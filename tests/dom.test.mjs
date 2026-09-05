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
global.getComputedStyle = window.getComputedStyle.bind(window);
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

  // 1. Choix de langue (tout premier écran, avant même le grimoire fermé)
  assert.ok($('#overlay').classList.contains('show'), 'overlay langue');
  assert.ok($('[data-ob="lang-gate"]'), 'écran de choix de langue');
  await click('[data-ob="lang-gate"][data-v="fr"]');

  // Écran d'ouverture (grimoire fermé) puis onboarding
  assert.ok($('.cover-screen'), 'écran de couverture');
  await click('[data-ob="next"]');
  assert.ok($('.onboarding'), 'écran onboarding');

  // welcome -> name (âge 16+ obligatoire)
  const age = $('#ob-age');
  assert.ok(age, 'case âge');
  assert.ok($('[data-ob="next"]').disabled, 'Continuer bloqué sans ack âge');
  age.checked = true;
  age.dispatchEvent(new window.Event('change', { bubbles: true }));
  await tick();
  assert.equal($('[data-ob="next"]').disabled, false, 'Continuer débloqué');
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
  const ceremony = $('.quest-ceremony');
  assert.ok(ceremony, 'cérémonie de validation');
  assert.match($('.ceremony-xp').textContent, /\+\d+\s*XP/);
  const reaction = $('.ceremony-line').textContent.trim();
  assert.ok(reaction.length > 3, 'réaction du compagnon affichée');
  await click('[data-action="close-overlay"]');
  await tick();

  const saved = JSON.parse(window.localStorage.getItem('irlrpg_save_v2'));
  assert.equal(saved.name, 'Testeur');
  assert.ok(saved.xp > 0 || saved.level > 1, 'XP gagnée et persistée');
  assert.equal(saved.history.totalCompleted, 1);

  // 4. Switch de langue — désormais dans les Réglages, plus dans la topbar
  // (le sélecteur topbar a été retiré, cf. DECISIONS.md D11).
  await click('[data-action="open-settings"]');
  await click('[data-set="lang"][data-v="en"]');
  const navAfter = $('.tab').textContent;
  assert.match(navAfter, /Adventure/, 'nav en anglais');
  assert.equal(JSON.parse(window.localStorage.getItem('irlrpg_save_v2')).lang, 'en');
  await click('[data-set="lang"][data-v="fr"]');
  await click('[data-set="close"]');

  // 5b. Journal vivant
  await click('[data-action="goto"][data-id="journal"]');
  assert.ok($('.journal-chapter'), 'chapitre journal');
  await click('[data-action="goto"][data-id="world"]');
  assert.ok($('.world-map'), 'carte SVG');
  assert.ok($$('.map-node').length >= 6, 'régions sur la carte');
  await click('.map-node[data-id="foyer"]');
  assert.ok($('.map-detail'), 'panneau détail région');

  // 6. Onglet Personnage + musée
  await click('[data-action="goto"][data-id="character"]');
  assert.ok($('.skills-grid'), 'grille de compétences');
  assert.match($('#root').textContent, /Testeur/);
  assert.ok($('.museum-empty, .museum-grid'), 'section musée');

  // 7. Réglages
  await click('[data-action="open-settings"]');
  assert.ok($('.sheet'), 'feuille de réglages');
  await click('[data-set="close"]');
  assert.equal($('#overlay').classList.contains('show'), false, 'réglages fermés');

  // 8. Nouveau jour (re-tirage)
  await click('[data-action="goto"][data-id="adventure"]');
  await click('[data-action="new-day"]');
  await tick();
  const freshCount = $$('.quest-card').length;
  assert.ok(freshCount >= 1, 'nouvelles quêtes après « nouvelle journée »');

  // 9. Ignorer une quête : gratuit, elle disparaît simplement de la liste
  const toIgnore = $('[data-action="ignore-quest"]');
  assert.ok(toIgnore, 'bouton ignorer disponible');
  const ignoredId = toIgnore.dataset.id;
  await click(toIgnore);
  assert.equal($$('.quest-card').length, freshCount - 1, 'la quête ignorée disparaît de la liste');
  const afterIgnore = JSON.parse(window.localStorage.getItem('irlrpg_save_v2'));
  const ignoredQuest = afterIgnore.quests.find((q) => q.id === ignoredId);
  assert.equal(ignoredQuest.status, 'ignored');
});

test('boutique de thèmes : ouverture depuis Réglages, déblocage puis activation', async () => {
  await click('[data-action="open-settings"]');
  await click('[data-set="shop"]');
  assert.ok($('.shop-sheet'), 'feuille boutique affichée');
  assert.equal($$('.shop-card').length, 3, 'les 3 thèmes sont listés');
  assert.ok($('.shop-status.active'), 'un thème actif est marqué');
  assert.ok($('[data-shop="unlock"][data-v="cyberpunk"]'), 'cyberpunk pas encore débloqué');
  const preview = $('.shop-preview-video video');
  assert.ok(preview, 'cyberpunk a une vraie vidéo d’aperçu (pas le repli CSS)');
  assert.match(preview.getAttribute('src'), /cyberpunk-preview\.mp4$/);

  // Débloquer active tout de suite le thème (sinon rien ne semble se
  // passer à l'écran — retour direct d'un test réel sur appareil).
  await click('[data-shop="unlock"][data-v="cyberpunk"]');
  assert.equal(window.document.documentElement.dataset.theme, 'cyberpunk', 'thème appliqué au document');
  assert.ok(
    $('[data-shop="activate"][data-v="nordique"]'),
    'nordique redevient « activer » une fois qu’il n’est plus le thème actif',
  );
  const saved = JSON.parse(window.localStorage.getItem('irlrpg_save_v2'));
  assert.equal(saved.theme, 'cyberpunk');
  assert.ok(saved.unlockedThemes.includes('cyberpunk'));

  // reviens à nordique pour ne pas polluer les tests suivants de ce fichier.
  await click('[data-shop="activate"][data-v="nordique"]');
  assert.equal(window.document.documentElement.dataset.theme, 'nordique');
  await click('[data-shop="close"]');
});

test('ripple au clic : seulement sous cyberpunk, jamais sous nordique', async () => {
  const { initRipples } = await import('../www/js/ui/ripple.js');
  initRipples();
  // Un .iconbtn (réglages) plutôt qu'un .tab : cliquer un .tab déclenche
  // dispatch('goto') -> render() qui remplace tout #root (nav incluse) et
  // détacherait la référence captée ici ; le bouton réglages, lui, ne
  // remplace que #overlay.
  const btn = window.document.querySelector('[data-action="open-settings"]');
  assert.ok(btn, 'bouton réglages disponible');

  window.document.documentElement.dataset.theme = 'nordique';
  btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true, clientX: 5, clientY: 5 }));
  await tick();
  assert.equal(btn.querySelector('.ripple'), null, 'pas de ripple sous nordique');

  // Ne pas fermer les réglages ici : close() ré-appelle render(), qui
  // remplace #root (topbar incluse) et détacherait `btn`. Recliquer
  // open-settings pendant que c'est déjà ouvert ne fait que re-render la
  // feuille elle-même, sans toucher au bouton.
  window.document.documentElement.dataset.theme = 'cyberpunk';
  btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true, clientX: 5, clientY: 5 }));
  await tick();
  const span = btn.querySelector('.ripple');
  assert.ok(span, 'un ripple apparaît sous cyberpunk');

  // jsdom ne joue pas les animations CSS : animationend ne part jamais,
  // seul le délai de secours retire l'élément.
  await new Promise((r) => setTimeout(r, 750));
  assert.equal(btn.querySelector('.ripple'), null, 'le ripple est retiré après le délai de secours');

  window.document.documentElement.dataset.theme = 'nordique';
  await click('[data-set="close"]');
});

test('hideOverlay : fondu synchrone, contenu vidé après coup', async () => {
  const { hideOverlay } = await import('../www/js/ui/dom.js');
  const ov = window.document.createElement('div');
  ov.innerHTML = '<p>contenu</p>';
  ov.classList.add('show');
  window.document.body.appendChild(ov);

  hideOverlay(ov);
  assert.equal(ov.classList.contains('show'), false, 'la classe show part immédiatement');
  assert.notEqual(ov.innerHTML, '', 'le contenu reste le temps du fondu');

  await new Promise((r) => setTimeout(r, 380));
  assert.equal(ov.innerHTML, '', 'le contenu est vidé après le délai de secours');

  // Rouvert entre-temps : ne doit jamais être effacé sous les pieds de l'utilisateur.
  ov.innerHTML = '<p>nouveau contenu</p>';
  ov.classList.add('show');
  hideOverlay(ov);
  ov.innerHTML = '<p>rouvert avant la fin du fondu</p>';
  ov.classList.add('show');
  await new Promise((r) => setTimeout(r, 380));
  assert.notEqual(ov.innerHTML, '', 'un overlay rouvert entre-temps ne doit pas être vidé');

  ov.remove();
});
