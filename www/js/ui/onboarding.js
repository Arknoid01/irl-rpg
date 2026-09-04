import { i18n } from '../i18n/index.js';
import { FAMILIES } from '../data/taxonomy.js';
import { PREFERABLE_FAMILIES } from '../data/quests.js';
import { THEMES, THEME_KEYS } from '../data/themes.js';
import { applyTheme } from './theme.js';
import { $, esc } from './dom.js';

const STEPS = ['welcome', 'name', 'comfort', 'families', 'notif'];

export function startOnboarding(initial, onComplete) {
  const ov = $('#overlay');
  const data = {
    name: '',
    comfort: 3,
    prefFamilies: [],
    theme: initial.theme || 'nordique',
    lang: i18n.lang,
    notifications: { enabled: false, hour: 9 },
    ageAck: false,
  };
  let step = 0;

  function langToggle() {
    return `<div class="lang-toggle">
      <button class="${i18n.lang === 'fr' ? 'active' : ''}" data-ob="lang" data-v="fr">FR</button>
      <button class="${i18n.lang === 'en' ? 'active' : ''}" data-ob="lang" data-v="en">EN</button>
    </div>`;
  }

  function chapterMark() {
    const roman = ['I', 'II', 'III', 'IV', 'V'];
    return `<div class="ob-chapter">
      <span class="ob-chapter-ribbon">${roman[step]} / V</span>
      <p class="ob-companion">${i18n.t('ob_chapter_' + STEPS[step])}</p>
    </div>`;
  }

  function stepHtml() {
    const name = STEPS[step];
    if (name === 'welcome') {
      return `
        ${langToggle()}
        ${chapterMark()}
        <h2 class="ob-title">${i18n.t('ob_welcome_title')}</h2>
        <p>${i18n.t('ob_welcome_body')}</p>
        <p class="tiny muted">${i18n.t('ob_age')}</p>
        <label class="switch-row age-ack">
          <input id="ob-age" type="checkbox" ${data.ageAck ? 'checked' : ''} />
          <span>${i18n.t('ob_age_ack')}</span>
        </label>
        <div class="theme-choose">${THEME_KEYS.map((k) => `
          <button class="theme-dot${k === data.theme ? ' active' : ''}" style="background:${THEMES[k].dot}"
            data-ob="theme" data-v="${k}" title="${THEMES[k].label}"></button>`).join('')}</div>
        <button class="btn primary full" data-ob="next" ${data.ageAck ? '' : 'disabled'}>${i18n.t('ob_next')}</button>`;
    }
    if (name === 'name') {
      return `
        ${chapterMark()}
        <h2 class="ob-title">${i18n.t('ob_name_title')}</h2>
        <input id="ob-name" type="text" maxlength="24" placeholder="${i18n.t('ob_name_ph')}" value="${esc(data.name)}" />
        <div class="ob-nav">
          <button class="btn ghost" data-ob="back">${i18n.t('ob_back')}</button>
          <button class="btn primary" data-ob="next">${i18n.t('ob_next')}</button>
        </div>`;
    }
    if (name === 'comfort') {
      return `
        ${chapterMark()}
        <h2 class="ob-title">${i18n.t('ob_comfort_title')}</h2>
        <p class="muted">${i18n.t('ob_comfort_body')}</p>
        <input id="ob-comfort" type="range" min="1" max="5" step="1" value="${data.comfort}" />
        <div class="range-ends"><span>${i18n.t('ob_comfort_1')}</span><span>${i18n.t('ob_comfort_5')}</span></div>
        <div class="ob-nav">
          <button class="btn ghost" data-ob="back">${i18n.t('ob_back')}</button>
          <button class="btn primary" data-ob="next">${i18n.t('ob_next')}</button>
        </div>`;
    }
    if (name === 'families') {
      return `
        ${chapterMark()}
        <h2 class="ob-title">${i18n.t('ob_families_title')}</h2>
        <p class="muted">${i18n.t('ob_families_body')}</p>
        <div class="fam-choose">${PREFERABLE_FAMILIES.map((f) => `
          <button class="fam-pill${data.prefFamilies.includes(f) ? ' active' : ''}" data-ob="fam" data-v="${f}">
            ${FAMILIES[f].icon} ${i18n.loc(FAMILIES[f].label)}</button>`).join('')}</div>
        <div class="ob-nav">
          <button class="btn ghost" data-ob="back">${i18n.t('ob_back')}</button>
          <button class="btn primary" data-ob="next">${i18n.t('ob_next')}</button>
        </div>`;
    }
    // notif
    return `
      ${chapterMark()}
      <h2 class="ob-title">${i18n.t('ob_notif_title')}</h2>
      <p class="muted">${i18n.t('ob_notif_body')}</p>
      <label class="switch-row">
        <input id="ob-notif" type="checkbox" ${data.notifications.enabled ? 'checked' : ''} />
        <span>${i18n.t('ob_notif_enable')}</span>
      </label>
      <label class="switch-row">
        <span>${i18n.t('ob_notif_hour')}</span>
        <input id="ob-hour" type="number" min="6" max="22" value="${data.notifications.hour}" />
      </label>
      <div class="ob-nav">
        <button class="btn ghost" data-ob="back">${i18n.t('ob_back')}</button>
        <button class="btn primary" data-ob="finish">${i18n.t('ob_start')}</button>
      </div>`;
  }

  function render() {
    ov.innerHTML = `<div class="onboarding ob-folio"><div class="ob-progress" aria-hidden="true">${
      STEPS.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')
    }</div>${stepHtml()}</div>`;
    ov.classList.add('show');
    const nameInput = $('#ob-name');
    if (nameInput) setTimeout(() => nameInput.focus(), 50);
  }

  function captureInputs() {
    const n = $('#ob-name'); if (n) data.name = n.value;
    const c = $('#ob-comfort'); if (c) data.comfort = Number(c.value);
    const a = $('#ob-age'); if (a) data.ageAck = a.checked;
    const nt = $('#ob-notif'); if (nt) data.notifications.enabled = nt.checked;
    const h = $('#ob-hour'); if (h) data.notifications.hour = Number(h.value);
  }

  function onClick(e) {
    const b = e.target.closest('[data-ob]');
    if (!b) return;
    if (b.disabled) return;
    const act = b.dataset.ob;
    captureInputs();
    if (act === 'lang') {
      i18n.setLang(b.dataset.v); data.lang = b.dataset.v; render();
    } else if (act === 'theme') {
      data.theme = b.dataset.v; applyTheme(data.theme); render();
    } else if (act === 'fam') {
      const f = b.dataset.v;
      const idx = data.prefFamilies.indexOf(f);
      if (idx >= 0) data.prefFamilies.splice(idx, 1);
      else if (data.prefFamilies.length < 3) data.prefFamilies.push(f);
      render();
    } else if (act === 'next') {
      if (step === 0 && !data.ageAck) return;
      step = Math.min(STEPS.length - 1, step + 1); render();
    } else if (act === 'back') {
      step = Math.max(0, step - 1); render();
    } else if (act === 'finish') {
      if (!data.ageAck) return;
      ov.removeEventListener('click', onClick);
      ov.removeEventListener('change', onChange);
      ov.classList.remove('show');
      ov.innerHTML = '';
      onComplete(data);
    }
  }

  function onChange(e) {
    if (e.target && e.target.id === 'ob-age') {
      data.ageAck = e.target.checked;
      const next = ov.querySelector('[data-ob="next"]');
      if (next) next.disabled = !data.ageAck;
    }
  }

  ov.addEventListener('click', onClick);
  ov.addEventListener('change', onChange);
  render();
}
