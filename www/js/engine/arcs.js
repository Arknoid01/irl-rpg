// Suivi des mini-arcs secrets (ROADMAP Phase 3.3). Un arc à la fois.
// state.arcs = { active: <arcId|null>, step: <index de la prochaine étape>,
//               completed: [<arcId>] }.
// Fonctions pures pour le tirage / l'UI ; advanceArc() mute state.arcs et est
// appelé par engine/game.js à la complétion d'une étape.

import { ARCS } from '../data/arcs.js';

const FALLBACK = {
  fr: "Garde l’idée pour quand ça se présente — rien ne presse.",
  en: "Keep the idea for when it comes up — no rush.",
};

export function arcState(state) {
  const a = (state && state.arcs) || {};
  return {
    active: a.active || null,
    step: a.step || 0,
    completed: Array.isArray(a.completed) ? a.completed : [],
  };
}

/** L'arc en cours, ou le prochain arc à commencer, ou null si tout est fait. */
export function nextArc(state) {
  const { active, completed } = arcState(state);
  const done = new Set(completed);
  if (active && !done.has(active)) {
    return ARCS.find((a) => a.id === active) || null;
  }
  return ARCS.find((a) => !done.has(a.id)) || null;
}

/** Vrai tant qu'un arc a été commencé mais pas terminé. */
export function arcInProgress(state) {
  const { active, completed } = arcState(state);
  return !!active && !completed.includes(active);
}

/**
 * L'étape courante à proposer, au format d'une quête cachée, ou null.
 */
export function currentArcStep(state) {
  const arc = nextArc(state);
  if (!arc) return null;
  const { active, step } = arcState(state);
  const idx = active === arc.id ? step : 0;
  if (idx >= arc.steps.length) return null;
  const s = arc.steps[idx];
  return {
    id: `arc_${arc.id}_${idx}`,
    arcId: arc.id,
    arcStep: idx,
    arcLast: idx === arc.steps.length - 1,
    famille: s.famille,
    xp: s.xp,
    effort: 'leger',
    audace: 2,
    registre: 'quete',
    poids: 'mystere',
    contexte: s.contexte ? s.contexte.slice() : [],
    safe_fallback: s.safe_fallback || FALLBACK,
    defi_ami: false,
    hidden: true,
    fragment: null,
    text: s.text,
  };
}

/**
 * Fait avancer l'arc après la complétion d'une de ses étapes. Mute state.arcs.
 * @returns {{arc:object, last:boolean, text:object}|null} texte = indice (ou
 *          révélation si dernière étape), brut, à habiller par la voix du thème
 */
export function advanceArc(state, quest) {
  const arc = ARCS.find((a) => a.id === quest.arcId);
  if (!arc) return null;
  const idx = quest.arcStep;
  if (!Number.isInteger(idx) || idx < 0 || idx >= arc.steps.length) return null;
  if (!state.arcs) state.arcs = { active: null, step: 0, completed: [] };
  if (!Array.isArray(state.arcs.completed)) state.arcs.completed = [];
  if (state.arcs.completed.includes(arc.id)) return null; // déjà terminé

  const step = arc.steps[idx];
  const last = idx === arc.steps.length - 1;
  state.arcs.active = last ? null : arc.id;
  state.arcs.step = last ? 0 : idx + 1;
  if (last) state.arcs.completed = [...state.arcs.completed, arc.id];

  return { arc, last, text: last ? step.revelation : step.indice };
}
