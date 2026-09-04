import { i18n } from '../i18n/index.js';
import { $ } from './dom.js';

let toastTimer;
export function showToast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

let toastQueue = [];
let queueRunning = false;
function enqueueToast(msg) {
  toastQueue.push(msg);
  if (queueRunning) return;
  queueRunning = true;
  const step = () => {
    if (!toastQueue.length) { queueRunning = false; return; }
    showToast(toastQueue.shift());
    setTimeout(step, 1100);
  };
  step();
}

export function levelUpOverlay(level) {
  const ov = $('#overlay');
  if (!ov) return;
  ov.innerHTML = `
    <div class="levelup" role="dialog" aria-live="assertive">
      <div class="levelup-kicker">${i18n.t('levelup_title')}</div>
      <div class="levelup-number">${level}</div>
      <div class="levelup-sub">${i18n.t('levelup_sub')}</div>
      <button class="btn primary" data-action="close-overlay">${i18n.t('levelup_close')}</button>
    </div>`;
  ov.classList.add('show');
}

export function closeOverlay() {
  const ov = $('#overlay');
  if (ov) { ov.classList.remove('show'); ov.innerHTML = ''; }
}

/** Joue une liste d'effets renvoyée par le moteur. */
export function playEffects(effects) {
  let lastLevel = null;
  for (const fx of effects || []) {
    switch (fx.type) {
      case 'xp': enqueueToast(i18n.t('toast_xp', { n: fx.amount })); break;
      case 'levelup': lastLevel = fx.level; enqueueToast(i18n.t('toast_level', { n: fx.level })); break;
      case 'title': enqueueToast(i18n.t('toast_title', { label: i18n.loc(fx.label) })); break;
      case 'fragment': enqueueToast(i18n.t('toast_fragment')); break;
      case 'moment': enqueueToast(i18n.t('toast_moment')); break;
      case 'event-done': enqueueToast(i18n.t('toast_item', { item: i18n.loc(fx.item) })); break;
      case 'loot': enqueueToast(i18n.t('toast_loot', { item: i18n.loc(fx.item) })); break;
      default: break;
    }
  }
  if (lastLevel != null) setTimeout(() => levelUpOverlay(lastLevel), 600);
}
