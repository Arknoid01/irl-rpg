// Journal d'aventure : fragments, moments, timeline + chapitres.
// Tout le texte de saveur vient de la voix du thème (data/themes/<thème>.js,
// clé `voice`) via voiceFor() — nordique fait référence, les autres thèmes
// n'adaptent que le vocabulaire. Le thème est passé explicitement par les
// reducers (engine/game.js) et par buildJournalTimeline (state.theme).

import { pick, defaultRng } from './rng.js';
import { loc } from '../i18n/index.js';
import { voiceFor } from '../data/themes.js';
import { FAMILIES } from '../data/taxonomy.js';
import { daysBetween, todayStr } from './dates.js';

export function addEntry(s, {
  date, text, kind = 'note', title, souvenir, coda,
}) {
  const entry = {
    date, text, kind,
    day: Math.max(1, (s.history && s.history.daysPlayed) || 1),
  };
  // Champs optionnels : une entrée « souvenir » (événement) porte un titre,
  // l'objet gagné, et parfois une ligne de clôture du compagnon.
  if (title) entry.title = title;
  if (souvenir) entry.souvenir = souvenir;
  if (coda) entry.coda = coda;
  s.journal.push(entry);
}

const MEMORABLE_CHANCE = 0.38;
const EVENT_CODA_CHANCE = 0.34;

/**
 * Ligne de clôture occasionnelle sous un souvenir d'événement (~1 sur 3).
 * @returns {{fr:string,en:string}|null}
 */
export function eventCoda(themeKey, rng = defaultRng) {
  const pool = voiceFor(themeKey).eventCoda || [];
  if (!pool.length || rng() > EVENT_CODA_CHANCE) return null;
  return pick(pool, rng);
}

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

/** Indice de mini-arc au journal (Phase 3.3) — texte brut habillé par le thème. */
export function arcClueEntry(text, themeKey) {
  const v = voiceFor(themeKey).arc.clue;
  return { fr: v.fr(loc(text, 'fr')), en: v.en(loc(text, 'en')) };
}

/** Révélation finale d'un mini-arc. */
export function arcRevealEntry(text, themeKey) {
  const v = voiceFor(themeKey).arc.reveal;
  return { fr: v.fr(loc(text, 'fr')), en: v.en(loc(text, 'en')) };
}

/**
 * Entrée de journal « du jour » (Phase 3.2) — résumé narratif de la veille.
 * @param {number} dayNo  numéro du jour résumé
 * @param {string[]} families  familles vécues (distinctes, ordre d'apparition)
 * @param {string} themeKey
 * @param {number} seed  fait varier le titre du jour
 * @returns {{fr:string,en:string}|null} null s'il n'y a rien à raconter
 */
export function dailyRecapEntry(dayNo, families, themeKey, seed = 0) {
  const fams = (families || []).filter((f) => FAMILIES[f]).slice(0, 3);
  if (!fams.length) return null;
  const V = voiceFor(themeKey);
  const titles = V.dayTitles;
  const pickTitle = (lang) => titles[lang][seed % titles[lang].length];
  const tagStr = (lang) => fams.map((f) => `${FAMILIES[f].icon} ${loc(FAMILIES[f].label, lang)}`).join(' · ');
  return {
    fr: V.dayEntry.fr(dayNo, pickTitle('fr'), tagStr('fr')),
    en: V.dayEntry.en(dayNo, pickTitle('en'), tagStr('en')),
  };
}

// Paliers de chapitre — en NOMBRE DE QUÊTES accomplies (DECISIONS D15, §2.2 :
// « plus lié à l'activité » qu'au niveau). L'ordre et les identifiants ne
// changent jamais ; seuls le texte (thématisé) et la nuance de famille varient.
const CHAPTER_IDS = ['prologue', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5'];
export const CHAPTER_QUEST_THRESHOLDS = [0, 10, 25, 50, 100, 200];

function chapterIndexFor(state) {
  const n = (state && state.history && state.history.totalCompleted) || 0;
  let idx = 0;
  for (let i = 0; i < CHAPTER_QUEST_THRESHOLDS.length; i += 1) {
    if (n >= CHAPTER_QUEST_THRESHOLDS[i]) idx = i;
  }
  return idx;
}

/** Famille nettement en tête, ou null si trop tôt / trop équilibré. */
function dominantFamily(state) {
  const fc = (state && state.history && state.history.familleCompleted) || {};
  const ranked = Object.entries(fc).sort((a, b) => b[1] - a[1]);
  const top = ranked[0];
  const second = ranked[1];
  if (!top || top[1] < 5) return null;
  if (second && second[1] >= top[1] * 0.7) return null;
  return top[0];
}

/** Phrase de nuance du chapitre selon la famille dominante (Phase 3.1). */
function chapterLean(state, themeKey) {
  const fam = dominantFamily(state);
  if (!fam) return null;
  const base = voiceFor().chapterLean;
  const cl = voiceFor(themeKey).chapterLean || base;
  return {
    fr: (cl.fr && cl.fr[fam]) || base.fr[fam],
    en: (cl.en && cl.en[fam]) || base.en[fam],
  };
}

/**
 * Entrée de journal quand un nouveau chapitre s'ouvre (label + blurb déjà
 * thématisés par la voix du thème — pas de wrapper par thème à écrire).
 */
export function chapterOpenEntry(chap) {
  return {
    fr: `— ${loc(chap.label, 'fr')} —\n${loc(chap.blurb, 'fr')}`,
    en: `— ${loc(chap.label, 'en')} —\n${loc(chap.blurb, 'en')}`,
  };
}

/** Chapitre narratif selon le nombre de quêtes accomplies + nuance de famille. */
export function chapterFor(state, themeKey = state && state.theme) {
  const idx = chapterIndexFor(state);
  const chapters = voiceFor(themeKey).chapters;
  const ch = chapters[idx] || voiceFor().chapters[idx];
  return {
    id: CHAPTER_IDS[idx],
    label: ch.label,
    blurb: ch.blurb,
    lean: chapterLean(state, themeKey),
  };
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
  const chapter = chapterFor(state, state.theme);
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
