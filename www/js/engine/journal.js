// Journal d'aventure : fragments narratifs + « moments mémorables ».
// Les entrées générées stockent un objet { fr, en } pour rester bilingues même
// après un changement de langue.

import { pick, defaultRng } from './rng.js';
import { loc } from '../i18n/index.js';

export function addEntry(s, { date, text, kind = 'note' }) {
  s.journal.push({ date, text, kind });
}

const MEMORABLE_TEMPLATES = [
  {
    fr: (t) => `Aujourd'hui tu as vraiment fait ça : « ${t} » Personne ne te l'avait demandé.`,
    en: (t) => `Today you actually did this: “${t}” Nobody asked you to.`,
  },
  {
    fr: (t) => `Note pour plus tard : le jour où « ${t.toLowerCase()} » Oui, vraiment.`,
    en: (t) => `Note for later: the day when “${t.toLowerCase()}” Yes, really.`,
  },
  {
    fr: (t) => `Petit moment ridicule et parfait : « ${t} »`,
    en: (t) => `A small, ridiculous, perfect moment: “${t}”`,
  },
];

const MEMORABLE_CHANCE = 0.35;

/**
 * Renvoie un objet { fr, en } de « moment mémorable » ou null.
 * Se déclenche surtout sur le chaos et les quêtes à poids fort.
 */
export function maybeMemorable(quest, rng = defaultRng) {
  const eligible = quest.famille === 'chaos' || (quest.poids && quest.poids !== 'petite');
  if (!eligible) return null;
  if (rng() > MEMORABLE_CHANCE) return null;
  const tpl = pick(MEMORABLE_TEMPLATES, rng);
  return {
    fr: tpl.fr(loc(quest.text, 'fr')),
    en: tpl.en(loc(quest.text, 'en')),
  };
}

export function eventEntry(ev) {
  return {
    fr: `Événement relevé — ${loc(ev.title, 'fr')}. Butin : ${loc(ev.item, 'fr')}.`,
    en: `Event taken on — ${loc(ev.title, 'en')}. Loot: ${loc(ev.item, 'en')}.`,
  };
}
