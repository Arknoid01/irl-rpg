// Réglages — feuille (sheet) à onglets : Aventure · Thèmes · Général.
// Le sélecteur de langue reste toujours visible, au-dessus des onglets.
// L'onglet « Thèmes » a absorbé l'ancienne boutique (ui/shop.js) : sélection
// de thème + achat unique « Collection des Mondes » (D17). La boutique ne
// connaît que l'interface billing { listProducts, purchase, restore } —
// impl « dev » (déblocage local) sur le web, impl native sur appareil.

import { i18n, LANGS } from '../i18n/index.js';
import { FAMILIES, FAMILY_KEYS } from '../data/taxonomy.js';
import { PREFERABLE_FAMILIES } from '../data/quests.js';
import { THEMES, THEME_KEYS, companionLineFor } from '../data/themes.js';
import { getBilling, COLLECTION_PRODUCT } from '../platform/billing.js';
import { canTrial } from '../engine/game.js';
import { $, esc, hideOverlay, showOverlay } from './dom.js';

const PREVIEW_XP = 120;
const TABS = ['adventure', 'custom', 'themes', 'general'];

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
  let error = false;          // le dernier achat a échoué : false | 'failed' | 'unavailable'
  let editingId = null;       // quête perso en cours de modification

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
    const onTrial = s.trial && s.trial.theme === key && Date.now() < s.trial.until;
    if (s.theme === key) {
      const left = onTrial ? ` · ${i18n.t('shop_trial_left', { h: Math.max(1, Math.ceil((s.trial.until - Date.now()) / 3600000)) })}` : '';
      return `<span class="shop-status active">${i18n.t('shop_active')}${left}</span>`;
    }
    if (s.unlockedThemes.includes(key) || onTrial) {
      return `<button class="btn ghost small" data-shop="activate" data-v="${key}"${busy ? ' disabled' : ''}>${i18n.t('shop_activate')}</button>`;
    }
    // Verrouillé : l'achat débloque tout ; on rappelle le thème cliqué pour
    // l'activer tout de suite après. Un essai de 24 h par thème est offert.
    const trial = canTrial(s, key)
      ? `<button class="btn ghost small" data-shop="trial" data-v="${key}"${busy ? ' disabled' : ''}>${i18n.t('shop_trial')}</button>` : '';
    return `<span class="shop-actions">${trial}<button class="btn primary small" data-shop="unlock" data-v="${key}"${busy ? ' disabled' : ''}>${i18n.t('shop_locked')}</button></span>`;
  }

  // Un cairn : des pierres empilées, la marque de l'app. Couleur = `currentColor`.
  const CAIRN_SVG = `<svg class="shop-cairn" viewBox="0 0 64 64" aria-hidden="true">
    <ellipse cx="32" cy="52" rx="24" ry="8" fill="currentColor" opacity=".95"/>
    <ellipse cx="31" cy="38" rx="17" ry="6.5" fill="currentColor" opacity=".8"/>
    <ellipse cx="33" cy="26" rx="11" ry="5" fill="currentColor" opacity=".65"/>
    <ellipse cx="32" cy="16" rx="6" ry="3.6" fill="currentColor" opacity=".5"/>
  </svg>`;

  function perksHtml() {
    const yes = (k) => `<li class="ok"><span class="shop-tick">✓</span>${i18n.t(k)}</li>`;
    return `<ul class="shop-perks">
      ${yes('shop_perk_themes')}${yes('shop_perk_custom')}${yes('shop_perk_retro')}${yes('shop_perk_remind')}${yes('shop_perk_arc')}
    </ul>`;
  }

  function heroHtml(s) {
    if (s.complete) {
      return `<section class="shop-hero owned">
        ${CAIRN_SVG}
        <h3>${i18n.t('shop_owned_title')}</h3>
        <p class="tiny">${i18n.t('shop_owned_sub')}</p>
      </section>`;
    }
    const price = collectionPrice ? ` · ${collectionPrice}` : '';
    return `<section class="shop-hero">
      ${CAIRN_SVG}
      <p class="shop-kicker">${i18n.t('shop_hero_kicker')}</p>
      <h3>${i18n.t('shop_hero_title')}</h3>
      <p class="shop-sub">${i18n.t('shop_hero_sub')}</p>
      ${perksHtml()}
      <button class="btn primary shop-cta" data-shop="unlock" data-v=""${busy ? ' disabled' : ''}>${i18n.t('shop_cta')}${price}</button>
      ${error ? `<p class="shop-error tiny">${i18n.t(error === 'unavailable' ? 'shop_purchase_unavailable' : 'shop_purchase_error')}</p>` : ''}
      <ul class="shop-trust">
        <li>${i18n.t('shop_trust_once')}</li><li>${i18n.t('shop_trust_noads')}</li>
        <li>${i18n.t('shop_trust_fair')}</li><li>${i18n.t('shop_trust_local')}</li>
      </ul>
    </section>`;
  }

  function themesPanelHtml(s) {
    return `
      ${heroHtml(s)}
      <div class="shop-worlds-head">
        <h3>${i18n.t('shop_worlds')}</h3>
        <span class="tiny muted">${i18n.t('shop_swipe')}</span>
      </div>
      <div class="shop-rail">
        ${THEME_KEYS.map((k) => `
          <div class="shop-card${s.unlockedThemes.includes(k) ? '' : ' locked'}">
            ${previewHtml(k)}
            <div class="shop-card-foot">
              <div>
                <h3>${i18n.loc(THEMES[k].label)}</h3>
                ${k !== 'nordique' && !s.complete ? `<span class="tiny muted">${i18n.t('shop_in_complete')}</span>` : ''}
              </div>
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
      ${s.complete ? [0, 1].map((i) => `
      <label class="switch-row">
        <span>${i18n.t('set_notif_extra')} ${i + 1}</span>
        <input type="number" min="6" max="22" value="${(s.notifications.extra || [])[i] ?? ''}" placeholder="${esc(i18n.t('set_notif_extra_none'))}" data-set="notif-extra" />
      </label>`).join('') : `
      <button class="btn ghost small" data-set="cq-shop">${i18n.t('set_notif_extra_locked')}</button>`}

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

  // Quêtes perso (Cairn Complet, D19) : verrouillé => même achat que la Collection.
  function customPanelHtml(s) {
    if (!s.complete) {
      const price = collectionPrice ? ` · ${collectionPrice}` : '';
      return `
        <div class="shop-collection panel">
          <h3>${i18n.t('cq_locked_title')}</h3>
          <p class="tiny muted">${i18n.t('cq_locked_desc')}</p>
          <button class="btn primary" data-shop="unlock" data-v="Q"${busy ? ' disabled' : ''}>${i18n.t('shop_unlock_collection')}${price}</button>
          ${error ? `<p class="shop-error tiny">${i18n.t(error === 'unavailable' ? 'shop_purchase_unavailable' : 'shop_purchase_error')}</p>` : ''}
        </div>`;
    }
    const playedToday = s.quests.some((q) => q.custom);
    const editing = s.customQuests.find((c) => c.id === editingId) || null;
    if (!editing) editingId = null;
    const fams = FAMILY_KEYS.map((f) => `<option value="${f}"${editing && editing.famille === f ? ' selected' : ''}>${FAMILIES[f].icon} ${i18n.loc(FAMILIES[f].label)}</option>`).join('');
    const efforts = ['leger', 'moyen', 'consequent'].map((e) => `<option value="${e}"${(editing ? editing.effort : 'moyen') === e ? ' selected' : ''}>${i18n.t('cq_effort_' + e)}</option>`).join('');
    const list = s.customQuests.length ? s.customQuests.map((c) => `
      <div class="set-row col">
        <span>${FAMILIES[c.famille].icon} ${esc(c.text)} <span class="tiny muted">· ${i18n.t('cq_effort_' + c.effort)}</span></span>
        <div class="set-actions cq-actions">
          <button class="btn ghost small" data-set="cq-play" data-v="${c.id}"${playedToday ? ' disabled' : ''}>${i18n.t('cq_play')}</button>
          <button class="btn ghost small" data-set="cq-edit" data-v="${c.id}">${i18n.t('cq_edit')}</button>
          <button class="btn ghost small" data-set="cq-del" data-v="${c.id}">${i18n.t('cq_delete')}</button>
        </div>
      </div>`).join('') : `<p class="tiny muted">${i18n.t('cq_empty')}</p>`;
    return `
      <p class="tiny muted">${i18n.t('cq_intro')}</p>
      <div class="set-row col">
        <input id="cq-text" type="text" maxlength="120" value="${editing ? esc(editing.text) : ''}" placeholder="${esc(i18n.t('cq_text_ph'))}" />
        <label class="tiny">${i18n.t('cq_family')} <select id="cq-fam">${fams}</select></label>
        <label class="tiny">${i18n.t('cq_effort')} <select id="cq-eff">${efforts}</select></label>
        <button class="btn primary" data-set="cq-add">${i18n.t(editing ? 'cq_save' : 'cq_add')}</button>
      </div>
      <h3>${i18n.t('cq_saved')}</h3>
      ${playedToday ? `<p class="tiny muted">${i18n.t('cq_played_today')}</p>` : ''}
      ${list}`;
  }

  function render() {
    const s = getState();
    const panel = activeTab === 'themes' ? themesPanelHtml(s)
      : activeTab === 'custom' ? customPanelHtml(s)
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
    showOverlay(ov, ['sheet-mode']);
  }

  /* ─────────────── événements ─────────────── */

  function onInput(e) {
    const el = e.target.closest('[data-set]');
    if (!el) return;
    const k = el.dataset.set;
    if (k === 'comfort') dispatch('setComfort', { comfort: Number(el.value) });
    else if (k === 'notif-hour') dispatch('setNotifications', { hour: Number(el.value) });
    else if (k === 'notif-extra') {
      const vals = [...ov.querySelectorAll('[data-set="notif-extra"]')].map((i) => i.value).filter((v) => v !== '');
      dispatch('setNotifications', { extra: vals.map(Number) });
      if (e.type === 'change') render(); // montre l'état réellement retenu (doublons, hors plage)
    } else if (k === 'notif-enable') dispatch('setNotifications', { enabled: el.checked });
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
    if (k === 'cq-shop') { activeTab = 'themes'; render(); return; }
    if (k === 'cq-add') {
      const f = { text: $('#cq-text').value, famille: $('#cq-fam').value, effort: $('#cq-eff').value };
      if (editingId) { const id = editingId; editingId = null; dispatch('updateCustomQuest', { id, ...f }); } else dispatch('addCustomQuest', f);
      return;
    }
    if (k === 'cq-edit') { editingId = el.dataset.v; render(); return; }
    if (k === 'cq-del') { if (editingId === el.dataset.v) editingId = null; dispatch('deleteCustomQuest', { id: el.dataset.v }); return; }
    if (k === 'cq-play') { teardown(); close(); dispatch('playCustomQuest', { id: el.dataset.v }); return; }
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
    if (k === 'trial') { dispatch('startTrial', { theme: el.dataset.v }); return; }

    if (k === 'unlock') {
      const theme = el.dataset.v; // '' depuis la bannière, une clé depuis une carte
      busy = true; error = false; render();
      const res = await billing.purchase();
      busy = false;
      if (res.ok) {
        // Un seul achat débloque les 6. On active le thème cliqué s'il y en a
        // un (sinon rien ne semble se passer à l'écran — retour de test réel).
        dispatch('unlockCollection');
        if (theme && theme !== 'Q') dispatch('setTheme', { theme });
        else render();
      } else if (res.error) {
        error = res.unavailable ? 'unavailable' : 'failed'; render();
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
