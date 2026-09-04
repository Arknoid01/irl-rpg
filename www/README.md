# IRL RPG — application (www/)

App web (HTML/CSS/JS, ES modules natifs, aucun bundler) empaquetée avec Capacitor.
Bilingue FR/EN. 100 % on-device : aucune donnée ne quitte l'appareil.

## Lancer en local

```bash
npm run serve          # http://localhost:8123  (python3 -m http.server)
# ou n'importe quel serveur statique servant www/ — PAS d'ouverture file:// (modules ES)
```

`www/demo.html` : page de démo qui injecte une sauvegarde d'exemple puis lance
l'app (captures d'écran, revue visuelle). `#character` / `#journal` dans l'URL
ouvre directement l'onglet. Ne pas expédier.

## Tests

```bash
npm test               # node --test : moteur, tirage, progression, store, i18n, DOM (jsdom)
npm run sim            # simulation d'une partie de 45 jours + vérif des invariants
node tests/simulate.mjs 90 777   # N jours, seed
```

`tests/dom.test.mjs` nécessite `jsdom` (déclaré en `devDependency` : `npm ci`).

CI GitHub Actions : `.github/workflows/ci.yml` (`npm ci` · `npm test` · `npm run sim`).

## Structure

```
www/
├── index.html            coquille (charge base/themes/components.css + js/main.js)
├── manifest.webmanifest
├── styles/
│   ├── themes.css         jeux de tokens par thème (cyberpunk / nordique / sombre)
│   ├── base.css           reset, layout, topbar, nav, boutons
│   └── components.css     panneaux, cartes de quête, journal, overlay, level-up…
└── js/
    ├── main.js            contrôleur : boot, dispatch, rendu de la coquille
    ├── i18n/              index.js (t / loc) + fr.js + en.js
    ├── data/              taxonomy · quests (~70) · events · titles · themes
    ├── state/             defaults.js (forme de sauvegarde) · store.js (persist + migrations)
    ├── engine/            dates · rng · draw (tirage quotidien) · progression · journal · game (orchestrateur) · philosophy
    ├── ui/                dom · theme · feedback · onboarding · settings
    │   ├── screens/       adventure · journal · character  (render(state) -> string)
    │   └── components/    questCard · eventCard · charBits
    └── platform/          notifications.js (Capacitor local-notifications + repli web)
```

Le moteur (`engine/`, `data/`, `state/`, `i18n/`) est sans DOM et testable en Node.
L'UI rend des chaînes HTML ; les clics passent par délégation (`data-action`).

## Empaqueter avec Capacitor

```bash
npm install
npx cap add android
npx cap sync
npx cap open android      # build APK/AAB dans Android Studio
```

`capacitor.config.json` : `appId com.pegasuscorp.irlrpg`, `webDir www`.
Plugins utilisés : `@capacitor/local-notifications` (rappel quotidien),
`@capacitor/share` (envoyer un défi à un ami). Tout est optionnel : sur le web,
`platform/notifications.js` dégrade proprement.

## Sauvegarde

Clé `irlrpg_save_v2` dans `localStorage`. Migration automatique depuis
`irlrpg_save_v1` (ancien prototype) et depuis les thèmes `skyrim`/`witcher`.
Export/import JSON dans Réglages.
