// Page « Cairn Complet » (D20) : ce qu'on achète, ce qu'on garde sans acheter,
// et comment marche l'essai. Montée par ui/settings.js (vue `offer`) : elle
// partage son état d'achat (prix, en cours, erreur) et ses gestionnaires
// `data-shop`. Rien ici ne pousse à acheter : pas de compte à rebours, pas de
// rouge, le même ton que le reste de l'app.

import { i18n } from '../i18n/index.js';
import { inTrial, trialDay, TRIAL_DAYS } from '../engine/access.js';

// Un cairn : des pierres empilées, la marque de l'app. Couleur = `currentColor`.
export const CAIRN_SVG = `<svg class="shop-cairn" viewBox="0 0 64 64" aria-hidden="true">
  <ellipse cx="32" cy="52" rx="24" ry="8" fill="currentColor" opacity=".95"/>
  <ellipse cx="31" cy="38" rx="17" ry="6.5" fill="currentColor" opacity=".8"/>
  <ellipse cx="33" cy="26" rx="11" ry="5" fill="currentColor" opacity=".65"/>
  <ellipse cx="32" cy="16" rx="6" ry="3.6" fill="currentColor" opacity=".5"/>
</svg>`;

const PERKS = ['shop_perk_adventure', 'shop_perk_themes', 'shop_perk_custom', 'shop_perk_remind', 'shop_perk_arc'];
const KEEPS = ['offer_keep_journal', 'offer_keep_character', 'offer_keep_map', 'offer_keep_retro'];
const TRUST = ['shop_trust_once', 'shop_trust_noads', 'shop_trust_fair', 'shop_trust_local'];

const list = (keys, cls, mark) => `<ul class="${cls}">${keys.map((k) => `
  <li>${mark ? `<span class="shop-tick">${mark}</span>` : ''}${i18n.t(k)}</li>`).join('')}</ul>`;

// Les 7 jours de l'essai, en pierres : posées (jouées), la pierre du jour, à venir.
function pathHtml(s) {
  const trial = inTrial(s);
  const day = trial ? trialDay(s) : TRIAL_DAYS;
  const stones = Array.from({ length: TRIAL_DAYS }, (_, i) => {
    const cls = i + 1 < day || !trial ? 'done' : i + 1 === day ? 'today' : '';
    return `<span class="offer-stone ${cls}" aria-hidden="true"></span>`;
  }).join('');
  const status = !trial
    ? i18n.t('shop_trial_over')
    : i18n.t(day >= TRIAL_DAYS ? 'shop_trial_last' : 'shop_trial_status', { n: TRIAL_DAYS - day + 1 });
  return `<section class="offer-path">
    <div class="offer-stones" role="img" aria-label="${i18n.t('offer_path_day', { n: day, total: TRIAL_DAYS })}">${stones}</div>
    <p class="shop-trial-status">${status}</p>
    <p class="tiny muted">${i18n.t('offer_path_note')}</p>
  </section>`;
}

/**
 * @param {object} s  état du jeu
 * @param {object} ctx
 * @param {string|null} ctx.price   prix affichable, ou null
 * @param {boolean} ctx.busy        achat / restauration en cours
 * @param {false|'failed'|'unavailable'} ctx.error
 * @param {boolean} ctx.devNote     afficher la note « démo locale »
 */
export function offerHtml(s, { price, busy, error, devNote }) {
  const dis = busy ? ' disabled' : '';
  const restore = `<div class="shop-foot">
    <button class="btn ghost small" data-shop="restore"${dis}>${i18n.t('shop_restore')}</button>
  </div>`;

  if (s.complete) {
    return `<section class="shop-hero owned">
        ${CAIRN_SVG}
        <h3>${i18n.t('shop_owned_title')}</h3>
        <p class="tiny">${i18n.t('shop_owned_sub')}</p>
      </section>
      <h4 class="offer-h">${i18n.t('offer_owned_what')}</h4>
      ${list(PERKS, 'shop-perks', '✓')}
      ${restore}`;
  }

  return `
    <section class="shop-hero">
      ${CAIRN_SVG}
      <h3>${i18n.t('shop_hero_title')}</h3>
      <p class="shop-sub">${i18n.t('shop_hero_sub')}</p>
      ${pathHtml(s)}
    </section>

    <h4 class="offer-h">${i18n.t('offer_what')}</h4>
    ${list(PERKS, 'shop-perks', '✓')}

    <h4 class="offer-h">${i18n.t('offer_keep')}</h4>
    ${list(KEEPS, 'shop-perks offer-keeps', '◆')}

    <h4 class="offer-h">${i18n.t('offer_how')}</h4>
    <ol class="offer-how">
      <li>${i18n.t('offer_how_1', { total: TRIAL_DAYS })}</li>
      <li>${i18n.t('offer_how_2', { next: TRIAL_DAYS + 1 })}</li>
      <li>${i18n.t('offer_how_3')}</li>
    </ol>

    <div class="offer-buy">
      <button class="btn primary shop-cta" data-shop="unlock" data-v=""${dis}>${i18n.t('shop_cta')}${price ? ` · ${price}` : ''}</button>
      ${error ? `<p class="shop-error tiny">${i18n.t(error === 'unavailable' ? 'shop_purchase_unavailable' : 'shop_purchase_error')}</p>` : ''}
      ${list(TRUST, 'shop-trust', '')}
    </div>
    ${restore}
    ${devNote ? `<p class="tiny muted">${i18n.t('shop_unlock_dev_note')}</p>` : ''}`;
}
