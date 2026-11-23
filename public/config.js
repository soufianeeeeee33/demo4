/* =====================================================================
   CONFIGURATION CENTRALE — Bulk Maroc
   ---------------------------------------------------------------------
   Lu par le NAVIGATEUR (affichage) ET par le SERVEUR (calcul officiel).
   Le serveur ne fait jamais confiance au prix envoyé par le navigateur.
   Après modification, redémarrez le serveur (npm start).
   Les textes affichés (FR / AR) sont dans public/i18n.js.
   ===================================================================== */

/* Prix en DH.
   - single : prix d'un sachet de 500 g (et ancien prix barré)
   - double : prix de 2 sachets (offre) */
const PRODUCTS = {
  single: { name: "1 sachet — 500 g", price: 399, compareAt: 499 },
  double: { name: "Pack de 2 sachets — 1 kg", price: 749, compareAt: 998 }
};

/* Quantité (compteur − / +) */
const MAX_QUANTITY = 10;

/* Prix pour N sachets : chaque paire au prix du pack de 2, le sachet restant au prix unitaire.
   1 → 399 · 2 → 749 · 3 → 1148 · 4 → 1498 … */
function priceForQuantity(q) {
  return Math.floor(q / 2) * PRODUCTS.double.price + (q % 2) * PRODUCTS.single.price;
}
function compareForQuantity(q) {
  return q * PRODUCTS.single.compareAt;
}
/* Libellé enregistré dans la base : "1 sachet — 500 g", "Pack de 2 sachets — 1 kg", "3 sachets — 1,5 kg" */
function packNameForQuantity(q) {
  if (q === 1) return PRODUCTS.single.name;
  if (q === 2) return PRODUCTS.double.name;
  const kg = String(q * 0.5).replace(".", ",");
  return `${q} sachets — ${kg} kg`;
}

/* Goûts, dans l'ordre d'affichage (clé envoyée au serveur → nom enregistré) */
const FLAVORS = {
  unflavored: { name: "Unflavoured", image: "assets/images/creatine-bulk-sans-gout.jpg" },
  vanilla: { name: "Vanille", image: "assets/images/creatine-bulk-vanille.jpg" },
  mixedBerry: { name: "Mixed Berry", image: "assets/images/creatine-bulk-mixed-berry.jpg" }
};

/* Frais de livraison en DH, ajoutés une fois au total (0 = "à confirmer"). */
const DELIVERY_FEE = 20;

/* Villes proposées pendant la saisie (le client peut écrire une autre ville). */
const CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda",
  "Kénitra", "Tétouan", "Salé", "Témara", "Mohammédia", "El Jadida", "Béni Mellal",
  "Nador", "Settat", "Khouribga", "Safi", "Laâyoune", "Berrechid", "Khémisset",
  "Guelmim", "Errachidia", "Taza", "Larache", "Ksar El Kébir", "Essaouira", "Ouarzazate", "Dakhla"
];

/* Langue à l'ouverture : "fr" ou "ar" */
const DEFAULT_LANG = "fr";

const CURRENCY = "DH";

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PRODUCTS, FLAVORS, DELIVERY_FEE, DEFAULT_LANG, CURRENCY, MAX_QUANTITY, CITIES,
    priceForQuantity, compareForQuantity, packNameForQuantity
  };
}
