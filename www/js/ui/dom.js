// Petits helpers DOM. Le rendu se fait en chaînes HTML (fonctions pures,
// testables) puis injecté dans un conteneur ; les clics passent par délégation.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Échappe le contenu utilisateur (prénom, texte importé…). */
export function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ENT[c]);
}

export function pctBar(pct, cls = '', label = '') {
  const w = Math.max(0, Math.min(100, pct));
  const labelAttr = label ? ` aria-label="${esc(label)}"` : '';
  return `<div class="bar-track" role="progressbar" aria-valuenow="${w}" aria-valuemin="0" aria-valuemax="100"${labelAttr}><div class="bar-fill ${cls}" style="width:${w}%"></div></div>`;
}

/** Remplace le contenu d'un conteneur par du HTML. */
export function mount(container, html) {
  container.innerHTML = html;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
let overlayReturnFocus = null;

/** Éléments focalisables et actifs à l'intérieur d'un conteneur. */
export function focusables(root) {
  return $$(FOCUSABLE, root).filter((el) => !el.disabled && !el.hidden);
}

/**
 * Ouvre #overlay : mémorise le focus courant, ajoute `.show`, puis déplace le
 * focus dans le dialogue (premier élément utile, sinon le conteneur). Le focus
 * est rendu par hideOverlay.
 */
export function showOverlay(ov, extraClasses = []) {
  if (!ov) return;
  try {
    const a = document.activeElement;
    if (a && a !== document.body && !ov.contains(a)) overlayReturnFocus = a;
  } catch { /* pas de DOM complet */ }
  ov.classList.add('show', ...extraClasses);
  const dlg = ov.querySelector('[role="dialog"]') || ov.firstElementChild;
  const target = focusables(ov)[0] || dlg;
  if (target) {
    if (target === dlg && !dlg.hasAttribute('tabindex')) dlg.setAttribute('tabindex', '-1');
    try { target.focus({ preventScroll: true }); } catch { /* jsdom */ }
  }
}

/**
 * Referme #overlay avec le fondu défini dans components.css : on retire la
 * classe qui pilote l'opacité, et on ne vide le HTML qu'une fois le fondu
 * terminé — sinon le contenu disparaît d'un coup et casse l'effet.
 */
export function hideOverlay(ov, extraClasses = []) {
  if (!ov) return;
  ov.classList.remove('show', ...extraClasses);
  // Rend le focus à l'élément qui a ouvert l'overlay (accessibilité clavier).
  if (overlayReturnFocus && typeof overlayReturnFocus.focus === 'function'
    && overlayReturnFocus.isConnected !== false) {
    try { overlayReturnFocus.focus({ preventScroll: true }); } catch { /* */ }
  }
  overlayReturnFocus = null;
  let done = false;
  // Si l'overlay a été rouvert entre-temps (double-tap, cérémonie enchaînée),
  // on ne vide surtout pas le contenu qui vient d'être affiché.
  const finish = () => {
    if (done) return;
    done = true;
    ov.removeEventListener('transitionend', onEnd);
    if (!ov.classList.contains('show')) ov.innerHTML = '';
  };
  const onEnd = (e) => { if (e.target === ov && e.propertyName === 'opacity') finish(); };
  ov.addEventListener('transitionend', onEnd);
  setTimeout(finish, 350);
}
