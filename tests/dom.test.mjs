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

  // 2. App montée — plus de pop-up au premier lancement (D19) : la carte boutique
  // n'apparaît qu'après quelques quêtes vécues.
  assert.equal($('[data-tip]'), null, 'aucune astuce modale au premier lancement');
  assert.equal($('.shop-offer'), null, 'pas de carte boutique avant d’avoir joué');
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
  // Activation clavier d'un nœud de carte (a11y : role=button + tabindex, mais
  // c'est un <g> SVG — pas d'activation native).
  const node = $('.map-node[data-id="social"]');
  assert.equal(node.getAttribute('role'), 'button');
  node.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  await tick();
  assert.equal($('.map-node.selected')?.dataset.id, 'social', 'nœud sélectionné au clavier');
  await click('.map-node[data-id="foyer"]');
  assert.ok($('.map-detail'), 'panneau détail région');

  // 6. Onglet Personnage — page « Mon aventure »
  await click('[data-action="goto"][data-id="character"]');
  assert.ok($('.traits-list'), 'traits de l’aventurier');
  assert.ok($('.collect-grid'), 'collections Moments / Découvertes');
  assert.ok($('.chronicle-box'), 'chronique en cours');
  assert.match($('#root').textContent, /Testeur/);
  assert.ok($('.museum-empty, .museum-grid'), 'section musée');

  // 7. Réglages — Échap referme (a11y clavier)
  await click('[data-action="open-settings"]');
  assert.ok($('.sheet'), 'feuille de réglages');
  assert.ok($('#overlay').contains(window.document.activeElement), 'focus déplacé dans la feuille');
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await tick();
  assert.equal($('#overlay').classList.contains('show'), false, 'Échap referme les réglages');

  // 8. Le passage de jour est automatique (minuit / retour au premier plan) —
  // plus de bouton « ↻ Nouvelle journée » sur l'écran Aventure.
  await click('[data-action="goto"][data-id="adventure"]');
  assert.equal($('[data-action="new-day"]'), null, 'pas de bouton de re-tirage manuel');
  const freshCount = $$('.quest-card').length;
  assert.ok(freshCount >= 1, 'des quêtes sont affichées');

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

test('réglages : onglet Boutique — essai en cours, puis un achat débloque tout (D17/D20)', async () => {
  await click('[data-action="open-settings"]');
  await click('[data-set="tab"][data-v="themes"]');
  assert.ok($('.settings-sheet'), 'feuille de réglages affichée');
  assert.ok($('.set-tab.active') && /Boutique/.test($('.set-tab.active').textContent), 'onglet Boutique actif');
  assert.equal($$('.shop-card').length, 7, 'les 7 thèmes sont listés');
  assert.ok($('.shop-status.active'), 'un thème actif est marqué');
  assert.ok($('.shop-hero:not(.owned) .shop-cta'), 'héros « Cairn Complet » avec bouton d’achat tant que non débloqué');
  assert.equal($$('.shop-perks li.ok').length, 5, 'cinq avantages livrés');
  assert.equal($$('.shop-perks li.soon').length, 0, 'plus aucun « Bientôt » : tout ce qui est promis est livré');
  assert.match($('.shop-trial-status').textContent, /Essai gratuit en cours/, 'état de l’essai affiché');
  assert.ok($('[data-shop="activate"][data-v="cyberpunk"]'), 'pendant l’essai, tous les mondes s’activent');
  assert.equal($('[data-shop="unlock"][data-v="cyberpunk"]'), null);
  // Plus de vidéo : chaque carte a un aperçu live (mini-page thémée).
  assert.equal($('video'), null, 'aucun aperçu vidéo');
  assert.equal($$('.shop-preview .page').length, 7, 'chaque thème a un aperçu live rendu');

  // Acheter Cairn Complet (les 6 mondes à vie), puis activer cyberpunk.
  await click('.shop-cta');
  await click('[data-shop="activate"][data-v="cyberpunk"]');
  assert.equal(window.document.documentElement.dataset.theme, 'cyberpunk', 'thème appliqué au document');
  assert.match($('.section-label span').textContent, /Missions du jour/, 'vocab cyberpunk sur l’écran');

  const saved = JSON.parse(window.localStorage.getItem('irlrpg_save_v2'));
  assert.equal(saved.theme, 'cyberpunk');
  for (const k of ['sombre', 'cyberpunk', 'enquete', 'mystique', 'postapo', 'cockpit']) {
    assert.ok(saved.unlockedThemes.includes(k), `${k} débloqué par la Collection`);
  }
  assert.equal($('.shop-cta'), null, 'bouton d’achat retiré une fois débloqué');
  assert.ok($('.shop-hero.owned'), 'héros passe en état « à toi »');
  assert.ok($('[data-shop="activate"][data-v="mystique"]'), 'les autres thèmes passent à « activer »');

  // Restaurer : présent, ne casse rien.
  assert.ok($('[data-shop="restore"]'), 'bouton restaurer présent');
  await click('[data-shop="restore"]');
  await tick();
  assert.ok($('.settings-sheet'), 'l’onglet Thèmes tient après une restauration');
  assert.ok(
    $('.tiny.muted') && [...$$('.tiny.muted')].some((n) => /démo locale|local demo/i.test(n.textContent)),
    'note « démo locale » affichée tant que l’achat réel n’est pas branché',
  );

  // reviens à nordique pour ne pas polluer les tests suivants de ce fichier.
  await click('[data-shop="activate"][data-v="nordique"]');
  assert.equal(window.document.documentElement.dataset.theme, 'nordique');
  assert.match($('.section-label span').textContent, /Quêtes du jour/, 'vocab par défaut restauré');
  await click('[data-set="close"]');
});

test('ripple au clic : sous les thèmes payants, jamais sous nordique', async () => {
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

  // Le thème sombre (payant) a lui aussi son ripple (diffusion d'encre).
  window.document.documentElement.dataset.theme = 'sombre';
  btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true, clientX: 5, clientY: 5 }));
  await tick();
  assert.ok(btn.querySelector('.ripple'), 'un ripple apparaît aussi sous sombre');
  await new Promise((r) => setTimeout(r, 750));

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

test('aventure en pause après l’essai (D20) : panneau de fin de prologue, souvenirs gardés', async () => {
  const { renderAdventure } = await import('../www/js/ui/screens/adventure.js');
  const { defaultState } = await import('../www/js/state/defaults.js');
  const base = { ...defaultState(), name: 'Léa', onboarded: true };
  base.history = { ...base.history, daysPlayed: 3, totalCompleted: 5 };

  const trial = renderAdventure({ ...base, quests: [] });
  assert.match(trial, /Essai gratuit · jour 3 sur 7/);
  const last = renderAdventure({ ...base, quests: [], history: { ...base.history, daysPlayed: 7 } });
  assert.match(last, /Dernier jour de ton essai gratuit/);

  const paused = renderAdventure({ ...base, trialEnded: true, quests: [] });
  assert.match(paused, /class="panel trial-over"/);
  assert.match(paused, /Léa, tu as atteint la crête/);
  assert.match(paused, /class="retro-stats"/, 'récap chiffré du prologue');
  assert.match(paused, /<b>5<\/b><span>/, 'quêtes vécues dans le récap');
  const rich = renderAdventure({
    ...base, trialEnded: true, quests: [],
    inventory: [{ item: { fr: '🥖 Pain légendaire', en: '🥖 Legendary bread' }, date: '2026-09-02' }],
    skills: { ...base.skills, social: 300 },
    history: { ...base.history, familleCompleted: { social: 4, chaos: 1 }, ordealsDone: ['o_pont'] },
  });
  assert.match(rich, /Premier souvenir :<\/span> 🥖 Pain légendaire/);
  assert.match(rich, /Épreuve franchie :<\/span> Le pont/);
  assert.match(rich, /Ce que tu as le plus vécu :<\/span> .*Social/);
  assert.match(rich, /Ton style :/);
  assert.match(paused, /data-action="open-shop"/);
  assert.doesNotMatch(paused, /Essai gratuit · jour/);

  const withOrdeal = renderAdventure({ ...base, level: 3, ordeal: { id: 'o_pont', skipped: [] }, quests: [] });
  assert.match(withOrdeal, /class="panel ordeal-panel"/);
  assert.match(withOrdeal, /Le pont/);
  assert.match(withOrdeal, /Niveau 4/);
  assert.match(withOrdeal, /data-action="reroll-ordeal"/);
  assert.match(withOrdeal, /data-action="complete-ordeal"/);
  assert.doesNotMatch(renderAdventure({ ...base, trialEnded: true, ordeal: { id: 'o_pont', skipped: [] }, quests: [] }), /ordeal-panel/, 'pas d’épreuve pendant la pause');

  const owner = renderAdventure({ ...base, complete: true, quests: [] });
  assert.doesNotMatch(owner, /trial-line|trial-over/, 'rien pour un acheteur');
});

test('épreuves (D21) : le compagnon réagit, le journal propose le partage', async () => {
  const { companionLineForState } = await import('../www/js/engine/companion.js');
  const { renderJournal } = await import('../www/js/ui/screens/journal.js');
  const { defaultState } = await import('../www/js/state/defaults.js');
  const { voiceFor } = await import('../www/js/data/themes.js');
  const now = new Date(2026, 8, 21, 10);
  const q = { id: 'x', famille: 'social', xp: 50, status: 'proposed', text: { fr: 'x', en: 'x' } };
  const base = { ...defaultState(), onboarded: true, name: 'Léa', quests: [q], theme: 'cyberpunk' };
  const V = voiceFor('cyberpunk').ctx;
  // épreuve en attente : la réplique d'attente sort une fois sur deux (seed pair)
  const waiting = companionLineForState({ ...base, ordeal: { id: 'o_pont', skipped: [] }, seeds: { companion: 0 } }, 'fr', now);
  assert.ok(V.ordealWaiting.fr.includes(waiting), waiting);
  // épreuve passée aujourd'hui : réaction dédiée
  const entry = { id: '2026-09-21~epreuve~0', date: '2026-09-21', kind: 'epreuve', title: { fr: 'Le pont', en: 'The bridge' }, text: { fr: 'Souvenir.', en: 'Memory.' }, souvenir: { fr: '🌉 Pont', en: '🌉 Bridge' }, level: 5 };
  const done = companionLineForState({ ...base, journal: [entry, { date: '2026-09-21', kind: 'chapitre', text: { fr: 'c', en: 'c' } }] }, 'fr', now);
  assert.ok(V.ordealDone.fr.includes(done), done);
  // journal : bouton de partage sur l'entrée d'épreuve
  const html = renderJournal({ ...base, journal: [entry] });
  assert.match(html, /data-action="share-ordeal" data-id="2026-09-21~epreuve~0"/);
});
