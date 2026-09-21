// Rétrospective du mois + export du journal (Cairn Complet, D19).
// Pur : lit l'état, ne le mute pas. Les mois d'avant l'existence du suivi
// (`history.months`) n'ont pas de chiffres — on ne les invente pas.

import { loc } from '../i18n/index.js';
import { FAMILIES } from '../data/taxonomy.js';
import { FELT_KINDS } from './journal.js';

const HIGHLIGHTS_MAX = 3;
const TOP_FAMILIES_MAX = 3;

export function monthKeyOf(date) {
  const d = date instanceof Date ? date : new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Mois consultables, du plus récent au plus ancien (le mois courant toujours présent). */
export function retroMonths(state, now = new Date()) {
  const keys = new Set(Object.keys(state.history.months || {}));
  keys.add(monthKeyOf(now));
  return [...keys].sort().reverse();
}

export function monthLabel(key, lang) {
  const [y, m] = key.split('-').map(Number);
  const label = new Date(y, m - 1, 1)
    .toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Bilan d'un mois : chiffres + jusqu'à 3 souvenirs (gardés d'abord). */
export function buildRetrospective(state, key) {
  const m = (state.history.months || {})[key] || null;
  const inMonth = (state.journal || []).filter((e) => e.date && e.date.startsWith(key) && FELT_KINDS.has(e.kind));
  const highlights = [...inMonth.filter((e) => e.pinned), ...inMonth.filter((e) => !e.pinned).reverse()]
    .slice(0, HIGHLIGHTS_MAX);
  const top = Object.entries((m && m.fam) || {})
    .sort((a, b) => b[1] - a[1]).slice(0, TOP_FAMILIES_MAX)
    .map(([famille, n]) => ({ famille, n }));
  return {
    key,
    empty: !m || m.done === 0,
    done: m ? m.done : 0,
    xp: m ? m.xp : 0,
    activeDays: m ? m.activeDays : 0,
    bestStreak: m ? m.bestStreak : 0,
    top,
    highlights,
  };
}

const T = {
  fr: {
    head: (l) => `Cairn — ${l}`,
    line: (r) => `${r.done} quête${r.done > 1 ? 's' : ''} · ${r.xp} XP · ${r.activeDays} jour${r.activeDays > 1 ? 's' : ''} actif${r.activeDays > 1 ? 's' : ''} · série max ${r.bestStreak}`,
    memories: 'Souvenirs :',
    journalTitle: 'Mon journal Cairn',
  },
  en: {
    head: (l) => `Cairn — ${l}`,
    line: (r) => `${r.done} quest${r.done > 1 ? 's' : ''} · ${r.xp} XP · ${r.activeDays} active day${r.activeDays > 1 ? 's' : ''} · best streak ${r.bestStreak}`,
    memories: 'Memories:',
    journalTitle: 'My Cairn journal',
  },
};

/** Texte partageable d'une rétrospective. */
export function retrospectiveText(state, key, lang = 'fr') {
  const t = T[lang] || T.fr;
  const r = buildRetrospective(state, key);
  const out = [t.head(monthLabel(key, lang)), t.line(r)];
  if (r.top.length) {
    out.push(r.top.map((x) => `${FAMILIES[x.famille].icon} ${loc(FAMILIES[x.famille].label, lang)} ×${x.n}`).join('  '));
  }
  if (r.highlights.length) {
    out.push('', t.memories, ...r.highlights.map((e) => `• ${loc(e.title, lang) ? `${loc(e.title, lang)} — ` : ''}${loc(e.text, lang)}`));
  }
  return out.join('\n');
}

/** Journal complet en Markdown, du plus ancien au plus récent, groupé par mois. */
export function journalMarkdown(state, lang = 'fr') {
  const t = T[lang] || T.fr;
  const entries = (state.journal || []).filter((e) => e.date);
  const out = [`# ${t.journalTitle}${state.name ? ` — ${state.name}` : ''}`];
  let month = '';
  for (const e of entries) {
    const key = e.date.slice(0, 7);
    if (key !== month) { month = key; out.push('', `## ${monthLabel(key, lang)}`, ''); }
    const title = loc(e.title, lang);
    const text = loc(e.text, lang).replace(/\n/g, ' ');
    out.push(`- **${e.date}** ${e.pinned ? '★ ' : ''}${title ? `*${title}* — ` : ''}${text}`);
  }
  return `${out.join('\n')}\n`;
}
