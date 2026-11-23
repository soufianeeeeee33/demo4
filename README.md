# Bulk Maroc — Landing page créatine

Landing page e-commerce pour la créatine monohydrate **Bulk** (Unflavoured, Vanille, Mixed Berry) sur le marché marocain.
Les clients commandent directement sur le site. Chaque commande est enregistrée dans une base **SQLite** via un serveur **Node.js / Express**. Aucune redirection WhatsApp.

## 1. Prérequis

- [Node.js](https://nodejs.org/) installé (version 18 ou plus récente, LTS recommandée)
- npm installé (fourni avec Node.js)

Vérifier :

```bash
node -v
npm -v
```

## 2. Installation

```bash
cd bulk-store
npm install
```

## 3. Lancement

```bash
npm start
```

Mode développement (redémarrage automatique à chaque modification du serveur) :

```bash
npm run dev
```

## 4. Accès

- Site : http://localhost:3000
- Test du serveur : http://localhost:3000/api/health → `{ "status": "ok" }`

Pour changer le port : `PORT=8080 npm start` (Linux/macOS), ou `$env:PORT=8080; npm start` (Windows PowerShell).

## 5. Modifier les prix et les formats

Fichier : **`public/config.js`**, objet `PRODUCTS`.

```js
const PRODUCTS = {
  single: { name: "1 sachet — 500 g",         price: 399, compareAt: 499 },
  double: { name: "Pack de 2 sachets — 1 kg", price: 749, compareAt: 998 }
};
```

- `price` : prix de vente. `compareAt` : ancien prix affiché barré (uniquement un vrai prix pratiqué).
- **Quantité** (compteur − / +, maximum `MAX_QUANTITY`) : chaque paire de sachets est facturée au prix du pack de 2, le sachet restant au prix unitaire (1 → 399, 2 → 749, 3 → 1 148…). Le calcul est dans `priceForQuantity()`, utilisé par la page **et** par le serveur.
- **Formulaire** (comme l'ancienne boutique YouCan) : Nom complet, (ille, Téléphone. La ville est enregistrée dans la colonne `city` ; l'adresse précise est confirmée par téléphone. La liste des villes proposées est `CITIES`.
- Les parfums (`FLAVORS`) et la langue par défaut (`DEFAULT_LANG`, `"fr"` ou `"ar"`) sont dans le même fichier.

**Textes de la page (français et arabe)** : tous dans **`public/i18n.js`**. Faites relire l'arabe par une personne arabophone avant la mise en ligne.

Ce fichier est lu par le navigateur, pour l'affichage, **et** par le serveur, pour le calcul officiel. Le serveur recalcule toujours le nom du pack, le prix et le total, et ignore tout prix envoyé par le navigateur. **Redémarrez le serveur** après chaque modification.

## 6. Modifier les frais de livraison

Même fichier, **`public/config.js`** :

```js
const DELIVERY_FEE = 20;
```

- Une valeur > 0 : le montant s'affiche et s'ajoute au total, côté page comme côté serveur (399 + 20 = 419 DH).
- `0` : la page affiche « À confirmer » et rien n'est ajouté au total.

Le paiement se fait à la livraison. Aucun paiement en ligne n'est demandé.

## 7. Base de données

- Les commandes sont enregistrées dans **`database/shop.db`** (SQLite).
- Le dossier, la base et la table `orders` sont créés automatiquement au premier lancement.
- La base n'est jamais accessible depuis le navigateur : seul le dossier `public/` est servi.
- Un identifiant unique (`client_ref`) est généré pour chaque tentative d'envoi. Un double clic ou un double envoi ne crée donc pas deux commandes.
- Colonnes : `id, full_name, phone, address, pack, flavor, quantity, unit_price, delivery_fee, total_price, status, client_ref, created_at`. Le statut initial est `new`.
- Les bases créées avec la première version (ville, région, remarque) sont migrées automatiquement au démarrage. Les anciennes commandes sont conservées, avec la ville et la remarque ajoutées à l'adresse.

Consulter les commandes, par exemple avec [DB Browser for SQLite](https://sqlitebrowser.org/) ou en ligne de commande :

```bash
sqlite3 database/shop.db "SELECT id, created_at, full_name, phone, address, pack, flavor, total_price, status FROM orders ORDER BY id DESC;"
```

Statuts prévus : `new`, `confirmed`, `shipped`, `delivered`, `cancelled`.

### Préparé pour un futur tableau de bord admin

`db.js` expose déjà les fonctions nécessaires :

| Fonction | Rôle |
|---|---|
| `listOrders({ limit, offset })` | Voir les commandes |
| `updateOrderStatus(id, status)` | Modifier le statut |
| `searchOrders(terme)` | Rechercher par nom ou téléphone |
| `exportOrdersCsv()` | Exporter les commandes en CSV |

Un exemple de route est en commentaire dans `server.js`. **Protégez toute route admin par une authentification** avant de l'exposer.

## 8. Déploiement

Il faut un hébergement **Node.js** avec un **stockage disque persistant**, par exemple un VPS, Render ou Railway avec un volume, ou Fly.io avec un volume. Sans stockage persistant, `database/shop.db` serait effacé à chaque redéploiement et les commandes seraient perdues. Les hébergements purement statiques (Netlify, GitHub Pages…) ne conviennent pas.

Pensez à sauvegarder régulièrement `database/shop.db`.

## Où modifier quoi ?

| Élément | Emplacement |
|---|---|
| Prix, formats, mentions, badge | `public/config.js` → `PRODUCTS` |
| Parfums et leur image | `public/config.js` → `FLAVORS` |
| Sélection par défaut | `public/config.js` → `DEFAULT_PACK`, `DEFAULT_FLAVOR` |
| Frais de livraison | `public/config.js` → `DELIVERY_FEE` |
| Logo | Remplacer `public/assets/images/bulk-logo.png` (PNG transparent conseillé) |
| Image principale de la galerie | `public/assets/images/bulk-flatlay-all-flavors.png` (vignette : `bulk-flatlay-thumb.jpg`) |
| Photos par parfum | `public/assets/images/creatine-bulk-vanille.jpg`, `creatine-bulk-mixed-berry.jpg`, `creatine-bulk-sans-gout.jpg` |
| Textes des accordéons (Description, Détails, Livraison, Paiement) | `public/index.html`, bloc `#details` |
| Téléphone affiché | `public/index.html`, commentaire `<!-- CONTACT -->` dans le footer |
| Informations de livraison | `public/index.html`, commentaire `<!-- INFOS LIVRAISON -->` (section confiance) |

## Structure

```
bulk-store/
├── package.json
├── server.js          # Express : fichiers statiques, /api/orders, /api/health
├── db.js              # SQLite : création de la table + fonctions commandes
├── database/
│   └── shop.db        # créé automatiquement
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── config.js      # formats, prix, parfums, livraison (partagé navigateur/serveur)
│   └── assets/images/
└── README.md
```
