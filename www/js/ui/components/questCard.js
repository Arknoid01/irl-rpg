import { FAMILIES } from '../../data/taxonomy.js';
import { THEMES, DEFAULT_THEME } from '../../data/themes.js';
import { i18n } from '../../i18n/index.js';
import { esc } from '../dom.js';

export function questCardHtml(quest, themeKey) {
  const fam = FAMILIES[quest.famille] || FAMILIES.quotidien;
  const theme = THEMES[themeKey] || THEMES[DEFAULT_THEME];
  const isMystery = quest.hidden && quest.status === 'proposed';
  const poidsCls = quest.poids && quest.poids !== 'petite' ? ` poids-${quest.poids}` : '';

  const body = isMystery
    ? `<p class="quest-text muted"><em>${i18n.t('q_mystery')}</em></p>`
    : `<p class="quest-text">${esc(i18n.loc(quest.text))}</p>`;

  let fallback = '';
  if (!isMystery && quest.safe_fallback && quest.status === 'accepted') {
    fallback = `<p class="quest-fallback">🛡️ ${esc(i18n.loc(quest.safe_fallback))}</p>`;
  }

  let actions = '';
  if (quest.status === 'proposed') {
    actions = `
      <div class="quest-actions">
        <button class="btn ghost" data-action="ignore-quest" data-id="${quest.id}">${i18n.t('q_ignore')}</button>
        <button class="btn primary" data-action="accept-quest" data-id="${quest.id}">${i18n.t('q_accept')}</button>
      </div>`;
  } else if (quest.status === 'accepted') {
    actions = `
      <div class="quest-actions">
        <button class="btn ghost small" data-action="ignore-quest" data-id="${quest.id}">${i18n.t('q_leave')}</button>
        <button class="btn done" data-action="complete-quest" data-id="${quest.id}">${i18n.t('q_done')}</button>
      </div>`;
  }

  const badge = quest.registre === 'experience'
    ? `<span class="quest-badge">${i18n.t('q_experience')}</span>`
    : '';

  const effortLabel = i18n.t('q_effort_' + quest.effort) || quest.effort;
  const friend = quest.defi_ami
    ? ` · <button class="linkbtn" data-action="share-quest" data-id="${quest.id}">${i18n.t('q_send_friend')}</button>`
    : '';

  return `
  <article class="quest-card${poidsCls}" style="--fam-color:${fam.color}">
    <div class="quest-top">
      <span class="quest-cat">${fam.icon} ${i18n.loc(fam.label)}</span>
      <span class="quest-xp">+${quest.xp} XP <span class="xp-suffix">${esc(i18n.loc(theme.xpSuffix))}</span></span>
    </div>
    ${badge}
    ${body}
    ${fallback}
    <div class="quest-meta">${i18n.t('q_effort')} ${effortLabel}${friend}</div>
    ${actions}
  </article>`;
}
