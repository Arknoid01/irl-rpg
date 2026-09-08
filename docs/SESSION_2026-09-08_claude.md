# Session du 2026-09-08 — thèmes payants poussés, voix par thème, IAP, pipeline quêtes

> Récap pour reprendre sans tout réexpliquer. `DECISIONS.md` (addenda D12 du
> 2026-09-08) fait autorité sur ce qui est tranché ; ce doc raconte le fil.

Point de départ : vérification que rien des « points ouverts » du 2026-09-05
n'avait avancé (confirmé — dernier commit = le récap lui-même). Puis on a
attaqué dans l'ordre, **Play Store mis de côté** (comme le 05).

## 1. Cyberpunk — rattrapage des filets/fonds codés pour un fond clair (`dc50f96`)

Les valeurs brunes héritées de nordique dans `components.css`
(`rgba(70,45,20,…)` etc.) sont invisibles sur les panneaux sombres du thème.
Un bloc de reprise groupé dans `cyberpunk.css` : filet des titres de section
et du journal, bouton « autre proposition », liseré du compagnon, rails de
jauges XP/compétences/onboarding, encart « pas d'autre quête », badges
(quête, événement, région, carte de boutique), butin de montée de niveau,
contour du toast. CSS validé `css-tree`.

**Pas fait** : la carte SVG du Monde (`.map-paper`, `.map-path`, pins) garde
sa palette parchemin clair sous cyberpunk — vrai recoloriage, pas un filet ;
à traiter dans une passe dédiée si repéré gênant en test.

## 2. Thème sombre — pass visuel complet « grimoire / pierre gravée » (`68b4e0a`)

Direction choisie par Yannick. `sombre` passe de « juste une palette » à une
identité aussi forte que cyberpunk :

- **Police Cinzel** (capitales romaines gravées) pour les titres, embarquée
  en local (`www/assets/fonts/cinzel-400-normal-latin{,-ext}.woff2`, Google
  Fonts / SIL OFL, zéro réseau). Le texte courant reste en Cormorant
  Garamond (`[data-theme="sombre"] .companion-line`, `.quest-text`, etc.).
- Fond parchemin **cendré froid** (`grayscale(.28)`, grain désaturé), brume
  froide en haut de page + vignette sombre aux bords (remplace les taches de
  foxing chaudes).
- Cadres **double filet** façon fer forgé, coins nets (radius 2px).
- Onglets ardoise froide, léger accent par onglet.
- Effet payant `sombre-candle` : vacillement lent de la vignette (bougie),
  coupé sous `prefers-reduced-motion` par la règle globale `*` de
  `components.css` (comme les effets cyberpunk).
- `ripple.js` : gate passée de `=== 'cyberpunk'` à un `Set` de thèmes payants
  (`cyberpunk`, `sombre`) ; apparence (néon / diffusion d'encre) dans le CSS
  du thème.
- `previewVideo: null` de `sombre` conservé, **place réservée** — commentaire
  explicite dans `data/themes/sombre.js` : Yannick enregistrera les vidéos
  d'aperçu boutique à la fin, chemin `./assets/videos/sombre-preview.mp4`.

## 3. Voix du compagnon par thème (`7251e47`)

Étendue choisie : **tout, en une passe**. Le texte de saveur devient une voix
complète par thème sous la clé `voice` de `data/themes/<thème>.js` :

- `nordique.js` = version de référence (texte inchangé, mêmes chaînes qu'avant
  dans `companion.js` / `journal.js`).
- `sombre.js` (veille / contrat / cendre / registre / la cité endormie) et
  `cyberpunk.js` (signal / secteur / log / la Grille) : variante complète,
  **même structure, mêmes intentions** (jamais de pression, toujours « avec
  toi », D4) — seul le vocabulaire change.
- `themes.js` → `voiceFor(themeKey)` : renvoie la voix du thème, complétée
  par celle de nordique pour toute clé absente (fusion peu profonde + 1
  niveau pour `ctx`). Un futur thème peut n'adapter qu'une partie.
- `companion.js` et `journal.js` n'ont plus **aucun texte en dur**. Les
  reducers de `game.js` passent `s.theme` aux générateurs d'entrées de
  journal ; `buildJournalTimeline` passe `state.theme` à `chapterForLevel`.
  Identifiants et seuils de chapitre (`prologue`, `ch1`…`ch5`) inchangés —
  seuls `label`/`blurb` sont thématisés.
- Nouveau test `voix par thème (D12)`.

## 4. Achat in-app derrière une abstraction (`b229fa0`)

Plugin retenu : **`@capacitor-community/in-app-purchases`** (natif Play
Billing / StoreKit, aucun serveur tiers → cohérent D11 ; RevenueCat écarté).
Approche : **câbler l'abstraction, ne pas installer le plugin maintenant**
(pas testable sans Play Console).

- `www/js/platform/billing.js` : interface `{ listProducts, purchase,
  restore }`. Impl **dev** (web / pas de plugin) = déblocage local gratuit
  actuel ; impl **native** = plugin atteint via
  `window.Capacitor.Plugins.InAppPurchases` (style `notifications.js`, pas
  d'import ES → bundle web sans dépendance).
- Produits : deux **non-consommables** `theme_sombre`, `theme_cyberpunk`.
- `ui/shop.js` : `billing.purchase(themeKey)` / `billing.restore()` ; bouton
  « Restaurer mes achats » ajouté ; note « démo locale » masquée dès que
  `billing.real` est vrai. Gestion busy/annulation/erreur.
- Nouveau test `billing (D12)` + flux restauration dans le test DOM boutique.

**Reste à faire (besoin Play Console)** : `npm i @capacitor-community/in-app-purchases`,
`npx cap sync`, déclarer les produits côté stores, permission
`com.android.vending.BILLING`, **vérifier les noms de méthodes/réponses
réels** du plugin (les appels dans `nativeBilling` sont des hypothèses
isolées, marquées comme telles dans le fichier).

## 6. Pipeline banque de quêtes (`9c18177`)

- `tools/quests-report.mjs` (`npm run quests`, ajouté à la CI après `sim`) :
  couverture (familles vs poids de tirage cible, matrice famille × effort,
  audace, défi d'ami / mystère / contexte, combinaisons génératives) +
  checks durs non couverts par les tests → **exit 1** sur doublon de texte
  fr/en, deux templates identiques hors slots, famille sans quête curée.
- `tests/engine.test.mjs` : test « pas de doublon de texte ».
- `docs/QUESTS.md` : mode d'emploi (boucle, modèle champ par champ, blocages).
- État mesuré : 98 curées + 42 templates (~1 100 combinaisons), familles
  alignées, deux trous connus : **social/chaos en effort `consequent`** et
  **audace 4–5** (seulement 5 et 1 quêtes).

## État des tests

45/45 (`npm test`), simulation 45 j inchangée (`npm run sim` — niveau 12),
`npm run quests` vert (4 points d'attention documentés), CSS validé
`css-tree` à chaque changement. **Toujours pas de QA visuelle possible ici**
(pas de navigateur) — les deux thèmes payants sont à revoir sur appareil
avant de vendre.

## Reste ouvert pour la suite

- **QA visuelle appareil** des thèmes cyberpunk + sombre (jamais fait).
- Carte du Monde sous cyberpunk/sombre (palette parchemin clair non reprise).
- Vidéos d'aperçu boutique (cyberpunk = brouillon, sombre = à enregistrer).
- **IAP réel** : installer le plugin + config stores quand accès Play Console.
- Combler les trous de la banque : social/chaos `consequent`, audace 4–5.
- Play Store (privacy.html hébergé, `versionCode`/`versionName`) — toujours
  mis de côté volontairement.

## Commits de la session

```
dc50f96 Cyberpunk : rattrape les filets/fonds encore codés pour un fond clair
68b4e0a Thème sombre : pass visuel complet « grimoire / pierre gravée » (D12)
7251e47 Voix du compagnon par thème : cérémonie, journal, chapitres (D12)
b229fa0 Achat in-app derrière une abstraction billing.js (D12)
9c18177 Pipeline banque de quêtes : rapport santé + couverture (npm run quests)
```
