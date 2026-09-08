import { i18n } from '../../i18n/index.js';
import { esc, pctBar } from '../dom.js';
import { xpProgress, computeStyle } from '../../engine/progression.js';
import { chapterForLevel } from '../../engine/journal.js';
import { companionLineForState } from '../../engine/companion.js';
import { STYLE_DEFAULT } from '../../data/titles.js';
import {
  traitsHtml, titlesHtml, momentsHtml, discoveriesHtml, pathStatsHtml, inventoryHtml,
} from '../components/charBits.js';

// Page « Mon aventure » (ROADMAP Phase 2.1) — recadrée autour de « qui je
// deviens », pas « quelles stats optimiser ». Réagencement du même contenu :
// identité en tête, traits, chronique en cours, chemin parcouru, puis les
// collections (Moments, Découvertes, Musée).
export function renderCharacter(state) {
  const p = xpProgress(state);
  const lang = state.lang || i18n.lang;
  const style = computeStyle(state) || STYLE_DEFAULT;
  const ch = chapterForLevel(state.level || 1, state.theme);
  const line = companionLineForState(state, lang);

  return `
    <div class="section-label"><span>${i18n.t('my_adventure')}</span></div>

    <section class="panel adventure-head">
      <div class="adv-name">${esc(state.name)}</div>
      <div class="adv-becoming">${i18n.t('level')} ${state.level} · <b>${esc(i18n.loc(style))}</b></div>
      <div class="bar-row">
        <div class="bar-label"><span>${i18n.t('xp')}</span><span>${p.xp} / ${p.need}</span></div>
        ${pctBar(p.pct, 'xp', `${i18n.t('xp')} ${p.xp}/${p.need}`)}
      </div>
      <p class="adv-word">${esc(line)}</p>
    </section>

    <div class="section-label"><span>${i18n.t('traits_title')}</span></div>
    <section class="panel">${traitsHtml(state)}</section>

    ${titlesHtml(state, true) ? `
    <div class="section-label"><span>${i18n.t('titles')}</span></div>
    <section class="panel">${titlesHtml(state, true)}</section>` : ''}

    <div class="section-label"><span>${i18n.t('journal_chronicle')}</span></div>
    <section class="panel chronicle-box">
      <div class="chronicle-mark">${esc(i18n.loc(ch.label))}</div>
      <p class="chronicle-blurb">${esc(i18n.loc(ch.blurb))}</p>
    </section>

    <div class="section-label"><span>${i18n.t('path_title')}</span></div>
    <section class="panel">${pathStatsHtml(state)}</section>

    <div class="section-label"><span>${i18n.t('moments_title')}</span></div>
    <section class="panel">${momentsHtml(state)}</section>

    <div class="section-label"><span>${i18n.t('discoveries_title')}</span></div>
    <section class="panel">${discoveriesHtml(state)}</section>

    <div class="section-label"><span>${i18n.t('museum')}</span></div>
    ${inventoryHtml(state)}
  `;
}
