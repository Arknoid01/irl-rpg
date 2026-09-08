# Session 2026-09-08 (Phase 2) — vie du personnage & présentation

> Suite de `SESSION_2026-09-08_phase1.md`. Phase 2 de `ROADMAP.md`. Autorité :
> `DECISIONS.md` **D14** (ajouté). Décidé avec Yannick : **compétences =
> qualificatif seul, sans chiffre (Option A §2.4)** ; les 6 items en une passe,
> **commits directs sur `main`**.

Pas de QA visuelle possible ici (pas de navigateur) — CSS validé `css-tree`,
UI éprouvée par `tests/dom.test.mjs` + composants purs + `simulate.mjs`.

## 2.1 — Page « Mon aventure » (`ui/screens/character.js` réécrit)

Réagencement, pas de nouvel onglet (l'onglet reste « Personnage »). Ordre :
titre « Mon aventure » → en-tête (`prénom`, `Niveau N · <style>`, fine barre
XP, mot du compagnon via `companionLineForState`) → Traits → Titres (masqués
si aucun) → « Ta chronique » (`chapterForLevel`) → « Ton chemin » → Moments →
Découvertes → Musée.

`charBits.js` : `heroCardHtml` inchangé ; **retirés** `skillsGridHtml` /
`styleHtml` ; **ajoutés** `traitsHtml`, `momentsHtml`, `discoveriesHtml`,
`pathStatsHtml` ; `inventoryHtml` gagne les vitrines `???`.

## 2.2 — Traits qualitatifs

`engine/progression.js` `traitTierFor(state)` : `dominante / émergente /
présente / discrète`, **relatif à la compétence la plus haute** (ratio
.8 / .45 / .2 ; 0 → discrète ; rien joué → tout discret). `data/taxonomy.js`
`TRAIT_TIERS` (bilingue + `rank`). Indicateur visuel = 4 segments, **pas de
chiffre, pas de `role="progressbar"`**. Les `state.skills` bruts restent
(titres/style/carte en dépendent) — juste plus affichés ici.

## 2.3 — Collection « Moments »

`charBits.momentsHtml` : 8 cartes « premières fois » (`state.milestones` de la
Phase 1), **cochée** (icône + libellé + date) ou **scellée** (« Cette page
n'a pas encore d'histoire. »), sans révéler le déclencheur. `MILESTONE_LABELS`
dans `engine/milestones.js`. Paliers `volume_*` sur une ligne à part (chips,
explicites).

## 2.4 — Collection « Découvertes » (nouveau `engine/discoveries.js`)

`state.discoveries` = map `<clé> -> 'YYYY-MM-DD'`, jumelle des jalons.
`recordDiscoveries(state, quest, now)` appelé dans `completeQuest`, dérivé du
`contexte` / famille : `dehors` (exterieur) · `chemin` (trajet) · `rencontre`
(presence_gens ou famille social) · `creer` (famille creation) · `matin` /
`soir` (`dayPart`). **`pluie` / `nature` / `ville` de l'analyse écartés** :
météo/géo indisponibles hors-ligne (D11), comme `first_rain`. `charBits.discoveriesHtml`.

## 2.5 — Musée : vitrines `???`

`inventoryHtml` : 2 `.museum-card.sealed` après les vraies pièces, **vue
« tout » uniquement** (pas dans les vues filtrées). Curiosité sans faire du
musée une checklist.

## 2.6 — Carte du Monde : polish révélation

`ui/screens/world.js` : ligne « Certaines régions ne sont pas encore prêtes… »
sous la carte tant que `fog + locked > 0` ; dans le détail d'une région
`justRevealed` : encart « Tu viens de révéler cette partie du monde. » +
liseré or (`.map-detail.just-revealed`).

## Divers

- `state.history.comebacks` (+ `lastComebackDate`) : compteur de retours après
  absence, incrémenté **une fois par jour** de retour (`noteComebackReturn`
  dans `completeQuest` / `completeEvent`, avant `bumpStreak`). Affiché dans
  « Ton chemin » **seulement si > 0**.
- i18n : ~18 clés fr/en (page Mon aventure, collections, carte).
- CSS : bloc « Page Mon aventure » dans `components.css` (tokens uniquement,
  pas de brun nordique en dur) + 3 règles carte. `css-tree` OK.
- **Dette** : `.hero-*` / `.skill-*` / `.style-*` dans `components.css` (et
  leurs overrides par thème) sont orphelins — nettoyage lors de la QA appareil.

## Tests

- `tests/engine.test.mjs` : 6 nouveaux (traits, collections, vitrines ???,
  écran Personnage bilingue, découvertes, compteur reprises) + charBits mis à
  jour. **58/58.**
- `tests/dom.test.mjs` : assertions écran Personnage → `.traits-list`,
  `.collect-grid`, `.chronicle-box`.
- `tests/simulate.mjs` : rend `renderCharacter` (fr/en), lignes Découvertes /
  Reprises au rapport. Sim 45 j : 6/6 découvertes, 2 reprises, 0 violation.
- `npm run quests` vert (4 points d'attention inchangés).

## Reste ouvert

- **QA visuelle appareil** : Phase 0 + 1 + 2 (surtout l'écran Personnage
  réécrit et les collections) — jamais vu en vrai.
- Nettoyer le CSS orphelin `.hero-*` / `.skill-*` / `.style-*` (+ overrides
  thèmes).
- Remettre `npm run quests` dans `.github/workflows/ci.yml`.
- Phase 3 : 3.1 Chronique (décision §2.2 seuils de chapitre encore ouverte),
  3.2 entrée de journal « du jour », **3.3 mini-arcs secrets = plus gros
  levier**, 3.4 événements spéciaux.
- Décisions Yannick encore ouvertes : pricing (§2.1), seuils de chapitre
  (§2.2), tagline store (§2.3).
- Vidéos boutique, IAP réel, trous banque de quêtes, Play Store — inchangés.
