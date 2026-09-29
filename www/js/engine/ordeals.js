// Épreuves de passage (D21). À partir du niveau 3, quand la barre d'XP est
// pleine, une épreuve apparaît ; la valider fait monter de niveau. Elle est
// choisie d'après les familles vécues pendant le niveau (`history.levelFam`).
// Garde-fous : l'XP continue de s'accumuler (les niveaux en retard tombent
// d'un coup), « Autre épreuve » à volonté, aucune limite de temps.

import { ORDEALS, ORDEAL_BY_ID } from '../data/ordeals.js';
import { FAMILY_KEYS, xpToNext } from '../data/taxonomy.js';
import { ORDEAL_FROM_LEVEL } from './progression.js';

/** Deux familles sont « proches » si la seconde fait au moins 60 % de la première. */
const PAIR_RATIO = 0.6;

/** La barre est pleine et aucune épreuve n'attend. */
export function ordealDue(s) {
  return !s.ordeal && s.level >= ORDEAL_FROM_LEVEL && s.xp >= xpToNext(s.level);
}

/** Familles vécues pendant le niveau, de la plus fréquente à la moins fréquente. */
export function rankedFamilies(levelFam = {}) {
  return FAMILY_KEYS
    .map((f, i) => [f, levelFam[f] || 0, i])
    .sort((a, b) => b[1] - a[1] || a[2] - b[2])
    .map(([f, n]) => ({ famille: f, n }));
}

/**
 * Épreuves candidates, dans l'ordre de préférence : le duo des deux familles
 * dominantes (si proches), puis celles de la 1re famille, de la 2e, etc.
 * Les épreuves déjà passées vont en fin de liste (jamais exclues : on
 * finit par revoir d'anciennes épreuves plutôt que d'en manquer).
 */
export function ordealCandidates(s) {
  const ranked = rankedFamilies(s.history?.levelFam);
  const [a, b] = ranked;
  const out = [];
  const push = (o) => { if (o && !out.includes(o)) out.push(o); };
  if (a.n > 0 && b.n > 0 && b.n >= a.n * PAIR_RATIO) {
    push(ORDEALS.find((o) => o.familles.length === 2
      && o.familles.includes(a.famille) && o.familles.includes(b.famille)));
  }
  // Rotation par niveau : deux joueurs au même profil ne voient pas la même.
  const rot = Math.max(0, s.level || 0);
  for (const { famille } of ranked) {
    const solo = ORDEALS.filter((o) => o.familles.length === 1 && o.familles[0] === famille);
    for (let i = 0; i < solo.length; i++) push(solo[(i + rot) % solo.length]);
  }
  const done = new Set(s.history?.ordealsDone || []);
  return [...out.filter((o) => !done.has(o.id)), ...out.filter((o) => done.has(o.id))];
}

/** Choisit une épreuve, en évitant celles déjà écartées pour ce niveau. */
export function pickOrdeal(s, skipped = []) {
  const list = ordealCandidates(s);
  return list.find((o) => !skipped.includes(o.id)) || list[0] || null;
}

/** Ouvre une épreuve si la barre est pleine (mute `s`). */
export function openOrdealIfDue(s, effects) {
  if (!ordealDue(s)) return;
  const o = pickOrdeal(s);
  if (!o) return;
  s.ordeal = { id: o.id, skipped: [] };
  effects.push({ type: 'ordeal-ready', id: o.id });
}

/** L'épreuve en attente, résolue depuis les données (ou null). */
export function currentOrdeal(s) {
  return (s && s.ordeal && ORDEAL_BY_ID[s.ordeal.id]) || null;
}
