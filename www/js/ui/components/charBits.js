import { SKILLS, SKILL_KEYS } from '../../data/taxonomy.js';
import { TITLES, STYLE_DEFAULT, TITLE_TIER2 } from '../../data/titles.js';
import { xpProgress, elanDuJour, computeStyle } from '../../engine/progression.js';
import { buildMuseumView, lootGlyph, lootTitle } from '../../engine/inventory.js';
import { LOOT_KINDS } from '../../data/loot.js';
import { i18n } from '../../i18n/index.js';
import { esc, pctBar } from '../dom.js';

const SKILL_TITLE_MAX = TITLE_TIER2;

/** Filtre / sélection locale du musée (non persistés). */
let museumFilter = null;
let museumSelected = null;

export function setMuseumFilter(kind) {
  museumFilter = kind && LOOT_KINDS[kind] ? kind : null;
  museumSelected = null;
}

export function selectMuseumItem(id) {
  museumSelected = id || null;
}

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

function itemKey(it, idx) {
  return it.id || `idx_${idx}_${it.date || ''}_${lootTitle(it, 'en')}`;
}

export function inventoryHtml(state) {
  const view = buildMuseumView(state, museumFilter);
  if (!view.total) {
    return `<section class="panel museum-empty">
      <div class="inv-empty-icon" aria-hidden="true">🏛</div>
      <p class="muted">${i18n.t('no_inventory')}</p>
      <p class="tiny muted">${i18n.t('museum_hint')}</p>
    </section>`;
  }

  const filters = `
    <div class="museum-filters" role="tablist">
      <button type="button" class="museum-filter${museumFilter == null ? ' active' : ''}"
        data-action="museum-filter" data-id="">${i18n.t('museum_all')} · ${view.total}</button>
      ${view.kinds.map((k) => {
        const n = view.counts[k] || 0;
        if (!n) return '';
        const meta = LOOT_KINDS[k];
        return `<button type="button" class="museum-filter${museumFilter === k ? ' active' : ''}"
          data-action="museum-filter" data-id="${k}">${meta.icon} ${esc(i18n.loc(meta.label))} · ${n}</button>`;
      }).join('')}
    </div>`;

  const list = view.filtered;
  const selected = list.find((it, idx) => itemKey(it, idx) === museumSelected)
    || list[0];
  const selKey = selected ? itemKey(selected, list.indexOf(selected)) : null;
  if (selected && museumSelected !== selKey) museumSelected = selKey;

  const cards = list.map((it, idx) => {
    const key = itemKey(it, idx);
    const kind = LOOT_KINDS[it.kind] || LOOT_KINDS.objet;
    const active = key === museumSelected ? ' selected' : '';
    return `
    <button type="button" class="inv-item museum-card${active}" data-action="select-loot" data-id="${esc(key)}">
      <span class="inv-glyph" aria-hidden="true">${lootGlyph(it, state.lang)}</span>
      <span class="inv-icon">${esc(lootTitle(it, state.lang))}</span>
      <span class="inv-kind tiny muted">${kind.icon} ${esc(i18n.loc(kind.label))}</span>
    </button>`;
  }).join('');

  let detail = '';
  if (selected) {
    const kind = LOOT_KINDS[selected.kind] || LOOT_KINDS.objet;
    const from = selected.from ? i18n.loc(selected.from) : '';
    const lore = selected.lore ? i18n.loc(selected.lore) : i18n.t('museum_no_lore');
    detail = `
    <article class="panel museum-detail">
      <div class="museum-detail-head">
        <span class="museum-detail-glyph">${lootGlyph(selected, state.lang)}</span>
        <div>
          <h3 style="margin:0">${esc(lootTitle(selected, state.lang))}</h3>
          <span class="inv-kind tiny">${kind.icon} ${esc(i18n.loc(kind.label))}</span>
        </div>
      </div>
      <p class="museum-lore">${esc(lore)}</p>
      <div class="museum-meta tiny muted">
        ${from ? `${i18n.t('inv_from')} ${esc(from)} · ` : ''}${esc(selected.date || '')}
      </div>
      <p class="tiny muted museum-deco">${i18n.t('museum_deco')}</p>
    </article>`;
  }

  return `
    <p class="tiny muted museum-intro">${i18n.t('museum_intro')}</p>
    ${filters}
    <div class="inv-grid museum-grid">${cards}</div>
    ${detail}
  `;
}

export function statsHtml(state) {
  const h = state.history;
  return `<div class="stats-grid">
    <div><b>${h.totalCompleted}</b><span>${i18n.t('stat_quests')}</span></div>
    <div><b>${h.daysPlayed}</b><span>${i18n.t('stat_days')}</span></div>
    <div><b>${h.bestStreak || state.streak}</b><span>${i18n.t('stat_best_streak')}</span></div>
  </div>`;
}
