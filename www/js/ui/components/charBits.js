import { SKILLS, SKILL_KEYS, TRAIT_TIERS } from '../../data/taxonomy.js';
import { TITLES } from '../../data/titles.js';
import { xpProgress, traitTierFor, traitRank } from '../../engine/progression.js';
import { buildMuseumView, lootGlyph, lootTitle } from '../../engine/inventory.js';
import { LOOT_KINDS } from '../../data/loot.js';
import {
  FIRST_MILESTONES, VOLUME_MILESTONES, MILESTONE_LABELS, volumeLabel,
} from '../../engine/milestones.js';
import { DISCOVERY_KEYS, DISCOVERY_LABELS } from '../../engine/discoveries.js';
import { i18n } from '../../i18n/index.js';
import { esc, pctBar } from '../dom.js';

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

// Résumé de progression discret pour le bas de l'écran Aventure (ROADMAP
// Phase 0.1) : prénom + niveau, une fine barre d'XP, la série, un lien vers
// le personnage. Plus de gros panneau de stats en haut de l'accueil.
export function heroCardHtml(state) {
  const p = xpProgress(state);
  return `
  <div class="prog-strip">
    <span class="prog-hero">${esc(state.name)} · <b>${i18n.t('level')} ${state.level}</b></span>
    <span class="prog-xp">${pctBar(p.pct, 'xp', `${i18n.t('xp')} ${p.xp}/${p.need}`)}</span>
    <span class="prog-streak">🔥 ${i18n.t('streak_days', { n: state.streak })}</span>
    <button class="linkbtn" data-action="goto" data-id="character">${i18n.t('see_character')} →</button>
  </div>`;
}

/**
 * Traits de l'aventurier (Phase 2.2) — des paliers qualitatifs, pas des
 * chiffres à maximiser. Un petit indicateur en segments (non chiffré) donne
 * l'ordre de grandeur sans inviter à l'optimisation.
 */
export function traitsHtml(state) {
  const tiers = traitTierFor(state);
  const rows = SKILL_KEYS.map((k) => {
    const tier = tiers[k];
    const rank = traitRank(tier);
    const label = i18n.loc(SKILLS[k].label);
    const word = i18n.loc(TRAIT_TIERS[tier]);
    const segs = [1, 2, 3, 4]
      .map((i) => `<i class="${i <= rank ? 'on' : ''}"></i>`).join('');
    return `
    <div class="trait-row">
      <span class="trait-name">${SKILLS[k].icon} ${esc(label)}</span>
      <span class="trait-tier tier-${tier}">${esc(word)}</span>
      <span class="trait-track" aria-hidden="true">${segs}</span>
    </div>`;
  }).join('');
  return `<div class="traits-list">${rows}</div>`;
}

export function titlesHtml(state, compact = false) {
  const unlocked = TITLES.filter((t) => state.titles.includes(t.id));
  if (!unlocked.length) {
    return compact ? '' : `<p class="muted tiny">${i18n.t('no_titles')}</p>`;
  }
  const chips = unlocked.map((t) => `<span class="title-chip">${i18n.loc(t.label)}</span>`).join('');
  return `<div class="titles-row">${chips}</div>`;
}

/**
 * Collection « Moments » (Phase 2.3) — les premières fois, cochées au fil du
 * jeu. Une case pas encore atteinte n'est pas un manque : elle est scellée,
 * sans dire ce qui l'ouvre.
 */
export function momentsHtml(state) {
  const ms = state.milestones || {};
  const cards = FIRST_MILESTONES.map((key) => {
    const meta = MILESTONE_LABELS[key];
    const date = ms[key];
    if (date) {
      return `<div class="collect-card got">
        <span class="collect-ic" aria-hidden="true">${meta.icon}</span>
        <span class="collect-name">${esc(i18n.loc(meta))}</span>
        <span class="collect-date tiny muted">${esc(date)}</span>
      </div>`;
    }
    return `<div class="collect-card sealed">
      <span class="collect-ic" aria-hidden="true">？</span>
      <span class="collect-name tiny muted">${i18n.t('moments_sealed')}</span>
    </div>`;
  }).join('');

  const done = state.history?.totalCompleted || 0;
  const paliers = VOLUME_MILESTONES.map((n) => {
    const got = !!ms[`volume_${n}`] || done >= n;
    return `<span class="palier-chip${got ? ' got' : ''}">${esc(volumeLabel(n, i18n.lang))}</span>`;
  }).join('');

  return `
    <p class="tiny muted collect-intro">${i18n.t('moments_intro')}</p>
    <div class="collect-grid">${cards}</div>
    <div class="palier-row">${paliers}</div>
  `;
}

/** Collection « Découvertes » (Phase 2.4) — contextes de vie traversés. */
export function discoveriesHtml(state) {
  const d = state.discoveries || {};
  const cards = DISCOVERY_KEYS.map((key) => {
    const meta = DISCOVERY_LABELS[key];
    const date = d[key];
    if (date) {
      return `<div class="collect-card got">
        <span class="collect-ic" aria-hidden="true">${meta.icon}</span>
        <span class="collect-name">${esc(i18n.loc(meta))}</span>
      </div>`;
    }
    return `<div class="collect-card sealed">
      <span class="collect-ic" aria-hidden="true">？</span>
      <span class="collect-name tiny muted">${i18n.t('discoveries_sealed')}</span>
    </div>`;
  }).join('');
  return `
    <p class="tiny muted collect-intro">${i18n.t('discoveries_intro')}</p>
    <div class="collect-grid">${cards}</div>
  `;
}

/** « Ton chemin » (Phase 2.1) — quelques repères doux, jamais un tableau de bord. */
export function pathStatsHtml(state) {
  const h = state.history || {};
  const momentsGot = Object.keys(state.milestones || {}).filter((k) => !k.startsWith('volume_')).length;
  const tiles = [
    `<div><b>${h.daysPlayed || 0}</b><span>${i18n.t('path_days')}</span></div>`,
    `<div><b>${h.bestStreak || state.streak || 0}</b><span>${i18n.t('path_streak')}</span></div>`,
    `<div><b>${momentsGot} / ${FIRST_MILESTONES.length}</b><span>${i18n.t('path_moments')}</span></div>`,
  ];
  if ((h.comebacks || 0) > 0) {
    tiles.push(`<div><b>${h.comebacks}</b><span>${i18n.t('path_returns')}</span></div>`);
  }
  return `<div class="stats-grid">${tiles.join('')}</div>`;
}

function itemKey(it, idx) {
  return it.id || `idx_${idx}_${it.date || ''}_${lootTitle(it, 'en')}`;
}

// Nombre de vitrines « ??? » montrées après les vraies pièces (Phase 2.5) —
// de la curiosité sans pression, sans transformer le musée en checklist.
const SEALED_SLOTS = 2;

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
    <div class="museum-filters" role="group" aria-label="${esc(i18n.t('museum'))}">
      <button type="button" class="museum-filter${museumFilter == null ? ' active' : ''}"
        aria-pressed="${museumFilter == null}"
        data-action="museum-filter" data-id="">${i18n.t('museum_all')} · ${view.total}</button>
      ${view.kinds.map((k) => {
        const n = view.counts[k] || 0;
        if (!n) return '';
        const meta = LOOT_KINDS[k];
        return `<button type="button" class="museum-filter${museumFilter === k ? ' active' : ''}"
          aria-pressed="${museumFilter === k}"
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

  // Vitrines mystérieuses — seulement dans la vue « tout ».
  const sealed = museumFilter == null
    ? Array.from({ length: SEALED_SLOTS }, () => `
      <div class="inv-item museum-card sealed" aria-hidden="true">
        <span class="inv-glyph">？</span>
        <span class="inv-icon tiny muted">${i18n.t('museum_sealed')}</span>
      </div>`).join('')
    : '';

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
    <div class="inv-grid museum-grid">${cards}${sealed}</div>
    ${detail}
  `;
}
