// Journal d'aventure : fragments, moments, timeline + chapitres.
// Tout le texte de saveur vient de la voix du thème (data/themes/<thème>.js,
// clé `voice`) via voiceFor() — nordique fait référence, les autres thèmes
// n'adaptent que le vocabulaire. Le thème est passé explicitement par les
// reducers (engine/game.js) et par buildJournalTimeline (state.theme).

import { pick, defaultRng } from './rng.js';
import { loc } from '../i18n/index.js';
import { voiceFor } from '../data/themes.js';
import { daysBetween, todayStr } from './dates.js';

export function addEntry(s, { date, text, kind = 'note' }) {
  s.journal.push({ date, text, kind });
}

const MEMORABLE_CHANCE = 0.38;

/**
 * Renvoie un objet { fr, en } de « moment mémorable » ou null.
 */
export function maybeMemorable(quest, rng = defaultRng, themeKey) {
  const eligible = quest.famille === 'chaos'
    || quest.hidden
    || (quest.poids && quest.poids !== 'petite');
  if (!eligible) return null;
  if (rng() > MEMORABLE_CHANCE) return null;
  const tpl = pick(voiceFor(themeKey).memorable, rng);
  return {
    fr: tpl.fr(loc(quest.text, 'fr')),
    en: tpl.en(loc(quest.text, 'en')),
  };
}

export function eventEntry(ev, themeKey) {
  const v = voiceFor(themeKey).eventEntry;
  return {
    fr: v.fr(loc(ev.title, 'fr'), loc(ev.item, 'fr')),
    en: v.en(loc(ev.title, 'en'), loc(ev.item, 'en')),
  };
}

export function levelChapterEntry(level, themeKey) {
  const v = voiceFor(themeKey).levelChapter;
  return { fr: v.fr(level), en: v.en(level) };
}

export function regionRevealEntry(regionLabel, themeKey) {
  const v = voiceFor(themeKey).regionReveal;
  return {
    fr: v.fr(loc(regionLabel, 'fr')),
    en: v.en(loc(regionLabel, 'en')),
  };
}

// Paliers de niveau -> index du chapitre + identifiant stable (l'ordre et les
// seuils ne changent jamais ; seul le texte est thématisé).
const CHAPTER_IDS = ['prologue', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5'];
function chapterIndexForLevel(level) {
  if (level < 3) return 0;
  if (level < 5) return 1;
  if (level < 8) return 2;
  if (level < 12) return 3;
  if (level < 15) return 4;
  return 5;
}

/** Chapitre narratif selon le niveau actuel. */
export function chapterForLevel(level, themeKey) {
  const idx = chapterIndexForLevel(level);
  const chapters = voiceFor(themeKey).chapters;
  const ch = chapters[idx] || voiceFor().chapters[idx];
  return { id: CHAPTER_IDS[idx], label: ch.label, blurb: ch.blurb };
}

function bucketFor(dateStr, today) {
  if (!dateStr) return 'older';
  const d = daysBetween(dateStr, today);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d <= 7) return 'week';
  return 'older';
}

/**
 * Timeline groupée pour l’UI journal.
 */
export function buildJournalTimeline(state, now = new Date()) {
  const today = todayStr(now);
  const chapter = chapterForLevel(state.level || 1, state.theme);
  const raw = (state.journal || []).slice().reverse();

  const buckets = {
    today: [],
    yesterday: [],
    week: [],
    older: [],
  };
  for (const e of raw) {
    buckets[bucketFor(e.date, today)].push(e);
  }

  const order = ['today', 'yesterday', 'week', 'older'];
  const sections = order
    .filter((k) => buckets[k].length)
    .map((k) => ({ id: k, entries: buckets[k] }));

  return {
    chapter,
    sections,
    total: raw.length,
    empty: raw.length === 0,
  };
}
