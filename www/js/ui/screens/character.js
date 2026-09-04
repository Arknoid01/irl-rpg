import { i18n } from '../../i18n/index.js';
import { esc, pctBar } from '../dom.js';
import { xpProgress } from '../../engine/progression.js';
import {
  skillsGridHtml, titlesHtml, styleHtml, inventoryHtml, statsHtml,
} from '../components/charBits.js';

export function renderCharacter(state) {
  const p = xpProgress(state);
  return `
    <section class="panel">
      <div class="hero-head">
        <div class="hero-name big">${esc(state.name)}</div>
        <div class="hero-level">${i18n.t('level')} <b>${state.level}</b></div>
      </div>
      <div class="bar-row">
        <div class="bar-label"><span>${i18n.t('xp')}</span><span>${p.xp} / ${p.need}</span></div>
        ${pctBar(p.pct, 'xp')}
      </div>
      ${styleHtml(state)}
    </section>

    <div class="section-label"><span>${i18n.t('skills')}</span></div>
    <section class="panel">${skillsGridHtml(state)}</section>

    <div class="section-label"><span>${i18n.t('titles')}</span></div>
    <section class="panel">${titlesHtml(state)}</section>

    <div class="section-label"><span>${i18n.t('inventory')}</span></div>
    <section class="panel">${inventoryHtml(state)}</section>

    <div class="section-label"><span>${i18n.t('stats')}</span></div>
    <section class="panel">${statsHtml(state)}</section>
  `;
}
