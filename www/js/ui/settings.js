import { i18n, LANGS } from '../i18n/index.js';
import { FAMILIES } from '../data/taxonomy.js';
import { PREFERABLE_FAMILIES } from '../data/quests.js';
import { THEMES, THEME_KEYS } from '../data/themes.js';
import { $, esc } from './dom.js';

/**
 * @param {object} opts
 * @param {() => object} opts.getState
 * @param {(action: string, args?: object) => void} opts.dispatch  applique + persiste + re-render global
 * @param {() => void} opts.close
 */
export function openSettings({ getState, dispatch, close }) {
  const ov = $('#overlay');

  function render() {
    const s = getState();
    ov.innerHTML = `
      <div class="sheet" role="dialog">
        <div class="sheet-head">
          <h2>${i18n.t('set_title')}</h2>
          <button class="iconbtn" data-set="close" aria-label="${i18n.t('set_close')}">✕</button>
        </div>

        <h3>${i18n.t('set_appearance')}</h3>
        <div class="set-row">
          <span>${i18n.t('set_theme')}</span>
          <div class="theme-choose">${THEME_KEYS.map((k) => `
            <button class="theme-dot${k === s.theme ? ' active' : ''}" style="background:${THEMES[k].dot}"
              data-set="theme" data-v="${k}" title="${THEMES[k].label}"></button>`).join('')}</div>
        </div>
        <div class="set-row">
          <span>${i18n.t('set_language')}</span>
          <div class="lang-toggle">${LANGS.map((l) => `
            <button class="${s.lang === l ? 'active' : ''}" data-set="lang" data-v="${l}">${l.toUpperCase()}</button>`).join('')}</div>
        </div>

        <h3>${i18n.t('set_adventure')}</h3>
        <div class="set-row col">
          <span>${i18n.t('set_comfort')} — ${s.comfort}/5</span>
          <input type="range" min="1" max="5" step="1" value="${s.comfort}" data-set="comfort" />
        </div>
        <div class="set-row col">
          <span>${i18n.t('set_families')}</span>
          <div class="fam-choose">${PREFERABLE_FAMILIES.map((f) => `
            <button class="fam-pill${s.prefFamilies.includes(f) ? ' active' : ''}" data-set="fam" data-v="${f}">
              ${FAMILIES[f].icon} ${i18n.loc(FAMILIES[f].label)}</button>`).join('')}</div>
        </div>

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
        <p class="tiny muted">${esc(s.name)} · ${i18n.t('level')} ${s.level}</p>
        <button class="btn primary full" data-set="close">${i18n.t('set_close')}</button>
      </div>`;
    ov.classList.add('show', 'sheet-mode');
  }

  function onInput(e) {
    const el = e.target.closest('[data-set]');
    if (!el) return;
    const k = el.dataset.set;
    if (k === 'comfort') dispatch('setComfort', { comfort: Number(el.value) });
    else if (k === 'notif-hour') dispatch('setNotifications', { hour: Number(el.value) });
    else if (k === 'notif-enable') dispatch('setNotifications', { enabled: el.checked });
  }

  function onClick(e) {
    const el = e.target.closest('[data-set]');
    if (!el) return;
    const k = el.dataset.set;
    if (k === 'close') { teardown(); close(); return; }
    if (k === 'theme') dispatch('setTheme', { theme: el.dataset.v });
    else if (k === 'lang') dispatch('setLang', { lang: el.dataset.v });
    else if (k === 'fam') {
      const s = getState();
      const list = s.prefFamilies.slice();
      const i = list.indexOf(el.dataset.v);
      if (i >= 0) list.splice(i, 1);
      else if (list.length < 3) list.push(el.dataset.v);
      dispatch('setPrefFamilies', { prefFamilies: list });
    } else if (k === 'export') dispatch('exportSave');
    else if (k === 'import') dispatch('importSave');
    else if (k === 'wipe') dispatch('wipe');
    if (['theme', 'lang', 'fam'].includes(k)) render();
  }

  function teardown() {
    ov.removeEventListener('click', onClick);
    ov.removeEventListener('input', onInput);
    ov.removeEventListener('change', onInput);
    ov.classList.remove('show', 'sheet-mode');
    ov.innerHTML = '';
  }

  // Re-render externe (ex. après import) : exposé pour main.
  openSettings._rerender = render;
  ov.addEventListener('click', onClick);
  ov.addEventListener('input', onInput);
  ov.addEventListener('change', onInput);
  render();
}
