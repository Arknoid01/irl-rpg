// Générateur modulaire : remplit les templates avec des slots tirés au hasard.
// Produit des quêtes au même format que la banque curée (id, text, famille…).

import { SLOT_POOLS } from '../data/slots.js';
import { QUEST_TEMPLATES } from '../data/templates.js';
import { pick } from './rng.js';

const SLOT_RE = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;

/** Clé stable pour l’historique (cooldown du template, toutes variantes). */
export function templateHistoryKey(templateId) {
  return `tpl:${templateId}`;
}

function displayValue(v, lang) {
  if (v && typeof v === 'object' && (v.fr != null || v.en != null)) {
    return String(v[lang] ?? v.fr ?? v.en);
  }
  return String(v);
}

function fillLang(templateStr, filled, lang) {
  return templateStr.replace(SLOT_RE, (_, key) => displayValue(filled[key], lang));
}

function shortHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

function fillKey(filled) {
  return Object.keys(filled).sort().map((k) => {
    const v = filled[k];
    const s = typeof v === 'object' ? (v.en || v.fr) : v;
    return `${k}=${s}`;
  }).join('|');
}

/**
 * Tire une valeur pour chaque slot du template.
 * @returns {Record<string, number|string|{fr:string,en:string}>}
 */
export function pickSlots(slotsSpec, rng) {
  const filled = {};
  for (const [name, poolKey] of Object.entries(slotsSpec || {})) {
    const pool = SLOT_POOLS[poolKey];
    if (!pool || !pool.length) {
      throw new Error(`slot pool manquant : ${poolKey}`);
    }
    filled[name] = pick(pool, rng);
  }
  return filled;
}

/** Remplit un texte bilingue `{ fr, en }` avec les valeurs de slots. */
export function fillBilingual(text, filled) {
  return {
    fr: fillLang(text.fr, filled, 'fr'),
    en: fillLang(text.en, filled, 'en'),
  };
}

/**
 * Instancie un template en quête concrète.
 * @returns {object}
 */
export function instantiateTemplate(template, rng) {
  const filled = pickSlots(template.slots, rng);
  const key = fillKey(filled);
  const id = `g_${template.id}_${shortHash(key)}`;

  return {
    id,
    templateId: template.id,
    generated: true,
    famille: template.famille,
    xp: template.xp,
    effort: template.effort,
    registre: template.registre,
    poids: template.poids || 'petite',
    audace: template.audace,
    contexte: template.contexte ? template.contexte.slice() : [],
    safe_fallback: template.safe_fallback || null,
    defi_ami: !!template.defi_ami,
    skill_bonus: template.skill_bonus || null,
    hidden: !!template.hidden,
    fragment: template.fragment || null,
    text: fillBilingual(template.text, filled),
    params: filled,
  };
}

function momentOk(quest, part) {
  const m = (quest.contexte || []).find((c) => c.startsWith('moment:'));
  return !m || m === `moment:${part}`;
}

/**
 * Produit une instance par template éligible (plafond d’audace, moment, cooldown).
 * @param {{ ceiling: number, part: string, recentDone: Set<string>, rng: function, hidden?: boolean }} opts
 */
export function expandTemplates({
  ceiling, part, recentDone, rng, hidden = false,
}) {
  const out = [];
  for (const tpl of QUEST_TEMPLATES) {
    if (!!tpl.hidden !== hidden) continue;
    if (tpl.audace > ceiling) continue;
    if (!momentOk(tpl, part)) continue;
    const hist = templateHistoryKey(tpl.id);
    if (recentDone.has(hist)) continue;
    try {
      const q = instantiateTemplate(tpl, rng);
      if (recentDone.has(q.id)) continue;
      out.push(q);
    } catch {
      // pool manquant : ignore ce template
    }
  }
  return out;
}

/** Intégrité des templates (pour les tests). */
export function listTemplates() {
  return QUEST_TEMPLATES;
}
