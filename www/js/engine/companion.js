// Compagnon contextuel — répliques selon streak, style, carte, journée.
// D4 : toujours « avec toi », jamais un maître du jeu.

import { THEMES, DEFAULT_THEME, voiceFor } from '../data/themes.js';
import { computeStyle } from './progression.js';
import { STYLE_DEFAULT } from '../data/titles.js';
import { loc } from '../i18n/index.js';
import { todayStr } from './dates.js';

// Le texte de saveur (contextuel + réaction après quête) vit désormais dans
// data/themes/<thème>.js sous `voice` : voiceFor(state.theme) renvoie la voix
// du thème, complétée par celle de nordique. Aucun texte en dur ici.

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

/**
 * Réaction courte du compagnon après une quête accomplie (plan §8/§26).
 */
export function companionLineAfterQuest(state, lang = 'fr', opts = {}) {
  const v = voiceFor(state?.theme);
  if (opts.first) return v.afterQuestFirst[lang] || v.afterQuestFirst.fr;
  const seed = state?.seeds?.companion || 0;
  const lines = v.afterQuest[lang] || v.afterQuest.fr;
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
  const C = voiceFor(state.theme).ctx;
  const quests = state.quests || [];
  const active = quests.filter((q) => q.status === 'proposed' || q.status === 'accepted');
  const done = quests.filter((q) => q.status === 'done');

  if (!quests.length) {
    const lines = C.emptyDay[lang] || C.emptyDay.fr;
    return lines[seed % lines.length];
  }

  if (quests.length && active.length === 0 && done.length > 0) {
    const lines = C.allDone[lang] || C.allDone.fr;
    return lines[seed % lines.length];
  }

  const unlocked = state.history?.regionsUnlocked || [];
  const fresh = state.history?.regionsFresh || [];
  if (fresh.length) {
    const lines = C.mapFresh[lang] || C.mapFresh.fr;
    return lines[seed % lines.length];
  }

  if ((state.streak || 0) >= 5) {
    const lines = C.streakHot[lang] || C.streakHot.fr;
    return lines[seed % lines.length];
  }

  const style = computeStyle(state);
  if (style && style !== STYLE_DEFAULT && (state.history?.totalCompleted || 0) >= 4) {
    const label = loc(style, lang);
    const factory = C.styleLead[lang] || C.styleLead.fr;
    const lines = factory(label);
    return lines[seed % lines.length];
  }

  const callbackText = lastCallbackEntry(state, todayStr(now));
  if (callbackText && seed % 3 === 0) {
    const label = loc(callbackText, lang);
    const factory = C.callback[lang] || C.callback.fr;
    const lines = factory(label);
    return lines[seed % lines.length];
  }

  // Carte déjà bien ouverte → mention douce occasionnelle
  if (unlocked.length >= 5 && seed % 4 === 0) {
    const lines = C.mapFresh[lang] || C.mapFresh.fr;
    return lines[(seed + 1) % lines.length];
  }

  return themeFallback(state.theme, lang, seed);
}
