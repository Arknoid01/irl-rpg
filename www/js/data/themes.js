// Thèmes — habillage + vocabulaire uniquement. Le gameplay ne change jamais.
// Couleurs/polices : styles/themes.css. Textes : bilingues { fr, en }.
//
// Un thème = un fichier dans ./themes/. Pour en ajouter un : créer
// ./themes/<clé>.js exportant par défaut { label, dot, companionLines: {fr,en},
// xpSuffix: {fr,en}, voice: {...} }, puis l'enregistrer dans THEMES ci-dessous.
// Rien d'autre dans le code n'a besoin de changer (companion.js, journal.js,
// store.js, ui/theme.js importent tous depuis ce fichier, pas depuis ./themes/
// directement).
//
// Champs optionnels d'un thème :
//   previewVideo : chemin d'une vidéo d'aperçu boutique (sinon aperçu live CSS).
//   ui : mots de saveur { questsHeading, eventLabel, allDone } en { fr, en },
//        résolus par ui/themeText.js. Habillage uniquement — jamais un texte
//        de sécurité / d'optionnalité (spec §22).
//
// `voice` (répliques du compagnon, cérémonie, entrées et chapitres de journal)
// : nordique.js porte la version complète de référence ; les autres thèmes
// fournissent leur variante et retombent sur nordique pour ce qu'ils omettent
// (cf. voiceFor ci-dessous). Même intention pour tous : jamais de pression,
// toujours « avec toi » (D4) — seul le vocabulaire de saveur change.
//
// D4 : l'entité qui propose les quêtes est un « compagnon », jamais un maître du jeu.
// Le vocabulaire de thème n'habille que des mots de saveur ; tout le texte de
// sécurité / optionnalité reste identique quel que soit le thème.

import nordique from './themes/nordique.js';
import sombre from './themes/sombre.js';
import cyberpunk from './themes/cyberpunk.js';
import enquete from './themes/enquete.js';
import mystique from './themes/mystique.js';
import postapo from './themes/postapo.js';
import cockpit from './themes/cockpit.js';

export const DEFAULT_THEME = 'nordique';

export const THEMES = {
  nordique, sombre, cyberpunk, enquete, mystique, postapo, cockpit,
};

export const THEME_KEYS = Object.keys(THEMES);

export function companionLineFor(themeKey, lang, seed = 0) {
  const t = THEMES[themeKey] || THEMES[DEFAULT_THEME];
  const lines = t.companionLines[lang] || t.companionLines.fr;
  return lines[seed % lines.length];
}

const BASE_VOICE = THEMES[DEFAULT_THEME].voice;

/**
 * Voix narrative d'un thème, complétée par celle de nordique pour toute clé
 * absente (fusion peu profonde, + un niveau pour `ctx`). Un thème peut donc
 * n'adapter qu'une partie de sa voix sans rien casser.
 */
export function voiceFor(themeKey) {
  const v = (THEMES[themeKey] || THEMES[DEFAULT_THEME]).voice;
  if (!v || v === BASE_VOICE) return BASE_VOICE;
  return {
    ...BASE_VOICE,
    ...v,
    ctx: { ...BASE_VOICE.ctx, ...(v.ctx || {}) },
  };
}
