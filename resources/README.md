# Assets sources (icône + splash)

- `logo-cairn.png` — logo complet fourni (cairn + étoile + boussole, wordmark
  « CAIRN » + baseline). Source de vérité de la marque.
- `icon.png` (1024²) — **l'icône d'app** : recadrage sans wordmark du logo
  (boussole + étoile + cairn au coucher de soleil), fond de nuit étendu en
  dégradé flouté haut/bas pour rester carré.
- `splash.png` (2732²) — fond `#0F1E2C` + logo complet centré.

## Régénérer (Pillow / ImageMagick)

Les PNG livrés ont été générés le 2026-09-10 depuis `logo-cairn.png` :
- `www/assets/icon-{192,512}.png` + `icon-maskable-512.png` (quantifiés 256 c.)
- `android/app/src/main/res/mipmap-*/ic_launcher{,_round,_foreground}.png`
- `android/app/src/main/res/drawable*/splash.png`
- `ic_launcher_background` → `#0F1E2C`

Un `npx @capacitor/assets generate` (non installé ici) referait tout depuis
`resources/icon.png` + `resources/splash.png` si besoin plus tard.
