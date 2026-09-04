// Tirage quotidien — cf. docs/TAXONOMIE.md §7.
// Renvoie { quests, event } sans muter l'état ; le bookkeeping (historique,
// drawDate) est appliqué par game.newDay().

import { QUESTS } from '../data/quests.js';
import { EVENTS } from '../data/events.js';
import {
  FAMILIES, FAMILY_KEYS, EFFORT_POINTS, DAILY_EFFORT_BUDGET,
} from '../data/taxonomy.js';
import { dayPart } from './dates.js';
import { weightedPick, shuffle, pick, defaultRng } from './rng.js';

const MIN_QUESTS = 3;
const MAX_QUESTS = 4;
const HIDDEN_SWAP_CHANCE = 0.25;
const EVENT_CHANCE = 0.30;
const PREF_FAMILY_BONUS = 12;
const RECENT_DONE_MEMORY = 40;

/** Entrée sociale plus douce quand les quêtes sociales n'accrochent pas. */
export function wantsGentleSocial(state) {
  const h = state.history.social;
  return h.proposed >= 3 && h.skipped >= 2 && h.completed === 0;
}

function gentleSocialQuest() {
  return {
    id: 'gentle_social',
    famille: 'social',
    text: {
      fr: "Une mini-interaction toute simple, si l'envie te prend : demande à quelqu'un « Comment se passe ta journée ? »",
      en: "A tiny, easy interaction, if you feel like it: ask someone “How's your day going?”",
    },
    xp: 110,
    effort: 'leger',
    registre: 'experience',
    poids: 'petite',
    audace: 1,
    contexte: ['presence_gens'],
    safe_fallback: {
      fr: "Garde l'idée pour quand ça se présente — aucune urgence.",
      en: "Keep the idea for when it comes up — no rush.",
    },
    defi_ami: false,
    gentle: true,
  };
}

function momentOk(quest, part) {
  const m = (quest.contexte || []).find((c) => c.startsWith('moment:'));
  return !m || m === `moment:${part}`;
}

export function drawDaily(state, { now = new Date(), rng = defaultRng } = {}) {
  const part = dayPart(now);
  const recentDone = new Set(state.history.completedQuestIds.slice(-RECENT_DONE_MEMORY));
  const ceiling = Math.min(5, state.comfort + 1);

  const eligible = QUESTS.filter(
    (q) => !q.hidden && q.audace <= ceiling && momentOk(q, part),
  );
  const fresh = eligible.filter((q) => !recentDone.has(q.id));
  const base = fresh.length >= 10 ? fresh : eligible;
  const poolFor = (fam) => shuffle(base.filter((q) => q.famille === fam), rng);

  const chosen = [];
  const familleCount = {};
  let effortUsed = 0;
  let consequentUsed = false;

  const canAdd = (q) => {
    if (chosen.some((c) => c.id === q.id)) return false;
    if ((familleCount[q.famille] || 0) >= 2) return false;
    if (q.effort === 'consequent' && consequentUsed) return false;
    if (
      effortUsed + EFFORT_POINTS[q.effort] > DAILY_EFFORT_BUDGET &&
      chosen.length >= MIN_QUESTS
    ) return false;
    return true;
  };
  const add = (q) => {
    chosen.push({ ...q, status: 'proposed' });
    familleCount[q.famille] = (familleCount[q.famille] || 0) + 1;
    effortUsed += EFFORT_POINTS[q.effort];
    if (q.effort === 'consequent') consequentUsed = true;
  };

  // 1. Toujours au moins une entrée sociale.
  if (wantsGentleSocial(state)) {
    add(gentleSocialQuest());
  } else {
    const s = poolFor('social').find(canAdd);
    if (s) add(s);
  }

  // 2. Remplissage pondéré par famille.
  const recentF = state.history.recentFamilles.slice(-3);
  const chaosStreak = recentF.length === 3 && recentF.every((f) => f === 'chaos');

  let guard = 0;
  while (chosen.length < MAX_QUESTS && guard++ < 60) {
    const weights = FAMILY_KEYS.map((fam) => {
      let w = FAMILIES[fam].drawWeight;
      if (state.prefFamilies.includes(fam)) w += PREF_FAMILY_BONUS;
      if (fam === 'chaos' && (chaosStreak || (familleCount.chaos || 0) >= 1)) w = 0;
      if ((familleCount[fam] || 0) >= 2) w = 0;
      return { value: fam, weight: w };
    });
    if (weights.every((x) => x.weight <= 0)) break;

    const fam = weightedPick(weights, rng);
    const cand = poolFor(fam).find(canAdd);
    if (cand) add(cand);

    if (chosen.length >= MIN_QUESTS && effortUsed >= DAILY_EFFORT_BUDGET - 1) break;
  }

  // 3. Quête cachée à la place d'un créneau non-social (25 %),
  //    sans casser les invariants (≤1 conséquent, ≤2 par famille).
  if (rng() < HIDDEN_SWAP_CHANCE && chosen.length) {
    let idx = chosen.length - 1;
    for (let i = chosen.length - 1; i >= 0; i--) {
      if (chosen[i].famille !== 'social') { idx = i; break; }
    }
    const rest = chosen.filter((_, i) => i !== idx);
    const consequentElsewhere = rest.some((c) => c.effort === 'consequent');
    const famCount = (fam) => rest.filter((c) => c.famille === fam).length;

    const hiddenPool = shuffle(
      QUESTS.filter(
        (q) => q.hidden && q.audace <= ceiling &&
          !recentDone.has(q.id) && !chosen.some((c) => c.id === q.id) &&
          !(q.effort === 'consequent' && consequentElsewhere) &&
          famCount(q.famille) < 2 &&
          !(q.famille === 'chaos' && rest.some((c) => c.famille === 'chaos')),
      ),
      rng,
    );
    if (hiddenPool.length) chosen[idx] = { ...hiddenPool[0], status: 'proposed' };
  }

  // 4. Événement (30 %), hors budget d'effort.
  let event = null;
  if (rng() < EVENT_CHANCE) {
    const ev = pick(shuffle(EVENTS, rng), rng);
    if (ev) event = { ...ev, status: 'active' };
  }

  return { quests: chosen, event };
}
