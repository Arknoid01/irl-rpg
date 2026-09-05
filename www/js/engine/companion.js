// Compagnon contextuel — répliques selon streak, style, carte, journée.
// D4 : toujours « avec toi », jamais un maître du jeu.

import { THEMES, DEFAULT_THEME } from '../data/themes.js';
import { computeStyle } from './progression.js';
import { STYLE_DEFAULT } from '../data/titles.js';
import { loc } from '../i18n/index.js';
import { todayStr } from './dates.js';

const CTX = {
  allDone: {
    fr: [
      'Les pages du jour sont remplies. Repose-toi — ou feuillette le journal.',
      'Rien d’obligatoire maintenant. Ton compagnon sourit : la journée a suffi.',
    ],
    en: [
      'Today’s pages are full. Rest — or skim the journal.',
      'Nothing required now. Your companion smiles: the day was enough.',
    ],
  },
  streakHot: {
    fr: [
      'Ta série tient comme un feu de camp. Ton compagnon y ajoute une braise — sans pression.',
      'Jour après jour, le grimoire s’épaissit. On continue à ton rythme.',
    ],
    en: [
      'Your streak holds like a campfire. Your companion adds an ember — no pressure.',
      'Day after day the grimoire thickens. We keep your pace.',
    ],
  },
  mapFresh: {
    fr: [
      'La brume se lève quelque part sur la carte. Un lieu s’est ouvert pour toi.',
      'Ton compagnon pointe le plateau : une région vient de se révéler.',
    ],
    en: [
      'Fog lifts somewhere on the map. A place has opened for you.',
      'Your companion points at the board: a region just revealed itself.',
    ],
  },
  emptyDay: {
    fr: [
      'La page est encore blanche. On peut tirer une journée quand tu veux.',
      'Pas de quêtes pour l’instant — le compagnon attend ton signal.',
    ],
    en: [
      'The page is still blank. We can draw a day whenever you like.',
      'No quests yet — your companion waits for your cue.',
    ],
  },
  styleLead: {
    fr: (style) => [
      `Ton style — « ${style} » — colore déjà la journée. Ton compagnon s’adapte.`,
      `On voit bien qui tu es en chemin : ${style}. Voici de quoi nourrir ça.`,
    ],
    en: (style) => [
      `Your style — “${style}” — already colours the day. Your companion adapts.`,
      `It’s clear who you are on the road: ${style}. Here’s something to feed that.`,
    ],
  },
  // Le compagnon se souvient d'un fragment précis de ton histoire — jamais
  // une case cochée générique. Renforce « il/elle connaît ton histoire »
  // (axe différenciation : push, pas pull).
  callback: {
    fr: (t) => [
      `Hier : « ${t} » Ton compagnon s’en souvient encore.`,
      `Ce que tu as fait n’est pas oublié : « ${t} »`,
    ],
    en: (t) => [
      `Yesterday: “${t}” Your companion still remembers it.`,
      `What you did isn’t forgotten: “${t}”`,
    ],
  },
};

/** Dernier fragment/moment de journal d'un jour précédent (pas aujourd'hui). */
function lastCallbackEntry(state, today) {
  const journal = state.journal || [];
  for (let i = journal.length - 1; i >= 0; i--) {
    const e = journal[i];
    if ((e.kind === 'fragment' || e.kind === 'moment') && e.date && e.date !== today) {
      return e.text;
    }
  }
  return null;
}

const AFTER_QUEST = {
  fr: [
    'Pas mal.',
    'Voilà qui est fait.',
    'Le monde a bougé, un peu.',
    'Ton compagnon hoche la tête.',
    'Une page de plus dans le grimoire.',
  ],
  en: [
    'Not bad.',
    'Well, that’s done.',
    'The world shifted, a little.',
    'Your companion nods.',
    'One more page in the grimoire.',
  ],
};

const AFTER_QUEST_FIRST = {
  fr: 'Ton compagnon sourit : « J’ai quelque chose pour toi. Reviens demain. »',
  en: 'Your companion smiles: “I’ll have something for you. Come back tomorrow.”',
};

/**
 * Réaction courte du compagnon après une quête accomplie (plan §8/§26).
 */
export function companionLineAfterQuest(state, lang = 'fr', opts = {}) {
  if (opts.first) return AFTER_QUEST_FIRST[lang] || AFTER_QUEST_FIRST.fr;
  const seed = state?.seeds?.companion || 0;
  const lines = AFTER_QUEST[lang] || AFTER_QUEST.fr;
  return lines[seed % lines.length];
}

function themeFallback(themeKey, lang, seed) {
  const t = THEMES[themeKey] || THEMES[DEFAULT_THEME];
  const lines = t.companionLines[lang] || t.companionLines.fr;
  return lines[seed % lines.length];
}

/**
 * Ligne du compagnon pour l’écran Aventure (et ailleurs).
 * @returns {string}
 */
export function companionLineForState(state, lang = 'fr', now = new Date()) {
  const seed = state.seeds?.companion || 0;
  const quests = state.quests || [];
  const active = quests.filter((q) => q.status === 'proposed' || q.status === 'accepted');
  const done = quests.filter((q) => q.status === 'done');

  if (!quests.length) {
    const lines = CTX.emptyDay[lang] || CTX.emptyDay.fr;
    return lines[seed % lines.length];
  }

  if (quests.length && active.length === 0 && done.length > 0) {
    const lines = CTX.allDone[lang] || CTX.allDone.fr;
    return lines[seed % lines.length];
  }

  const unlocked = state.history?.regionsUnlocked || [];
  const fresh = state.history?.regionsFresh || [];
  if (fresh.length) {
    const lines = CTX.mapFresh[lang] || CTX.mapFresh.fr;
    return lines[seed % lines.length];
  }

  if ((state.streak || 0) >= 5) {
    const lines = CTX.streakHot[lang] || CTX.streakHot.fr;
    return lines[seed % lines.length];
  }

  const style = computeStyle(state);
  if (style && style !== STYLE_DEFAULT && (state.history?.totalCompleted || 0) >= 4) {
    const label = loc(style, lang);
    const factory = CTX.styleLead[lang] || CTX.styleLead.fr;
    const lines = factory(label);
    return lines[seed % lines.length];
  }

  const callbackText = lastCallbackEntry(state, todayStr(now));
  if (callbackText && seed % 3 === 0) {
    const label = loc(callbackText, lang);
    const factory = CTX.callback[lang] || CTX.callback.fr;
    const lines = factory(label);
    return lines[seed % lines.length];
  }

  // Carte déjà bien ouverte → mention douce occasionnelle
  if (unlocked.length >= 5 && seed % 4 === 0) {
    const lines = CTX.mapFresh[lang] || CTX.mapFresh.fr;
    return lines[(seed + 1) % lines.length];
  }

  return themeFallback(state.theme, lang, seed);
}
