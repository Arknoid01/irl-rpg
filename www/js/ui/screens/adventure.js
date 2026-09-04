import { companionLineFor } from '../../data/themes.js';
import { i18n } from '../../i18n/index.js';
import { esc } from '../dom.js';
import { heroCardHtml } from '../components/charBits.js';
import { questCardHtml } from '../components/questCard.js';
import { eventCardHtml } from '../components/eventCard.js';
import { elanDuJour } from '../../engine/progression.js';

export function renderAdventure(state) {
  const line = companionLineFor(state.theme, state.lang, state.seeds.companion || 0);

  const active = state.quests.filter((q) => q.status === 'proposed' || q.status === 'accepted');
  const done = state.quests.filter((q) => q.status === 'done');
  const ignored = state.quests.filter((q) => q.status === 'ignored');
  const elan = elanDuJour(state);

  let questsBlock;
  if (state.quests.length === 0) {
    questsBlock = `<div class="panel empty">
      <p><b>${i18n.t('no_quests_title')}</b></p>
      <p class="muted">${i18n.t('no_quests_body')}</p>
      <button class="btn primary" data-action="new-day">${i18n.t('start_day')}</button>
    </div>`;
  } else if (active.length === 0 && done.length === 0) {
    questsBlock = `<div class="panel empty">
      <p><b>${i18n.t('all_done_title')}</b></p>
      <p class="muted">${i18n.t('all_done_body')}</p>
    </div>`;
  } else {
    const listed = [...active, ...done];
    questsBlock = listed.map((q) => questCardHtml(q, state.theme)).join('');
    if (active.length === 0 && done.length > 0) {
      questsBlock += `<div class="panel empty" style="margin-top:8px">
        <p><b>${i18n.t('all_done_title')}</b></p>
        <p class="muted">${i18n.t('all_done_body')}</p>
      </div>`;
    }
  }

  const chest = state.quests.length > 0
    ? (() => {
      const denom = Math.max(1, state.quests.length - ignored.length);
      return `<div class="elan-chest" title="${i18n.t('elan_hint')}">
        <span class="chest-ic" aria-hidden="true">🗃</span>
        <div style="flex:1">
          <div class="bar-label"><span>${i18n.t('elan_jour')}</span><span>${done.length}/${denom}</span></div>
          <div class="bar-track"><div class="bar-fill elan" style="width:${elan}%"></div></div>
        </div>
      </div>`;
    })()
    : '';

  return `
    <p class="companion-line">${esc(line)}</p>
    ${heroCardHtml(state)}
    <div class="section-label">
      <span>${i18n.t('quests_today')}</span>
      <button class="refresh-btn" data-action="new-day" title="${i18n.t('new_day_hint')}">↻ ${i18n.t('new_day')}</button>
    </div>
    ${chest}
    ${questsBlock}
    ${eventCardHtml(state.event)}
  `;
}
