// Journal d'aventure : fragments, moments, timeline + chapitres.

import { pick, defaultRng } from './rng.js';
import { loc } from '../i18n/index.js';
import { daysBetween, todayStr } from './dates.js';

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
  {
    fr: (t) => `Chapitre minuscule : tu as choisi « ${t} » — et le monde n’a pas basculé. Tant mieux.`,
    en: (t) => `Tiny chapter: you chose “${t}” — and the world didn’t tip. Good.`,
  },
  {
    fr: (t) => `Ton compagnon note en marge : « ${t} » — à relire un soir de doute.`,
    en: (t) => `Your companion notes in the margin: “${t}” — to reread on a doubtful night.`,
  },
];

const MEMORABLE_CHANCE = 0.38;

/**
 * Renvoie un objet { fr, en } de « moment mémorable » ou null.
 */
export function maybeMemorable(quest, rng = defaultRng) {
  const eligible = quest.famille === 'chaos'
    || quest.hidden
    || (quest.poids && quest.poids !== 'petite');
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

export function levelChapterEntry(level) {
  return {
    fr: `Une page se tourne. Niveau ${level}. Le grimoire s’épaissit — sans rien exiger de plus.`,
    en: `A page turns. Level ${level}. The grimoire thickens — asking nothing more.`,
  };
}

export function regionRevealEntry(regionLabel) {
  return {
    fr: `Sur la carte, la brume se lève : « ${loc(regionLabel, 'fr')} » n’est plus un blanc.`,
    en: `On the map, the fog lifts: “${loc(regionLabel, 'en')}” is no longer a blank.`,
  };
}

/** Chapitre narratif selon le niveau actuel. */
export function chapterForLevel(level) {
  if (level < 3) {
    return {
      id: 'prologue',
      label: { fr: 'Prologue', en: 'Prologue' },
      blurb: {
        fr: 'Les premiers pas — encore hésitants, déjà vrais.',
        en: 'First steps — still hesitant, already real.',
      },
    };
  }
  if (level < 5) {
    return {
      id: 'ch1',
      label: { fr: 'Chapitre I', en: 'Chapter I' },
      blurb: {
        fr: 'Le rythme s’installe. Les rues commencent à répondre.',
        en: 'A rhythm settles in. The streets begin to answer.',
      },
    };
  }
  if (level < 8) {
    return {
      id: 'ch2',
      label: { fr: 'Chapitre II', en: 'Chapter II' },
      blurb: {
        fr: 'Le feu tient. Les souvenirs s’accumulent dans le musée.',
        en: 'The fire holds. Souvenirs gather in the museum.',
      },
    };
  }
  if (level < 12) {
    return {
      id: 'ch3',
      label: { fr: 'Chapitre III', en: 'Chapter III' },
      blurb: {
        fr: 'La crête est en vue. La carte n’est plus un rêve.',
        en: 'The ridge is in sight. The map is no longer a dream.',
      },
    };
  }
  if (level < 15) {
    return {
      id: 'ch4',
      label: { fr: 'Chapitre IV', en: 'Chapter IV' },
      blurb: {
        fr: 'Assez de veilles pour sentir la cire du grimoire.',
        en: 'Enough watches to smell the grimoire’s wax.',
      },
    };
  }
  return {
    id: 'ch5',
    label: { fr: 'Chapitre V', en: 'Chapter V' },
    blurb: {
      fr: 'Le château lointain n’est plus qu’une silhouette familière.',
      en: 'The distant castle is now only a familiar silhouette.',
    },
  };
}

function bucketFor(dateStr, today) {
  if (!dateStr) return 'older';
  const d = daysBetween(dateStr, today);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d <= 7) return 'week';
  return 'older';
}

/**
 * Timeline groupée pour l’UI journal.
 */
export function buildJournalTimeline(state, now = new Date()) {
  const today = todayStr(now);
  const chapter = chapterForLevel(state.level || 1);
  const raw = (state.journal || []).slice().reverse();

  const buckets = {
    today: [],
    yesterday: [],
    week: [],
    older: [],
  };
  for (const e of raw) {
    buckets[bucketFor(e.date, today)].push(e);
  }

  const order = ['today', 'yesterday', 'week', 'older'];
  const sections = order
    .filter((k) => buckets[k].length)
    .map((k) => ({ id: k, entries: buckets[k] }));

  return {
    chapter,
    sections,
    total: raw.length,
    empty: raw.length === 0,
  };
}
