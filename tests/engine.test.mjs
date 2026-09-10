import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SKILLS, SKILL_KEYS, FAMILIES, FAMILY_KEYS, EFFORT_POINTS,
  DAILY_EFFORT_BUDGET, skillDeltasFor, xpToNext,
} from '../www/js/data/taxonomy.js';
import { QUESTS } from '../www/js/data/quests.js';
import { EVENTS } from '../www/js/data/events.js';
import { TITLES } from '../www/js/data/titles.js';
import { THEME_KEYS, voiceFor } from '../www/js/data/themes.js';
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
import {
  inferKind, normalizeLootEntry, buildMuseumView, lootFromEvent, milestoneLootForLevel, addLoot,
} from '../www/js/engine/inventory.js';
import { LOOT_KINDS, EVENT_LOOT_META } from '../www/js/data/loot.js';
import {
  buildJournalTimeline, chapterFor, chapterOpenEntry, dailyRecapEntry,
  levelChapterEntry, eventEntry, eventCoda, regionRevealEntry, CHAPTER_QUEST_THRESHOLDS,
} from '../www/js/engine/journal.js';

/** Petit helper : un état avec N quêtes accomplies. */
const withCompleted = (n, extra = {}) => {
  const s = defaultState();
  s.history.totalCompleted = n;
  return Object.assign(s, extra);
};
import { companionLineForState, companionLineAfterQuest } from '../www/js/engine/companion.js';
import {
  recordQuestMilestones, recordEventMilestones, FIRST_MILESTONES, MILESTONE_KEYS,
  MILESTONE_LABELS,
} from '../www/js/engine/milestones.js';
import { isComebackDay, daysAway } from '../www/js/engine/comeback.js';
import { mulberry32 } from '../www/js/engine/rng.js';
import {
  gainXp, gainSkills, bumpStreak, computeStyle, elanDuJour, traitTierFor,
} from '../www/js/engine/progression.js';
import { checkNoPenalty } from '../www/js/engine/philosophy.js';
import * as game from '../www/js/engine/game.js';
import { msUntilNextMidnight } from '../www/js/engine/dates.js';
import { getBilling, billingIsReal, COLLECTION_PRODUCT, COLLECTION_THEMES } from '../www/js/platform/billing.js';
import fr from '../www/js/i18n/fr.js';
import en from '../www/js/i18n/en.js';
import { i18n } from '../www/js/i18n/index.js';
import {
  heroCardHtml, traitsHtml, titlesHtml, momentsHtml, discoveriesHtml,
  pathStatsHtml, inventoryHtml, setMuseumFilter, selectMuseumItem,
} from '../www/js/ui/components/charBits.js';
import { recordDiscoveries, DISCOVERY_KEYS } from '../www/js/engine/discoveries.js';
import {
  nextArc, currentArcStep, advanceArc, arcInProgress, arcState,
} from '../www/js/engine/arcs.js';
import { ARCS } from '../www/js/data/arcs.js';
import { renderCharacter } from '../www/js/ui/screens/character.js';

const bilingual = (v) => v && typeof v === 'object' && typeof v.fr === 'string' && typeof v.en === 'string';

/* ─────────────── i18n ─────────────── */

test('i18n : fr et en ont exactement les mêmes clés', () => {
  const frKeys = new Set(Object.keys(fr));
  const enKeys = new Set(Object.keys(en));
  const missingInEn = [...frKeys].filter((k) => !enKeys.has(k));
  const missingInFr = [...enKeys].filter((k) => !frKeys.has(k));
  assert.deepEqual(missingInEn, [], `clés absentes de en.js : ${missingInEn.join(', ')}`);
  assert.deepEqual(missingInFr, [], `clés absentes de fr.js : ${missingInFr.join(', ')}`);
});

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

test('quêtes : pas de doublon de texte (fr / en)', () => {
  const norm = (s) => String(s || '')
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  for (const lang of ['fr', 'en']) {
    const seen = new Map();
    for (const q of QUESTS) {
      const k = norm(q.text[lang]);
      assert.ok(!seen.has(k), `doublon de texte ${lang} : ${q.id} ≈ ${seen.get(k)}`);
      seen.set(k, q.id);
    }
  }
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
  assert.ok(listTemplates().length >= 38, 'pas assez de templates');
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
    assert.ok(bilingual(e.memory), `${e.id} : memory bilingue`);
    assert.ok(e.xp > 0);
    if (e.famille) assert.ok(FAMILY_KEYS.includes(e.famille), e.id);
    if (e.moment) assert.ok(['matin', 'midi', 'soir'].includes(e.moment), e.id);
  }
  assert.ok(EVENTS.length >= 30, `trop peu d’événements : ${EVENTS.length}`);
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

test('musée : kinds, lore événements, jalons', () => {
  assert.ok(Object.keys(LOOT_KINDS).length >= 5);
  for (const id of Object.keys(EVENT_LOOT_META)) {
    assert.ok(LOOT_KINDS[EVENT_LOOT_META[id].kind], id);
    assert.ok(bilingual(EVENT_LOOT_META[id].lore), id);
  }
  const legacy = normalizeLootEntry({ item: { fr: '🗺️ Fragment de carte', en: '🗺️ Map fragment' }, date: '2026-01-01' });
  assert.equal(legacy.kind, 'fragment');
  assert.equal(inferKind({ item: { fr: '🏅 Médaille', en: '🏅 Medal' } }), 'collectible');

  const s = defaultState();
  const ev = EVENTS.find((e) => e.id === 'ev_porte');
  const loot = lootFromEvent(ev, '2026-09-04');
  assert.equal(loot.kind, 'fragment');
  assert.ok(bilingual(loot.lore));
  addLoot(s, loot);
  assert.equal(s.inventory.length, 1);

  const ms = milestoneLootForLevel(8);
  assert.ok(ms && ms.kind === 'collectible');
  addLoot(s, { ...ms, date: '2026-09-04' });
  addLoot(s, { ...ms, date: '2026-09-04' }); // doublon id
  assert.equal(s.inventory.length, 2);

  const view = buildMuseumView(s);
  assert.equal(view.total, 2);
  assert.ok(view.counts.fragment >= 1);
  assert.ok(view.counts.collectible >= 1);
});

test('journal : timeline et chapitres (seuils en nb de quêtes — Phase 3.1)', () => {
  const ch = chapterFor(withCompleted(0));
  assert.equal(ch.id, 'prologue');
  assert.ok(bilingual(ch.label));
  assert.equal(chapterFor(withCompleted(9)).id, 'prologue');
  assert.equal(chapterFor(withCompleted(10)).id, 'ch1');
  assert.equal(chapterFor(withCompleted(50)).id, 'ch3');
  assert.equal(chapterFor(withCompleted(250)).id, 'ch5');
  assert.deepEqual(CHAPTER_QUEST_THRESHOLDS, [0, 10, 25, 50, 100, 200]);

  // nuance de famille : apparaît quand une famille domine nettement
  const leaned = withCompleted(30);
  leaned.history.familleCompleted = { social: 20, exploration: 4, curiosite: 3 };
  assert.ok(bilingual(chapterFor(leaned).lean), 'nuance présente');
  assert.equal(chapterFor(withCompleted(30)).lean, null, 'pas de nuance sans dominante');

  // entrée « nouveau chapitre »
  const open = chapterOpenEntry(chapterFor(withCompleted(25)));
  assert.ok(bilingual(open) && open.fr.includes('—'));

  const s = defaultState();
  s.history.totalCompleted = 12;
  s.journal = [
    { date: '2026-09-04', text: { fr: 'A', en: 'A' }, kind: 'moment' },
    { date: '2026-09-03', text: { fr: 'B', en: 'B' }, kind: 'fragment' },
    { date: '2026-08-20', text: { fr: 'C', en: 'C' }, kind: 'evenement' },
  ];
  const tl = buildJournalTimeline(s, new Date('2026-09-04T12:00:00'));
  assert.equal(tl.chapter.id, 'ch1');
  assert.ok(tl.sections.some((sec) => sec.id === 'today'));
  assert.ok(tl.sections.some((sec) => sec.id === 'yesterday'));
});

test('journal : entrée « du jour » (Phase 3.2)', () => {
  const entry = dailyRecapEntry(17, ['exploration', 'social'], 'nordique', 0);
  assert.ok(bilingual(entry));
  assert.match(entry.fr, /Jour 17/);
  assert.match(entry.fr, /Exploration/);
  assert.equal(dailyRecapEntry(3, [], 'nordique'), null, 'journée vide -> aucune entrée');

  const enq = dailyRecapEntry(5, ['curiosite'], 'enquete', 1);
  assert.ok(bilingual(enq) && enq.en.includes('Day 5'));
});

test('game : chapitre-ouvert + entrée du jour au fil de la partie (Phase 3.1-3.2)', () => {
  const day = (d, h = 9) => ({ now: new Date(`2026-09-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00`), rng: mulberry32(5) });
  let s = game.finishOnboarding(defaultState(), { name: 'P', comfort: 5, ageAck: true }, day(4)).state;

  // 10e quête -> entrée « chapitre » dans le journal
  let sawChapter = false;
  let dnum = 4;
  while ((s.history.totalCompleted < 12) && dnum < 40) {
    dnum += 1;
    s = game.newDay(s, {}, day(dnum)).state; // rollover naturel (pas de re-tirage forcé)
    for (const q of [...s.quests]) {
      if (s.history.totalCompleted >= 12) break;
      s = game.acceptQuest(s, { id: q.id }).state;
      const r = game.completeQuest(s, { id: q.id }, day(dnum));
      s = r.state;
      if (r.effects.some((e) => e.type === 'chapter-open')) sawChapter = true;
    }
  }
  assert.ok(sawChapter, 'effet chapter-open émis au passage de seuil');
  assert.ok(s.journal.some((e) => e.kind === 'chapitre'), 'entrée chapitre au journal');
  assert.ok(s.journal.some((e) => e.kind === 'jour'), 'entrée « du jour » au journal');
  // une seule entrée « jour » par date
  const jourDates = s.journal.filter((e) => e.kind === 'jour').map((e) => e.date);
  assert.equal(jourDates.length, new Set(jourDates).size, 'pas de doublon d’entrée du jour');
});

test('compagnon : répliques contextuelles', () => {
  const s = defaultState();
  s.theme = 'nordique';
  s.lang = 'fr';
  const empty = companionLineForState(s, 'fr');
  assert.ok(typeof empty === 'string' && empty.length > 10);

  s.quests = [
    { id: 'a', status: 'done', famille: 'social', text: { fr: 'x', en: 'x' }, xp: 10 },
  ];
  const done = companionLineForState(s, 'fr');
  assert.match(done, /pages|obligatoire|suffi|journal/i);

  s.quests = [{ id: 'a', status: 'proposed', famille: 'social', text: { fr: 'x', en: 'x' }, xp: 10 }];
  s.streak = 6;
  const streak = companionLineForState(s, 'fr');
  assert.match(streak, /série|feu|grimoire|braise|rythme/i);
});

test('compagnon : callback cite un fragment de journal passé (axe différenciation D11)', () => {
  const s = defaultState();
  s.quests = [{ id: 'a', status: 'proposed', famille: 'social', text: { fr: 'x', en: 'x' }, xp: 10 }];
  s.journal = [
    { date: '2026-09-01', text: { fr: 'Tu as parlé à un inconnu.', en: 'You talked to a stranger.' }, kind: 'fragment' },
  ];
  s.seeds.companion = 0; // seed % 3 === 0 -> déclenche la branche callback
  const line = companionLineForState(s, 'fr', new Date('2026-09-02T12:00:00'));
  assert.match(line, /Tu as parlé à un inconnu/);

  // Un fragment du jour même ne doit jamais être cité (pas encore "passé").
  s.journal = [
    { date: '2026-09-02', text: { fr: 'Tu as parlé à un inconnu.', en: 'You talked to a stranger.' }, kind: 'fragment' },
  ];
  const noSelfCite = companionLineForState(s, 'fr', new Date('2026-09-02T12:00:00'));
  assert.doesNotMatch(noSelfCite, /Tu as parlé à un inconnu/);
});

test('compagnon : réaction après quête (cérémonie de validation)', () => {
  const s = defaultState();
  s.seeds.companion = 0;
  const first = companionLineAfterQuest(s, 'fr', { first: true });
  assert.ok(typeof first === 'string' && first.length > 5);
  assert.notEqual(first, companionLineAfterQuest(s, 'fr', { first: false }));

  const a = companionLineAfterQuest(s, 'fr');
  s.seeds.companion = 1;
  const b = companionLineAfterQuest(s, 'fr');
  assert.notEqual(a, b, 'le seed doit faire varier la réplique');

  const enLine = companionLineAfterQuest(s, 'en');
  assert.ok(typeof enLine === 'string' && enLine.length > 5);
});

/* ─────────────── Phase 1 — rétention ─────────────── */

test('jalons : premières fois marquées une seule fois, + paliers de volume', () => {
  const s = defaultState();
  s.history.totalCompleted = 1;
  const q = {
    famille: 'social', audace: 4, effort: 'consequent', hidden: true, contexte: ['exterieur'],
  };
  const hits = recordQuestMilestones(s, q, new Date('2026-09-04T20:00:00'));
  for (const k of ['first_quest', 'first_outdoor', 'first_social', 'first_evening',
    'first_hidden', 'first_bold', 'first_big']) {
    assert.ok(hits.includes(k), `jalon manquant : ${k}`);
  }
  assert.equal(hits[0], 'first_quest', 'la toute première quête passe devant');
  assert.equal(s.milestones.first_quest, '2026-09-04');

  // rejoué le lendemain : plus rien à débloquer
  s.history.totalCompleted = 2;
  assert.deepEqual(recordQuestMilestones(s, q, new Date('2026-09-05T20:00:00')), []);

  // palier de volume
  s.history.totalCompleted = 10;
  assert.deepEqual(
    recordQuestMilestones(s, { famille: 'curiosite', effort: 'leger', contexte: [] },
      new Date('2026-09-12T12:00:00')),
    ['volume_10'],
  );

  // événement -> first_event, une seule fois
  const s2 = defaultState();
  assert.deepEqual(recordEventMilestones(s2, {}, new Date('2026-09-04T12:00:00')), ['first_event']);
  assert.deepEqual(recordEventMilestones(s2, {}, new Date('2026-09-05T12:00:00')), []);
});

test('jalons : completeQuest émet les effets et nourrit la voix du compagnon', () => {
  const ctx = { now: new Date('2026-09-04T10:00:00'), rng: mulberry32(7) };
  let s = game.finishOnboarding(defaultState(), { name: 'P', comfort: 5, ageAck: true }, ctx).state;
  const q = s.quests.find((x) => !x.hidden) || s.quests[0];
  s = game.acceptQuest(s, { id: q.id }).state;
  const r = game.completeQuest(s, { id: q.id }, ctx);
  s = r.state;

  assert.ok(r.effects.some((e) => e.type === 'milestone' && e.key === 'first_quest'));
  assert.equal(s.milestones.first_quest, '2026-09-04');
  assert.equal(s.history.lastMilestone.key, 'first_quest');
  assert.deepEqual(checkNoPenalty(structuredClone(defaultState()), s), []);

  // le compagnon relève le jalon le jour même…
  const line = companionLineForState(s, 'fr', new Date('2026-09-04T12:00:00'));
  assert.match(line, /page/i, 'voix nordique de first_quest');
  // …mais plus le lendemain
  const later = companionLineForState(s, 'fr', new Date('2026-09-05T12:00:00'));
  assert.doesNotMatch(later, /Première page écrite/);
});

test('retour après absence : détection + tirage allégé', () => {
  const away = { ...defaultState(), lastActiveDate: '2026-09-01' };
  assert.equal(daysAway(away, new Date('2026-09-08T10:00:00')), 7);
  assert.equal(isComebackDay(away, new Date('2026-09-08T10:00:00')), true);
  assert.equal(isComebackDay(away, new Date('2026-09-03T10:00:00')), false, 'moins de 3 jours');
  assert.equal(isComebackDay(defaultState(), new Date('2026-09-08T10:00:00')), false, 'jamais joué');

  const s = defaultState();
  s.comfort = 4;
  s.lastActiveDate = '2026-09-01';
  const now = new Date('2026-09-08T10:00:00');
  for (let seed = 1; seed <= 20; seed++) {
    const { quests } = drawDaily(s, { now, rng: mulberry32(seed) });
    assert.equal(quests.length, 3);
    assert.ok(!quests.some((q) => q.effort === 'consequent'), `reprise sans conséquent (seed ${seed})`);
    assert.ok(quests.filter((q) => q.effort === 'leger').length >= 2, `reprise surtout légère (seed ${seed})`);
  }

  // ligne du compagnon dédiée
  s.quests = drawDaily(s, { now, rng: mulberry32(1) }).quests;
  assert.match(companionLineForState(s, 'fr', now), /rattraper|revoilà|attendait/i);
});

test('événement d’accueil : hors rotation normale, tiré au retour', () => {
  const s = defaultState();
  s.comfort = 3;
  const now = new Date('2026-09-08T10:00:00');

  // jamais en temps normal
  for (let seed = 1; seed <= 25; seed++) {
    const ev = drawEvent(s, { now, rng: mulberry32(seed), chance: 1, comeback: false });
    assert.ok(!ev || !ev.comeback, `pas d’événement d’accueil hors retour (seed ${seed})`);
  }
  // au retour, l’événement d’accueil passe devant
  const cb = drawEvent(s, { now, rng: mulberry32(2), chance: 1, comeback: true });
  assert.ok(cb && cb.comeback, 'un événement d’accueil est proposé au retour');
});

test('événement d’ouverture : forcé après une longue disette', () => {
  const s = defaultState();
  s.comfort = 3;
  const now = new Date('2026-09-04T10:00:00');

  s.history.daysSinceEvent = 4;
  let forced = 0;
  for (let seed = 1; seed <= 20; seed++) {
    if (drawDaily(s, { now, rng: mulberry32(seed) }).event) forced += 1;
  }
  assert.ok(forced >= 19, `disette -> événement quasi garanti : ${forced}/20`);

  s.history.daysSinceEvent = 0;
  let normal = 0;
  for (let seed = 1; seed <= 20; seed++) {
    if (drawDaily(s, { now, rng: mulberry32(seed) }).event) normal += 1;
  }
  assert.ok(normal < forced, `sans disette le tirage reste partiel : ${normal}/20`);
});

test('événements spéciaux : temporels + échos de jalon (Phase 3.4)', () => {
  const semaine = EVENTS.find((e) => e.id === 'ev_une_semaine');
  const echoSocial = EVENTS.find((e) => e.id === 'ev_echo_inconnu');
  assert.ok(semaine && echoSocial, 'événements spéciaux présents');

  const s = defaultState();
  s.history.daysPlayed = 3;
  assert.equal(eventEligible(semaine, s), false, 'pas avant 7 jours joués');
  assert.equal(eventEligible(echoSocial, s), false, 'pas sans le jalon first_social');

  s.history.daysPlayed = 9;
  s.milestones = { first_quest: '2026-09-01', first_social: '2026-09-02' };
  assert.equal(eventEligible(semaine, s), true);
  assert.equal(eventEligible(echoSocial, s), true);

  // ces événements ne sortent jamais en mode retour (pas de flag comeback)
  assert.equal(!!semaine.comeback, false);
});

test('mini-arcs : contenu bien formé (Phase 3.3)', () => {
  const ids = new Set();
  for (const arc of ARCS) {
    assert.ok(!ids.has(arc.id), `arc dupliqué : ${arc.id}`);
    ids.add(arc.id);
    assert.ok(arc.steps.length >= 3 && arc.steps.length <= 5, `${arc.id} : 3-5 étapes`);
    assert.ok(FAMILY_KEYS.includes(arc.famille));
    assert.ok(bilingual(arc.loot.item) && bilingual(arc.loot.lore));
    assert.ok(LOOT_KINDS[arc.loot.kind], `${arc.id} loot kind`);
    arc.steps.forEach((s, i) => {
      assert.ok(FAMILY_KEYS.includes(s.famille) && s.famille !== 'chaos', `${arc.id}#${i} famille`);
      assert.ok(bilingual(s.text), `${arc.id}#${i} text`);
      assert.ok(bilingual(s.safe_fallback), `${arc.id}#${i} fallback`);
      const last = i === arc.steps.length - 1;
      assert.ok(bilingual(last ? s.revelation : s.indice), `${arc.id}#${i} ${last ? 'revelation' : 'indice'}`);
    });
  }
  assert.equal(ARCS.length, 4);
});

test('mini-arcs : moteur — proposition, avancement, révélation', () => {
  const s = defaultState();
  // rien de commencé -> propose l'étape 0 du premier arc
  const arc0 = nextArc(s);
  assert.ok(arc0);
  let step = currentArcStep(s);
  assert.equal(step.arcStep, 0);
  assert.equal(step.effort, 'leger');
  assert.equal(step.audace, 2);
  assert.ok(step.hidden && step.poids === 'mystere');

  // compléter l'étape 0 -> arc actif, étape 1
  let adv = advanceArc(s, step);
  assert.equal(adv.last, false);
  assert.equal(s.arcs.active, arc0.id);
  assert.equal(s.arcs.step, 1);
  assert.ok(arcInProgress(s));

  // aller jusqu'à la dernière étape
  let guard = 0;
  while (!currentArcStep(s).arcLast && guard++ < 10) {
    adv = advanceArc(s, currentArcStep(s));
    assert.equal(adv.last, false);
  }
  const lastStep = currentArcStep(s);
  assert.equal(lastStep.arcLast, true);
  adv = advanceArc(s, lastStep);
  assert.equal(adv.last, true);
  assert.ok(adv.text.fr, 'révélation présente');
  assert.deepEqual(s.arcs.completed, [arc0.id]);
  assert.equal(s.arcs.active, null);
  assert.ok(!arcInProgress(s));

  // l'arc suivant devient disponible
  const arc1 = nextArc(s);
  assert.ok(arc1 && arc1.id !== arc0.id);

  // rejouer la dernière étape ne recompte pas
  assert.equal(advanceArc(s, lastStep), null);
});

test('mini-arcs : completeQuest fait avancer la piste + dépose une pièce', () => {
  const ctx = { now: new Date('2026-09-04T10:00:00'), rng: mulberry32(3) };
  let s = game.finishOnboarding(defaultState(), { name: 'P', comfort: 4, ageAck: true }, ctx).state;
  const arc = ARCS[0];

  // injecte manuellement les étapes de l'arc et les complète
  for (let i = 0; i < arc.steps.length; i += 1) {
    const stepQ = { ...currentArcStep(s), status: 'accepted' };
    assert.equal(stepQ.arcStep, i);
    s.quests = [stepQ];
    const r = game.completeQuest(s, { id: stepQ.id }, ctx);
    s = r.state;
    const last = i === arc.steps.length - 1;
    if (last) {
      assert.ok(r.effects.some((e) => e.type === 'arc-done' && e.arcId === arc.id));
      assert.ok(s.journal.some((e) => e.kind === 'revelation'));
      assert.ok(s.inventory.some((it) => it.id === `arc_${arc.id}`), 'pièce de musée déposée');
    } else {
      assert.ok(r.effects.some((e) => e.type === 'arc-clue'));
      assert.ok(s.journal.some((e) => e.kind === 'indice'));
    }
    // pas de souvenir « Chapitre glané » pour une étape d'arc
    assert.ok(!s.inventory.some((it) => /Chapitre glané|Gleaned chapter/.test(JSON.stringify(it.item))));
  }
  assert.deepEqual(s.arcs.completed, [arc.id]);
});

test('mini-arcs : le compagnon mentionne une piste en cours', () => {
  const s = defaultState();
  s.arcs = { active: ARCS[0].id, step: 1, completed: [] };
  s.quests = [{ id: 'a', status: 'proposed', famille: 'social', text: { fr: 'x', en: 'x' }, xp: 10 }];
  s.seeds.companion = 1; // seed % 3 === 1 -> branche arc
  const line = companionLineForState(s, 'fr');
  assert.match(line, /piste|page|grimoire/i);
});

test('newDay : compteur de disette d’événement', () => {
  const ctx = (iso) => ({ now: new Date(`${iso}T09:00:00`), rng: mulberry32(11) });
  let s = game.finishOnboarding(defaultState(), { name: 'P', comfort: 3, ageAck: true }, ctx('2026-09-04')).state;
  const seen = [];
  for (let d = 5; d < 20; d++) {
    s.drawDate = null;
    s = game.newDay(s, {}, ctx(`2026-09-${String(d).padStart(2, '0')}`)).state;
    seen.push({ event: !!s.event, since: s.history.daysSinceEvent });
  }
  // le compteur ne dépasse jamais le plafond (un événement est forcé avant)
  assert.ok(seen.every((x) => x.since <= 4), 'la disette est bornée');
  assert.ok(seen.some((x) => x.event), 'des événements sortent bien');
});

test('voix par thème (D12) : chaque thème payant a sa propre voix, complète', () => {
  const paid = THEME_KEYS.filter((k) => k !== 'nordique');
  assert.ok(paid.length >= 6, 'catalogue payant complet');
  assert.ok(paid.includes('sombre') && paid.includes('cyberpunk'));

  for (const theme of paid) {
    // Réaction après quête : texte différent de nordique, même longueur de set.
    for (let seed = 0; seed < 5; seed++) {
      const base = companionLineAfterQuest({ theme: 'nordique', seeds: { companion: seed } }, 'fr');
      const skin = companionLineAfterQuest({ theme, seeds: { companion: seed } }, 'fr');
      assert.notEqual(skin, base, `${theme} #${seed} : réaction propre au thème`);
      assert.ok(skin.length > 3);
      assert.ok(companionLineAfterQuest({ theme, seeds: { companion: seed } }, 'en').length > 3);
    }
    const firstFr = companionLineAfterQuest({ theme, seeds: { companion: 0 } }, 'fr', { first: true });
    assert.doesNotMatch(firstFr, /grimoire/i, `${theme} : première réplique réécrite`);

    // Répliques contextuelles : streak chaud, un thème dit l'anti-pression.
    const streak = companionLineForState(
      { theme, streak: 6, seeds: { companion: 0 }, quests: [{ id: 'a', status: 'proposed' }] },
      'fr',
    );
    assert.match(
      streak,
      /sans pression|sans rien exiger|ton rythme|ton pas|te presse|no pressure|your pace|pushing you/i,
      `${theme} : anti-pression préservée sur la série chaude`,
    );

    // Chapitres : id + seuils stables, label/blurb bilingues et thématisés.
    const prologue = chapterFor(withCompleted(0), theme);
    assert.equal(prologue.id, 'prologue');
    assert.ok(bilingual(prologue.label) && bilingual(prologue.blurb));
    assert.equal(chapterFor(withCompleted(50), theme).id, 'ch3');
    assert.equal(chapterFor(withCompleted(250), theme).id, 'ch5');

    // Nuance de chapitre par famille (Phase 3.1) : 6 familles, bilingues, propres au thème.
    const cl = voiceFor(theme).chapterLean;
    const nordCl = voiceFor('nordique').chapterLean;
    for (const fam of ['social', 'exploration', 'curiosite', 'creation', 'quotidien', 'chaos']) {
      assert.ok(typeof cl.fr[fam] === 'string' && cl.fr[fam].length > 5, `${theme}.chapterLean.fr.${fam}`);
      assert.ok(typeof cl.en[fam] === 'string' && cl.en[fam].length > 5, `${theme}.chapterLean.en.${fam}`);
      assert.notEqual(cl.fr[fam], nordCl.fr[fam], `${theme}.chapterLean.${fam} réécrit pour le thème`);
    }

    // Entrée « du jour » (Phase 3.2) : bilingue, thématisée (≠ nordique).
    const day = dailyRecapEntry(9, ['exploration'], theme, 0);
    assert.ok(bilingual(day) && /9/.test(day.fr));
    assert.notEqual(day.fr, dailyRecapEntry(9, ['exploration'], 'nordique', 0).fr,
      `${theme} : entrée du jour propre au thème`);

    // Cadre des mini-arcs (Phase 3.3) : propre au thème.
    const arc = voiceFor(theme).arc;
    assert.equal(typeof arc.clue.fr, 'function', `${theme}.arc.clue.fr`);
    assert.ok(arc.clue.fr('X').includes('X') && arc.reveal.en('Y').includes('Y'));
    assert.ok(Array.isArray(arc.inProgress.fr) && arc.inProgress.fr.length >= 1);
    assert.notEqual(arc.clue.fr('X'), voiceFor('nordique').arc.clue.fr('X'),
      `${theme} : cadre d'arc propre au thème`);

    // Entrées de journal générées : bilingues, non vides.
    const lvl = levelChapterEntry(7, theme);
    assert.ok(bilingual(lvl) && lvl.fr.includes('7'));
    const evt = eventEntry({ title: { fr: 'X', en: 'X' }, item: { fr: 'Y', en: 'Y' } }, theme);
    assert.ok(bilingual(evt) && evt.fr.includes('X') && evt.fr.includes('Y'));
    const reg = regionRevealEntry({ fr: 'Les Docks', en: 'The Docks' }, theme);
    assert.ok(bilingual(reg) && reg.fr.includes('Les Docks'));

    // Jalons (Phase 1.2) : voix propre et complète, bilingue.
    const M = voiceFor(theme).milestones;
    for (const key of FIRST_MILESTONES) {
      assert.ok(M[key] && bilingual(M[key]), `${theme}.milestones.${key} bilingue`);
    }
    assert.equal(typeof M.volume.fr, 'function', `${theme}.milestones.volume.fr`);
    assert.ok(M.volume.fr(25).includes('25') && M.volume.en(25).includes('25'), `${theme} volume(n)`);
    assert.notEqual(
      M.first_quest.fr, voiceFor('nordique').milestones.first_quest.fr,
      `${theme} : jalon réécrit pour le thème`,
    );

    // Retour après absence (Phase 1.3) : accueil bilingue, jamais un reproche.
    const cbLines = voiceFor(theme).ctx.comeback;
    assert.ok(Array.isArray(cbLines.fr) && cbLines.fr.length >= 2, `${theme}.ctx.comeback.fr`);
    assert.ok(Array.isArray(cbLines.en) && cbLines.en.length >= 2, `${theme}.ctx.comeback.en`);
    for (const l of [...cbLines.fr, ...cbLines.en]) {
      assert.doesNotMatch(l, /manqué|raté\b|missed/i, `${theme} : accueil sans reproche`);
    }
  }

  // Le catalogue des jalons est stable (les tests / la voix s'appuient dessus).
  assert.equal(MILESTONE_KEYS.length, FIRST_MILESTONES.length + 4);
  assert.ok(voiceFor('nordique').milestones.first_quest.fr.length > 10);

  // Thème inconnu -> retombe sur la voix de nordique sans planter.
  const fallback = chapterFor(withCompleted(0), 'inconnu');
  assert.equal(fallback.id, 'prologue');
  assert.ok(bilingual(fallback.label));
  assert.ok(dailyRecapEntry(1, ['social'], 'inconnu'));
});

test('billing (D12/D17) : Collection des Mondes — impl dev hors appareil', async () => {
  // Hors Capacitor natif (cas des tests), getBilling() renvoie l'impl « dev ».
  const b = getBilling();
  assert.equal(b.real, false);
  assert.equal(billingIsReal(), false);

  // Un seul produit non consommable, jamais nordique (gratuit).
  assert.equal(COLLECTION_PRODUCT, 'collection_des_mondes');
  assert.deepEqual([...COLLECTION_THEMES].sort(),
    ['cockpit', 'cyberpunk', 'enquete', 'mystique', 'postapo', 'sombre']);
  assert.ok(!COLLECTION_THEMES.includes('nordique'));

  const list = await b.listProducts();
  assert.equal(list.length, 1);
  assert.equal(list[0].productId, COLLECTION_PRODUCT);

  const res = await b.purchase();
  assert.equal(res.ok, true);
  assert.deepEqual([...res.themes].sort(), [...COLLECTION_THEMES].sort());

  const restored = await b.restore();
  assert.deepEqual(restored, { ok: true, themes: [] });
});

test('game : unlockCollection débloque les 6 thèmes payants d’un coup (D17)', () => {
  let s = defaultState();
  assert.deepEqual(s.unlockedThemes, ['nordique']);

  let r = game.unlockCollection(s);
  s = r.state;
  assert.deepEqual([...s.unlockedThemes].sort(),
    ['cockpit', 'cyberpunk', 'enquete', 'mystique', 'nordique', 'postapo', 'sombre']);
  assert.equal(r.effects[0].type, 'collection-unlocked');
  assert.equal(r.effects[0].themes.length, 6);

  // idempotent
  r = game.unlockCollection(s);
  assert.equal(r.effects.length, 0);
  assert.equal(r.state.unlockedThemes.length, 7);

  // un thème quelconque de la collection s'active ensuite normalement
  r = game.setTheme(s, { theme: 'cyberpunk' });
  assert.equal(r.state.theme, 'cyberpunk');
});

test('thèmes : chaque fichier respecte le contrat (7 thèmes)', async () => {
  const {
    THEMES, THEME_KEYS, DEFAULT_THEME, companionLineFor,
  } = await import('../www/js/data/themes.js');
  assert.ok(THEME_KEYS.length >= 7, 'catalogue complet');
  for (const key of THEME_KEYS) {
    const t = THEMES[key];
    assert.ok(bilingual(t.label), `${key}.label bilingue`);
    assert.ok(typeof t.dot === 'string' && t.dot.length, `${key}.dot`);
    assert.ok(bilingual(t.xpSuffix), `${key}.xpSuffix bilingue`);
    for (const lang of ['fr', 'en']) {
      assert.ok(Array.isArray(t.companionLines[lang]) && t.companionLines[lang].length >= 3,
        `${key}.companionLines.${lang}`);
      assert.equal(typeof companionLineFor(key, lang, 1), 'string');
    }
    // `ui` optionnel ; s'il existe, chaque slot est bilingue.
    if (t.ui) {
      for (const slot of Object.keys(t.ui)) {
        assert.ok(bilingual(t.ui[slot]), `${key}.ui.${slot} bilingue`);
      }
    }
    // Les thèmes payants habillent la réplique de montée de niveau (sinon on
    // retombe sur « grimoire », hors-sujet pour cockpit / cyberpunk / etc.).
    if (key !== DEFAULT_THEME) {
      assert.ok(t.ui && bilingual(t.ui.levelUpLine), `${key}.ui.levelUpLine bilingue`);
    }
  }
});

test('titres : compétences valides, bilingues', () => {
  for (const t of TITLES) {
    assert.ok(SKILL_KEYS.includes(t.skill), t.id);
    assert.ok(bilingual(t.label), t.id);
    assert.ok(t.min === 100 || t.min === 320, `${t.id} seuil`);
  }
  assert.equal(TITLES.length, 12);
});

/* ─────────────── UI : composants purs (charBits) ─────────────── */

test('charBits : cartes personnage ne plantent pas et reflètent l’état', () => {
  const s = defaultState();
  s.name = 'Aria';
  s.level = 3;
  s.skills.curiosite = 100;
  s.titles = ['curiosite_1'];
  s.streak = 2;

  assert.match(heroCardHtml(s), /Aria/);
  assert.match(titlesHtml(s), /title-chip/);
  assert.equal(titlesHtml(defaultState(), true), '', 'aucun titre -> vide en mode compact');
  assert.match(titlesHtml(defaultState(), false), /no_titles|Aucun titre/);
  assert.match(pathStatsHtml(s), /stats-grid/);
});

test('charBits : traits qualitatifs, sans chiffre à maximiser (Phase 2.2)', () => {
  const s = defaultState();
  s.skills.curiosite = 200;
  s.skills.social = 90;
  const html = traitsHtml(s);
  assert.match(html, /traits-list/);
  assert.match(html, /tier-dominante/);
  assert.doesNotMatch(html, /progressbar/, 'pas une barre de stat');
  assert.doesNotMatch(html, />\s*200\s*</, 'aucune valeur numérique affichée');

  const tiers = traitTierFor(s);
  assert.equal(tiers.curiosite, 'dominante');
  assert.ok(['emergente', 'presente'].includes(tiers.social));
  assert.equal(tiers.chaos, 'discrete');
  // rien joué -> tout discret, pas un manque
  assert.deepEqual(new Set(Object.values(traitTierFor(defaultState()))), new Set(['discrete']));
});

test('charBits : collections Moments / Découvertes — scellées puis cochées', () => {
  const s = defaultState();
  let m = momentsHtml(s);
  assert.match(m, /collect-card sealed/);
  assert.doesNotMatch(m, /collect-card got/);

  s.milestones = { first_quest: '2026-09-04', volume_10: '2026-09-12' };
  s.history.totalCompleted = 12;
  m = momentsHtml(s);
  assert.match(m, /collect-card got/);
  assert.match(m, new RegExp(MILESTONE_LABELS.first_quest.fr.slice(0, 8).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(m, /palier-chip got/);

  let d = discoveriesHtml(s);
  assert.match(d, /collect-card sealed/);
  s.discoveries = { dehors: '2026-09-05' };
  d = discoveriesHtml(s);
  assert.match(d, /collect-card got/);
});

test('charBits : musée montre des vitrines ??? seulement en vue « tout » (Phase 2.5)', () => {
  const s = defaultState();
  s.inventory = [{ id: 'a', item: { fr: 'Plume', en: 'Feather' }, kind: 'fragment', date: '2026-09-01' }];
  setMuseumFilter(null);
  selectMuseumItem(null);
  assert.match(inventoryHtml(s), /museum-card sealed/);
  setMuseumFilter('fragment');
  assert.doesNotMatch(inventoryHtml(s), /museum-card sealed/);
  setMuseumFilter(null);
});

test('écran Personnage : « Mon aventure » rend toutes les sections', () => {
  const s = defaultState();
  s.name = 'Aria';
  s.level = 4;
  s.skills.social = 120;
  s.milestones = { first_quest: '2026-09-04' };
  s.discoveries = { soir: '2026-09-04' };
  for (const lang of ['fr', 'en']) {
    i18n.setLang(lang);
    const html = renderCharacter(s);
    assert.match(html, /my_adventure|Mon aventure|My adventure/);
    assert.match(html, /traits-list/);
    assert.match(html, /chronicle-box/);
    assert.match(html, /collect-grid/);
    assert.match(html, /stats-grid/);
  }
  i18n.setLang('fr');
});

test('découvertes : dérivées du contexte / famille, une seule fois', () => {
  const s = defaultState();
  const hits = recordDiscoveries(s, {
    famille: 'creation', contexte: ['exterieur', 'trajet', 'presence_gens'],
  }, new Date('2026-09-04T20:00:00'));
  assert.deepEqual(hits, DISCOVERY_KEYS.filter((k) => hits.includes(k)));
  for (const k of ['dehors', 'chemin', 'rencontre', 'creer', 'soir']) {
    assert.ok(hits.includes(k), `découverte manquante : ${k}`);
  }
  assert.ok(!hits.includes('matin'));
  assert.equal(s.discoveries.dehors, '2026-09-04');
  // rejoué : rien de neuf
  assert.deepEqual(recordDiscoveries(s, { famille: 'creation', contexte: ['exterieur'] },
    new Date('2026-09-05T20:00:00')), []);
});

test('retour après absence : compteur de reprises, une fois par jour', () => {
  const ctx = (iso, h = 10) => ({ now: new Date(`${iso}T${String(h).padStart(2, '0')}:00:00`), rng: mulberry32(4) });
  let s = game.finishOnboarding(defaultState(), { name: 'P', comfort: 4, ageAck: true }, ctx('2026-09-01')).state;
  // joue le 1er
  for (const q of [...s.quests]) {
    s = game.acceptQuest(s, { id: q.id }).state;
    s = game.completeQuest(s, { id: q.id }, ctx('2026-09-01')).state;
  }
  assert.equal(s.history.comebacks, 0);

  // revient 8 jours plus tard
  s.drawDate = null;
  s = game.newDay(s, {}, ctx('2026-09-09')).state;
  const first = s.quests[0];
  s = game.acceptQuest(s, { id: first.id }).state;
  s = game.completeQuest(s, { id: first.id }, ctx('2026-09-09')).state;
  assert.equal(s.history.comebacks, 1);
  // une 2e quête le même jour ne recompte pas
  if (s.quests[1]) {
    s = game.acceptQuest(s, { id: s.quests[1].id }).state;
    s = game.completeQuest(s, { id: s.quests[1].id }, ctx('2026-09-09')).state;
  }
  assert.equal(s.history.comebacks, 1);
});

test('charBits : musée — filtre et sélection', () => {
  const s = defaultState();
  s.inventory = [
    { id: 'a', item: { fr: 'Plume', en: 'Feather' }, kind: 'fragment', date: '2026-09-01' },
    { id: 'b', item: { fr: 'Médaille', en: 'Medal' }, kind: 'collectible', date: '2026-09-02' },
  ];

  setMuseumFilter(null);
  selectMuseumItem(null);
  let html = inventoryHtml(s);
  assert.match(html, /aria-pressed="true"/, 'le filtre « tout » est actif par défaut');
  assert.match(html, /Plume|Médaille/);

  setMuseumFilter('collectible');
  html = inventoryHtml(s);
  assert.doesNotMatch(html, /Plume/);
  assert.match(html, /Médaille/);

  setMuseumFilter('inconnu');
  html = inventoryHtml(s);
  assert.match(html, /aria-pressed="true"/, 'un kind invalide retombe sur « tout »');

  setMuseumFilter(null);
  selectMuseumItem('b');
  html = inventoryHtml(s);
  assert.match(html, /museum-detail/);
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

    assert.equal(quests.length, 3, `exactement 3 propositions/jour (seed ${seed})`);
    const fams = quests.map((q) => q.famille);
    assert.ok(fams.includes('social'), `pas de social (seed ${seed})`);

    const roles = quests.map((q) => q.role).sort();
    assert.deepEqual(roles, ['audacieuse', 'principale', 'tranquille'], `rôles (seed ${seed})`);

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
  let fx = [];
  bumpStreak(s, fx, '2026-09-01');
  assert.equal(s.streak, 1);
  assert.equal(fx.at(-1).broke, false, 'premier jour : pas une rupture');
  fx = [];
  bumpStreak(s, fx, '2026-09-02');
  assert.equal(s.streak, 2);
  fx = [];
  bumpStreak(s, fx, '2026-09-02'); // même jour
  assert.equal(s.streak, 2);
  assert.equal(fx.length, 0, 'même jour : aucun effet');
  fx = [];
  bumpStreak(s, fx, '2026-09-10'); // trou -> reset, sans coût
  assert.equal(s.streak, 1);
  assert.equal(s.history.bestStreak, 2);
  assert.equal(fx.at(-1).broke, true, 'une série >1 qui casse doit être signalée pour la réassurance UI');
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

test('normalize : le flag d’astuce thème est toujours booléen', () => {
  assert.equal(defaultState().hints.themeTip, false);
  assert.equal(normalize({}).hints.themeTip, false);
  assert.equal(normalize({ hints: { themeTip: true } }).hints.themeTip, true);
  assert.equal(normalize({ hints: 'corrompu' }).hints.themeTip, false);
  // une sauvegarde d'avant la fonctionnalité : l'astuce reste à montrer
  assert.equal(normalize({ onboarded: true, name: 'X' }).hints.themeTip, false);
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

test('événement : compléter donne XP/loot sans pénalité, ignorer ne coûte rien', () => {
  const ctx = { now: new Date('2026-09-04T10:00:00'), rng: mulberry32(9) };
  let s = defaultState();
  s.level = 10; s.streak = 5; s.comfort = 4; s.ageAck = true;
  s.event = { ...EVENTS.find((e) => e.id === 'ev_porte'), status: 'active' };
  const before = structuredClone(s);

  const dismissed = game.dismissEvent(s).state;
  assert.deepEqual(checkNoPenalty(before, dismissed), []);
  assert.equal(dismissed.event.status, 'dismissed');
  assert.equal(dismissed.xp, before.xp);

  const r = game.completeEvent(s, {}, ctx);
  assert.deepEqual(checkNoPenalty(before, r.state), []);
  assert.equal(r.state.event.status, 'done');
  assert.ok(r.state.xp > before.xp || r.state.level > before.level);
  assert.equal(r.state.inventory.length, 1);
  assert.ok(r.effects.some((e) => e.type === 'event-done'));

  const again = game.completeEvent(r.state, {}, ctx);
  assert.equal(again.effects.length, 0, 'un événement déjà fait ne redonne rien');
});

test('journal : une entrée d\'événement est un souvenir (titre + récit + objet)', () => {
  const ctx = { now: new Date('2026-09-04T10:00:00'), rng: mulberry32(3) };
  let s = defaultState();
  s.level = 10; s.ageAck = true; s.history.daysPlayed = 5;
  s.event = { ...EVENTS.find((e) => e.id === 'ev_lumiere'), status: 'active' };
  s = game.completeEvent(s, {}, ctx).state;

  const entry = s.journal.find((e) => e.kind === 'evenement');
  assert.ok(entry, 'entrée de journal créée');
  assert.ok(bilingual(entry.title), 'titre bilingue');
  assert.ok(bilingual(entry.text) && !/Butin|Loot/.test(entry.text.fr), 'récit, pas une ligne de log');
  assert.ok(bilingual(entry.souvenir) && /Éclat/.test(entry.souvenir.fr), 'objet-souvenir');
  assert.equal(entry.day, 5, 'numéro de jour stampé');
  // coda : soit absente, soit une ligne bilingue du compagnon
  if (entry.coda) assert.ok(bilingual(entry.coda));
});

test('journal : eventCoda tombe ~1 fois sur 3, toujours bilingue', () => {
  let hits = 0;
  for (let i = 0; i < 300; i++) {
    const c = eventCoda('nordique', mulberry32(i));
    if (c) { hits += 1; assert.ok(bilingual(c)); }
  }
  assert.ok(hits > 40 && hits < 160, `fréquence coda plausible : ${hits}/300`);
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

test('boutique de thèmes (D12) : déblocage local + activation verrouillée', () => {
  let s = defaultState();
  assert.deepEqual(s.unlockedThemes, ['nordique']);

  // setTheme refuse un thème non débloqué : aucune faille pour contourner un achat.
  let r = game.setTheme(s, { theme: 'cyberpunk' });
  assert.equal(r.state.theme, 'nordique', 'refuse un thème non débloqué');
  assert.equal(r.effects.length, 0);

  r = game.unlockTheme(s, { theme: 'cyberpunk' });
  s = r.state;
  assert.ok(s.unlockedThemes.includes('cyberpunk'));
  assert.deepEqual(r.effects, [{ type: 'theme-unlocked', theme: 'cyberpunk' }]);

  // idempotent : débloquer deux fois ne duplique rien et ne renvoie aucun effet.
  r = game.unlockTheme(s, { theme: 'cyberpunk' });
  assert.equal(r.state.unlockedThemes.filter((k) => k === 'cyberpunk').length, 1);
  assert.equal(r.effects.length, 0);

  r = game.setTheme(s, { theme: 'cyberpunk' });
  assert.equal(r.state.theme, 'cyberpunk', 'accepté une fois débloqué');

  // clé de thème invalide : ignorée proprement.
  r = game.unlockTheme(s, { theme: 'imaginaire' });
  assert.equal(r.effects.length, 0);
});

test('msUntilNextMidnight : délai jusqu’au prochain minuit local + marge', () => {
  // Midi pile : 12 h restantes, + 5 s de marge.
  const noon = new Date(2026, 0, 15, 12, 0, 0, 0);
  assert.equal(msUntilNextMidnight(noon, 5), 12 * 3600_000 + 5000);

  // 30 s avant minuit : 30 s + 5 s de marge.
  const late = new Date(2026, 0, 15, 23, 59, 30, 0);
  assert.equal(msUntilNextMidnight(late, 5), 35_000);

  // Toujours strictement positif (jamais un setTimeout négatif).
  const oneSecBefore = new Date(2026, 5, 1, 23, 59, 59, 500);
  assert.ok(msUntilNextMidnight(oneSecBefore, 0) > 0);
});
