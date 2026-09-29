import { companionLineForState } from '../../engine/companion.js';
import { i18n } from '../../i18n/index.js';
import { themeText } from '../themeText.js';
import { esc } from '../dom.js';
import { heroCardHtml } from '../components/charBits.js';
import { questCardHtml } from '../components/questCard.js';
import { eventCardHtml } from '../components/eventCard.js';
import { ordealCardHtml } from '../components/ordealCard.js';
import { hasAccess, inTrial, trialDay, TRIAL_DAYS } from '../../engine/access.js';
import { computeStyle } from '../../engine/progression.js';
import { FAMILIES } from '../../data/taxonomy.js';
import { STYLE_DEFAULT } from '../../data/titles.js';
import { ORDEAL_BY_ID } from '../../data/ordeals.js';

// Accueil : les aventures d'abord (ROADMAP Phase 0). Ordre = jour → le
// compagnon plante le décor → les 3 propositions → l'événement → un résumé
// de progression discret en bas. Les chiffres de perso (niveau, XP, série)
// ne dominent plus le haut de l'écran.
export function renderAdventure(state) {
  if (!hasAccess(state)) return pausedHtml(state);
  const line = companionLineForState(state, state.lang || i18n.lang);
  const allDoneTitle = themeText('allDone', 'all_done_title');

  const active = state.quests.filter((q) => q.status === 'proposed' || q.status === 'accepted');
  const done = state.quests.filter((q) => q.status === 'done');
  const ignored = state.quests.filter((q) => q.status === 'ignored');

  let questsBlock;
  if (state.quests.length === 0) {
    // État normalement jamais atteint (le tirage est automatique au boot et à
    // minuit) — filet de secours si une sauvegarde arrive sans quêtes.
    questsBlock = `<div class="panel empty">
      <p><b>${i18n.t('no_quests_title')}</b></p>
      <p class="muted">${i18n.t('no_quests_body')}</p>
      <button class="btn primary" data-action="new-day">${i18n.t('start_day')}</button>
    </div>`;
  } else if (active.length === 0 && done.length === 0) {
    questsBlock = `<div class="panel empty">
      <p><b>${allDoneTitle}</b></p>
      <p class="muted">${i18n.t('all_done_body')}</p>
    </div>`;
  } else {
    const listed = [...active, ...done];
    questsBlock = listed.map((q) => questCardHtml(q, state.theme)).join('');
    if (active.length === 0 && done.length > 0) {
      questsBlock += `<div class="panel empty" style="margin-top:8px">
        <p><b>${allDoneTitle}</b></p>
        <p class="muted">${i18n.t('all_done_body')}</p>
      </div>`;
    }
  }

  const dayNo = Math.max(1, state.history?.daysPlayed || 1);

  // Élan du jour : une fraction + une phrase narrative, jamais un %.
  // Indicateur, pas une contrainte (ROADMAP Phase 0.2).
  let elanLine = '';
  if (state.quests.length > 0) {
    const denom = Math.max(1, state.quests.length - ignored.length);
    const n = done.length;
    let phrase;
    if (n === 0) phrase = i18n.t('elan_phrase_start');
    else if (n >= denom) phrase = i18n.t('elan_phrase_done');
    else phrase = i18n.t('elan_phrase_mid');
    elanLine = `<p class="elan-line"><span class="elan-count">🌱 ${n} / ${denom} ${i18n.t('elan_unit')}</span> — ${phrase}</p>`;
  }

  return `
    <p class="day-kicker">${i18n.t('day_kicker', { n: dayNo })}</p>
    ${trialLineHtml(state)}
    <p class="companion-line">${esc(line)}</p>
    ${ordealCardHtml(state)}
    <div class="section-label">
      <span>${themeText('questsHeading', 'quests_today')}</span>
    </div>
    ${elanLine}
    ${questsBlock}
    <button class="btn ghost small" data-action="open-settings" data-tab="custom">${i18n.t('cq_cta')}</button>
    ${eventCardHtml(state.event)}
    ${heroCardHtml(state)}
  `;
}

// Essai (D20) : une ligne discrète, jamais un compte à rebours en rouge.
function trialLineHtml(state) {
  if (!inTrial(state)) return '';
  const day = trialDay(state);
  const text = day >= TRIAL_DAYS
    ? i18n.t('trial_line_last')
    : i18n.t('trial_line', { n: day, total: TRIAL_DAYS });
  return `<p class="trial-line tiny muted">${text} · <button class="linkbtn" data-action="open-shop">${i18n.t('trial_line_more')}</button></p>`;
}

// Fin de l'essai sans achat (D20) : l'aventure est en pause. Le journal, le
// personnage et la carte restent accessibles par les onglets. Le panneau
// montre ce que le joueur a construit pendant son prologue, au moment de décider.
function pausedHtml(state) {
  return `
    <section class="panel trial-over">
      <p class="retro-kicker">🏔 ${i18n.t('trial_over_kicker')}</p>
      <h3>${i18n.t('trial_over_title', { name: esc(state.name) })}</h3>
      ${prologueRecapHtml(state)}
      <p>${i18n.t('trial_over_body')}</p>
      <p class="tiny muted">${i18n.t('trial_over_keep')}</p>
      <button class="btn primary full" data-action="open-shop">${i18n.t('trial_over_cta')}</button>
    </section>
    ${heroCardHtml(state)}
  `;
}

/** Récap du prologue (7 jours d'essai) : chiffres + ce qui le rend personnel. */
export function prologueRecapHtml(state) {
  const h = state.history || {};
  const stats = [
    [h.totalCompleted || 0, i18n.t('retro_quests')],
    [h.daysPlayed || 0, i18n.t('retro_days')],
    [h.bestStreak || 0, i18n.t('retro_streak')],
    [state.level || 1, i18n.t('level')],
  ];
  const lines = [];
  const style = computeStyle(state);
  if (style && style !== STYLE_DEFAULT) lines.push([i18n.t('recap_style'), i18n.loc(style)]);
  const fams = Object.entries(h.familleCompleted || {}).sort((a, b) => b[1] - a[1]);
  if (fams.length && FAMILIES[fams[0][0]]) {
    const f = FAMILIES[fams[0][0]];
    lines.push([i18n.t('recap_family'), `${f.icon} ${i18n.loc(f.label)}`]);
  }
  const first = (state.inventory || [])[0];
  if (first && first.item) lines.push([i18n.t('recap_first_souvenir'), i18n.loc(first.item)]);
  const lastOrdeal = ORDEAL_BY_ID[(h.ordealsDone || []).slice(-1)[0]];
  if (lastOrdeal) lines.push([i18n.t('recap_ordeal'), i18n.loc(lastOrdeal.title)]);
  return `
      <div class="retro-stats">${stats.map(([n, l]) => `<div><b>${n}</b><span>${esc(l)}</span></div>`).join('')}</div>
      ${lines.length ? `<ul class="recap-lines">${lines.map(([k, v]) => `<li><span class="muted">${esc(k)}</span> ${esc(v)}</li>`).join('')}</ul>` : ''}`;
}
