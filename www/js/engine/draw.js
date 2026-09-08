// Tirage quotidien — cf. docs/TAXONOMIE.md §7.
// Renvoie { quests, event } sans muter l'état ; le bookkeeping (historique,
// drawDate) est appliqué par game.newDay().
// Mélange banque curée + quêtes générées (templates + slots).

import { QUESTS } from '../data/quests.js';
import {
  FAMILIES, FAMILY_KEYS, EFFORT_POINTS, DAILY_EFFORT_BUDGET,
} from '../data/taxonomy.js';
import { dayPart } from './dates.js';
import { weightedPick, shuffle, defaultRng } from './rng.js';
import { expandTemplates } from './generate.js';
import { drawEvent, adaptiveFamilyBonus } from './events.js';
import { isComebackDay } from './comeback.js';
import { currentArcStep } from './arcs.js';

// Exactement 3 propositions/jour (plan UX : « choisis ton aventure », D9/D10
// du 2026-09-05) — le moteur de tirage/budget/accept-multiple reste inchangé,
// seul le nombre de créneaux affichés change (4 -> 3).
const MIN_QUESTS = 3;
const MAX_QUESTS = 3;
const HIDDEN_SWAP_CHANCE = 0.25;
// Étape de mini-arc : ~1 fois tous les 3-4 jours quand un arc est disponible
// (4 arcs de 3-4 étapes ≈ 2-3 mois de jeu).
const ARC_STEP_CHANCE = 0.28;
const EVENT_CHANCE = 0.32;
const COMEBACK_EVENT_CHANCE = 0.8;
// Après ce nombre de jours sans événement, on en force un : il faut qu'il y ait
// une question à l'ouverture (« aujourd'hui, quelque chose est différent »).
const EVENT_DROUGHT_MAX = 4;
const PREF_FAMILY_BONUS = 12;
const RECENT_DONE_MEMORY = 56;

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

/**
 * Habille les 3 propositions du jour en ⭐ principale / 🌿 tranquille /
 * 🔥 audacieuse, selon l'audace relative (plan §12-13). Purement cosmétique :
 * ne change ni le tirage ni les règles, juste l'étiquette affichée.
 */
function assignProposalRoles(quests) {
  const ranked = quests.map((_, i) => i).sort((a, b) => (
    quests[a].audace - quests[b].audace || a - b
  ));
  quests.forEach((q, i) => {
    if (i === ranked[0]) q.role = 'tranquille';
    else if (i === ranked[ranked.length - 1]) q.role = 'audacieuse';
    else q.role = 'principale';
  });
  return quests;
}

export function drawDaily(state, { now = new Date(), rng = defaultRng } = {}) {
  const part = dayPart(now);
  const recentDone = new Set(state.history.completedQuestIds.slice(-RECENT_DONE_MEMORY));
  const ceiling = Math.min(5, state.comfort + 1);
  const comeback = isComebackDay(state, now);

  const curated = QUESTS.filter(
    (q) => !q.hidden && q.audace <= ceiling && momentOk(q, part),
  );
  const generated = expandTemplates({ ceiling, part, recentDone, rng, hidden: false });
  const eligible = curated.concat(generated);
  const fresh = eligible.filter((q) => !recentDone.has(q.id));
  // Au retour, on privilégie franchement des quêtes jamais faites dès qu'il y en
  // a de quoi remplir la journée (sinon le seuil habituel de 10).
  const base = (comeback ? fresh.length >= 3 : fresh.length >= 10) ? fresh : eligible;
  const poolFor = (fam) => shuffle(base.filter((q) => q.famille === fam), rng);

  const chosen = [];
  const familleCount = {};
  let effortUsed = 0;
  let consequentUsed = false;

  const canAdd = (q) => {
    if (chosen.some((c) => c.id === q.id)) return false;
    if (q.templateId && chosen.some((c) => c.templateId === q.templateId)) return false;
    if ((familleCount[q.famille] || 0) >= 2) return false;
    // Au retour après absence, on ne propose jamais d'effort conséquent.
    if (comeback && q.effort === 'consequent') return false;
    if (q.effort === 'consequent' && consequentUsed) return false;
    const next = effortUsed + EFFORT_POINTS[q.effort];
    if (next > DAILY_EFFORT_BUDGET) {
      if (chosen.length >= MIN_QUESTS) return false;
      // Remplir le minimum : au plus +1 pt de dépassement, et plutôt léger.
      if (next > DAILY_EFFORT_BUDGET + 1) return false;
      if (q.effort === 'consequent') return false;
    }
    return true;
  };
  const add = (q) => {
    chosen.push({ ...q, status: 'proposed' });
    familleCount[q.famille] = (familleCount[q.famille] || 0) + 1;
    effortUsed += EFFORT_POINTS[q.effort];
    if (q.effort === 'consequent') consequentUsed = true;
  };
  // Au retour après absence, on vise l'effort léger tant que c'est possible.
  const pickFrom = (pool) => (
    comeback ? (pool.find((q) => canAdd(q) && q.effort === 'leger') || pool.find(canAdd))
      : pool.find(canAdd)
  );

  // 1. Toujours au moins une entrée sociale.
  if (wantsGentleSocial(state)) {
    add(gentleSocialQuest());
  } else {
    const s = pickFrom(poolFor('social'));
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
      w += adaptiveFamilyBonus(fam, state);
      if (fam === 'chaos' && (chaosStreak || (familleCount.chaos || 0) >= 1)) w = 0;
      if ((familleCount[fam] || 0) >= 2) w = 0;
      return { value: fam, weight: Math.max(0, w) };
    });
    if (weights.every((x) => x.weight <= 0)) break;

    const fam = weightedPick(weights, rng);
    const cand = pickFrom(poolFor(fam));
    if (cand) add(cand);

    if (chosen.length >= MIN_QUESTS && effortUsed >= DAILY_EFFORT_BUDGET - 1) break;
  }

  // 3a. Étape de mini-arc secret (Phase 3.3) — occupe le créneau « mystère »
  //     à la place d'une quête cachée aléatoire. Toujours légère + audace 2,
  //     donc les invariants tiennent (budget d'effort ne fait que baisser).
  let arcInjected = false;
  const arcStep = currentArcStep(state);
  if (arcStep && rng() < ARC_STEP_CHANCE && chosen.length) {
    let idx = -1;
    for (let i = chosen.length - 1; i >= 0; i--) {
      if (chosen[i].famille !== 'social' && chosen[i].id !== arcStep.id) { idx = i; break; }
    }
    if (idx >= 0) {
      const rest = chosen.filter((_, i) => i !== idx);
      const famOk = rest.filter((c) => c.famille === arcStep.famille).length < 2;
      const dup = chosen.some((c) => c.id === arcStep.id) || recentDone.has(arcStep.id);
      if (famOk && !dup) {
        chosen[idx] = { ...arcStep, status: 'proposed' };
        arcInjected = true;
      }
    }
  }

  // 3b. Sinon, quête cachée à la place d'un créneau non-social (25 %),
  //     sans casser les invariants (≤1 conséquent, ≤2 par famille, budget).
  //     Pas au retour après absence — on garde la reprise légère.
  if (!arcInjected && !comeback && rng() < HIDDEN_SWAP_CHANCE && chosen.length) {
    let idx = chosen.length - 1;
    for (let i = chosen.length - 1; i >= 0; i--) {
      if (chosen[i].famille !== 'social') { idx = i; break; }
    }
    const rest = chosen.filter((_, i) => i !== idx);
    const restEffort = rest.reduce((s, c) => s + EFFORT_POINTS[c.effort], 0);
    const consequentElsewhere = rest.some((c) => c.effort === 'consequent');
    const famCount = (fam) => rest.filter((c) => c.famille === fam).length;
    const fitsBudget = (q) => restEffort + EFFORT_POINTS[q.effort] <= DAILY_EFFORT_BUDGET + 1;

    const curatedHidden = QUESTS.filter(
      (q) => q.hidden && q.audace <= ceiling &&
        !recentDone.has(q.id) && !chosen.some((c) => c.id === q.id) &&
        !(q.effort === 'consequent' && consequentElsewhere) &&
        famCount(q.famille) < 2 &&
        fitsBudget(q) &&
        !(q.famille === 'chaos' && rest.some((c) => c.famille === 'chaos')),
    );
    const genHidden = expandTemplates({ ceiling, part, recentDone, rng, hidden: true }).filter(
      (q) => !chosen.some((c) => c.id === q.id || (q.templateId && c.templateId === q.templateId)) &&
        !(q.effort === 'consequent' && consequentElsewhere) &&
        famCount(q.famille) < 2 &&
        fitsBudget(q) &&
        !(q.famille === 'chaos' && rest.some((c) => c.famille === 'chaos')),
    );
    const hiddenPool = shuffle(curatedHidden.concat(genHidden), rng);
    if (hiddenPool.length) chosen[idx] = { ...hiddenPool[0], status: 'proposed' };
  }

  // 4. Événement contextuel (hors budget d'effort). Au retour, un événement
  //    d'accueil est très probable ; après une longue disette, on en force un.
  let event = null;
  const drought = (state.history?.daysSinceEvent || 0) >= EVENT_DROUGHT_MAX;
  const chance = comeback ? COMEBACK_EVENT_CHANCE : (drought ? 1 : EVENT_CHANCE);
  const drawn = drawEvent(state, { now, rng, chance, comeback });
  if (drawn) event = { ...drawn, status: 'active' };

  assignProposalRoles(chosen);
  return { quests: chosen, event };
}
