import { i18n } from '../../i18n/index.js';
import { esc } from '../dom.js';
import { FAMILIES } from '../../data/taxonomy.js';

export function eventCardHtml(event) {
  if (!event || event.status === 'dismissed' || event.status === 'done') return '';
  const fam = event.famille && FAMILIES[event.famille];
  const famBadge = fam
    ? `<span class="event-fam" style="--fam-color:${fam.color}">${fam.icon} ${esc(i18n.loc(fam.label))}</span>`
    : '';
  return `
  <article class="panel event-panel">
    <div class="event-top">
      <span class="event-badge">⚠️ ${i18n.t('event_badge')}</span>
      ${famBadge}
    </div>
    <div class="event-title">${esc(i18n.loc(event.title))}</div>
    <p class="quest-text">${esc(i18n.loc(event.text))}</p>
    <div class="event-reward">+${event.xp} XP · ${esc(i18n.loc(event.item))}</div>
    <div class="quest-actions">
      <button class="btn ghost" data-action="dismiss-event">${i18n.t('event_ignore')}</button>
      <button class="btn primary" data-action="complete-event">${i18n.t('event_accept')}</button>
    </div>
  </article>`;
}
