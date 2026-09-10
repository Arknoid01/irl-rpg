// Intégration : quand l'app reste ouverte, le passage de minuit local
// réinitialise les quêtes du jour tout seul (main.js scheduleDayWatch).
// On simule l'horloge (Date + setTimeout) et on avance jusqu'après minuit.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
import { defaultState } from '../www/js/state/defaults.js';

const html = fs.readFileSync(new URL('../www/index.html', import.meta.url), 'utf8');

test('minuit : nouveau jour automatique quand l’app ne quitte pas le premier plan', async (t) => {
  // 23:59:00 heure locale, la veille du changement de date.
  const start = new Date(2026, 5, 15, 23, 59, 0, 0);
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now: start.getTime() });

  const dom = new JSDOM(html, { url: 'https://localhost/', pretendToBeVisual: true });
  const { window } = dom;
  global.window = window;
  global.document = window.document;
  global.localStorage = window.localStorage;
  global.location = window.location;
  global.Event = window.Event;
  global.MouseEvent = window.MouseEvent;
  global.KeyboardEvent = window.KeyboardEvent;
  global.getComputedStyle = window.getComputedStyle.bind(window);
  try { Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true }); } catch { /* déjà là */ }
  if (!window.matchMedia) window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

  // Sauvegarde déjà jouée, tirage daté du 15/06.
  const seed = defaultState();
  seed.onboarded = true;
  seed.ageAck = true;
  seed.name = 'Testeur';
  seed.drawDate = '2026-06-15';
  seed.history.daysPlayed = 4;
  seed.quests = [{
    id: 'seed_q', famille: 'quotidien', xp: 60, effort: 'leger',
    registre: 'quete', audace: 1, contexte: [], status: 'proposed',
    text: { fr: 'Une quête de la veille.', en: 'Yesterday quest.' },
    safe_fallback: { fr: '.', en: '.' },
  }];
  window.localStorage.setItem('irlrpg_save_v2', JSON.stringify(seed));

  // boot() tourne à l'import : il ne redécoupe pas le jour (drawDate == today
  // simulé) et programme le réveil de minuit.
  await import('../www/js/main.js');
  await Promise.resolve();

  let saved = JSON.parse(window.localStorage.getItem('irlrpg_save_v2'));
  assert.equal(saved.drawDate, '2026-06-15', 'pas encore de nouveau jour à 23:59');
  assert.equal(saved.history.daysPlayed, 4);

  // On franchit minuit : le setTimeout planifié se déclenche.
  t.mock.timers.tick(5 * 60 * 1000);
  await Promise.resolve();

  saved = JSON.parse(window.localStorage.getItem('irlrpg_save_v2'));
  assert.equal(saved.drawDate, '2026-06-16', 'le jour a basculé automatiquement');
  assert.equal(saved.history.daysPlayed, 5, 'un jour de plus joué');
  assert.ok(saved.quests.length >= 1, 'de nouvelles quêtes ont été tirées');
  assert.ok(
    !saved.quests.some((q) => q.id === 'seed_q'),
    'les quêtes de la veille ont laissé la place',
  );

  // L'écran Aventure est réaffiché (app au premier plan).
  assert.ok(window.document.querySelector('.quest-card'), 'écran Aventure re-rendu');
});
