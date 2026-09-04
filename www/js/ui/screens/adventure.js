import { companionLineFor } from '../../data/themes.js';
import { i18n } from '../../i18n/index.js';
import { esc } from '../dom.js';
import { heroCardHtml } from '../components/charBits.js';
import { questCardHtml } from '../components/questCard.js';
import { eventCardHtml } from '../components/eventCard.js';

export function renderAdventure(state) {
  const line = companionLineFor(state.theme, state.lang, state.seeds.companion || 0);

  const active = state.quests.filter((q) => q.status === 'proposed' || q.status === 'accepted');
  const doneCount = state.quests.filter((q) => q.status === 'done').length;

  let questsBlock;
  if (state.quests.length === 0) {
    questsBlock = `<div class="panel empty">
      <p><b>${i18n.t('no_quests_title')}</b></p>
      <p class="muted">${i18n.t('no_quests_body')}</p>
      <button class="btn primary" data-action="new-day">${i18n.t('start_day')}</button>
    </div>`;
  } else if (active.length === 0) {
    questsBlock = `<div class="panel empty">
      <p><b>${i18n.t('all_done_title')}</b></p>
      <p class="muted">${i18n.t('all_done_body')}</p>
    </div>`;
  } else {
    questsBlock = active.map((q) => questCardHtml(q, state.theme)).join('');
  }

  const doneLine = doneCount > 0 && active.length > 0
    ? `<p class="tiny muted done-line">${i18n.t('done_count', { n: doneCount })}</p>`
    : '';

  return `
    <p class="companion-line">${esc(line)}</p>
    ${heroCardHtml(state)}
    <div class="section-label">
      <span>${i18n.t('quests_today')}</span>
      <button class="refresh-btn" data-action="new-day" title="${i18n.t('new_day_hint')}">↻ ${i18n.t('new_day')}</button>
    </div>
    ${questsBlock}
    ${doneLine}
    ${eventCardHtml(state.event)}
  `;
}
