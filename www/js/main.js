import { browserStorage, loadState, saveState, wipe, exportState, importState } from './state/store.js';
import * as game from './engine/game.js';
import { needsNewDay } from './engine/game.js';
import { i18n, detectLang } from './i18n/index.js';
import { applyTheme } from './ui/theme.js';
import { $ } from './ui/dom.js';
import { renderAdventure } from './ui/screens/adventure.js';
import { renderWorld, selectWorldRegion } from './ui/screens/world.js';
import { renderJournal } from './ui/screens/journal.js';
import { renderCharacter } from './ui/screens/character.js';
import { playEffects, closeOverlay, showToast } from './ui/feedback.js';
import { startOnboarding } from './ui/onboarding.js';
import { openSettings } from './ui/settings.js';
import { openShop } from './ui/shop.js';
import { syncDailyReminder, shareText } from './platform/notifications.js';
import { syncStatusBar } from './platform/statusbar.js';
import { QUESTS } from './data/quests.js';
import { setMuseumFilter, selectMuseumItem } from './ui/components/charBits.js';
import { clearRegionFresh } from './engine/worldView.js';
import { initRipples } from './ui/ripple.js';


let storage;
let state;
let view = 'adventure';
let settingsOpen = false;
let shopOpen = false;

const SCREENS = {
  adventure: renderAdventure,
  world: renderWorld,
  journal: renderJournal,
  character: renderCharacter,
};

const NAV = [
  { id: 'adventure', icon: '⚔', key: 'nav_adventure' },
  { id: 'world', icon: '🗺', key: 'nav_world' },
  { id: 'journal', icon: '✒', key: 'nav_journal' },
  { id: 'character', icon: '⚜', key: 'nav_character' },
];

/* ─────────────── boot ─────────────── */

function boot() {
  storage = browserStorage();
  state = loadState(storage);
  if (!state.lang || (state.lang === 'fr' && !state.onboarded)) {
    state.lang = detectLang();
  }
  i18n.setLang(state.lang);
  applyTheme(state.theme);
  syncStatusBar(state.theme);

  if (!state.onboarded) {
    startOnboarding(state, (data) => {
      const r = game.finishOnboarding(state, data);
      state = r.state;
      i18n.setLang(state.lang);
      applyTheme(state.theme);
      syncStatusBar(state.theme);
      persist();
      render();
      playEffects(r.effects.filter((e) => e.type !== 'onboarded'), state);
      syncDailyReminder(state);
    });
    return;
  }

  ensureDay();
  const hash = (location.hash || '').slice(1);
  if (SCREENS[hash]) view = hash;
  render();
  syncDailyReminder(state);
}

function ensureDay() {
  if (needsNewDay(state)) {
    const r = game.newDay(state);
    state = r.state;
    // petite variété de la phrase du compagnon
    state.seeds.companion = (state.seeds.companion || 0) + 1;
    persist();
  }
}

function persist() {
  saveState(storage, state);
}

/* ─────────────── dispatch ─────────────── */

function apply(result) {
  state = result.state;
  persist();
  render();
  playEffects(result.effects, state);
}

async function dispatch(action, args = {}) {
  switch (action) {
    case 'goto': {
      const next = args.id || 'adventure';
      if (view === 'world' && next !== 'world' && state.history?.regionsFresh?.length) {
        clearRegionFresh(state);
        persist();
      }
      view = next;
      render();
      break;
    }

    case 'select-region':
      selectWorldRegion(args.id);
      view = 'world';
      render();
      break;

    case 'museum-filter':
      setMuseumFilter(args.id || null);
      view = 'character';
      render();
      break;

    case 'select-loot':
      selectMuseumItem(args.id);
      view = 'character';
      render();
      break;

    case 'new-day': {
      // force un nouveau tirage même si drawDate == aujourd'hui
      state.drawDate = null;
      const r = game.newDay(state);
      state = r.state;
      state.seeds.companion = (state.seeds.companion || 0) + 1;
      view = 'adventure';
      persist();
      render();
      showToast(i18n.t('new_day_hint'));
      break;
    }

    case 'accept-quest': apply(game.acceptQuest(state, { id: args.id })); break;
    case 'ignore-quest': apply(game.ignoreQuest(state, { id: args.id })); break;
    case 'complete-quest': apply(game.completeQuest(state, { id: args.id })); break;
    case 'complete-event': apply(game.completeEvent(state, {})); break;
    case 'dismiss-event': apply(game.dismissEvent(state)); break;

    case 'share-quest': {
      const q = state.quests.find((x) => x.id === args.id) || QUESTS.find((x) => x.id === args.id);
      if (!q) break;
      const res = await shareText(
        i18n.t('share_text', { quest: i18n.loc(q.text) }),
        i18n.t('share_title'),
      );
      if (res === 'copied') showToast(i18n.t('set_copied'));
      break;
    }

    case 'open-settings':
      shopOpen = false;
      settingsOpen = true;
      openSettings({ getState: () => state, dispatch, close: () => { settingsOpen = false; closeOverlay(); render(); } });
      break;

    case 'open-shop':
      settingsOpen = false;
      shopOpen = true;
      openShop({ getState: () => state, dispatch, close: () => { shopOpen = false; closeOverlay(); render(); } });
      break;

    case 'close-overlay': closeOverlay(); break;

    /* réglages */
    case 'setTheme':
      state = game.setTheme(state, args).state;
      applyTheme(state.theme); syncStatusBar(state.theme); persist(); render();
      softRerenderSettings(); softRerenderShop();
      break;
    case 'unlockTheme': {
      const r = game.unlockTheme(state, args);
      state = r.state; persist(); render();
      playEffects(r.effects, state);
      softRerenderShop();
      break;
    }
    case 'setLang':
      state.lang = args.lang === 'en' ? 'en' : 'fr';
      i18n.setLang(state.lang); persist(); render(); softRerenderSettings();
      syncDailyReminder(state);
      break;
    case 'setComfort':
      state = game.setComfort(state, args).state; persist();
      break;
    case 'setPrefFamilies':
      state = game.setPrefFamilies(state, args).state; persist(); softRerenderSettings();
      break;
    case 'setNotifications': {
      const r = game.setNotifications(state, args);
      state = r.state; persist();
      syncDailyReminder(state);
      break;
    }
    case 'renameHero': {
      const r = game.renameHero(state, args);
      state = r.state; persist(); render(); softRerenderSettings();
      showToast(i18n.t('set_renamed'));
      break;
    }
    case 'exportSave':
      try {
        await navigator.clipboard.writeText(exportState(state));
        showToast(i18n.t('set_copied'));
      } catch { showToast(exportState(state).slice(0, 40) + '…'); }
      break;
    case 'importSave': {
      const txt = window.prompt(i18n.t('set_import_prompt'));
      if (!txt) break;
      try {
        state = importState(txt);
        i18n.setLang(state.lang);
        applyTheme(state.theme);
        persist(); render(); softRerenderSettings();
        showToast(i18n.t('set_import_ok'));
      } catch { showToast(i18n.t('set_import_err')); }
      break;
    }
    case 'wipe':
      if (window.confirm(i18n.t('set_wipe_confirm'))) {
        wipe(storage);
        location.reload();
      }
      break;

    default:
      break;
  }
}

function softRerenderSettings() {
  if (settingsOpen && typeof openSettings._rerender === 'function') openSettings._rerender();
}

function softRerenderShop() {
  if (shopOpen && typeof openShop._rerender === 'function') openShop._rerender();
}

/* ─────────────── render ─────────────── */

function topbarHtml() {
  return `
  <header class="topbar">
    <div class="brand"><span class="glyph" aria-hidden="true">•</span> ${i18n.t('app_name')}</div>
    <div class="topbar-actions">
      <button class="iconbtn" data-action="open-settings" aria-label="${i18n.t('settings')}">⚙</button>
    </div>
  </header>`;
}

function navHtml() {
  return `<nav class="tabs">${NAV.map((n) => `
    <button class="tab${view === n.id ? ' active' : ''}" data-action="goto" data-id="${n.id}">
      <span class="ic">${n.icon}</span>${i18n.t(n.key)}
    </button>`).join('')}</nav>`;
}

function render() {
  const screen = (SCREENS[view] || renderAdventure)(state);
  $('#root').innerHTML = `
    <div class="book">
      <div class="page">
        ${topbarHtml()}
        <main class="wrap">${screen}</main>
      </div>
    </div>
    ${navHtml()}`;
  document.documentElement.lang = state.lang;
}

/* ─────────────── events ─────────────── */

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const args = { id: el.dataset.id, lang: el.dataset.lang };
  dispatch(action, args);
});

initRipples();

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
// Redécoupe le jour si l'app reste ouverte à minuit / revient au premier plan.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state && state.onboarded && needsNewDay(state)) {
    ensureDay();
    render();
  }
});
