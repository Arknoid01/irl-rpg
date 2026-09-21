import { i18n } from '../../i18n/index.js';
import { daysBetween, todayStr } from '../../engine/dates.js';
import { buildJournalTimeline } from '../../engine/journal.js';
import { FAMILIES } from '../../data/taxonomy.js';
import { buildRetrospective, retroMonths, monthLabel } from '../../engine/retrospective.js';
import { esc } from '../dom.js';

const KIND_ICON = {
  fragment: '📖',
  moment: '✨',
  evenement: '⚔',
  chapitre: '⚜',
  decouverte: '🗺',
  jour: '📔',
  indice: '🧵',
  revelation: '🗝',
  note: '•',
};

// Filtre local, non persisté (comme la sélection de région sur la carte).
let filter = 'all';
export function setJournalFilter(id) {
  filter = ['pinned', 'felt'].includes(id) ? id : 'all';
}

// Mois affiché dans la rétrospective : local, non persisté (comme le filtre).
let retroKey = null;
export function setRetroMonth(key) { retroKey = /^\d{4}-\d{2}$/.test(key || '') ? key : null; }
export function currentRetroMonth(state) {
  const months = retroMonths(state);
  return retroKey && months.includes(retroKey) ? retroKey : months[0];
}

// Cairn Complet (D19) : bilan du mois + export. Verrouillé => vitrine.
function retroHtml(state) {
  if (!state.complete) {
    return `<section class="panel retro locked">
      <p class="retro-kicker">✨ ${i18n.t('retro_kicker')}</p>
      <p class="tiny muted">${i18n.t('retro_locked_desc')}</p>
      <button class="btn ghost small" data-action="open-settings" data-tab="themes">${i18n.t('retro_see')}</button>
    </section>`;
  }
  const months = retroMonths(state);
  const key = currentRetroMonth(state);
  const r = buildRetrospective(state, key);
  const lang = i18n.lang;
  const chips = months.slice(0, 6).map((k) => `<button class="journal-filter${k === key ? ' active' : ''}"
    data-action="retro-month" data-id="${k}">${esc(monthLabel(k, lang))}</button>`).join('');
  const body = r.empty ? `<p class="tiny muted">${i18n.t('retro_empty')}</p>` : `
    <div class="retro-stats">
      <div><b>${r.done}</b><span>${i18n.t('retro_quests')}</span></div>
      <div><b>${r.xp}</b><span>XP</span></div>
      <div><b>${r.activeDays}</b><span>${i18n.t('retro_days')}</span></div>
      <div><b>${r.bestStreak}</b><span>${i18n.t('retro_streak')}</span></div>
    </div>
    ${r.top.length ? `<p class="retro-h">${i18n.t('retro_top')}</p>
      <p class="retro-top">${r.top.map((x) => `${FAMILIES[x.famille].icon} ${esc(i18n.loc(FAMILIES[x.famille].label))} <span class="muted">×${x.n}</span>`).join(' &nbsp; ')}</p>` : ''}
    ${r.highlights.length ? `<p class="retro-h">${i18n.t('retro_memories')}</p>
      <ul class="retro-memories">${r.highlights.map((e) => `<li>${e.title ? `<b>${esc(i18n.loc(e.title))}</b> — ` : ''}${esc(i18n.loc(e.text))}</li>`).join('')}</ul>` : ''}`;
  const note = months.length === 1 ? `<p class="tiny muted">${i18n.t('retro_note')}</p>` : '';
  return `<section class="panel retro">
    <p class="retro-kicker">✨ ${i18n.t('retro_kicker')}</p>
    <div class="journal-filters">${chips}</div>
    ${body}${note}
    <div class="set-actions">
      <button class="btn ghost small" data-action="share-retro"${r.empty ? ' disabled' : ''}>${i18n.t('retro_share')}</button>
      <button class="btn ghost small" data-action="export-journal">${i18n.t('retro_export')}</button>
    </div>
  </section>`;
}

function relDate(dateStr, today) {
  if (!dateStr) return '';
  const d = daysBetween(dateStr, today);
  if (d <= 0) return i18n.t('journal_today');
  if (d === 1) return i18n.t('journal_yesterday');
  return i18n.t('journal_days_ago', { n: d });
}

const SECTION_KEYS = {
  today: 'journal_today',
  yesterday: 'journal_yesterday',
  week: 'journal_this_week',
  older: 'journal_older',
};

function metaHtml(e, today) {
  const icon = KIND_ICON[e.kind] || '•';
  // Les entrées « du jour » portent déjà « Jour N » dans leur texte.
  const day = (e.day && e.kind !== 'jour')
    ? `<span class="journal-day">${esc(i18n.t('day_kicker', { n: e.day }))}</span> · `
    : '';
  return `<span class="journal-date"><span aria-hidden="true">${icon}</span> ${day}${relDate(e.date, today)}</span>`;
}

function pinBtnHtml(e) {
  if (!e.id) return '';
  const on = !!e.pinned;
  return `<button class="journal-pin${on ? ' on' : ''}" data-action="pin-memory" data-id="${esc(e.id)}"
    aria-pressed="${on}" aria-label="${i18n.t(on ? 'journal_unpin' : 'journal_pin')}"
    title="${i18n.t(on ? 'journal_unpin' : 'journal_pin')}">${on ? '★' : '☆'}</button>`;
}

// Entrée « souvenir » (événement) : titre + récit + objet gagné + parfois un
// mot du compagnon. Bascule sur le rendu simple si l'entrée n'a pas de titre.
function memoryEntryHtml(e, today) {
  const body = esc(i18n.loc(e.text)).replace(/\n/g, '<br>');
  const souvenir = e.souvenir ? `
    <div class="journal-souvenir">
      <span class="journal-souvenir-label">${i18n.t('journal_souvenir_added')}</span>
      <span class="journal-souvenir-item">${esc(i18n.loc(e.souvenir))}</span>
    </div>` : '';
  const coda = e.coda ? `<p class="journal-coda">${esc(i18n.loc(e.coda))}</p>` : '';
  return `
    <article class="journal-entry journal-memory kind-${e.kind || 'note'}${e.pinned ? ' pinned' : ''}">
      ${pinBtnHtml(e)}
      ${metaHtml(e, today)}
      <h4 class="journal-entry-title">${esc(i18n.loc(e.title))}</h4>
      <p class="journal-entry-body">${body}</p>
      ${souvenir}
      ${coda}
    </article>`;
}

// Jalon narratif (chapitre de la chronique, montée de niveau, révélation d'arc)
// — une entrée à part entière : sceau, texte centré en police d'affichage.
const MILESTONE_KINDS = new Set(['chapitre', 'revelation']);
function milestoneEntryHtml(e, today) {
  const seal = e.kind === 'revelation' ? '🗝' : '⚜';
  return `
    <article class="journal-entry journal-milestone kind-${e.kind}${e.pinned ? ' pinned' : ''}">
      ${pinBtnHtml(e)}
      <div class="journal-milestone-seal" aria-hidden="true">${seal}</div>
      ${metaHtml(e, today)}
      <p class="journal-milestone-text">${esc(i18n.loc(e.text)).replace(/\n/g, '<br>')}</p>
    </article>`;
}

function entryHtml(e, today) {
  if (MILESTONE_KINDS.has(e.kind)) return milestoneEntryHtml(e, today);
  if (e.title) return memoryEntryHtml(e, today);
  return `
    <article class="journal-entry kind-${e.kind || 'note'}${e.pinned ? ' pinned' : ''}">
      ${pinBtnHtml(e)}
      ${metaHtml(e, today)}
      <p>${esc(i18n.loc(e.text)).replace(/\n/g, '<br>')}</p>
    </article>`;
}

const FILTERS = [
  { id: 'all', key: 'journal_filter_all' },
  { id: 'felt', key: 'journal_filter_felt' },
  { id: 'pinned', key: 'journal_filter_pinned' },
];

function filtersHtml(counts, active) {
  return `<div class="journal-filters">${FILTERS.map((f) => {
    const n = counts[f.id];
    const disabled = f.id === 'pinned' && !n;
    return `<button class="journal-filter${active === f.id ? ' active' : ''}"
      data-action="journal-filter" data-id="${f.id}"${disabled ? ' disabled' : ''}>
      ${i18n.t(f.key)}${n ? ` <span class="journal-filter-n">${n}</span>` : ''}</button>`;
  }).join('')}</div>`;
}

export function renderJournal(state) {
  const today = todayStr();
  const timeline = buildJournalTimeline(state, new Date(), { filter });
  const ch = timeline.chapter;

  const header = `
    <div class="section-label"><span>${i18n.t('journal_title')}</span></div>
    <header class="journal-chapter panel">
      <div class="journal-chapter-mark">${esc(i18n.loc(ch.label))}</div>
      <p class="journal-chapter-blurb">${esc(i18n.loc(ch.blurb))}</p>
      ${ch.lean ? `<p class="journal-chapter-lean">${esc(i18n.loc(ch.lean))}</p>` : ''}
    </header>`;

  if (timeline.empty) {
    return `${header}${retroHtml(state)}
      <div class="panel empty"><p class="muted">${i18n.t('journal_empty')}</p></div>`;
  }

  const filters = retroHtml(state) + filtersHtml(timeline.counts, timeline.filter);

  const pinnedSection = timeline.pinned.length ? `
    <div class="journal-section journal-kept">
      <h3 class="journal-section-title">★ ${i18n.t('journal_pinned_section')}</h3>
      <div class="journal-timeline">${timeline.pinned.map((e) => entryHtml(e, today)).join('')}</div>
    </div>` : '';

  if (timeline.noMatch) {
    return `${header}${filters}
      <div class="panel empty"><p class="muted">${i18n.t('journal_no_match')}</p></div>`;
  }

  const body = timeline.sections.map((sec) => {
    const title = i18n.t(SECTION_KEYS[sec.id] || 'journal_older');
    const entries = sec.entries.map((e) => entryHtml(e, today)).join('');
    return `
      <div class="journal-section">
        <h3 class="journal-section-title">${esc(title)}</h3>
        <div class="journal-timeline">${entries}</div>
      </div>`;
  }).join('');

  return `${header}${filters}${pinnedSection}${body}`;
}
