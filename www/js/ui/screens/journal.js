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

export function renderJournal(state) {
  const today = todayStr();
  const timeline = buildJournalTimeline(state);
  const ch = timeline.chapter;

  const header = `
    <div class="section-label"><span>${i18n.t('journal_title')}</span></div>
    <header class="journal-chapter panel">
      <div class="journal-chapter-mark">${esc(i18n.loc(ch.label))}</div>
      <p class="journal-chapter-blurb">${esc(i18n.loc(ch.blurb))}</p>
    </header>`;

  if (timeline.empty) {
    return `${header}
      <div class="panel empty"><p class="muted">${i18n.t('journal_empty')}</p></div>`;
  }

  const body = timeline.sections.map((sec) => {
    const title = i18n.t(SECTION_KEYS[sec.id] || 'journal_older');
    const entries = sec.entries.map((e) => `
      <article class="journal-entry kind-${e.kind || 'note'}">
        <span class="journal-date">${KIND_ICON[e.kind] || '•'} ${relDate(e.date, today)}</span>
        <p>${esc(i18n.loc(e.text))}</p>
      </article>`).join('');
    return `
      <div class="journal-section">
        <h3 class="journal-section-title">${esc(title)}</h3>
        <div class="journal-timeline">${entries}</div>
      </div>`;
  }).join('');

  return `${header}${body}`;
}
