import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SKILLS, SKILL_KEYS, FAMILIES, FAMILY_KEYS, EFFORT_POINTS,
  DAILY_EFFORT_BUDGET, skillDeltasFor, xpToNext,
} from '../www/js/data/taxonomy.js';
import { QUESTS } from '../www/js/data/quests.js';
import { EVENTS } from '../www/js/data/events.js';
import { TITLES } from '../www/js/data/titles.js';
import { THEME_KEYS } from '../www/js/data/themes.js';
import { defaultState } from '../www/js/state/defaults.js';
import { normalize, loadState, memoryStorage, importState, exportState } from '../www/js/state/store.js';
import { drawDaily, wantsGentleSocial } from '../www/js/engine/draw.js';
import { mulberry32 } from '../www/js/engine/rng.js';
import {
  gainXp, gainSkills, bumpStreak, computeStyle, elanDuJour,
} from '../www/js/engine/progression.js';
import { checkNoPenalty } from '../www/js/engine/philosophy.js';
import * as game from '../www/js/engine/game.js';

const bilingual = (v) => v && typeof v === 'object' && typeof v.fr === 'string' && typeof v.en === 'string';

/* ─────────────── Taxonomie ─────────────── */

test('familles : primary/secondary sont des compétences valides', () => {
  for (const [key, f] of Object.entries(FAMILIES)) {
    assert.ok(SKILL_KEYS.includes(f.primary), `${key}.primary`);
    if (f.secondary) assert.ok(SKILL_KEYS.includes(f.secondary), `${key}.secondary`);
    assert.ok(bilingual(f.label));
  }
  assert.equal(FAMILY_KEYS.length, 6);
  assert.equal(SKILL_KEYS.length, 6);
});

test('skillDeltasFor répartit 0.5 / 0.2', () => {
  const d = skillDeltasFor({ famille: 'social', xp: 100 });
  assert.equal(d.social, 50);
  assert.equal(d.audace, 20);
  const q = skillDeltasFor({ famille: 'quotidien', xp: 100 });
  assert.equal(q.discipline, 50);
  assert.equal(Object.keys(q).length, 1);
});

test('xpToNext croît avec le niveau', () => {
  assert.ok(xpToNext(2) > xpToNext(1));
});

/* ─────────────── Banque de quêtes ─────────────── */

test('quêtes : intégrité du modèle', () => {
  const ids = new Set();
  for (const q of QUESTS) {
    assert.ok(!ids.has(q.id), `id dupliqué : ${q.id}`);
    ids.add(q.id);
    assert.ok(FAMILY_KEYS.includes(q.famille), `${q.id} famille`);
    assert.ok(q.effort in EFFORT_POINTS, `${q.id} effort`);
    assert.ok(['quete', 'experience'].includes(q.registre), `${q.id} registre`);
    assert.ok(q.audace >= 1 && q.audace <= 5, `${q.id} audace`);
    assert.ok(bilingual(q.text), `${q.id} text bilingue`);
    const needsFallback = (q.contexte || []).some((c) => !c.startsWith('moment:'));
    if (needsFallback) {
      assert.ok(bilingual(q.safe_fallback), `${q.id} safe_fallback requis`);
    }
    if (q.hidden) assert.ok(bilingual(q.fragment), `${q.id} fragment`);
  }
  assert.ok(QUESTS.length >= 90, `banque trop petite : ${QUESTS.length}`);
});

test('événements : modèle bilingue', () => {
  for (const e of EVENTS) {
    assert.ok(bilingual(e.title) && bilingual(e.text) && bilingual(e.item), e.id);
    assert.ok(e.xp > 0);
  }
});

test('titres : compétences valides, bilingues', () => {
  for (const t of TITLES) {
    assert.ok(SKILL_KEYS.includes(t.skill), t.id);
    assert.ok(bilingual(t.label), t.id);
  }
});

/* ─────────────── Tirage ─────────────── */

test('tirage : invariants sur 300 tirages', () => {
  for (let seed = 1; seed <= 300; seed++) {
    const rng = mulberry32(seed);
    const s = defaultState();
    s.comfort = 1 + (seed % 5);
    s.prefFamilies = seed % 3 === 0 ? ['chaos'] : [];
    s.history.recentFamilles = seed % 7 === 0 ? ['chaos', 'chaos', 'chaos'] : [];
    const { quests, event } = drawDaily(s, { now: new Date('2026-09-04T10:00:00'), rng });

    assert.ok(quests.length >= 1 && quests.length <= 4, `count ${quests.length} (seed ${seed})`);
    const fams = quests.map((q) => q.famille);
    assert.ok(fams.includes('social'), `pas de social (seed ${seed})`);

    const counts = {};
    let effort = 0;
    let consequent = 0;
    const seen = new Set();
    for (const q of quests) {
      assert.ok(!seen.has(q.id), `doublon ${q.id} (seed ${seed})`);
      seen.add(q.id);
      counts[q.famille] = (counts[q.famille] || 0) + 1;
      effort += EFFORT_POINTS[q.effort];
      if (q.effort === 'consequent') consequent += 1;
      assert.ok(q.audace <= s.comfort + 1, `audace > plafond (seed ${seed})`);
    }
    assert.ok(consequent <= 1, `>1 conséquent (seed ${seed})`);
    assert.ok((counts.chaos || 0) <= 1, `>1 chaos (seed ${seed})`);
    for (const f of Object.keys(counts)) assert.ok(counts[f] <= 2, `>2 ${f} (seed ${seed})`);
    assert.ok(effort <= DAILY_EFFORT_BUDGET + 2, `effort ${effort} (seed ${seed})`);
    if (event) assert.ok(bilingual(event.title));
  }
});

test('wantsGentleSocial : seuil', () => {
  const s = defaultState();
  assert.equal(wantsGentleSocial(s), false);
  s.history.social = { proposed: 3, skipped: 2, completed: 0 };
  assert.equal(wantsGentleSocial(s), true);
  s.history.social.completed = 1;
  assert.equal(wantsGentleSocial(s), false);
});

/* ─────────────── Progression ─────────────── */

test('gainXp : montée de niveau', () => {
  const s = defaultState();
  const fx = [];
  gainXp(s, fx, xpToNext(1) + 10);
  assert.equal(s.level, 2);
  assert.equal(s.xp, 10);
  assert.ok(fx.some((e) => e.type === 'levelup'));
});

test('gainSkills : débloque un titre', () => {
  const s = defaultState();
  const fx = [];
  gainSkills(s, fx, { curiosite: 130 });
  assert.ok(s.titles.includes('curiosite_1'));
  assert.ok(fx.some((e) => e.type === 'title'));
});

test('bumpStreak : consécutif / trou / même jour', () => {
  const s = defaultState();
  bumpStreak(s, [], '2026-09-01');
  assert.equal(s.streak, 1);
  bumpStreak(s, [], '2026-09-02');
  assert.equal(s.streak, 2);
  bumpStreak(s, [], '2026-09-02'); // même jour
  assert.equal(s.streak, 2);
  bumpStreak(s, [], '2026-09-10'); // trou -> reset, sans coût
  assert.equal(s.streak, 1);
  assert.equal(s.history.bestStreak, 2);
});

test('computeStyle : défaut puis dominante', () => {
  const s = defaultState();
  assert.equal(computeStyle(s).fr, '🌱 Aventurier en devenir');
  s.skills.chaos = 200;
  assert.match(computeStyle(s).fr, /chaos/i);
});

/* ─────────────── Store / migrations ─────────────── */

test('normalize : migre les thèmes legacy', () => {
  assert.equal(normalize({ theme: 'skyrim' }).theme, 'nordique');
  assert.equal(normalize({ theme: 'witcher' }).theme, 'sombre');
  assert.ok(THEME_KEYS.includes(normalize({ theme: 'inconnu' }).theme));
});

test('loadState : migration depuis v1', () => {
  const storage = memoryStorage({
    irlrpg_save_v1: JSON.stringify({
      name: 'Yann', theme: 'skyrim', level: 4, xp: 30,
      skills: { social: 90 }, journal: [{ date: '2026-08-01', text: 'ancien' }],
    }),
  });
  const s = loadState(storage);
  assert.equal(s.name, 'Yann');
  assert.equal(s.theme, 'nordique');
  assert.equal(s.level, 4);
  assert.equal(s.onboarded, true);
  assert.equal(s.journal[0].text, 'ancien');
});

test('loadState : sauvegarde corrompue -> défaut', () => {
  const storage = memoryStorage({ irlrpg_save_v2: '{not json' });
  const s = loadState(storage);
  assert.equal(s.onboarded, false);
});

test('export / import : aller-retour', () => {
  const s = defaultState();
  s.name = 'Test';
  s.xp = 123;
  const back = importState(exportState(s));
  assert.equal(back.name, 'Test');
  assert.equal(back.xp, 123);
});

/* ─────────────── Philosophie ─────────────── */

test('ignorer une quête ne coûte rien', () => {
  const ctx = { now: new Date('2026-09-04T10:00:00'), rng: mulberry32(42) };
  let s = game.finishOnboarding(defaultState(), { name: 'P', comfort: 3, ageAck: true }, ctx).state;
  const before = structuredClone(s);
  const q = s.quests[0];
  s = game.ignoreQuest(s, { id: q.id }).state;
  assert.deepEqual(checkNoPenalty(before, s), []);
  assert.equal(s.xp, before.xp);
  assert.deepEqual(s.skills, before.skills);
});

test('compléter une quête : aucune pénalité, XP en hausse', () => {
  const ctx = { now: new Date('2026-09-04T10:00:00'), rng: mulberry32(7) };
  let s = game.finishOnboarding(defaultState(), { name: 'P', comfort: 5, ageAck: true }, ctx).state;
  const q = s.quests.find((x) => !x.hidden) || s.quests[0];
  const before = structuredClone(s);
  s = game.acceptQuest(s, { id: q.id }).state;
  const r = game.completeQuest(s, { id: q.id }, ctx);
  s = r.state;
  assert.deepEqual(checkNoPenalty(before, s), []);
  assert.ok(s.xp + (s.level - before.level) * 1000 > before.xp);
  assert.ok(r.effects.some((e) => e.type === 'quest-done'));
});

test('finishOnboarding : produit une journée jouable', () => {
  const ctx = { now: new Date('2026-09-04T09:00:00'), rng: mulberry32(3) };
  const r = game.finishOnboarding(defaultState(), {
    name: 'Yannick', comfort: 3, prefFamilies: ['social', 'exploration'], ageAck: true,
  }, ctx);
  assert.equal(r.state.onboarded, true);
  assert.equal(r.state.ageAck, true);
  assert.ok(r.state.quests.length >= 1);
  assert.equal(r.state.drawDate, '2026-09-04');
  assert.equal(elanDuJour(r.state), 0);
});

test('finishOnboarding : refuse sans ack d’âge', () => {
  const ctx = { now: new Date('2026-09-04T09:00:00'), rng: mulberry32(3) };
  const r = game.finishOnboarding(defaultState(), { name: 'X', ageAck: false }, ctx);
  assert.equal(r.state.onboarded, false);
  assert.equal(r.state.ageAck, false);
});

test('renameHero : tronque et conserve un nom valide', () => {
  let s = defaultState();
  s.name = 'Old';
  s = game.renameHero(s, { name: '  NouveauNomBeaucoupTropLongPourPasser  ' }).state;
  assert.equal(s.name, 'NouveauNomBeaucoupTropLo');
  assert.equal(s.name.length, 24);
  s = game.renameHero(s, { name: '   ' }).state;
  assert.equal(s.name, 'NouveauNomBeaucoupTropLo');
});
