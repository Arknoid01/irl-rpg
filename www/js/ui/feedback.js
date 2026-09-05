import { i18n } from '../i18n/index.js';
import { $, esc } from './dom.js';
import { companionLineAfterQuest } from '../engine/companion.js';

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

/**
 * Overlay level-up style grimoire.
 * @param {number} level
 * @param {{ lootLabel?: string }=} opts
 */
export function levelUpOverlay(level, opts = {}) {
  const ov = $('#overlay');
  if (!ov) return;
  const lootLine = opts.lootLabel
    ? `<p class="levelup-loot">${i18n.t('levelup_loot', { item: opts.lootLabel })}</p>`
    : '';
  ov.innerHTML = `
    <div class="levelup" role="dialog" aria-live="assertive">
      <div class="levelup-seal" aria-hidden="true">✦</div>
      <div class="levelup-kicker">${i18n.t('levelup_title')}</div>
      <div class="levelup-number">${level}</div>
      <div class="levelup-sub">${i18n.t('levelup_sub')}</div>
      ${lootLine}
      <button class="btn primary" data-action="close-overlay">${i18n.t('levelup_close')}</button>
    </div>`;
  ov.classList.add('show');
}

let pendingAfterClose = [];

export function closeOverlay() {
  const ov = $('#overlay');
  if (ov) { ov.classList.remove('show'); ov.innerHTML = ''; }
  if (pendingAfterClose.length) {
    const run = pendingAfterClose;
    pendingAfterClose = [];
    for (const fn of run) fn();
  }
}

/**
 * Cérémonie de validation (plan §16) — jouée pour la quête accomplie elle-même,
 * pas pour un simple toast : « ACCOMPLIE / le monde a changé un peu / +XP »
 * puis la réaction (courte) du compagnon.
 */
function questCeremonyOverlay(state, { xp, first }, onClose) {
  const ov = $('#overlay');
  if (!ov) return;
  const reaction = companionLineAfterQuest(state, state?.lang || i18n.lang, { first });
  ov.innerHTML = `
    <div class="levelup quest-ceremony" role="dialog" aria-live="assertive">
      <div class="levelup-seal" aria-hidden="true">✦</div>
      <div class="levelup-kicker">${i18n.t('quest_ceremony_title')}</div>
      <div class="ceremony-sub">${i18n.t('quest_ceremony_sub')}</div>
      <div class="ceremony-xp">+${xp} XP</div>
      <p class="ceremony-line">${esc(reaction)}</p>
      <button class="btn primary" data-action="close-overlay">${i18n.t('quest_ceremony_close')}</button>
    </div>`;
  ov.classList.add('show');
  pendingAfterClose.push(onClose);
}

function playRemaining(effects) {
  let lastLevel = null;
  let lootAtLevel = null;
  for (const fx of effects || []) {
    switch (fx.type) {
      case 'xp': enqueueToast(i18n.t('toast_xp', { n: fx.amount })); break;
      case 'levelup': lastLevel = fx.level; enqueueToast(i18n.t('toast_level', { n: fx.level })); break;
      case 'title': enqueueToast(i18n.t('toast_title', { label: i18n.loc(fx.label) })); break;
      case 'fragment': enqueueToast(i18n.t('toast_fragment')); break;
      case 'moment': enqueueToast(i18n.t('toast_moment')); break;
      case 'event-done': enqueueToast(i18n.t('toast_item', { item: i18n.loc(fx.item) })); break;
      case 'loot':
        enqueueToast(i18n.t('toast_loot', { item: i18n.loc(fx.item) }));
        if (lastLevel != null) lootAtLevel = i18n.loc(fx.item);
        break;
      case 'region': enqueueToast(i18n.t('toast_region')); break;
      default: break;
    }
  }
  if (lastLevel != null) {
    setTimeout(() => levelUpOverlay(lastLevel, { lootLabel: lootAtLevel || undefined }), 600);
  }
}

/** Joue une liste d'effets renvoyée par le moteur. */
export function playEffects(effects, state) {
  const list = effects || [];
  const questDone = list.find((e) => e.type === 'quest-done');
  if (questDone) {
    // Le +XP de la quête est déjà montré dans la cérémonie : on l'enlève des toasts.
    const rest = list.filter((e) => e !== questDone && e.type !== 'xp');
    questCeremonyOverlay(state, questDone, () => playRemaining(rest));
    return;
  }
  playRemaining(list);
}
