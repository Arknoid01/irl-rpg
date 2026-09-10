import { i18n } from '../../i18n/index.js';
import { daysBetween, todayStr } from '../../engine/dates.js';
import { buildJournalTimeline } from '../../engine/journal.js';
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

// Ligne de contexte d'une entrée : « JOUR 5 · il y a 3 jours ».
function metaHtml(e, today) {
  const icon = KIND_ICON[e.kind] || '•';
  // Les entrées « du jour » portent déjà « Jour N » dans leur texte.
  const day = (e.day && e.kind !== 'jour')
    ? `<span class="journal-day">${esc(i18n.t('day_kicker', { n: e.day }))}</span> · `
    : '';
  return `<span class="journal-date"><span aria-hidden="true">${icon}</span> ${day}${relDate(e.date, today)}</span>`;
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
    <article class="journal-entry journal-memory kind-${e.kind || 'note'}">
      ${metaHtml(e, today)}
      <h4 class="journal-entry-title">${esc(i18n.loc(e.title))}</h4>
      <p class="journal-entry-body">${body}</p>
      ${souvenir}
      ${coda}
    </article>`;
}

function entryHtml(e, today) {
  if (e.title) return memoryEntryHtml(e, today);
  return `
    <article class="journal-entry kind-${e.kind || 'note'}">
      ${metaHtml(e, today)}
      <p>${esc(i18n.loc(e.text)).replace(/\n/g, '<br>')}</p>
    </article>`;
}

export function renderJournal(state) {
  const today = todayStr();
  const timeline = buildJournalTimeline(state);
  const ch = timeline.chapter;

  const header = `
    <div class="section-label"><span>${i18n.t('journal_title')}</span></div>
    <header class="journal-chapter panel">
      <div class="journal-chapter-mark">${esc(i18n.loc(ch.label))}</div>
      <p class="journal-chapter-blurb">${esc(i18n.loc(ch.blurb))}</p>
      ${ch.lean ? `<p class="journal-chapter-lean">${esc(i18n.loc(ch.lean))}</p>` : ''}
    </header>`;

  if (timeline.empty) {
    return `${header}
      <div class="panel empty"><p class="muted">${i18n.t('journal_empty')}</p></div>`;
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

  return `${header}${body}`;
}
