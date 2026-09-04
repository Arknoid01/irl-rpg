import { SKILLS, SKILL_KEYS } from '../../data/taxonomy.js';
import { TITLES, STYLE_DEFAULT } from '../../data/titles.js';
import { xpProgress, elanDuJour, computeStyle } from '../../engine/progression.js';
import { i18n } from '../../i18n/index.js';
import { esc, pctBar } from '../dom.js';

const SKILL_TITLE_MAX = 400; // borne d'affichage de la barre de compétence

export function heroCardHtml(state) {
  const p = xpProgress(state);
  const elan = elanDuJour(state);
  return `
  <section class="panel hero-card">
    <div class="hero-head">
      <div class="hero-name">${esc(state.name)}</div>
      <div class="hero-level">${i18n.t('level')} <b>${state.level}</b></div>
    </div>
    <div class="bar-row">
      <div class="bar-label"><span>${i18n.t('xp')}</span><span>${p.xp} / ${p.need}</span></div>
      ${pctBar(p.pct, 'xp')}
    </div>
    <div class="bar-row">
      <div class="bar-label"><span>${i18n.t('elan_jour')}</span><span>${elan}%</span></div>
      ${pctBar(elan, 'elan')}
      <p class="tiny muted">${i18n.t('elan_hint')}</p>
    </div>
    <div class="streak-row">🔥 ${i18n.t('streak')} : <b>${i18n.t('streak_days', { n: state.streak })}</b></div>
    ${titlesHtml(state, true)}
    <button class="btn ghost full" data-action="goto" data-id="character">${i18n.t('see_character')}</button>
  </section>`;
}

export function skillsGridHtml(state) {
  const rows = SKILL_KEYS.map((k) => {
    const v = state.skills[k] || 0;
    const pct = Math.min(100, (v / SKILL_TITLE_MAX) * 100);
    return `
    <div class="skill-item">
      <div class="skill-top"><span>${SKILLS[k].icon} ${i18n.loc(SKILLS[k].label)}</span><span>${v}</span></div>
      <div class="skill-bar"><i style="width:${pct}%"></i></div>
    </div>`;
  }).join('');
  return `<div class="skills-grid">${rows}</div>`;
}

export function titlesHtml(state, compact = false) {
  const unlocked = TITLES.filter((t) => state.titles.includes(t.id));
  if (!unlocked.length) {
    return compact ? '' : `<p class="muted tiny">${i18n.t('no_titles')}</p>`;
  }
  const chips = unlocked.map((t) => `<span class="title-chip">${i18n.loc(t.label)}</span>`).join('');
  return `<div class="titles-row">${chips}</div>`;
}

export function styleHtml(state) {
  const style = computeStyle(state) || STYLE_DEFAULT;
  return `<div class="style-box"><span class="tiny muted">${i18n.t('style')}</span><div class="style-name">${i18n.loc(style)}</div></div>`;
}

export function inventoryHtml(state) {
  if (!state.inventory.length) return `<p class="muted tiny">${i18n.t('no_inventory')}</p>`;
  return `<div class="inv-grid">${state.inventory.slice().reverse().map((it) => `
    <div class="inv-item"><div class="inv-icon">${esc(i18n.loc(it.item))}</div><div class="tiny muted">${it.date}</div></div>`).join('')}</div>`;
}

export function statsHtml(state) {
  const h = state.history;
  return `<div class="stats-grid">
    <div><b>${h.totalCompleted}</b><span>${i18n.t('stat_quests')}</span></div>
    <div><b>${h.daysPlayed}</b><span>${i18n.t('stat_days')}</span></div>
    <div><b>${h.bestStreak || state.streak}</b><span>${i18n.t('stat_best_streak')}</span></div>
  </div>`;
}
