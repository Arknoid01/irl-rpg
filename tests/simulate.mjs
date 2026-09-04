// Simulation de partie : joue N jours de façon déterministe et vérifie les
// invariants à chaque étape (aucune pénalité, données cohérentes, pas de crash).
//   node tests/simulate.mjs [jours] [seed]

import { defaultState } from '../www/js/state/defaults.js';
import { normalize } from '../www/js/state/store.js';
import * as game from '../www/js/engine/game.js';
import { mulberry32 } from '../www/js/engine/rng.js';
import { checkNoPenalty } from '../www/js/engine/philosophy.js';
import { computeStyle } from '../www/js/engine/progression.js';
import { i18n, loc } from '../www/js/i18n/index.js';
import { TITLES } from '../www/js/data/titles.js';

const DAYS = Number(process.argv[2]) || 45;
const SEED = Number(process.argv[3]) || 20260904;

const rng = mulberry32(SEED);
const violations = [];
let state = normalize(defaultState());

function step(label, fn) {
  const before = structuredClone(state);
  let r;
  try {
    r = fn();
  } catch (e) {
    violations.push(`CRASH @ ${label} : ${e.stack || e}`);
    return;
  }
  state = r.state;
  const bad = checkNoPenalty(before, state);
  for (const b of bad) violations.push(`${label} : ${b}`);
  // cohérence de base
  if (!Number.isFinite(state.xp) || state.xp < 0) violations.push(`${label} : xp=${state.xp}`);
  if (state.level < 1) violations.push(`${label} : level=${state.level}`);
  for (const k of Object.keys(state.skills)) {
    if (!Number.isFinite(state.skills[k])) violations.push(`${label} : skill ${k} NaN`);
  }
}

// Onboarding
const dCtx = (dayISO, hour = 10) => ({ now: new Date(`${dayISO}T${String(hour).padStart(2, '0')}:00:00`), rng });
i18n.setLang(SEED % 2 ? 'fr' : 'en');

step('onboarding', () => game.finishOnboarding(state, {
  name: 'Sim', comfort: 3, prefFamilies: ['social', 'exploration', 'chaos'],
  notifications: { enabled: true, hour: 9 },
}, dCtx('2026-09-04')));

let completedTotal = 0;
let ignoredTotal = 0;
let eventsDone = 0;

for (let d = 0; d < DAYS; d++) {
  const day = new Date('2026-09-04T12:00:00Z');
  day.setUTCDate(day.getUTCDate() + d);
  const iso = day.toISOString().slice(0, 10);
  const ctx = dCtx(iso, 8 + (d % 12));

  // langue qui alterne pour éprouver l'i18n
  if (d % 10 === 0) i18n.setLang(i18n.lang === 'fr' ? 'en' : 'fr');

  step(`day ${d} newDay`, () => {
    state.drawDate = null;
    return game.newDay(state, {}, ctx);
  });

  // le joueur accepte ~80 % des quêtes, en ignore le reste
  for (const q of [...state.quests]) {
    if (rng() < 0.15) {
      step(`day ${d} ignore ${q.id}`, () => game.ignoreQuest(state, { id: q.id }));
      ignoredTotal++;
      continue;
    }
    step(`day ${d} accept ${q.id}`, () => game.acceptQuest(state, { id: q.id }));
    if (rng() < 0.82) {
      step(`day ${d} complete ${q.id}`, () => game.completeQuest(state, { id: q.id }, ctx));
      completedTotal++;
    }
  }

  if (state.event && rng() < 0.5) {
    step(`day ${d} event`, () => game.completeEvent(state, {}, ctx));
    eventsDone++;
  } else if (state.event) {
    step(`day ${d} dismiss event`, () => game.dismissEvent(state));
  }

  // rendu des écrans : ne doit jamais planter (import dynamique pour éviter le DOM au top-level)
}

// Rendu des chaînes (fonctions pures, pas de DOM) pour éprouver l'UI de contenu
try {
  const { renderJournal } = await import('../www/js/ui/screens/journal.js');
  // journal.js importe dates.js (ok) et i18n (ok) — pas de DOM
  for (const lang of ['fr', 'en']) {
    i18n.setLang(lang);
    const html = renderJournal(state);
    if (typeof html !== 'string' || html.length < 10) violations.push(`renderJournal ${lang} vide`);
  }
} catch (e) {
  violations.push(`renderJournal : ${e.stack || e}`);
}

/* ─────────────── Rapport ─────────────── */

const unlockedTitles = TITLES.filter((t) => state.titles.includes(t.id)).map((t) => loc(t.label, 'fr'));

console.log('─'.repeat(56));
console.log(`  Simulation IRL RPG — ${DAYS} jours, seed ${SEED}`);
console.log('─'.repeat(56));
console.log(`  Niveau final ............ ${state.level}  (${state.xp} XP en cours)`);
console.log(`  Compétences ............. ${Object.entries(state.skills).map(([k, v]) => `${k} ${v}`).join(', ')}`);
console.log(`  Style ................... ${loc(computeStyle(state), 'fr')}`);
console.log(`  Série actuelle / record  ${state.streak} / ${state.history.bestStreak}`);
console.log(`  Quêtes accomplies ....... ${completedTotal}  (ignorées ${ignoredTotal})`);
console.log(`  Événements relevés ...... ${eventsDone}`);
console.log(`  Objets (souvenirs) ...... ${state.inventory.length}`);
console.log(`  Entrées de journal ...... ${state.journal.length}`);
console.log(`  Titres débloqués ........ ${unlockedTitles.join(', ') || '—'}`);
console.log(`  Jours joués (history) ... ${state.history.daysPlayed}`);
console.log('─'.repeat(56));

if (violations.length) {
  console.log(`\n  ❌ ${violations.length} VIOLATION(S) :\n`);
  for (const v of violations.slice(0, 30)) console.log(`   • ${v}`);
  process.exit(1);
}
console.log('\n  ✅ Aucune violation. Partie cohérente de bout en bout.\n');
