# Session 2026-09-08 (Phase 4) — monétisation : achat in-app « Collection des Mondes »

> Suite de `SESSION_2026-09-08_phase3.md`. Phase 4 de `ROADMAP.md`. Autorité :
> `DECISIONS.md` **D17**. Décisions Yannick : pricing = **bundle unique** (§2.1) ;
> plugin = **`capacitor-plugin-cdv-purchase`**. Commits directs sur `main`.

## Constat de départ

- **`@capacitor-community/in-app-purchases` (le paquet visé par les sessions
  précédentes) n'existe pas sur npm** (404). Le seul qui respecte D11 (direct
  au store, aucun serveur) et est maintenu : **`capacitor-plugin-cdv-purchase`**
  (édition Capacitor de cordova-plugin-purchase / Fovea, v13). RevenueCat
  exige leur backend → écarté.
- Ce projet **n'a pas de bundler** — les modules `www/js` sont chargés bruts.
  On ne peut pas `import` le paquet ES. On passe par le pont bas niveau
  `window.Capacitor.Plugins.PurchasePlugin` (comme `LocalNotifications` /
  `Share`).
- **Rien de testable ici** : pas de Play Console, pas d'appareil, pas d'AAB
  signé.

## Ce qui a été fait

**Pricing → bundle (D17).** `platform/billing.js` réécrit : un seul produit
non consommable `collection_des_mondes` (~6,99 €) qui débloque les 6 thèmes
payants. `COLLECTION_PRODUCT` + `COLLECTION_THEMES` exportés. `THEME_PRODUCTS`
(6 SKU) supprimé.

- `engine/game.js` : `unlockCollection` (idempotent, effet
  `collection-unlocked`). `unlockTheme` conservé (démo / tests).
- `ui/shop.js` : bannière « 🌍 Collection des Mondes » (prix si le store le
  renvoie) ; les cartes verrouillées déclenchent le même achat et activent le
  thème cliqué. `billing.purchase()` sans argument. Restore → `unlockCollection`.
- `main.js` dispatch `unlockCollection` ; `feedback.js` toast
  `collection-unlocked` ; i18n fr/en (`shop_collection_*`, `shop_locked`,
  `toast_collection_unlocked`).

**Plugin réel.**
- `npm i capacitor-plugin-cdv-purchase` + `npx cap sync` → classe native
  `cc.fovea.iap.PurchasePlugin` enregistrée. Fichiers gradle générés commités
  (`android/app/capacitor.build.gradle`, `android/capacitor.settings.gradle`).
- `nativeBilling` réécrit contre le pont bas niveau (`init`,
  `getAvailableProducts`, `getPurchases`, `buy`, `acknowledgePurchase`,
  événements `purchasesUpdated` / `setPurchases`). API et payloads tirés du
  **source Android du plugin** (`PurchasePlugin.java`). Le flow complet
  (déroulé d'achat, acquittement obligatoire sous 3 j, forme exacte des
  payloads) est **à vérifier sur appareil** — surface isolée + commentée.
- `AndroidManifest.xml` : `com.android.vending.BILLING`.

**Docs.** `STORE.md` : section « Achat in-app » (produit à déclarer + checklist
de vérification appareil), data-safety mis à jour (achats in-app = oui, rien
collecté), permission BILLING. `DECISIONS.md` D17. `PHILOSOPHY_CHECKLIST.md`
(cosmétique pur, aucune donnée de paiement).

## 4.3 — extensions de contenu payantes

**Pas maintenant.** Roadmap : seulement après un D30 Return Rate correct. Rien
préparé.

## Tests

- `billing (D12/D17)` réécrit : un seul produit, impl dev, `COLLECTION_THEMES`.
- Nouveau : `game : unlockCollection débloque les 6 d'un coup`.
- `tests/dom.test.mjs` : boutique — bannière Collection, un clic débloque les
  6 + active le thème cliqué, bannière retirée ensuite.
- **66/66**, sim OK, `css-tree` OK, zéro appel réseau dans `billing.js`.

## Reste ouvert (Phase 4 = surtout du manuel hors env)

- **Play Console** : créer le produit `collection_des_mondes` (non
  consommable, ~6,99 €), URL privacy publique, questionnaires.
- **AAB signé** sur une piste de test fermée + compte testeur de licence.
- **Dérouler la checklist `STORE.md` § Achat in-app** : achat, restore
  (autre appareil / réinstall), acquittement, annulation, revérifier les noms
  d'événements du plugin.
- iOS : même ID produit en App Store Connect le jour d'un build iOS.
- **QA visuelle appareil** : Phases 0-4, toujours jamais faite.
- Nettoyer le CSS orphelin `.hero-*` / `.skill-*` / `.style-*`.
- `npm run quests` dans la CI (scope `workflow` du token).
- Après validation rétention (D30) : Phase 4.3 (packs de contenu).
- Enrichissement continu : arcs, banque de quêtes, thèmes.
