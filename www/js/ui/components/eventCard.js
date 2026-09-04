import { i18n } from '../../i18n/index.js';
import { esc } from '../dom.js';

export function eventCardHtml(event) {
  if (!event || event.status === 'dismissed' || event.status === 'done') return '';
  return `
  <article class="panel event-panel">
    <span class="event-badge">⚠️ ${i18n.t('event_badge')}</span>
    <div class="event-title">${esc(i18n.loc(event.title))}</div>
    <p class="quest-text">${esc(i18n.loc(event.text))}</p>
    <div class="event-reward">+${event.xp} XP · ${esc(i18n.loc(event.item))}</div>
    <div class="quest-actions">
      <button class="btn ghost" data-action="dismiss-event">${i18n.t('event_ignore')}</button>
      <button class="btn primary" data-action="complete-event">${i18n.t('event_accept')}</button>
    </div>
  </article>`;
}
