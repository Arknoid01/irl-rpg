import { buildWorldView } from '../../engine/worldView.js';
import { i18n } from '../../i18n/index.js';
import { themeText } from '../themeText.js';
import { esc } from '../dom.js';

/** Sélection locale (non persistée). */
let selectedId = null;

export function selectWorldRegion(id) {
  selectedId = id || null;
}

function statusLabel(status) {
  return i18n.t('map_status_' + status) || status;
}

// Un lieu verrouillé (palier de niveau / quête cachée) ne dit rien de lui-même
// sur le plateau : « ??? » et un point d'interrogation, pour donner envie.
// Un lieu sous la brume (famille bientôt débloquée) garde son nom, juste voilé.
function nodeIcon(r) {
  return r.status === 'locked' ? '?' : r.icon;
}

function nodeLabel(r) {
  return r.status === 'locked' ? '? ? ?' : i18n.loc(r.label);
}

/** Une seule pastille par lieu : événement > quête du jour > souvenir. */
function pinBadge(pins) {
  if (!pins.length) return null;
  if (pins.some((p) => p.kind === 'event')) return 'event';
  if (pins.some((p) => p.kind === 'quest'
    && (p.status === 'proposed' || p.status === 'accepted' || p.status === 'done'))) return 'quest';
  return 'souvenir';
}

function pathD(a, b) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 4;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

function mapSvg(view) {
  const byId = Object.fromEntries(view.regions.map((r) => [r.id, r]));
  const paths = view.paths.map(([a, b]) => {
    const ra = byId[a];
    const rb = byId[b];
    if (!ra || !rb) return '';
    const lit = ra.status !== 'locked' && rb.status !== 'locked';
    const toMystery = ra.status === 'locked' || rb.status === 'locked';
    return `<path class="map-path${lit ? ' lit' : ''}${toMystery ? ' to-mystery' : ''}" d="${pathD(ra, rb)}" />`;
  }).join('');

  const nodes = view.regions.map((r) => {
    const isSel = selectedId === r.id;
    const isHero = view.heroRegionId === r.id;
    const fill = r.color || 'var(--ink-dim)';
    const glow = `${Math.round(34 + (r.intensity || 0) * 48)}%`;
    const badge = pinBadge(r.pins);
    const cls = ['map-node', `status-${r.status}`,
      isSel && 'selected', isHero && 'hero-here', r.justRevealed && 'just-revealed',
    ].filter(Boolean).join(' ');

    return `
      <g class="${cls}" data-action="select-region" data-id="${r.id}" role="button" tabindex="0"
         aria-label="${esc(nodeLabel(r))}">
        <circle class="map-halo" cx="${r.x}" cy="${r.y}" r="13"
                style="--node-color:${fill}; --node-glow:${glow}" />
        ${isHero ? `<circle class="map-hero-ring" cx="${r.x}" cy="${r.y}" r="10.5" />` : ''}
        <circle class="map-disc" cx="${r.x}" cy="${r.y}" r="8" style="--node-color:${fill}" />
        <text class="map-icon" x="${r.x}" y="${r.y}" text-anchor="middle" dominant-baseline="central">${nodeIcon(r)}</text>
        ${badge ? `<circle class="map-badge map-badge-${badge}" cx="${r.x + 6.3}" cy="${r.y - 6.3}" r="2.7" />` : ''}
        <text class="map-label" x="${r.x}" y="${r.y + 15}" text-anchor="middle">${esc(nodeLabel(r))}</text>
      </g>`;
  }).join('');

  return `
    <svg class="world-map" viewBox="-6 -6 112 112" role="img" aria-label="${esc(i18n.t('map_title'))}">
      <rect class="map-paper" x="-6" y="-6" width="112" height="112" />
      <g class="map-paths">${paths}</g>
      <g class="map-nodes">${nodes}</g>
    </svg>`;
}

function pinsListHtml(r) {
  return `<ul class="map-pin-list">${r.pins.map((p) => {
    const title = p.kind === 'souvenir'
      ? i18n.loc(p.label)
      : (p.hidden && p.status === 'proposed' ? i18n.t('q_mystery') : i18n.loc(p.label));
    const meta = p.kind === 'quest'
      ? `${statusLabel(p.status === 'proposed' ? 'active' : p.status)} · +${p.xp} XP`
      : p.kind === 'event'
        ? `${themeText('eventLabel', 'event_badge')} · +${p.xp} XP`
        : i18n.t('map_souvenir');
    const ic = p.kind === 'event' ? '✦' : p.kind === 'souvenir' ? '·' : '◈';
    return `<li><span class="map-pin-ic">${ic}</span><div><b>${esc(title)}</b><span class="tiny muted">${esc(meta)}</span></div></li>`;
  }).join('')}</ul>`;
}

function detailHtml(view) {
  const r = view.regions.find((x) => x.id === selectedId)
    || view.regions.find((x) => x.id === view.heroRegionId);
  if (!r) return '';

  const locked = r.status === 'locked';
  const fog = r.status === 'fog';
  const title = locked ? '? ? ?' : i18n.loc(r.label);
  const icon = locked ? '?' : r.icon;

  let body;
  if (locked) {
    body = `<p class="map-blurb map-tease">${esc(i18n.t('map_locked_tease'))}</p>
      ${r.unlockHint ? `<p class="map-unlock-hint tiny">${esc(i18n.loc(r.unlockHint))}</p>` : ''}`;
  } else if (fog) {
    body = `<p class="map-blurb map-tease">${esc(i18n.t('map_fog_tease'))}</p>
      ${r.unlockHint ? `<p class="map-unlock-hint tiny">${esc(i18n.loc(r.unlockHint))}</p>` : ''}`;
  } else {
    const pins = r.pins.length ? pinsListHtml(r) : `<p class="muted tiny">${esc(i18n.t('map_empty'))}</p>`;
    body = `<p class="map-blurb">${esc(i18n.loc(r.blurb))}</p>${pins}`;
  }

  const count = (!locked && !fog && r.completions != null)
    ? `<span class="tiny muted">${i18n.t('map_completions').replace('{n}', String(r.completions))}</span>`
    : '';
  const revealed = r.justRevealed
    ? `<p class="map-revealed-note tiny">${esc(i18n.t('map_just_revealed'))}</p>`
    : '';

  return `
    <div class="map-detail panel detail-${r.status}${r.justRevealed ? ' just-revealed' : ''}">
      <div class="map-detail-head">
        <span class="map-detail-icon">${icon}</span>
        <div>
          <h3 style="margin:0">${esc(title)}</h3>
          <span class="map-status-chip st-${r.status}">${esc(statusLabel(r.status))}</span>
          ${count}
        </div>
      </div>
      ${revealed}
      ${body}
    </div>`;
}

export function renderWorld(state) {
  const view = buildWorldView(state);
  if (!selectedId || !view.regions.some((r) => r.id === selectedId)) {
    selectedId = view.heroRegionId;
  }

  const hidden = view.stats.fog + view.stats.locked;
  const notReady = hidden > 0
    ? `<p class="map-not-ready tiny muted">${esc(i18n.t('map_not_ready'))}</p>`
    : '';

  return `
    <div class="section-label">
      <span>${i18n.t('map_title')}</span>
      <span class="tiny muted">${view.stats.discovered}/${view.stats.total} ${i18n.t('map_revealed')}</span>
    </div>
    <p class="companion-line">${esc(i18n.t('map_intro'))}</p>
    <div class="world-frame">
      ${mapSvg(view)}
    </div>
    ${notReady}
    ${detailHtml(view)}
  `;
}
