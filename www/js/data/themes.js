// Thèmes — habillage + vocabulaire uniquement. Le gameplay ne change jamais.
// Couleurs/polices : styles/themes.css. Textes : bilingues { fr, en }.
//
// Un thème = un fichier dans ./themes/. Pour en ajouter un : créer
// ./themes/<clé>.js exportant par défaut { label, dot, companionLines: {fr,en},
// xpSuffix: {fr,en} }, puis l'enregistrer dans THEMES ci-dessous. Rien d'autre
// dans le code n'a besoin de changer (companion.js, store.js, ui/theme.js
// importent tous depuis ce fichier, pas depuis ./themes/ directement).
//
// D4 : l'entité qui propose les quêtes est un « compagnon », jamais un maître du jeu.
// Le vocabulaire de thème n'habille que des mots de saveur ; tout le texte de
// sécurité / optionnalité reste identique quel que soit le thème.

import nordique from './themes/nordique.js';
import sombre from './themes/sombre.js';
import cyberpunk from './themes/cyberpunk.js';

export const DEFAULT_THEME = 'nordique';

export const THEMES = { nordique, sombre, cyberpunk };

export const THEME_KEYS = Object.keys(THEMES);

export function companionLineFor(themeKey, lang, seed = 0) {
  const t = THEMES[themeKey] || THEMES[DEFAULT_THEME];
  const lines = t.companionLines[lang] || t.companionLines.fr;
  return lines[seed % lines.length];
}
