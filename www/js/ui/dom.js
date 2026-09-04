// Petits helpers DOM. Le rendu se fait en chaînes HTML (fonctions pures,
// testables) puis injecté dans un conteneur ; les clics passent par délégation.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Échappe le contenu utilisateur (prénom, texte importé…). */
export function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ENT[c]);
}

export function pctBar(pct, cls = '') {
  const w = Math.max(0, Math.min(100, pct));
  return `<div class="bar-track"><div class="bar-fill ${cls}" style="width:${w}%"></div></div>`;
}

/** Remplace le contenu d'un conteneur par du HTML. */
export function mount(container, html) {
  container.innerHTML = html;
}
