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
import { expandTemplates, instantiateTemplate, fillBilingual, listTemplates, templateHistoryKey,
} from '../www/js/engine/generate.js';
import { SLOT_POOLS } from '../www/js/data/slots.js';
import { QUEST_TEMPLATES } from '../www/js/data/templates.js';
import { WORLD_REGIONS, WORLD_PATHS } from '../www/js/data/world.js';
import { buildWorldView, regionStatus, mapPins } from '../www/js/engine/worldView.js';
import { drawEvent, eventEligible, eventWeight, adaptiveFamilyBonus } from '../www/js/engine/events.js';
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
  assert.equal(xpToNext(1), 280);
  assert.equal(xpToNext(2), 410);
  assert.ok(xpToNext(5) > xpToNext(2));
  assert.ok(xpToNext(10) > xpToNext(5));
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

test('templates : slots et texte cohérents', () => {
  const ids = new Set();
  for (const t of QUEST_TEMPLATES) {
    assert.ok(!ids.has(t.id), `template dupliqué : ${t.id}`);
    ids.add(t.id);
    assert.ok(FAMILY_KEYS.includes(t.famille), `${t.id} famille`);
    assert.ok(t.effort in EFFORT_POINTS, `${t.id} effort`);
    assert.ok(bilingual(t.text), `${t.id} text`);
    const slotsInText = new Set();
    for (const lang of ['fr', 'en']) {
      for (const m of t.text[lang].matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)) {
        slotsInText.add(m[1]);
      }
    }
    for (const key of slotsInText) {
      assert.ok(t.slots && t.slots[key], `${t.id} slot manquant : ${key}`);
    }
    for (const [name, poolKey] of Object.entries(t.slots || {})) {
      assert.ok(SLOT_POOLS[poolKey]?.length, `${t.id} pool ${poolKey}`);
      assert.ok(slotsInText.has(name), `${t.id} slot inutilisé : ${name}`);
    }
    const needsFallback = (t.contexte || []).some((c) => !c.startsWith('moment:'));
    if (needsFallback) assert.ok(bilingual(t.safe_fallback), `${t.id} safe_fallback`);
    if (t.hidden) assert.ok(bilingual(t.fragment), `${t.id} fragment`);
  }
  assert.ok(listTemplates().length >= 20, 'pas assez de templates');
});

test('générateur : instance bilingue déterministe par seed', () => {
  const tpl = QUEST_TEMPLATES.find((t) => t.id === 'tpl_e_expedition');
  const a = instantiateTemplate(tpl, mulberry32(42));
  const b = instantiateTemplate(tpl, mulberry32(42));
  assert.equal(a.id, b.id);
  assert.equal(a.templateId, 'tpl_e_expedition');
  assert.equal(a.generated, true);
  assert.ok(bilingual(a.text));
  assert.ok(!/\{[a-zA-Z_]/.test(a.text.fr), `placeholder restant : ${a.text.fr}`);
  assert.ok(!/\{[a-zA-Z_]/.test(a.text.en), `placeholder restant : ${a.text.en}`);

  const filled = fillBilingual(
    { fr: 'Marche {duree} min ({couleur}).', en: 'Walk {duree} min ({couleur}).' },
    { duree: 5, couleur: { fr: 'rouge', en: 'red' } },
  );
  assert.equal(filled.fr, 'Marche 5 min (rouge).');
  assert.equal(filled.en, 'Walk 5 min (red).');
});

test('générateur : expand respecte plafond et cooldown template', () => {
  const rng = mulberry32(7);
  const recentDone = new Set([templateHistoryKey('tpl_e_contrainte')]);
  const list = expandTemplates({
    ceiling: 2, part: 'jour', recentDone, rng, hidden: false,
  });
  assert.ok(list.every((q) => q.audace <= 2));
  assert.ok(!list.some((q) => q.templateId === 'tpl_e_contrainte'));
  assert.ok(list.some((q) => q.generated));
});

test('carte : régions et chemins cohérents', () => {
  const ids = new Set();
  for (const r of WORLD_REGIONS) {
    assert.ok(!ids.has(r.id), r.id);
    ids.add(r.id);
    assert.ok(bilingual(r.label) && bilingual(r.blurb), r.id);
    assert.ok(r.x >= 0 && r.x <= 100 && r.y >= 0 && r.y <= 100, r.id);
    if (r.kind === 'family') assert.ok(FAMILY_KEYS.includes(r.famille), r.id);
  }
  for (const [a, b] of WORLD_PATHS) {
    assert.ok(ids.has(a) && ids.has(b), `${a}-${b}`);
  }
});

test('carte : pins reflètent quêtes / événement / souvenirs', () => {
  const s = defaultState();
  s.level = 1;
  s.quests = [
    { id: 's_x', famille: 'social', status: 'proposed', text: { fr: 'A', en: 'A' }, xp: 10 },
    { id: 'e_x', famille: 'exploration', status: 'done', text: { fr: 'B', en: 'B' }, xp: 20 },
  ];
  s.event = { id: 'ev_x', status: 'active', title: { fr: 'E', en: 'E' }, xp: 100, famille: 'social' };
  s.inventory = [{ item: { fr: '🔑', en: '🔑' }, date: '2026-09-04' }];
  s.history.familleCompleted = { social: 2 };

  assert.equal(regionStatus(WORLD_REGIONS.find((r) => r.id === 'foyer'), s), 'discovered');
  assert.equal(regionStatus(WORLD_REGIONS.find((r) => r.id === 'social'), s), 'active');
  assert.equal(regionStatus(WORLD_REGIONS.find((r) => r.id === 'exploration'), s), 'fog');
  assert.equal(regionStatus(WORLD_REGIONS.find((r) => r.id === 'montagne'), s), 'locked');

  s.level = 8;
  assert.equal(regionStatus(WORLD_REGIONS.find((r) => r.id === 'montagne'), s), 'discovered');

  const pins = mapPins(s);
  assert.ok(pins.some((p) => p.kind === 'quest' && p.regionId === 'social'));
  assert.ok(pins.some((p) => p.kind === 'event' && p.regionId === 'social'));
  assert.ok(pins.some((p) => p.kind === 'souvenir'));

  const view = buildWorldView(s);
  assert.equal(view.heroRegionId, 'social');
  assert.ok(view.stats.discovered >= 2);
});

test('événements : modèle bilingue', () => {
  for (const e of EVENTS) {
    assert.ok(bilingual(e.title) && bilingual(e.text) && bilingual(e.item), e.id);
    assert.ok(e.xp > 0);
    if (e.famille) assert.ok(FAMILY_KEYS.includes(e.famille), e.id);
    if (e.moment) assert.ok(['matin', 'midi', 'soir'].includes(e.moment), e.id);
  }
  assert.ok(EVENTS.length >= 20, `trop peu d’événements : ${EVENTS.length}`);
});

test('événements : éligibilité et tirage contextuel', () => {
  const s = defaultState();
  s.level = 1;
  s.comfort = 2;
  s.streak = 0;
  const soft = EVENTS.find((e) => e.id === 'ev_doux');
  const summit = EVENTS.find((e) => e.id === 'ev_sommet');
  const serie = EVENTS.find((e) => e.id === 'ev_serie');
  assert.equal(eventEligible(soft, s, new Date('2026-09-04T10:00:00')), true);
  assert.equal(eventEligible(summit, s, new Date('2026-09-04T10:00:00')), false);
  assert.equal(eventEligible(serie, s, new Date('2026-09-04T10:00:00')), false);

  s.level = 10;
  s.streak = 5;
  s.comfort = 4;
  assert.equal(eventEligible(summit, s, new Date('2026-09-04T10:00:00')), true);
  assert.equal(eventEligible(serie, s, new Date('2026-09-04T10:00:00')), true);
  assert.equal(eventEligible(soft, s, new Date('2026-09-04T10:00:00')), false);

  s.history.recentEventIds = ['ev_porte'];
  assert.equal(eventEligible(EVENTS.find((e) => e.id === 'ev_porte'), s), false);

  s.history.familleCompleted = { social: 20, exploration: 0, curiosite: 0, creation: 0, quotidien: 0, chaos: 0 };
  assert.ok(eventWeight(EVENTS.find((e) => e.id === 'ev_marchand'), s) >
    eventWeight(EVENTS.find((e) => e.id === 'ev_visage'), s));

  assert.ok(adaptiveFamilyBonus('exploration', s) > 0);
  assert.ok(adaptiveFamilyBonus('social', s) < 0);

  let hit = 0;
  for (let i = 1; i <= 40; i++) {
    if (drawEvent(s, { now: new Date('2026-09-04T10:00:00'), rng: mulberry32(i), chance: 1 })) hit += 1;
  }
  assert.ok(hit >= 30, `tirage trop rare : ${hit}/40`);
});

test('titres : compétences valides, bilingues', () => {
  for (const t of TITLES) {
    assert.ok(SKILL_KEYS.includes(t.skill), t.id);
    assert.ok(bilingual(t.label), t.id);
    assert.ok(t.min === 100 || t.min === 320, `${t.id} seuil`);
  }
  assert.equal(TITLES.length, 12);
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
  gainSkills(s, fx, { curiosite: 100 });
  assert.ok(s.titles.includes('curiosite_1'));
  assert.ok(fx.some((e) => e.type === 'title'));
  gainSkills(s, fx, { curiosite: 220 }); // total 320
  assert.ok(s.titles.includes('curiosite_2'));
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
