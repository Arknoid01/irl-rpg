// Boutique de thèmes (D12). Aperçu vidéo si le thème en a une
// (`previewVideo`, cf. data/themes/*.js), sinon repli sur un mini panneau
// rendu en live avec le vrai thème (police, couleurs, halo animé).
//
// L'achat passe par platform/billing.js : impl « dev » (déblocage local
// gratuit, état actuel) sur le web / sans plugin, impl native (plugin IAP
// Capacitor) sur appareil quand le store est branché. La boutique ne connaît
// que l'interface { listProducts, purchase, restore } — brancher le vrai
// plugin ne touche pas ce fichier.

import { i18n } from '../i18n/index.js';
import { THEMES, THEME_KEYS, companionLineFor } from '../data/themes.js';
import { getBilling } from '../platform/billing.js';
import { $, hideOverlay } from './dom.js';

const PREVIEW_XP = 120;

export function openShop({ getState, dispatch, close }) {
  const ov = $('#overlay');
  const billing = getBilling();
  const prices = {};      // themeKey -> prix affichable (string) ou undefined
  let busy = false;       // un achat / une restauration est en cours
  let errorKey = null;    // thème dont le dernier achat a échoué

  billing.listProducts().then((list) => {
    let changed = false;
    for (const p of list) {
      if (p.price && prices[p.theme] !== p.price) { prices[p.theme] = p.price; changed = true; }
    }
    if (changed) render();
  }).catch(() => { /* prix indisponibles : on affiche sans */ });

  function previewHtml(key) {
    const t = THEMES[key];
    if (t.previewVideo) {
      return `
        <div class="shop-preview shop-preview-video">
          <video src="${t.previewVideo}" autoplay muted loop playsinline></video>
        </div>`;
    }
    const line = companionLineFor(key, i18n.lang, 0);
    return `
      <div class="shop-preview" data-theme="${key}">
        <div class="panel shop-preview-panel">
          <p class="companion-line">${line}</p>
          <p class="quest-xp">+${PREVIEW_XP} <span class="xp-suffix">${i18n.loc(t.xpSuffix)}</span></p>
        </div>
      </div>`;
  }

  function unlockLabel(key) {
    const price = prices[key];
    return price ? `${i18n.t('shop_unlock')} · ${price}` : i18n.t('shop_unlock');
  }

  function statusHtml(key, s) {
    if (s.theme === key) {
      return `<span class="shop-status active">${i18n.t('shop_active')}</span>`;
    }
    if (s.unlockedThemes.includes(key)) {
      return `<button class="btn ghost small" data-shop="activate" data-v="${key}"${busy ? ' disabled' : ''}>${i18n.t('shop_activate')}</button>`;
    }
    return `<button class="btn primary small" data-shop="unlock" data-v="${key}"${busy ? ' disabled' : ''}>${unlockLabel(key)}</button>`;
  }

  function render() {
    const s = getState();
    ov.innerHTML = `
      <div class="sheet shop-sheet" role="dialog">
        <div class="sheet-head">
          <h2>${i18n.t('shop_title')}</h2>
          <button class="iconbtn" data-shop="close" aria-label="${i18n.t('set_close')}">✕</button>
        </div>
        <p class="tiny muted">${i18n.t('shop_intro')}</p>
        <div class="shop-grid">
          ${THEME_KEYS.map((k) => `
            <div class="shop-card">
              ${previewHtml(k)}
              <div class="shop-card-foot">
                <h3>${i18n.loc(THEMES[k].label)}</h3>
                ${statusHtml(k, s)}
              </div>
              ${errorKey === k ? `<p class="shop-error tiny">${i18n.t('shop_purchase_error')}</p>` : ''}
            </div>`).join('')}
        </div>
        <div class="shop-foot">
          <button class="btn ghost small" data-shop="restore"${busy ? ' disabled' : ''}>${i18n.t('shop_restore')}</button>
        </div>
        ${billing.real ? '' : `<p class="tiny muted">${i18n.t('shop_unlock_dev_note')}</p>`}
        <button class="btn ghost full" data-shop="close">${i18n.t('set_close')}</button>
      </div>`;
    ov.classList.add('show', 'sheet-mode');
  }

  async function onClick(e) {
    const el = e.target.closest('[data-shop]');
    if (!el || busy) return;
    const k = el.dataset.shop;

    if (k === 'close') { teardown(); close(); return; }

    if (k === 'activate') { dispatch('setTheme', { theme: el.dataset.v }); return; }

    if (k === 'unlock') {
      const theme = el.dataset.v;
      busy = true; errorKey = null; render();
      const res = await billing.purchase(theme);
      busy = false;
      if (res.ok) {
        // Débloquer sans activer laisserait l'écran inchangé (confusion vécue
        // en test réel) : on active tout de suite le thème acheté. « Activer »
        // reste utile pour rebasculer plus tard entre thèmes possédés.
        dispatch('unlockTheme', { theme });
        dispatch('setTheme', { theme });
      } else if (res.error) {
        errorKey = theme; render();
      } else {
        render(); // annulation : on réaffiche simplement les boutons actifs
      }
      return;
    }

    if (k === 'restore') {
      busy = true; errorKey = null; render();
      const res = await billing.restore();
      busy = false;
      if (res.ok) {
        const owned = new Set(getState().unlockedThemes);
        for (const theme of res.themes || []) {
          if (!owned.has(theme)) dispatch('unlockTheme', { theme });
        }
      }
      render();
    }
  }

  function teardown() {
    ov.removeEventListener('click', onClick);
    hideOverlay(ov, ['sheet-mode']);
  }

  // Re-render externe (après unlock/activate) : exposé pour main.js.
  openShop._rerender = render;
  ov.addEventListener('click', onClick);
  render();
}
