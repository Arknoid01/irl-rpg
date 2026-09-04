import { buildWorldView } from '../../engine/worldView.js';
import { i18n } from '../../i18n/index.js';
import { esc } from '../dom.js';

/** Sélection locale (non persistée). */
let selectedId = null;

export function selectWorldRegion(id) {
  selectedId = id || null;
}

function statusLabel(status) {
  return i18n.t('map_status_' + status) || status;
}

function pinGlyph(pin) {
  if (pin.kind === 'event') return '✦';
  if (pin.kind === 'souvenir') return '·';
  if (pin.hidden && pin.status === 'proposed') return '?';
  if (pin.status === 'done') return '✓';
  if (pin.status === 'accepted') return '◎';
  return '○';
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
    const lit = (ra.status !== 'locked' && rb.status !== 'locked');
    return `<path class="map-path${lit ? ' lit' : ''}" d="${pathD(ra, rb)}" />`;
  }).join('');

  const nodes = view.regions.map((r) => {
    const isSel = selectedId === r.id;
    const isHero = view.heroRegionId === r.id;
    const glow = Math.round(40 + r.intensity * 55);
    const fill = r.color || 'var(--ink)';
    const pinDots = r.pins.slice(0, 5).map((p, i) => {
      const ang = -70 + i * 36;
      const rad = 9;
      const px = r.x + Math.cos((ang * Math.PI) / 180) * rad;
      const py = r.y + Math.sin((ang * Math.PI) / 180) * rad - 1;
      return `<text class="map-pin map-pin-${p.kind} st-${p.status || 'idle'}" x="${px}" y="${py}" text-anchor="middle" dominant-baseline="central">${pinGlyph(p)}</text>`;
    }).join('');

    return `
      <g class="map-node status-${r.status}${isSel ? ' selected' : ''}${isHero ? ' hero-here' : ''}${r.justRevealed ? ' just-revealed' : ''}"
         data-action="select-region" data-id="${r.id}" role="button" tabindex="0">
        <circle class="map-halo" cx="${r.x}" cy="${r.y}" r="11" style="--node-glow:${glow}%; --node-color:${fill}" />
        <circle class="map-disc" cx="${r.x}" cy="${r.y}" r="7.2" style="--node-color:${fill}" />
        <text class="map-icon" x="${r.x}" y="${r.y}" text-anchor="middle" dominant-baseline="central">${r.icon}</text>
        ${isHero ? `<circle class="map-hero" cx="${r.x}" cy="${r.y + 11}" r="1.6" />` : ''}
        ${pinDots}
        <text class="map-label" x="${r.x}" y="${r.y + 14.5}" text-anchor="middle">${esc(i18n.loc(r.label))}</text>
      </g>`;
  }).join('');

  return `
    <svg class="world-map" viewBox="0 0 100 100" role="img" aria-label="${esc(i18n.t('map_title'))}">
      <defs>
        <radialGradient id="mapFog" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="rgba(232,217,184,.15)" />
          <stop offset="100%" stop-color="rgba(60,40,20,.12)" />
        </radialGradient>
      </defs>
      <rect class="map-paper" x="0" y="0" width="100" height="100" rx="2" />
      <ellipse cx="50" cy="48" rx="42" ry="38" fill="url(#mapFog)" opacity=".55" />
      <g class="map-paths">${paths}</g>
      <g class="map-nodes">${nodes}</g>
    </svg>`;
}

function detailHtml(view) {
  const r = view.regions.find((x) => x.id === selectedId) || view.regions.find((x) => x.id === view.heroRegionId);
  if (!r) return '';

  let pinsBlock = '';
  if (r.pins.length) {
    pinsBlock = `<ul class="map-pin-list">${r.pins.map((p) => {
      const title = p.kind === 'souvenir'
        ? i18n.loc(p.label)
        : (p.hidden && p.status === 'proposed' ? i18n.t('q_mystery') : i18n.loc(p.label));
      const meta = p.kind === 'quest'
        ? `${statusLabel(p.status === 'proposed' ? 'active' : p.status)} · +${p.xp} XP`
        : p.kind === 'event'
          ? `${i18n.t('event_badge')} · +${p.xp} XP`
          : i18n.t('map_souvenir');
      return `<li><span class="map-pin-ic">${pinGlyph(p)}</span><div><b>${esc(title)}</b><span class="tiny muted">${esc(meta)}</span></div></li>`;
    }).join('')}</ul>`;
  } else if (r.status === 'locked' || r.status === 'fog') {
    pinsBlock = `<p class="muted tiny">${esc(r.unlockHint ? i18n.loc(r.unlockHint) : i18n.t('map_empty'))}</p>`;
  } else {
    pinsBlock = `<p class="muted tiny">${esc(i18n.t('map_empty'))}</p>`;
  }

  const count = r.completions != null
    ? `<span class="tiny muted">${i18n.t('map_completions').replace('{n}', String(r.completions))}</span>`
    : '';

  return `
    <div class="map-detail panel">
      <div class="map-detail-head">
        <span class="map-detail-icon">${r.icon}</span>
        <div>
          <h3 style="margin:0">${esc(i18n.loc(r.label))}</h3>
          <span class="map-status-chip st-${r.status}">${esc(statusLabel(r.status))}</span>
          ${count}
        </div>
      </div>
      <p class="map-blurb">${esc(i18n.loc(r.blurb))}</p>
      ${pinsBlock}
    </div>`;
}

export function renderWorld(state) {
  const view = buildWorldView(state);
  if (!selectedId || !view.regions.some((r) => r.id === selectedId)) {
    selectedId = view.heroRegionId;
  }

  return `
    <div class="section-label">
      <span>${i18n.t('map_title')}</span>
      <span class="tiny muted">${view.stats.discovered}/${view.stats.total} ${i18n.t('map_revealed')}</span>
    </div>
    <p class="companion-line">${esc(i18n.t('map_intro'))}</p>
    <div class="world-frame">
      ${mapSvg(view)}
    </div>
    ${detailHtml(view)}
  `;
}
