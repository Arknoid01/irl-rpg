# Session 2026-09-08 (Phase 1) — rétention : jalons, retour après absence, anti-disette

> Suite directe de `SESSION_2026-09-08_claude.md`. On attaque la **Phase 1**
> de `ROADMAP.md` (« le risque n°1 est la rétention »). Autorité : `DECISIONS.md`
> **D13** (ajouté cette session) + `PHILOSOPHY_CHECKLIST.md`.

Décidé avec Yannick avant de commencer : **voix par thème écrite pour les 7
thèmes en une passe** (cohérent avec D12 « reskin complet » et la passe voix
précédente) ; **commits directs sur `main`**.

## 1.1 — `state.milestones` (`8bf… TODO`)

- `state.milestones` : map `<clé> -> 'YYYY-MM-DD'` (première occurrence).
- Nouveau `engine/milestones.js` : `FIRST_MILESTONES` (8) + `volume_10/25/50/100`,
  `MILESTONE_KEYS` figé. `recordQuestMilestones` / `recordEventMilestones`
  (idempotents) + `applyMilestones` (pousse les effets `{type:'milestone',key}`
  et écrit `history.lastMilestone = {key, date}` — `key` = premier de la liste,
  donc `first_quest` passe devant).
- `state/defaults.js` : `milestones: {}`, `history.daysSinceEvent`,
  `history.lastMilestone`. `state/store.js` : `normalize` assainit `milestones`.
  Migration **additive**, pas de bump `SAVE_VERSION` (deepMerge suffit).
- `engine/game.js` : appel après le bookkeeping dans `completeQuest` /
  `completeEvent`.
- `first_rain` / météo **écartés** : pas de donnée on-device (D11).
- L'UI « Moments » reste Phase 2.3.

## 1.2 — Compagnon par jalon

- `companion.js` : branche prioritaire (juste après le garde `!quests.length`).
  Si `history.lastMilestone.date === aujourd'hui`, le compagnon sort la ligne
  du jalon. `volume_*` → `voice.milestones.volume(n)`, sinon
  `voice.milestones[key]` (`{fr,en}`).
- `data/themes.js` `voiceFor` : fusionne `milestones` en profondeur (comme
  `ctx`).
- **7 thèmes** ont `voice.milestones` complet (8 premières fois + `volume`),
  vocabulaire propre (registre, log, dossier, signes, secteur, journal de
  bord…). Nouveau contrôle dans le test `voix par thème (D12)`.

## 1.3 — Retour après absence

- Nouveau `engine/comeback.js` : `daysAway`, `isComebackDay` (seuil
  `COMEBACK_DAYS = 3`). S'éteint dès que le joueur valide quelque chose
  (`bumpStreak` remet `lastActiveDate`).
- `engine/draw.js` : `pickFrom` privilégie l'effort `leger` (social + boucle
  de remplissage), pool restreint aux quêtes jamais faites dès qu'il y en a
  assez, `chance` d'événement → `0.8`.
- `data/events.js` : 2 événements `comeback: true` (`ev_retour_chemin`,
  `ev_retour_page`) + lore dans `loot.js`. `engine/events.js` :
  `eventEligible(…, {comeback})` les exclut hors retour ; `drawEvent` les met
  devant en mode retour.
- `voice.ctx.comeback` (7 thèmes) : accueil, **jamais** un décompte de jours
  manqués (D3 ; test : pas de mot de reproche).

## 1.4 — Événement d'ouverture occasionnel

- `history.daysSinceEvent` : `newDay` l'incrémente si pas d'événement, le
  remet à 0 sinon.
- `drawDaily` : après `EVENT_DROUGHT_MAX = 4` jours secs, `chance = 1`.
  Compteur borné (vérifié en sim).

## Tests

- `tests/engine.test.mjs` : 6 nouveaux tests Phase 1 + extension de
  `voix par thème (D12)`. **52/52.**
- `tests/simulate.mjs` : 2 absences volontaires (`GAPS`) pour éprouver le
  retour, ligne « Jalons atteints » au rapport, boucle voix compagnon × 7
  thèmes. Sim 45 j : 12/12 jalons, **aucune violation**.
- `npm run quests` vert (4 points d'attention inchangés).
- Pas de CSS touché cette session.

## Reste ouvert (repris du récap précédent + Phase 1)

- **QA visuelle appareil** : Phase 0 (accueil) + Phase 1 se voient surtout
  dans la ligne du compagnon — vérifier les 7 voix de jalon / retour sur
  appareil.
- Remettre `npm run quests` dans `.github/workflows/ci.yml` (scope `workflow`).
- Phase 2 (vie du personnage & présentation) : **2.3 collection « Moments »**
  s'appuie directement sur `state.milestones` posé ici.
- Phase 3.3 mini-arcs secrets = plus gros levier restant.
- Vidéos d'aperçu boutique, IAP réel (Play Console), trous banque de quêtes,
  Play Store — inchangés.
