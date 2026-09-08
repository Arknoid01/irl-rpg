# Session 2026-09-08 (Phase 3) — récit : Chronique, journal du jour, mini-arcs, événements spéciaux

> Suite de `SESSION_2026-09-08_phase2.md`. Phase 3 de `ROADMAP.md`. Autorité :
> `DECISIONS.md` **D15** (chronique) + **D16** (récit). Décisions Yannick :
> chapitres = **nombre de quêtes** (§2.2) ; voix Phase 3 = **7 thèmes** ;
> mini-arcs = **système complet + 4 arcs**. Commits directs sur `main`.

Livré en 4 commits (3.1-3.2 groupés, 3.3, 3.4, docs).

## 3.1 — Chronique en nombre de quêtes + nuance de famille

- `chapterForLevel(level)` → **`chapterFor(state)`**, seuils sur
  `history.totalCompleted` : `[0, 10, 25, 50, 100, 200]`. Identifiants et
  textes par thème inchangés.
- Entrée de journal « nouveau chapitre » au passage de seuil (`completeQuest`,
  effet `chapter-open`). Texte = label + blurb (déjà thématisés).
- `voice.chapterLean` (6 familles × 7 thèmes) : une phrase sous le blurb quand
  une famille domine nettement (≥ 5 quêtes ET ≥ 1,4× la 2ᵉ). Affichée dans le
  journal et « Ta chronique ».

## 3.2 — Entrée de journal « du jour »

- `engine/journal.js dailyRecapEntry(dayNo, familles, thème, seed)`.
- `game.newDay` : au **rollover naturel** uniquement, résume la veille si
  quelque chose a été vécu. Une seule par date, jamais pour une journée vide.
- `voice.dayEntry` + `voice.dayTitles` (7 thèmes).
- **`simulate.mjs` et le test d'intégration ne forcent plus `drawDate = null`** :
  la date avance, le rollover est naturel, l'entrée du jour est exercée.

## 3.3 — Mini-arcs secrets (le plus gros levier)

- `data/arcs.js` : 4 arcs (`passage` 4, `visage` 4, `objet` 3, `heure` 4),
  contenu neutre bilingue. Chaque arc dépose une pièce de musée à la
  révélation.
- `engine/arcs.js` : `state.arcs = { active, step, completed }` (un arc à la
  fois). `nextArc` / `currentArcStep` (format quête cachée : léger, audace 2,
  jamais chaos, `poids: 'mystere'`) / `advanceArc` / `arcInProgress`.
- `engine/draw.js` : `ARC_STEP_CHANCE = 0.28`, l'étape courante occupe le
  créneau « mystère » avant la quête cachée aléatoire (`3a` puis `3b`).
  Invariants du tirage intacts. Retour après absence : plus de swap mystère
  aléatoire + `canAdd` refuse le conséquent.
- `engine/game.js` : `completeQuest` fait avancer l'arc → indice / révélation
  au journal (`voice.arc`), pièce de musée `id: arc_<arcId>`. Les étapes d'arc
  ne donnent plus « Chapitre glané ».
- `engine/companion.js` : `voice.arc.inProgress` — mention douce d'une piste.
- `voice.arc` (clue / reveal / inProgress) écrit pour les 7 thèmes.
- UI : marqueur « 🧵 une piste » (`questCard`), toasts `arc-clue` / `arc-done`
  (`feedback`), kinds journal `jour` / `indice` / `revelation` + CSS.

## 3.4 — Événements spéciaux

- `eventEligible` : `minDaysPlayed` (temporel) + `requireMilestone` (écho de
  jalon).
- 4 événements : `ev_une_semaine` (7 j + `first_quest`), `ev_un_mois`
  (30 j + `volume_10`), `ev_echo_inconnu` (`first_social`), `ev_echo_mystere`
  (`first_hidden`). Lore dans `data/loot.js`.
- L'événement de retour reste la Phase 1.3.

## Tests

- `tests/engine.test.mjs` : ~10 nouveaux tests (chapitre-seuils, nuance,
  entrée du jour, moteur d'arcs, `completeQuest` d'arc de bout en bout,
  compagnon en cours, événements spéciaux). Extension « voix par thème » :
  `chapterLean` / `dayEntry` / `arc` propres à chaque thème (≠ nordique).
  **65/65.**
- `tests/dom.test.mjs` : inchangé (l'écran Personnage rend déjà `.chronicle-box`).
- `tests/simulate.mjs` : rollover naturel, lignes « Mini-arcs » au rapport.
  Sim 45 j : 2 arcs terminés + 1 en cours, 0 violation.
- `npm run quests` vert. CSS `css-tree` OK.

## Reste ouvert

- **QA visuelle appareil** : Phases 0-3, jamais vues en vrai. En particulier
  la Chronique (nuance de famille), l'entrée du jour, l'affichage des arcs.
- Nettoyer le CSS orphelin `.hero-*` / `.skill-*` / `.style-*`.
- Remettre `npm run quests` dans `.github/workflows/ci.yml`.
- **Phase 4 (monétisation)** : IAP réel (plugin + Play Console), extensions de
  contenu payantes — *après* validation de la rétention.
- Décisions Yannick encore ouvertes : pricing (§2.1 — 1 produit/thème vs
  bundle), tagline store (§2.3).
- Enrichissement : plus d'arcs (`data/arcs.js` — juste du contenu), trous
  banque de quêtes (social/chaos `consequent`, audace 4-5), vidéos boutique.
