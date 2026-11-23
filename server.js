/* =====================================================================
   Bulk Maroc — serveur Express
   Lancement : npm start  →  http://localhost:3000
   ===================================================================== */

const path = require("path");
const express = require("express");

// Configuration partagée avec le navigateur (prix, livraison, villes)
const {
  DELIVERY_FEE, PRODUCTS, FLAVORS, MAX_QUANTITY,
  priceForQuantity, packNameForQuantity
} = require("./public/config.js");
const orders = require("./db");

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.disable("x-powered-by");

/* ---------- En-têtes de sécurité simples ---------- */
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

/* ---------- Limitation de taille du body JSON ---------- */
app.use("/api", express.json({ limit: "10kb" }));

/* ---------- Fichiers statiques (seulement public/) ----------
   La base SQLite est dans database/, hors de public/ : elle n'est
   jamais accessible depuis le navigateur. */
// HTML / CSS / JS : revalidés à chaque visite (les modifications s'affichent tout de suite).
// Images : gardées 1 jour en cache.
app.use(express.static(path.join(__dirname, "public"), {
  extensions: ["html"],
  setHeaders(res, filePath) {
    if (/\.(html|css|js)$/i.test(filePath)) res.setHeader("Cache-Control", "no-cache");
    else res.setHeader("Cache-Control", "public, max-age=86400");
  }
}));

/* ---------- Limitation simple du nombre de commandes par IP ---------- */
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = Number(process.env.ORDER_RATE_LIMIT) || 20; // tentatives max par IP et par fenêtre
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip;
  const entry = hits.get(key) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  hits.set(key, entry);
  if (entry.count > RATE_MAX) {
    return res.status(429).json({
      success: false,
      message: "Trop de tentatives. Veuillez réessayer dans quelques minutes."
    });
  }
  next();
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) if (now - v.start > RATE_WINDOW_MS) hits.delete(k);
}, RATE_WINDOW_MS).unref();

/* ---------- Nettoyage / validation ---------- */
const LIMITS = { full_name: 80, phone: 20, address: 300, city: 60 };
const has = (obj, key) => typeof key === "string" && Object.prototype.hasOwnProperty.call(obj, key);

function clean(value, max) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // caractères de contrôle
    .replace(/[<>]/g, "") // pas de balises HTML
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, max);
}

/** Retourne le numéro au format 0XXXXXXXXX, ou null s'il n'est pas valide. */
function normalizeMoroccanPhone(raw) {
  const digits = String(raw || "").replace(/[\s.\-()]/g, "");
  const m = digits.match(/^(?:\+212|00212|0)([5-7]\d{8})$/);
  return m ? "0" + m[1] : null;
}

function validateOrder(body) {
  const errors = {};
  const b = body && typeof body === "object" ? body : {};

  const full_name = clean(b.fullName, LIMITS.full_name);
  if (full_name.length < 2) errors.fullName = "Entrez votre nom.";

  const rawPhone = clean(b.phone, LIMITS.phone);
  const phone = normalizeMoroccanPhone(rawPhone);
  if (!rawPhone) errors.phone = "Entrez votre numéro de téléphone.";
  else if (!phone) errors.phone = "Numéro non valide. Exemple : 06 12 34 56 78.";

  // Ville (formulaire actuel, comme YouCan) ; l'adresse précise est confirmée par téléphone.
  const city = clean(b.city, LIMITS.city);
  const addressInput = clean(b.address, LIMITS.address);
  if (b.city !== undefined) {
    if (city.length < 2) errors.city = "Entrez votre ville.";
  } else if (addressInput.length < 5) {
    errors.address = "Entrez votre adresse de livraison.";
  }

  // Format « Mix » : nombre de sachets par goût, ex. { vanilla: 3, unflavored: 2 }
  const isMix = b.pack === "mix";
  let mixLabel = "";
  let quantity;
  if (isMix) {
    const m = b.mix && typeof b.mix === "object" && !Array.isArray(b.mix) ? b.mix : {};
    const parts = [];
    let bad = Object.keys(m).some((k) => !has(FLAVORS, k));
    quantity = 0;
    for (const k of Object.keys(FLAVORS)) {
      if (m[k] === undefined) continue;
      const c = Number(m[k]);
      if (!Number.isInteger(c) || c < 0 || c > MAX_QUANTITY) { bad = true; continue; }
      if (c > 0) { quantity += c; parts.push(`${FLAVORS[k].name} ×${c}`); }
    }
    if (bad || quantity < 1 || quantity > MAX_QUANTITY) {
      errors.mix = `Entre 1 et ${MAX_QUANTITY} sachets.`;
    }
    mixLabel = parts.join(" + ");
  } else {
    // Quantité : compteur 1..MAX_QUANTITY (ancien format "pack" encore accepté)
    quantity = Number(b.quantity);
    if (b.quantity === undefined && has(PRODUCTS, b.pack)) quantity = b.pack === "double" ? 2 : 1;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      errors.quantity = `Quantité entre 1 et ${MAX_QUANTITY}.`;
    }
    if (!has(FLAVORS, b.flavor)) errors.flavor = "Choisissez un goût.";
  }

  // Pack de 2 sachets : un goût par sachet (le 2e goût reprend le 1er s'il n'est pas envoyé)
  let flavor2 = null;
  if (!isMix && quantity === 2 && b.flavor2 !== undefined) {
    if (has(FLAVORS, b.flavor2)) flavor2 = b.flavor2;
    else errors.flavor2 = "Choisissez le goût du 2e sachet.";
  }

  const clientRef =
    typeof b.clientRef === "string" && /^[A-Za-z0-9-]{8,64}$/.test(b.clientRef) ? b.clientRef : null;

  if (Object.keys(errors).length) return { errors };

  // Prix et total recalculés UNIQUEMENT côté serveur.
  const subtotal = priceForQuantity(quantity);
  const unit_price = Math.round((subtotal / quantity) * 100) / 100;
  const delivery_fee = Number(DELIVERY_FEE) > 0 ? Number(DELIVERY_FEE) : 0;
  const total_price = Math.round((subtotal + delivery_fee) * 100) / 100;

  return {
    order: {
      full_name, phone,
      address: addressInput || city,
      city: city || null,
      pack: packNameForQuantity(quantity),
      // "Vanille" · "Vanille ×2" · "Unflavoured + Mixed Berry"
      flavor: isMix ? mixLabel
        : !flavor2 ?(quantity === 2 ? `${FLAVORS[b.flavor].name} ×2` : FLAVORS[b.flavor].name)
        : flavor2 === b.flavor ? `${FLAVORS[b.flavor].name} ×2`
        : `${FLAVORS[b.flavor].name} + ${FLAVORS[flavor2].name}`,
      quantity, unit_price, delivery_fee, total_price,
      client_ref: clientRef
    }
  };
}

/* ---------- Routes API ---------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/orders", rateLimit, (req, res, next) => {
  try {
    const { order, errors } = validateOrder(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: "Vérifiez les informations indiquées.",
        errors
      });
    }
    const { id } = orders.createOrder(order);
    return res.status(201).json({
      success: true,
      message: "Commande enregistrée avec succès",
      orderId: id,
      pack: order.pack,
      flavor: order.flavor,
      quantity: order.quantity,
      total: order.total_price
    });
  } catch (err) {
    next(err);
  }
});

/* ---------------------------------------------------------------------
   ADMIN (à venir) — les fonctions sont prêtes dans db.js :
     orders.listOrders({ limit, offset })
     orders.searchOrders("nom ou téléphone")
     orders.updateOrderStatus(id, "confirmed")
     orders.exportOrdersCsv()
   ⚠️ Avant d'exposer ces routes, ajoutez une authentification
   (ex. mot de passe via variable d'environnement + session).
   Exemple :
     app.get("/api/admin/orders", requireAdmin, (req, res) =>
       res.json(orders.listOrders()));
   --------------------------------------------------------------------- */

/* ---------- 404 API ---------- */
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "Ressource introuvable." });
});

/* ---------- Gestion des erreurs ---------- */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Données trop volumineuses." });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Veuillez vérifier les informations saisies." });
  }
  console.error("[Erreur serveur]", err);
  res.status(500).json({
    success: false,
    message: "Une erreur est survenue. Veuillez réessayer dans un instant."
  });
});

app.listen(PORT, () => {
  console.log(`Bulk Maroc en ligne sur http://localhost:${PORT}`);
  console.log(`Base de données : ${orders.DB_PATH}`);
  const zero = Object.values(PRODUCTS).filter((p) => !p.price);
  if (zero.length) {
    console.warn(`⚠️  ${zero.length} prix à 0 DH — modifiez-les dans public/config.js`);
  }
  if (!(DELIVERY_FEE > 0)) {
    console.log("Frais de livraison non définis (DELIVERY_FEE = 0) : affichés « à confirmer ».");
  }
});
