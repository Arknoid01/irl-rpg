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
- `DECISIONS.md` D3 — aucun classement, aucune comparaison de niveau.
- `DECISIONS.md` D11 — aucune quête créée par le joueur (push, pas pull).
