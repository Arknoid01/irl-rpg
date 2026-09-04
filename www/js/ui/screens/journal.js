import { i18n } from '../../i18n/index.js';
import { daysBetween, todayStr } from '../../engine/dates.js';
import { esc } from '../dom.js';

const KIND_ICON = { fragment: '📖', moment: '✨', evenement: '⚔️', note: '•' };

function relDate(dateStr, today) {
  if (!dateStr) return '';
  const d = daysBetween(dateStr, today);
  if (d <= 0) return i18n.t('journal_today');
  if (d === 1) return i18n.t('journal_yesterday');
  return i18n.t('journal_days_ago', { n: d });
}

export function renderJournal(state) {
  const today = todayStr();
  if (!state.journal.length) {
    return `<div class="section-label"><span>${i18n.t('journal_title')}</span></div>
      <div class="panel empty"><p class="muted">${i18n.t('journal_empty')}</p></div>`;
  }
  const entries = state.journal.slice().reverse().map((e) => `
    <div class="journal-entry kind-${e.kind}">
      <span class="journal-date">${KIND_ICON[e.kind] || '•'} ${relDate(e.date, today)}</span>
      <p>${esc(i18n.loc(e.text))}</p>
    </div>`).join('');
  return `<div class="section-label"><span>${i18n.t('journal_title')}</span></div>${entries}`;
}
