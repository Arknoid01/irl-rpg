// Boutique de thèmes (D12). Aperçu vidéo si le thème en a une
// (`previewVideo`, cf. data/themes/*.js), sinon repli sur un mini panneau
// rendu en live avec le vrai thème (police, couleurs, halo animé). Le
// déblocage est local pour l'instant, aucun paiement réel n'est encore
// branché (voir DECISIONS.md D12) — débloquer active aussi immédiatement le
// thème (sinon rien ne semble se passer à l'écran).

import { i18n } from '../i18n/index.js';
import { THEMES, THEME_KEYS, companionLineFor } from '../data/themes.js';
import { $, hideOverlay } from './dom.js';

const PREVIEW_XP = 120;

export function openShop({ getState, dispatch, close }) {
  const ov = $('#overlay');

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
      return `<button class="btn ghost small" data-shop="activate" data-v="${key}">${i18n.t('shop_activate')}</button>`;
    }
    return `<button class="btn primary small" data-shop="unlock" data-v="${key}">${i18n.t('shop_unlock')}</button>`;
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
            </div>`).join('')}
        </div>
        <p class="tiny muted">${i18n.t('shop_unlock_dev_note')}</p>
        <button class="btn ghost full" data-shop="close">${i18n.t('set_close')}</button>
      </div>`;
    ov.classList.add('show', 'sheet-mode');
  }

  function onClick(e) {
    const el = e.target.closest('[data-shop]');
    if (!el) return;
    const k = el.dataset.shop;
    if (k === 'close') { teardown(); close(); return; }
    if (k === 'unlock') {
      // Débloquer sans activer laisserait l'écran inchangé (confusion vécue
      // en test réel) : on active tout de suite le thème qu'on vient
      // d'acheter. Le bouton « Activer » reste utile pour rebasculer plus
      // tard entre deux thèmes déjà possédés.
      dispatch('unlockTheme', { theme: el.dataset.v });
      dispatch('setTheme', { theme: el.dataset.v });
    } else if (k === 'activate') dispatch('setTheme', { theme: el.dataset.v });
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
