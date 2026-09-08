// Boutique de thèmes (D12 + D17). Aperçu vidéo si le thème en a une
// (`previewVideo`, cf. data/themes/*.js), sinon repli sur un mini panneau
// rendu en live avec le vrai thème (police, couleurs, halo animé).
//
// Un seul achat : la « Collection des Mondes » (`billing.purchase()`), qui
// débloque les 6 thèmes payants. Impl « dev » (déblocage local gratuit) sur le
// web / sans plugin, impl native (Play Store / StoreKit) sur appareil. La
// boutique ne connaît que l'interface { listProducts, purchase, restore }.

import { i18n } from '../i18n/index.js';
import { THEMES, THEME_KEYS, companionLineFor } from '../data/themes.js';
import { getBilling, COLLECTION_PRODUCT } from '../platform/billing.js';
import { $, hideOverlay } from './dom.js';

const PREVIEW_XP = 120;

export function openShop({ getState, dispatch, close }) {
  const ov = $('#overlay');
  const billing = getBilling();
  let collectionPrice = null; // prix affichable de la Collection (string) ou null
  let busy = false;           // un achat / une restauration est en cours
  let error = false;          // le dernier achat a échoué

  billing.listProducts().then((list) => {
    const p = list.find((x) => x.productId === COLLECTION_PRODUCT) || list[0];
    if (p && p.price && p.price !== collectionPrice) { collectionPrice = p.price; render(); }
  }).catch(() => { /* prix indisponible : on affiche sans */ });

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

  function statusHtml(key, s) {
    if (s.theme === key) {
      return `<span class="shop-status active">${i18n.t('shop_active')}</span>`;
    }
    if (s.unlockedThemes.includes(key)) {
      return `<button class="btn ghost small" data-shop="activate" data-v="${key}"${busy ? ' disabled' : ''}>${i18n.t('shop_activate')}</button>`;
    }
    // Verrouillé : l'achat de la Collection débloque tout ; on rappelle le
    // thème cliqué pour l'activer tout de suite après.
    return `<button class="btn primary small" data-shop="unlock" data-v="${key}"${busy ? ' disabled' : ''}>${i18n.t('shop_locked')}</button>`;
  }

  function collectionBannerHtml(s) {
    const allOwned = THEME_KEYS.every((k) => s.unlockedThemes.includes(k));
    if (allOwned) return '';
    const price = collectionPrice ? ` · ${collectionPrice}` : '';
    return `
      <div class="shop-collection panel">
        <h3>${i18n.t('shop_collection_title')}</h3>
        <p class="tiny muted">${i18n.t('shop_collection_desc')}</p>
        <button class="btn primary" data-shop="unlock" data-v=""${busy ? ' disabled' : ''}>${i18n.t('shop_unlock_collection')}${price}</button>
        ${error ? `<p class="shop-error tiny">${i18n.t('shop_purchase_error')}</p>` : ''}
      </div>`;
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
        ${collectionBannerHtml(s)}
        <div class="shop-grid">
          ${THEME_KEYS.map((k) => `
            <div class="shop-card">
              ${previewHtml(k)}
              <div class="shop-card-foot">
                <h3>${i18n.loc(THEMES[k].label)}</h3>
                ${statusHtml(k, s)}
              </div>
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
      const theme = el.dataset.v; // '' depuis la bannière, une clé depuis une carte
      busy = true; error = false; render();
      const res = await billing.purchase();
      busy = false;
      if (res.ok) {
        // Un seul achat débloque les 6. On active le thème cliqué s'il y en a
        // un (sinon rien ne semble se passer à l'écran — retour de test réel).
        dispatch('unlockCollection');
        if (theme) dispatch('setTheme', { theme });
        else render();
      } else if (res.error) {
        error = true; render();
      } else {
        render(); // annulation : on réaffiche simplement les boutons
      }
      return;
    }

    if (k === 'restore') {
      busy = true; error = false; render();
      const res = await billing.restore();
      busy = false;
      if (res.ok && (res.themes || []).length) dispatch('unlockCollection');
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
