// Test d'intégration DOM : boot réel de l'app dans jsdom, parcours complet
// onboarding -> jouer une quête -> switch langue -> réglages -> onglets.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync(new URL('../www/index.html', import.meta.url), 'utf8');
const tick = () => new Promise((r) => setTimeout(r, 0));

const dom = new JSDOM(html, { url: 'https://localhost/', pretendToBeVisual: true });
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.Event = window.Event;
global.MouseEvent = window.MouseEvent;
try { Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true }); } catch { /* Node fournit déjà navigator */ }
if (!window.matchMedia) window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

const $ = (s) => window.document.querySelector(s);
const $$ = (s) => [...window.document.querySelectorAll(s)];
const click = async (elOrSel) => {
  const el = typeof elOrSel === 'string' ? $(elOrSel) : elOrSel;
  assert.ok(el, `élément absent : ${elOrSel}`);
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await tick();
};

test('parcours complet dans le DOM', async () => {
  await import('../www/js/main.js');
  await tick();

  // 1. Onboarding visible
  assert.ok($('#overlay').classList.contains('show'), 'overlay onboarding');
  assert.ok($('.onboarding'), 'écran onboarding');

  // welcome -> name
  await click('[data-ob="next"]');
  $('#ob-name').value = 'Testeur';
  await click('[data-ob="next"]');
  // comfort -> families
  await click('[data-ob="next"]');
  await click($('.fam-pill'));
  assert.ok($('.fam-pill.active'), 'famille sélectionnée');
  await click('[data-ob="next"]');
  // notif -> finish
  await click('[data-ob="finish"]');
  await tick();

  // 2. App montée
  assert.equal($('#overlay').classList.contains('show'), false, 'overlay fermé');
  assert.ok($('.topbar'), 'topbar');
  assert.ok($('.tabs'), 'nav');
  const cards = $$('.quest-card');
  assert.ok(cards.length >= 1, 'des quêtes du jour');

  // 3. Jouer une quête
  const accept = $('[data-action="accept-quest"]');
  await click(accept);
  const complete = $('[data-action="complete-quest"]');
  assert.ok(complete, 'bouton valider après acceptation');
  await click(complete);
  await tick();

  const saved = JSON.parse(window.localStorage.getItem('irlrpg_save_v2'));
  assert.equal(saved.name, 'Testeur');
  assert.ok(saved.xp > 0 || saved.level > 1, 'XP gagnée et persistée');
  assert.equal(saved.history.totalCompleted, 1);

  // 4. Switch de langue
  const navBefore = $('.tab.active').textContent.trim();
  await click('[data-action="setLang"][data-lang="fr"]');
  await click('[data-action="setLang"][data-lang="en"]');
  const navAfter = $('.tab').textContent;
  assert.match(navAfter, /Adventure/, 'nav en anglais');
  assert.equal(JSON.parse(window.localStorage.getItem('irlrpg_save_v2')).lang, 'en');
  await click('[data-action="setLang"][data-lang="fr"]');

  // 5. Onglet Personnage
  await click('[data-action="goto"][data-id="character"]');
  assert.ok($('.skills-grid'), 'grille de compétences');
  assert.match($('#root').textContent, /Testeur/);

  // 6. Réglages
  await click('[data-action="open-settings"]');
  assert.ok($('.sheet'), 'feuille de réglages');
  await click('[data-set="close"]');
  assert.equal($('#overlay').classList.contains('show'), false, 'réglages fermés');

  // 7. Nouveau jour (re-tirage)
  await click('[data-action="goto"][data-id="adventure"]');
  await click('[data-action="new-day"]');
  await tick();
  assert.ok($$('.quest-card').length >= 1, 'nouvelles quêtes après « nouvelle journée »');
});
