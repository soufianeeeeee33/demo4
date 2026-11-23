/* =====================================================================
   Accès à la base SQLite (better-sqlite3)
   ---------------------------------------------------------------------
   Toutes les requêtes sont PARAMÉTRÉES (aucune concaténation SQL).
   Fonctions prêtes pour un futur tableau de bord admin :
     - listOrders()        → voir les commandes
     - updateOrderStatus() → modifier le statut
     - searchOrders()      → rechercher par nom ou téléphone
     - exportOrdersCsv()   → exporter les commandes
   ===================================================================== */

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const DB_DIR = path.join(__dirname, "database");
const DB_PATH = path.join(DB_DIR, "shop.db");

fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

const ORDERS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    pack TEXT NOT NULL,
    flavor TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price REAL NOT NULL,
    delivery_fee REAL NOT NULL DEFAULT 0,
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    client_ref TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

/* ---------- Migration depuis la première version ----------
   L'ancienne table avait ville / région / remarque (city NOT NULL) et pas
   de colonne pack. On reconstruit la table en conservant toutes les
   commandes : ville, région et remarque sont ajoutées à l'adresse. */
function migrate() {
  const cols = db.prepare("PRAGMA table_info(orders)").all().map((c) => c.name);
  if (cols.length === 0 || cols.includes("pack")) return;

  const has = (c) => cols.includes(c);
  const addressExpr = [
    "address",
    has("city") ? "COALESCE(', ' || city, '')" : null,
    has("region") ? "COALESCE(', ' || region, '')" : null,
    has("note") ? "COALESCE(' — Remarque : ' || note, '')" : null
  ].filter(Boolean).join(" || ");

  db.transaction(() => {
    db.exec("ALTER TABLE orders RENAME TO orders_v1");
    db.exec(ORDERS_SCHEMA);
    db.exec(`
      INSERT INTO orders (id, full_name, phone, address, pack, flavor, quantity,
                          unit_price, delivery_fee, total_price, status, client_ref, created_at)
      SELECT id, full_name, phone, ${addressExpr}, 'Ancien format', flavor, quantity,
             unit_price, ${has("delivery_fee") ? "delivery_fee" : "0"}, total_price, status,
             ${has("client_ref") ? "client_ref" : "NULL"}, created_at
      FROM orders_v1
    `);
    db.exec("DROP TABLE orders_v1");
  })();
  console.log("Base de données : table orders migrée vers le nouveau format.");
}

migrate();
db.exec(ORDERS_SCHEMA);
// Colonne "city" (formulaire Nom / Ville / Téléphone) — ajoutée sans perte de données
if (!db.prepare("PRAGMA table_info(orders)").all().some((c) => c.name === "city")) {
  db.exec("ALTER TABLE orders ADD COLUMN city TEXT");
}
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_client_ref ON orders(client_ref)");
db.exec("CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone)");
db.exec("CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)");

const ORDER_STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];

const stmts = {
  insert: db.prepare(`
    INSERT INTO orders
      (full_name, phone, address, city, pack, flavor, quantity,
       unit_price, delivery_fee, total_price, client_ref)
    VALUES
      (@full_name, @phone, @address, @city, @pack, @flavor, @quantity,
       @unit_price, @delivery_fee, @total_price, @client_ref)
  `),
  byClientRef: db.prepare("SELECT id FROM orders WHERE client_ref = ?"),
  recentSame: db.prepare(`
    SELECT id FROM orders
    WHERE phone = @phone AND full_name = @full_name AND address = @address
      AND pack = @pack AND flavor = @flavor
      AND created_at >= datetime('now', '-60 seconds')
    ORDER BY id DESC LIMIT 1
  `),
  byId: db.prepare("SELECT * FROM orders WHERE id = ?"),
  list: db.prepare("SELECT * FROM orders ORDER BY id DESC LIMIT ? OFFSET ?"),
  search: db.prepare(`
    SELECT * FROM orders
    WHERE full_name LIKE @q ESCAPE '\\' OR phone LIKE @q ESCAPE '\\'
    ORDER BY id DESC
    LIMIT 200
  `),
  updateStatus: db.prepare("UPDATE orders SET status = ? WHERE id = ?"),
  all: db.prepare("SELECT * FROM orders ORDER BY id ASC")
};

/** Enregistre une commande.
 *  Anti-doublon (double clic, double envoi) :
 *  - client_ref déjà connu → commande existante ;
 *  - sinon, commande strictement identique dans les 60 dernières secondes
 *    → commande existante. */
const createOrder = db.transaction((order) => {
  if (order.client_ref) {
    const existing = stmts.byClientRef.get(order.client_ref);
    if (existing) return { id: existing.id, duplicate: true };
  }
  const same = stmts.recentSame.get(order);
  if (same) return { id: same.id, duplicate: true };
  const info = stmts.insert.run(order);
  return { id: Number(info.lastInsertRowid), duplicate: false };
});

const getOrder = (id) => stmts.byId.get(id);
const listOrders = ({ limit = 50, offset = 0 } = {}) => stmts.list.all(limit, offset);

function searchOrders(term) {
  const escaped = String(term).replace(/[\\%_]/g, (m) => "\\" + m);
  return stmts.search.all({ q: `%${escaped}%` });
}

function updateOrderStatus(id, status) {
  if (!ORDER_STATUSES.includes(status)) throw new Error("Statut invalide");
  return stmts.updateStatus.run(status, id).changes === 1;
}

function exportOrdersCsv() {
  const headers = [
    "id", "created_at", "status", "full_name", "phone", "city", "address",
    "pack", "flavor", "quantity", "unit_price", "delivery_fee", "total_price"
  ];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = stmts.all.all();
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}

module.exports = {
  db, DB_PATH, ORDER_STATUSES,
  createOrder, getOrder, listOrders, searchOrders, updateOrderStatus, exportOrdersCsv
};
