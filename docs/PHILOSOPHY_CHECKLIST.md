# Checklist philosophie — passage obligatoire

> Formalise `REVUE_CRITIQUE.md` §3.1. Toute nouvelle feature touchant séries,
> notifications, comparaison entre joueurs, ou proposition de contenu doit
> passer ces 5 questions **avant** merge. Si une réponse est non, la feature
> est retravaillée ou refusée — pas de compromis « juste cette fois ».
> Fait autorité au même titre que `DECISIONS.md` (voir D11).

1. **Le joueur peut ignorer ça avec zéro pénalité** (aucune perte réelle d'XP,
   d'objet, de rang, de progression) ?
2. **Ça n'implique jamais que le joueur échoue / est paresseux / « évite »** ?
   (aucun call-out d'évitement, cf. le nudge social réécrit en offre positive)
3. **Une série cassée ne coûte rien de réel** — et si l'app le mentionne, c'est
   pour rassurer, jamais pour culpabiliser ?
4. **Les données nécessaires restent sur l'appareil** — aucun appel réseau,
   aucune télémétrie, aucune IA distante ?
5. **Le ton reste « ça pourrait être marrant »**, jamais « tu dois » — y
   compris dans les micro-copies (toasts, notifications, réglages) ?

## Garde-fous existants (ne pas retirer sans nouvelle décision)

- `tests/no-network.test.mjs` — échoue si un appel réseau apparaît dans
  `www/js` (point 4).
- Tests moteur `ignorer une quête ne coûte rien` / `compléter une quête :
  aucune pénalité` (`tests/engine.test.mjs`) (point 1).
- `progression.js: bumpStreak` — une rupture réelle (`broke: true`) déclenche
  un toast de réassurance (`streak_break_ok`), jamais un message négatif
  (point 3).
- `engine/comeback.js` + `voice.ctx.comeback` — au retour après absence, on
  n'affiche ni ne stocke jamais le nombre de jours « manqués » ; la ligne
  d'accueil rassure (« rien à rattraper »). Test `voix par thème` : les
  lignes `comeback` ne contiennent pas de mot de reproche (points 3, 5).
- `engine/milestones.js` + `engine/discoveries.js` — un jalon / une découverte
  jamais atteint ne retire rien et s'affiche « scellé », pas « manqué »
  (point 2). Couvert par `checkNoPenalty` et la simulation.
- `engine/progression.js: traitTierFor` — les compétences sont présentées en
  paliers **relatifs** (`dominante`…`discrète`), jamais un score absolu à
  maximiser ; l'écran Personnage n'affiche aucun chiffre (D14, UX §11).
  Test `charBits : traits qualitatifs` : pas de `progressbar`, aucune valeur.
- « Ton chemin » (`charBits.pathStatsHtml`) — n'affiche jamais de jours
  manqués ; `comebacks` (reprises) n'apparaît que s'il est > 0, formulé
  positivement (point 3, point 5).
- `engine/journal.js: dailyRecapEntry` — l'entrée « du jour » n'est écrite que
  si quelque chose a été vécu ; **jamais d'entrée pour une journée vide**, donc
  jamais de « tu n'as rien fait hier » (points 2, 5).
- `data/arcs.js` — les étapes de mini-arc sont toujours à effort léger,
  audace 2, avec un `safe_fallback` ; un arc jamais commencé ou abandonné ne
  coûte rien et ne s'affiche pas comme un manque (points 1, 5).
- `DECISIONS.md` D3 — aucun classement, aucune comparaison de niveau.
- `DECISIONS.md` D11 — aucune quête créée par le joueur (push, pas pull).
