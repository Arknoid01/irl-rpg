import fr from './fr.js';
import en from './en.js';

export const DICTS = { fr, en };
export const LANGS = ['fr', 'en'];

function interpolate(str, params) {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m));
}

/** Résout une valeur localisée : chaîne simple ou objet { fr, en }. */
export function loc(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.fr ?? value.en ?? '';
}

let current = 'fr';

export const i18n = {
  get lang() { return current; },
  setLang(lang) { current = LANGS.includes(lang) ? lang : 'fr'; },
  /** Traduit une clé d'UI. */
  t(key, params) {
    const dict = DICTS[current] || DICTS.fr;
    const raw = dict[key] ?? DICTS.fr[key] ?? key;
    return interpolate(raw, params);
  },
  /** Résout un champ de contenu { fr, en }. */
  loc(value) { return loc(value, current); },
};

/** Devine la langue de départ depuis le navigateur. */
export function detectLang() {
  try {
    const nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
    return LANGS.includes(nav) ? nav : 'fr';
  } catch {
    return 'fr';
  }
}
