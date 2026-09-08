# Étoffer la banque de quêtes

> Pipeline pour ajouter des quêtes **durablement**, sans régression.
> Le modèle de données fait autorité dans `TAXONOMIE.md` ; ce doc-ci est le
> mode d'emploi. Philosophie : « tiens, ça pourrait être marrant » — jamais
> « encore une tâche » (`PHILOSOPHY_CHECKLIST.md`).

## Boucle

1. `npm run quests` — rapport de santé + couverture. Regarde les
   **points d'attention** : familles minces, cases famille × effort vides,
   niveaux d'audace peu fournis. Écris là où ça manque.
2. Ajoute la (les) quête(s) — voir ci-dessous.
3. `npm test` — intégrité du modèle, i18n, pas de doublon de texte.
4. `npm run sim` — simulation 45 jours, invariants de rythme et philosophie.
5. `npm run quests` à nouveau — 0 erreur dure, et idéalement un point
   d'attention en moins.

Les trois commandes tournent aussi en CI (`.github/workflows/ci.yml`).

## Ajouter une quête curée — `www/js/data/quests.js`

Un objet dans le tableau `QUESTS`, rangé sous le commentaire de sa famille :

```js
{ id: 's_nouvelle', famille: 'social', xp: 110, effort: 'leger',
  registre: 'quete', audace: 2, contexte: ['presence_gens'],
  safe_fallback: FB_SOCIAL, defi_ami: true,
  text: { fr: "…", en: "…" } },
```

| Champ | Règle |
|---|---|
| `id` | unique, préfixe de famille (`s_`, `e_`, `c_`, `cr_`, `q_`, `ch_`) |
| `famille` | une des 6 (`TAXONOMIE.md` §1) — pilote le tirage et les compétences |
| `xp` | ~60 (geste léger) → ~180 (quête conséquente) ; reste dans la fourchette existante, ne pas gonfler |
| `effort` | `leger` (1 pt) · `moyen` (2) · `consequent` (4) — budget /jour = 7 |
| `registre` | `quete` (action nette) · `experience` (posture, ressenti) |
| `audace` | 1 (anodin) → 5 (demande un vrai pas de côté) |
| `contexte` | ex. `presence_gens`, `exterieur`, `commerce_ouvert`, `moment:soir` |
| `safe_fallback` | **obligatoire** dès qu'il y a un `contexte` non `moment:` — réutilise `FB_SOCIAL` / `FB_DEHORS` / `FB_LATER` ou écris un `{fr,en}` |
| `defi_ami` | `true` si la quête se partage bien en texte (pas de classement) |
| `skill_bonus` | rare — pousse une compétence secondaire précise |
| `hidden` + `fragment` | quête « ❓ mystère » : texte révélé à l'acceptation, `fragment {fr,en}` ajouté au Journal à la complétion |

Garde-fous automatiques : `id` unique, `famille`/`effort`/`registre`/`audace`
valides, `text` bilingue, règle `contexte → safe_fallback`, **aucun doublon
de texte** (comparaison accents/ponctuation ignorés).

## Ajouter un template génératif — `www/js/data/templates.js`

Même modèle + des `{slots}` dans le texte et une map `slots` vers des pools
de `www/js/data/slots.js` :

```js
{ id: 't_objet_couleur', famille: 'curiosite', xp: 90, effort: 'leger',
  registre: 'experience', audace: 1,
  slots: { couleur: 'couleur', lieu: 'lieu_proche' },
  text: {
    fr: "Trouve trois choses {couleur} autour de {lieu}.",
    en: "Find three {couleur} things around {lieu}.",
  } },
```

- Tout `{slot}` du texte doit exister dans `slots` (et inversement, pas de
  slot déclaré inutilisé) — vérifié par `npm test`.
- Un pool réutilisable → l'ajouter à `SLOT_POOLS` ; valeurs numériques
  partagées FR/EN, libellés en `{fr,en}`.
- `npm run quests` signale les pools jamais utilisés et estime le nombre de
  combinaisons produites.

## Ce que `npm run quests` bloque (exit 1)

- doublon de texte entre deux quêtes curées (fr ou en) ;
- deux templates identiques une fois les `{slots}` retirés ;
- une famille sans **aucune** quête curée.

Le reste (familles minces, cases vides, audace 4–5 peu fournie) est un
**point d'attention**, pas un blocage : c'est la feuille de route pour les
prochains ajouts.
