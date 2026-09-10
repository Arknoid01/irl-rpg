// Réglages — feuille (sheet) à onglets : Aventure · Thèmes · Général.
// Le sélecteur de langue reste toujours visible, au-dessus des onglets.
// L'onglet « Thèmes » a absorbé l'ancienne boutique (ui/shop.js) : sélection
// de thème + achat unique « Collection des Mondes » (D17). La boutique ne
// connaît que l'interface billing { listProducts, purchase, restore } —
// impl « dev » (déblocage local) sur le web, impl native sur appareil.

import { i18n, LANGS } from '../i18n/index.js';
import { FAMILIES } from '../data/taxonomy.js';
import { PREFERABLE_FAMILIES } from '../data/quests.js';
import { THEMES, THEME_KEYS, companionLineFor } from '../data/themes.js';
import { getBilling, COLLECTION_PRODUCT } from '../platform/billing.js';
import { $, esc, hideOverlay } from './dom.js';

const PREVIEW_XP = 120;
const TABS = ['adventure', 'themes', 'general'];

/**
 * @param {object} opts
 * @param {() => object} opts.getState
 * @param {(action: string, args?: object) => void} opts.dispatch  applique + persiste + re-render global
 * @param {() => void} opts.close
 * @param {string} [opts.tab]  onglet initial ('adventure' | 'themes' | 'general')
 */
export function openSettings({ getState, dispatch, close, tab } = {}) {
  const ov = $('#overlay');

  // Un seul jeu d'écouteurs à la fois : si la feuille est déjà montée (ré-ouverte
  // pendant qu'elle est visible), on détache proprement l'ancien avant de remonter.
  if (typeof openSettings._detach === 'function') openSettings._detach();

  const billing = getBilling();
  let activeTab = TABS.includes(tab) ? tab : 'adventure';
  let collectionPrice = null; // prix affichable de la Collection (string) ou null
  let busy = false;           // un achat / une restauration est en cours
  let error = false;          // le dernier achat a échoué

  billing.listProducts().then((list) => {
    const p = list.find((x) => x.productId === COLLECTION_PRODUCT) || list[0];
    if (p && p.price && p.price !== collectionPrice) { collectionPrice = p.price; render(); }
  }).catch(() => { /* prix indisponible : on affiche sans */ });

  /* ─────────────── fragments ─────────────── */

  function tabBarHtml() {
    return `<div class="set-tabs" role="tablist">${TABS.map((t) => `
      <button class="set-tab${activeTab === t ? ' active' : ''}" role="tab"
        data-set="tab" data-v="${t}">${i18n.t('set_tab_' + t)}</button>`).join('')}</div>`;
  }

  function langBarHtml(s) {
    return `<div class="set-langbar">
      <span>${i18n.t('set_language')}</span>
      <div class="lang-toggle">${LANGS.map((l) => `
        <button class="${s.lang === l ? 'active' : ''}" data-set="lang" data-v="${l}">${l.toUpperCase()}</button>`).join('')}</div>
    </div>`;
  }

  function adventurePanelHtml(s) {
    return `
      <div class="set-row col">
        <span>${i18n.t('set_hero_name')}</span>
        <div class="set-name-row">
          <input id="set-name" type="text" maxlength="24" value="${esc(s.name)}" data-set="name-input" />
          <button class="btn ghost" data-set="rename">${i18n.t('set_rename')}</button>
        </div>
      </div>
      <div class="set-row col">
        <span>${i18n.t('set_comfort')} — ${s.comfort}/5</span>
        <input type="range" min="1" max="5" step="1" value="${s.comfort}" data-set="comfort" />
      </div>
      <div class="set-row col">
        <span>${i18n.t('set_families')}</span>
        <div class="fam-choose">${PREFERABLE_FAMILIES.map((f) => `
          <button class="fam-pill${s.prefFamilies.includes(f) ? ' active' : ''}" data-set="fam" data-v="${f}">
            ${FAMILIES[f].icon} ${i18n.loc(FAMILIES[f].label)}</button>`).join('')}</div>
      </div>`;
  }

  // Aperçu « live » : un mini page/panneau rendu avec le vrai thème (police,
  // couleurs, cadres) — et l'effet ambiant signature du thème, qui vient du
  // sélecteur `[data-theme="…"] .page::after` (coupé si prefers-reduced-motion).
  function previewHtml(key) {
    const t = THEMES[key];
    const line = companionLineFor(key, i18n.lang, 0);
    return `
      <div class="shop-preview" data-theme="${key}">
        <div class="shop-stage">
          <div class="page">
            <div class="shop-stage-brand">${i18n.t('app_name')}</div>
            <div class="panel shop-preview-panel">
              <p class="companion-line">${line}</p>
              <p class="quest-xp">+${PREVIEW_XP} <span class="xp-suffix">${i18n.loc(t.xpSuffix)}</span></p>
            </div>
          </div>
        </div>
      </div>`;
  }

  function themeStatusHtml(key, s) {
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

  function themesPanelHtml(s) {
    return `
      <p class="tiny muted">${i18n.t('shop_intro')}</p>
      ${collectionBannerHtml(s)}
      <div class="shop-grid">
        ${THEME_KEYS.map((k) => `
          <div class="shop-card">
            ${previewHtml(k)}
            <div class="shop-card-foot">
              <h3>${i18n.loc(THEMES[k].label)}</h3>
              ${themeStatusHtml(k, s)}
            </div>
          </div>`).join('')}
      </div>
      <div class="shop-foot">
        <button class="btn ghost small" data-shop="restore"${busy ? ' disabled' : ''}>${i18n.t('shop_restore')}</button>
      </div>
      ${billing.real ? '' : `<p class="tiny muted">${i18n.t('shop_unlock_dev_note')}</p>`}`;
  }

  function generalPanelHtml(s) {
    return `
      <h3>${i18n.t('set_notifications')}</h3>
      <label class="switch-row">
        <input type="checkbox" ${s.notifications.enabled ? 'checked' : ''} data-set="notif-enable" />
        <span>${i18n.t('set_notif_enable')}</span>
      </label>
      <label class="switch-row">
        <span>${i18n.t('set_notif_hour')}</span>
        <input type="number" min="6" max="22" value="${s.notifications.hour}" data-set="notif-hour" />
      </label>

      <h3>${i18n.t('set_data')}</h3>
      <p class="tiny muted">${i18n.t('set_data_body')}</p>
      <div class="set-actions">
        <button class="btn ghost" data-set="export">${i18n.t('set_export')}</button>
        <button class="btn ghost" data-set="import">${i18n.t('set_import')}</button>
        <button class="btn danger" data-set="wipe">${i18n.t('set_wipe')}</button>
      </div>

      <h3>${i18n.t('set_about')}</h3>
      <p class="tiny muted">${i18n.t('set_age_rating')}</p>
      <p class="tiny"><strong>${i18n.t('set_promise')}</strong> — ${i18n.t('set_promise_body')}</p>
      <p class="tiny muted">${i18n.t('set_privacy_body')}</p>
      <p class="tiny muted">${esc(s.name)} · ${i18n.t('level')} ${s.level}</p>`;
  }

  function render() {
    const s = getState();
    const panel = activeTab === 'themes' ? themesPanelHtml(s)
      : activeTab === 'general' ? generalPanelHtml(s)
        : adventurePanelHtml(s);
    ov.innerHTML = `
      <div class="sheet settings-sheet" role="dialog">
        <div class="sheet-head">
          <h2>${i18n.t('set_title')}</h2>
          <button class="iconbtn" data-set="close" aria-label="${i18n.t('set_close')}">✕</button>
        </div>
        ${langBarHtml(s)}
        ${tabBarHtml()}
        <div class="set-panel">${panel}</div>
        <button class="btn primary full" data-set="close">${i18n.t('set_close')}</button>
      </div>`;
    ov.classList.add('show', 'sheet-mode');
  }

  /* ─────────────── événements ─────────────── */

  function onInput(e) {
    const el = e.target.closest('[data-set]');
    if (!el) return;
    const k = el.dataset.set;
    if (k === 'comfort') dispatch('setComfort', { comfort: Number(el.value) });
    else if (k === 'notif-hour') dispatch('setNotifications', { hour: Number(el.value) });
    else if (k === 'notif-enable') dispatch('setNotifications', { enabled: el.checked });
  }

  function handleSet(el) {
    const k = el.dataset.set;
    if (k === 'close') { teardown(); close(); return; }
    if (k === 'tab') { activeTab = el.dataset.v; render(); return; }
    // lang / fam : main.js ré-applique et re-render la feuille (softRerenderSettings).
    if (k === 'lang') { dispatch('setLang', { lang: el.dataset.v }); return; }
    if (k === 'fam') {
      const s = getState();
      const list = s.prefFamilies.slice();
      const i = list.indexOf(el.dataset.v);
      if (i >= 0) list.splice(i, 1);
      else if (list.length < 3) list.push(el.dataset.v);
      dispatch('setPrefFamilies', { prefFamilies: list });
      return;
    }
    if (k === 'rename') {
      const input = $('#set-name');
      dispatch('renameHero', { name: input ? input.value : '' });
    } else if (k === 'export') dispatch('exportSave');
    else if (k === 'import') dispatch('importSave');
    else if (k === 'wipe') dispatch('wipe');
  }

  async function handleShop(el) {
    if (busy) return;
    const k = el.dataset.shop;

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

  function onClick(e) {
    const shopEl = e.target.closest('[data-shop]');
    if (shopEl) { handleShop(shopEl); return; }
    const setEl = e.target.closest('[data-set]');
    if (setEl) handleSet(setEl);
  }

  function detach() {
    ov.removeEventListener('click', onClick);
    ov.removeEventListener('input', onInput);
    ov.removeEventListener('change', onInput);
    openSettings._detach = null;
    openSettings._rerender = null;
  }

  function teardown() {
    detach();
    hideOverlay(ov, ['sheet-mode']);
  }

  // Re-render externe (ex. après changement de langue / thème / import) : exposé pour main.
  openSettings._rerender = render;
  openSettings._detach = detach;
  ov.addEventListener('click', onClick);
  ov.addEventListener('input', onInput);
  ov.addEventListener('change', onInput);
  render();
}
