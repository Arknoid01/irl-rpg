// Progression du personnage : XP, niveau, compétences, titres, série, style.
// Ces fonctions MUTENT un brouillon d'état et poussent des « effets » que l'UI
// pourra animer. Aucune pénalité n'est jamais infligée (cf. philosophy.js).

import { xpToNext, SKILL_KEYS } from '../data/taxonomy.js';
import { TITLES, STYLES, STYLE_PAIRS, STYLE_DEFAULT } from '../data/titles.js';
import { yesterdayStr } from './dates.js';

export function gainXp(s, effects, amount) {
  if (!amount) return;
  s.xp += amount;
  effects.push({ type: 'xp', amount });
  let need = xpToNext(s.level);
  while (s.xp >= need) {
    s.xp -= need;
    s.level += 1;
    effects.push({ type: 'levelup', level: s.level });
    need = xpToNext(s.level);
  }
}

export function gainSkills(s, effects, deltas) {
  for (const [skill, delta] of Object.entries(deltas || {})) {
    if (!delta || !(skill in s.skills)) continue;
    s.skills[skill] += delta;
    effects.push({ type: 'skill', skill, amount: delta });
  }
  checkTitles(s, effects);
}

export function checkTitles(s, effects) {
  for (const t of TITLES) {
    if (s.titles.includes(t.id)) continue;
    if ((s.skills[t.skill] || 0) >= t.min) {
      s.titles.push(t.id);
      effects.push({ type: 'title', id: t.id, label: t.label });
    }
  }
}

/**
 * Met à jour la série. Une série cassée ne coûte RIEN (aucune perte d'XP,
 * d'objet ou de rang) — c'est juste un compteur qui repart.
 */
export function bumpStreak(s, effects, todayS) {
  if (s.lastActiveDate === todayS) return;
  const y = yesterdayStr(new Date(todayS + 'T12:00:00Z'));
  if (s.lastActiveDate === y) {
    s.streak += 1;
  } else {
    s.streak = 1;
  }
  s.lastActiveDate = todayS;
  s.history.bestStreak = Math.max(s.history.bestStreak || 0, s.streak);
  effects.push({ type: 'streak', value: s.streak });
}

/** % de quêtes du jour accomplies. Indicateur, PAS une ressource — ne bloque rien. */
export function elanDuJour(s) {
  const total = s.quests.length;
  if (!total) return 0;
  const done = s.quests.filter((q) => q.status === 'done').length;
  return Math.round((done / total) * 100);
}

export function xpProgress(s) {
  const need = xpToNext(s.level);
  return { xp: s.xp, need, pct: Math.min(100, Math.round((s.xp / need) * 100)) };
}

/** Style d'aventure : 1-2 compétences dominantes. Jamais un jugement. */
export function computeStyle(s) {
  const ranked = SKILL_KEYS
    .map((k) => [k, s.skills[k] || 0])
    .sort((a, b) => b[1] - a[1]);
  const [first, second] = ranked;
  if (!first || first[1] === 0) return STYLE_DEFAULT;
  // Deux compétences proches -> style « paire »
  if (second && second[1] > 0 && second[1] >= first[1] * 0.6) {
    const key1 = `${first[0]}+${second[0]}`;
    const key2 = `${second[0]}+${first[0]}`;
    if (STYLE_PAIRS[key1]) return STYLE_PAIRS[key1];
    if (STYLE_PAIRS[key2]) return STYLE_PAIRS[key2];
  }
  return STYLES[first[0]] || STYLE_DEFAULT;
}
