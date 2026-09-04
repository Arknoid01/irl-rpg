// Vue dérivée de la carte : pure, pas de mutation d'état.
// Simule sur le plateau les éléments du jeu (quêtes, événement, souvenirs…).

import { WORLD_REGIONS, WORLD_PATHS } from '../data/world.js';
import { QUESTS } from '../data/quests.js';
import { QUEST_TEMPLATES } from '../data/templates.js';
import { FAMILIES } from '../data/taxonomy.js';

const HIDDEN_QUEST_IDS = new Set([
  ...QUESTS.filter((q) => q.hidden).map((q) => q.id),
  ...QUEST_TEMPLATES.filter((t) => t.hidden).map((t) => `tpl:${t.id}`),
]);

function familyCount(state, fam) {
  return (state.history.familleCompleted && state.history.familleCompleted[fam]) || 0;
}

function hiddenCompleted(state) {
  const ids = state.history.completedQuestIds || [];
  let n = 0;
  for (const id of ids) {
    if (HIDDEN_QUEST_IDS.has(id)) n += 1;
    else if (typeof id === 'string' && id.startsWith('g_tpl_h_')) n += 1;
    else if (typeof id === 'string' && id.startsWith('tpl:tpl_h_')) n += 1;
  }
  return n;
}

/**
 * @returns {'locked'|'fog'|'discovered'|'active'}
 */
export function regionStatus(region, state) {
  const u = region.unlock;
  if (u.type === 'always') return 'discovered';

  if (u.type === 'level') {
    if (state.level < u.min) return 'locked';
    return 'discovered';
  }

  if (u.type === 'hidden') {
    if (hiddenCompleted(state) < u.n) return 'locked';
    return 'discovered';
  }

  if (u.type === 'family') {
    const n = familyCount(state, region.famille);
    if (n < u.n) return 'fog';
    const today = (state.quests || []).some(
      (q) => q.famille === region.famille && (q.status === 'proposed' || q.status === 'accepted'),
    );
    return today ? 'active' : 'discovered';
  }

  return 'fog';
}

function intensityFor(region, state) {
  if (region.kind === 'family') {
    const n = familyCount(state, region.famille);
    return Math.min(1, n / 12);
  }
  if (region.kind === 'hub') {
    return Math.min(1, (state.history.totalCompleted || 0) / 40);
  }
  if (region.kind === 'gate') {
    return regionStatus(region, state) === 'discovered' ? 0.7 : 0;
  }
  if (region.kind === 'mystery') {
    return regionStatus(region, state) === 'discovered' ? 0.85 : 0;
  }
  return 0;
}

function regionForFamily(fam) {
  return WORLD_REGIONS.find((r) => r.famille === fam) || WORLD_REGIONS.find((r) => r.id === 'foyer');
}

/**
 * Pins simulés : quêtes du jour, événement, souvenirs.
 * @returns {Array<object>}
 */
export function mapPins(state) {
  const pins = [];

  for (const q of state.quests || []) {
    if (q.status === 'ignored') continue;
    const reg = regionForFamily(q.famille);
    pins.push({
      id: `quest:${q.id}`,
      kind: 'quest',
      regionId: reg.id,
      status: q.status,
      famille: q.famille,
      questId: q.id,
      label: q.text,
      xp: q.xp,
      hidden: !!q.hidden,
    });
  }

  if (state.event && state.event.status !== 'done' && state.event.status !== 'dismissed') {
    const fam = state.event.famille;
    const regionId = fam
      ? (WORLD_REGIONS.find((r) => r.famille === fam)?.id || 'foyer')
      : 'foyer';
    pins.push({
      id: `event:${state.event.id}`,
      kind: 'event',
      regionId,
      status: state.event.status,
      label: state.event.title,
      xp: state.event.xp,
      famille: fam || null,
    });
  }

  const inv = (state.inventory || []).slice(-8);
  inv.forEach((it, i) => {
    pins.push({
      id: `souvenir:${i}:${it.date || i}`,
      kind: 'souvenir',
      regionId: 'foyer',
      label: it.item,
      date: it.date,
    });
  });

  return pins;
}

export function heroRegionId(state) {
  const accepted = (state.quests || []).find((q) => q.status === 'accepted');
  if (accepted) return regionForFamily(accepted.famille).id;
  const proposed = (state.quests || []).find((q) => q.status === 'proposed');
  if (proposed) return regionForFamily(proposed.famille).id;
  const recent = (state.history.recentFamilles || []).slice(-1)[0];
  if (recent) return regionForFamily(recent).id;
  return 'foyer';
}

/**
 * Vue complète pour l’UI.
 */
export function buildWorldView(state) {
  const pins = mapPins(state);
  const fresh = new Set(state.history?.regionsFresh || []);
  const regions = WORLD_REGIONS.map((r) => {
    const status = regionStatus(r, state);
    const regionPins = pins.filter((p) => p.regionId === r.id);
    return {
      ...r,
      status,
      intensity: intensityFor(r, state),
      completions: r.famille ? familyCount(state, r.famille) : null,
      color: r.famille && FAMILIES[r.famille] ? FAMILIES[r.famille].color : null,
      pins: regionPins,
      unlockHint: unlockHint(r, state),
      justRevealed: fresh.has(r.id),
    };
  });

  return {
    regions,
    paths: WORLD_PATHS,
    pins,
    heroRegionId: heroRegionId(state),
    stats: {
      discovered: regions.filter((r) => r.status === 'discovered' || r.status === 'active').length,
      total: regions.length,
      fog: regions.filter((r) => r.status === 'fog').length,
      locked: regions.filter((r) => r.status === 'locked').length,
    },
  };
}

/**
 * Met à jour regionsUnlocked / regionsFresh selon l’état courant.
 * @returns {object[]} régions nouvellement révélées (objets WORLD_REGIONS)
 */
export function syncRegionUnlocks(state) {
  if (!state.history.regionsUnlocked) state.history.regionsUnlocked = [];
  if (!state.history.regionsFresh) state.history.regionsFresh = [];
  const known = new Set(state.history.regionsUnlocked);
  const newly = [];
  for (const r of WORLD_REGIONS) {
    const st = regionStatus(r, state);
    if (st === 'discovered' || st === 'active') {
      if (!known.has(r.id)) {
        known.add(r.id);
        newly.push(r);
        state.history.regionsFresh.push(r.id);
      }
    }
  }
  state.history.regionsUnlocked = [...known];
  state.history.regionsFresh = state.history.regionsFresh.slice(-8);
  return newly;
}

export function clearRegionFresh(state) {
  if (state.history) state.history.regionsFresh = [];
}

function unlockHint(region, state) {
  const u = region.unlock;
  if (u.type === 'always') return null;
  if (u.type === 'level' && state.level < u.min) {
    return { fr: `Se dévoile au niveau ${u.min}.`, en: `Reveals at level ${u.min}.` };
  }
  if (u.type === 'hidden' && hiddenCompleted(state) < u.n) {
    return {
      fr: 'Accomplis une quête mystérieuse pour ouvrir ce lieu.',
      en: 'Complete a mysterious quest to open this place.',
    };
  }
  if (u.type === 'family' && familyCount(state, region.famille) < u.n) {
    return {
      fr: 'Valide une quête de cette famille pour lever la brume.',
      en: 'Complete a quest of this family to clear the fog.',
    };
  }
  return null;
}
