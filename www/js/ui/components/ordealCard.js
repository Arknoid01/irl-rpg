import { i18n } from '../../i18n/index.js';
import { themeText } from '../themeText.js';
import { esc } from '../dom.js';
import { FAMILIES } from '../../data/taxonomy.js';
import { currentOrdeal } from '../../engine/ordeals.js';

// Épreuve de passage (D21) : au-dessus des quêtes du jour, sans en prendre
// la place. Jamais de délai ni de relance ; « Autre épreuve » à volonté.
export function ordealCardHtml(state) {
  const o = currentOrdeal(state);
  if (!o) return '';
  const fams = o.familles.map((f) => FAMILIES[f]).filter(Boolean).map((fam) => `
      <span class="event-fam" style="--fam-color:${fam.color}">${fam.icon} ${esc(i18n.loc(fam.label))}</span>`).join('');
  return `
  <article class="panel ordeal-panel">
    <div class="event-top">
      <span class="ordeal-badge">⚔ ${themeText('ordealLabel', 'ordeal_badge')}</span>
      ${fams}
    </div>
    <div class="event-title">${esc(i18n.loc(o.title))}</div>
    <p class="quest-text">${esc(i18n.loc(o.text))}</p>
    <p class="quest-fallback">🛡️ ${esc(i18n.loc(o.safe_fallback))}</p>
    <div class="event-reward">${i18n.t('ordeal_reward', { n: state.level + 1 })} · ${esc(i18n.loc(o.item))}</div>
    <p class="tiny muted">${i18n.t('ordeal_why')}</p>
    <div class="quest-actions">
      <button class="btn ghost" data-action="reroll-ordeal">${i18n.t('ordeal_reroll')}</button>
      <button class="btn primary" data-action="complete-ordeal">${i18n.t('ordeal_done')}</button>
    </div>
  </article>`;
}
