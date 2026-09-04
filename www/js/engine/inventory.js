// Musée : normalisation + vues dérivées (purement décoratif).

import { LOOT_KINDS, LOOT_KIND_KEYS, MILESTONE_LOOT, EVENT_LOOT_META } from '../data/loot.js';
import { loc } from '../i18n/index.js';

function textOf(v) {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return `${v.fr || ''} ${v.en || ''}`;
}

/** Déduit une catégorie depuis le libellé (sauvegardes anciennes). */
export function inferKind(entry) {
  if (entry.kind && LOOT_KINDS[entry.kind]) return entry.kind;
  const s = textOf(entry.item).toLowerCase();
  if (/🗺|🗺️|fragment|carte|map|compass|boussole|lentille|lens/.test(s)) return 'fragment';
  if (/📜|licence|sceau|seal|braise|ember|couronne|crown|clé de|key to|médaille|medal/.test(s)) return 'relic';
  if (/🏆|🏅|🏰|🏔|collect|jalon|milestone|crête|ridge|château|castle/.test(s)) return 'collectible';
  if (/📸|souvenir|memento|moment|note|photo|croquis|sketch/.test(s)) return 'souvenir';
  return 'objet';
}

export function normalizeLootEntry(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw.item;
  if (!item) return null;
  const entry = {
    item: typeof item === 'string' ? { fr: item, en: item } : item,
    date: raw.date || '',
    from: raw.from || null,
    kind: inferKind(raw),
    lore: raw.lore && typeof raw.lore === 'object' ? raw.lore : null,
    source: raw.source || (raw.from ? 'event' : 'unknown'),
    famille: raw.famille || null,
    id: raw.id || null,
  };
  return entry;
}

export function normalizeInventory(list) {
  return (list || []).map(normalizeLootEntry).filter(Boolean);
}

/** Icône affichée : emoji en tête du libellé, sinon icône de catégorie. */
export function lootGlyph(entry, lang = 'fr') {
  const label = loc(entry.item, lang) || '';
  const m = label.match(/^(\p{Extended_Pictographic}|\p{Emoji_Presentation})\uFE0F?/u);
  if (m) return m[0];
  const kind = LOOT_KINDS[entry.kind] || LOOT_KINDS.objet;
  return kind.icon;
}

export function lootTitle(entry, lang = 'fr') {
  const label = loc(entry.item, lang) || '';
  return label.replace(/^(\p{Extended_Pictographic}|\p{Emoji_Presentation})\uFE0F?\s*/u, '').trim() || label;
}

/**
 * Vue musée pour l’UI.
 * @param {string|null} filterKind
 */
export function buildMuseumView(state, filterKind = null) {
  const items = normalizeInventory(state.inventory).slice().reverse();
  const counts = Object.fromEntries(LOOT_KIND_KEYS.map((k) => [k, 0]));
  for (const it of items) counts[it.kind] = (counts[it.kind] || 0) + 1;

  const filtered = filterKind && LOOT_KINDS[filterKind]
    ? items.filter((it) => it.kind === filterKind)
    : items;

  const shelves = LOOT_KIND_KEYS
    .map((k) => ({
      kind: k,
      meta: LOOT_KINDS[k],
      items: items.filter((it) => it.kind === k),
    }))
    .filter((s) => s.items.length > 0);

  return {
    total: items.length,
    counts,
    filtered,
    shelves,
    kinds: LOOT_KIND_KEYS,
  };
}

export function milestoneLootForLevel(level) {
  const m = MILESTONE_LOOT[level];
  if (!m) return null;
  return {
    ...m,
    source: 'milestone',
    id: `ms_lv_${level}`,
  };
}

/** Enrichit le butin d’un événement. */
export function lootFromEvent(ev, today) {
  const meta = EVENT_LOOT_META[ev.id] || {};
  return {
    item: ev.item,
    date: today,
    from: ev.title,
    kind: ev.itemKind || meta.kind || inferKind({ item: ev.item }),
    lore: ev.itemLore || meta.lore || null,
    source: 'event',
    famille: ev.famille || null,
    id: `ev_${ev.id}_${today}`,
  };
}

/** Souvenir issu d’une quête mystérieuse. */
export function lootFromHiddenQuest(quest, today) {
  return {
    item: {
      fr: `📖 Chapitre glané`,
      en: `📖 Gleaned chapter`,
    },
    date: today,
    from: quest.text,
    kind: 'souvenir',
    lore: quest.fragment || null,
    source: 'quest',
    famille: quest.famille || null,
    id: `q_${quest.templateId || quest.id}_${today}`,
  };
}

/** Ajoute un objet au musée sans doublon d’id stable (jalons). */
export function addLoot(s, entry) {
  if (!entry) return false;
  if (entry.id && (s.inventory || []).some((x) => x.id === entry.id)) return false;
  if (!s.inventory) s.inventory = [];
  s.inventory.push(entry);
  s.inventory = s.inventory.slice(-200);
  return true;
}
