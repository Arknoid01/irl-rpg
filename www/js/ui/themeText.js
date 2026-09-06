// Mots de saveur du thème actif. N'habille QUE des libellés de saveur bien
// visibles (titre de section, badge d'événement…) — jamais un texte de
// sécurité, d'optionnalité ou de confidentialité, qui reste identique quel
// que soit le thème (spec §22, DECISIONS D4/D11).
//
// Un thème fournit ces mots via un objet `ui` optionnel dans son fichier
// (data/themes/<clé>.js), au format { slot: { fr, en } }. Sans `ui`, ou pour
// un slot absent, on retombe sur la clé i18n générique.

import { THEMES } from '../data/themes.js';
import { i18n } from '../i18n/index.js';

export function themeText(slot, fallbackKey) {
  let key = '';
  try { key = document.documentElement.dataset.theme || ''; } catch { /* pas de DOM */ }
  const v = THEMES[key] && THEMES[key].ui && THEMES[key].ui[slot];
  return v ? i18n.loc(v) : i18n.t(fallbackKey);
}
