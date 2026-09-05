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

/**
 * Referme #overlay avec le fondu défini dans components.css : on retire la
 * classe qui pilote l'opacité, et on ne vide le HTML qu'une fois le fondu
 * terminé — sinon le contenu disparaît d'un coup et casse l'effet.
 */
export function hideOverlay(ov, extraClasses = []) {
  if (!ov) return;
  ov.classList.remove('show', ...extraClasses);
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
