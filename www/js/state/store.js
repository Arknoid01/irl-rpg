// Persistance + migrations. Le stockage est injectable pour les tests.

import { defaultState, SAVE_VERSION } from './defaults.js';
import { THEME_KEYS, DEFAULT_THEME } from '../data/themes.js';

export const STORAGE_KEY = 'irlrpg_save_v2';
const LEGACY_KEY_V1 = 'irlrpg_save_v1';

const THEME_MIGRATION = { skyrim: 'nordique', witcher: 'sombre' };

/** Stockage basé sur localStorage, avec repli mémoire si indisponible. */
export function browserStorage() {
  try {
    const t = '__irlrpg_probe__';
    localStorage.setItem(t, '1');
    localStorage.removeItem(t);
    return localStorage;
  } catch (e) {
    const mem = new Map();
    return {
      getItem: (k) => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => mem.set(k, String(v)),
      removeItem: (k) => mem.delete(k),
    };
  }
}

/** Stockage mémoire pur (tests). */
export function memoryStorage(initial = {}) {
  const mem = new Map(Object.entries(initial));
  return {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k),
    _dump: () => Object.fromEntries(mem),
  };
}

function deepMerge(base, patch) {
  if (Array.isArray(base) || typeof base !== 'object' || base === null) {
    return patch === undefined ? base : patch;
  }
  const out = { ...base };
  for (const k of Object.keys(patch || {})) {
    out[k] = deepMerge(base[k], patch[k]);
  }
  return out;
}

function migrateFromV1(raw) {
  let old;
  try { old = JSON.parse(raw); } catch { return null; }
  if (!old || typeof old !== 'object') return null;
  const s = defaultState();
  s.name = typeof old.name === 'string' ? old.name : '';
  s.onboarded = !!s.name;
  s.ageAck = !!s.name;
  s.theme = THEME_MIGRATION[old.theme] || old.theme || s.theme;
  s.level = Number.isFinite(old.level) ? old.level : 1;
  s.xp = Number.isFinite(old.xp) ? old.xp : 0;
  s.streak = Number.isFinite(old.streak) ? old.streak : 0;
  if (old.skills && typeof old.skills === 'object') {
    for (const k of Object.keys(s.skills)) {
      if (Number.isFinite(old.skills[k])) s.skills[k] = old.skills[k];
    }
  }
  if (Array.isArray(old.journal)) {
    s.journal = old.journal
      .filter((e) => e && typeof e.text === 'string')
      .map((e) => ({ date: e.date || '', text: e.text, kind: e.kind || 'fragment' }));
  }
  // Les titres V1 avaient d'autres identifiants : on les laisse se redébloquer.
  return s;
}

export function normalize(state) {
  let s = deepMerge(defaultState(), state || {});
  if (!THEME_KEYS.includes(s.theme)) {
    s.theme = THEME_MIGRATION[s.theme] || DEFAULT_THEME;
    if (!THEME_KEYS.includes(s.theme)) s.theme = DEFAULT_THEME;
  }
  s.comfort = Math.min(5, Math.max(1, Math.round(s.comfort) || 3));
  if (s.lang !== 'fr' && s.lang !== 'en') s.lang = 'fr';
  s.level = Math.max(1, Math.round(s.level) || 1);
  s.xp = Math.max(0, Math.round(s.xp) || 0);
  s.version = SAVE_VERSION;
  return s;
}

export function loadState(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return normalize(JSON.parse(raw));
    } catch {
      /* sauvegarde corrompue : on repart proprement */
    }
  }
  const legacy = storage.getItem(LEGACY_KEY_V1);
  if (legacy) {
    const migrated = migrateFromV1(legacy);
    if (migrated) return normalize(migrated);
  }
  return defaultState();
}

export function saveState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function wipe(storage) {
  storage.removeItem(STORAGE_KEY);
  storage.removeItem(LEGACY_KEY_V1);
}

/** Export lisible pour la sauvegarde manuelle. */
export function exportState(state) {
  return JSON.stringify(state, null, 2);
}

/** Import depuis une chaîne JSON. Renvoie l'état normalisé ou lève. */
export function importState(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Sauvegarde invalide');
  }
  if (text.length > 2_000_000) {
    throw new Error('Sauvegarde trop volumineuse');
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Sauvegarde invalide');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Sauvegarde invalide');
  }
  const s = normalize(parsed);
  if (!s.skills || typeof s.skills.social !== 'number') {
    throw new Error('Sauvegarde invalide');
  }
  if (typeof s.name !== 'string') s.name = '';
  s.name = s.name.trim().slice(0, 24);
  if (!Array.isArray(s.journal)) s.journal = [];
  if (!Array.isArray(s.inventory)) s.inventory = [];
  if (!Array.isArray(s.titles)) s.titles = [];
  s.journal = s.journal.slice(0, 500);
  s.inventory = s.inventory.slice(0, 200);
  return s;
}
