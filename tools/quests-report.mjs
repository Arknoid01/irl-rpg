// Pipeline banque de quêtes — santé + couverture (README « Reste ouvert »).
//
//   npm run quests
//
// But : rendre l'ajout de quêtes durable. Le rapport montre où la banque est
// mince (famille / effort / audace) pour écrire les prochaines quêtes là où
// elles manquent, et bloque (exit 1) sur les erreurs dures que les tests
// unitaires ne couvrent pas encore : doublon de texte, pool de slots orphelin,
// famille vide. Complète `tests/engine.test.mjs` (intégrité du modèle) et
// `docs/QUESTS.md` (comment ajouter une quête).

import { QUESTS } from '../www/js/data/quests.js';
import { QUEST_TEMPLATES } from '../www/js/data/templates.js';
import { SLOT_POOLS } from '../www/js/data/slots.js';
import { FAMILIES, FAMILY_KEYS, EFFORT_POINTS } from '../www/js/data/taxonomy.js';

const EFFORTS = Object.keys(EFFORT_POINTS);
const AUDACE = [1, 2, 3, 4, 5];
const SLOT_RE = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;

const errors = [];
const warnings = [];

/* ─── Normalisation de texte pour la détection de doublons ─────────────────── */
function norm(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
// Pour un template : on retire les {slots} avant de comparer.
function normTemplate(s) {
  return norm(String(s).replace(SLOT_RE, ' '));
}

/* ─── Comptages ───────────────────────────────────────────────────────────── */
function tally(list, keyFn) {
  const m = {};
  for (const x of list) {
    const k = keyFn(x);
    m[k] = (m[k] || 0) + 1;
  }
  return m;
}

function bar(n, max, width = 24) {
  const filled = max ? Math.round((n / max) * width) : 0;
  return '█'.repeat(filled) + '·'.repeat(width - filled);
}

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

/* ─── Combinaisons génératives par template ───────────────────────────────── */
function templateCombos(tpl) {
  const slots = tpl.slots || {};
  let n = 1;
  for (const poolKey of Object.values(slots)) {
    const pool = SLOT_POOLS[poolKey];
    if (!pool || !pool.length) return 0;
    n *= pool.length;
  }
  return Object.keys(slots).length ? n : 1;
}

/* ─── Checks durs ─────────────────────────────────────────────────────────── */
function checkDuplicateText() {
  for (const lang of ['fr', 'en']) {
    const seen = new Map();
    for (const q of QUESTS) {
      const k = norm(q.text?.[lang]);
      if (!k) continue;
      if (seen.has(k)) {
        errors.push(`doublon de texte ${lang} : "${q.id}" ≈ "${seen.get(k)}"`);
      } else {
        seen.set(k, q.id);
      }
    }
    // templates entre eux (slots retirés)
    const seenT = new Map();
    for (const t of QUEST_TEMPLATES) {
      const k = normTemplate(t.text?.[lang]);
      if (!k) continue;
      if (seenT.has(k)) {
        errors.push(`templates ${lang} identiques hors slots : "${t.id}" ≈ "${seenT.get(k)}"`);
      } else {
        seenT.set(k, t.id);
      }
    }
  }
}

function checkOrphanPools() {
  const used = new Set();
  for (const t of QUEST_TEMPLATES) {
    for (const poolKey of Object.values(t.slots || {})) used.add(poolKey);
  }
  for (const poolKey of Object.keys(SLOT_POOLS)) {
    if (!used.has(poolKey)) warnings.push(`pool de slots jamais utilisé : ${poolKey}`);
  }
}

function checkEmptyFamilies() {
  const byFam = tally(QUESTS, (q) => q.famille);
  for (const f of FAMILY_KEYS) {
    if (!byFam[f]) errors.push(`famille sans aucune quête curée : ${f}`);
  }
}

/* ─── Couverture : famille vs poids de tirage cible ───────────────────────── */
function reportFamilies() {
  const byFam = tally(QUESTS, (q) => q.famille);
  const total = QUESTS.length;
  const weightSum = FAMILY_KEYS.reduce((s, f) => s + FAMILIES[f].drawWeight, 0);
  const max = Math.max(...Object.values(byFam));

  console.log('\n── Familles : quêtes curées vs poids de tirage cible ──');
  console.log(`${pad('famille', 12)} ${pad('n', 4)} ${pad('part', 7)} ${pad('cible', 7)}  écart`);
  for (const f of FAMILY_KEYS) {
    const n = byFam[f] || 0;
    const share = (n / total) * 100;
    const target = (FAMILIES[f].drawWeight / weightSum) * 100;
    const delta = share - target;
    const flag = Math.abs(delta) >= 6 ? (delta < 0 ? '  ← mince' : '  ← dense') : '';
    if (delta <= -6) warnings.push(`famille "${f}" : ${n} quêtes (${share.toFixed(0)} %) sous la cible ${target.toFixed(0)} %`);
    console.log(
      `${pad(f, 12)} ${pad(n, 4)} ${pad(share.toFixed(0) + ' %', 7)} ${pad(target.toFixed(0) + ' %', 7)} ${delta >= 0 ? '+' : ''}${delta.toFixed(0)}${flag}`,
    );
    console.log(`  ${bar(n, max)}`);
  }
}

/* ─── Couverture : matrice famille × effort ───────────────────────────────── */
function reportEffortMatrix() {
  console.log('\n── Matrice famille × effort (quêtes curées) ──');
  console.log(`${pad('', 12)} ${EFFORTS.map((e) => pad(e, 10)).join(' ')}`);
  for (const f of FAMILY_KEYS) {
    const row = QUESTS.filter((q) => q.famille === f);
    const cells = EFFORTS.map((e) => {
      const n = row.filter((q) => q.effort === e).length;
      if (n === 0) warnings.push(`case vide : ${f} / ${e} (aucune quête curée)`);
      return pad(n === 0 ? '—' : String(n), 10);
    });
    console.log(`${pad(f, 12)} ${cells.join(' ')}`);
  }
}

/* ─── Couverture : audace ─────────────────────────────────────────────────── */
function reportAudace() {
  const hist = tally(QUESTS, (q) => q.audace);
  const max = Math.max(...Object.values(hist));
  console.log('\n── Audace (quêtes curées) ──');
  for (const a of AUDACE) {
    const n = hist[a] || 0;
    console.log(`  ${a}  ${pad(n, 4)} ${bar(n, max)}`);
    if (n < 6) warnings.push(`audace ${a} : seulement ${n} quêtes curées`);
  }
}

/* ─── Divers ─────────────────────────────────────────────────────────────── */
function reportFlags() {
  const n = QUESTS.length;
  const defiAmi = QUESTS.filter((q) => q.defi_ami).length;
  const hidden = QUESTS.filter((q) => q.hidden).length;
  const withFragment = QUESTS.filter((q) => q.fragment).length;
  const withBonus = QUESTS.filter((q) => q.skill_bonus).length;
  const withContext = QUESTS.filter((q) => (q.contexte || []).length).length;
  const registre = tally(QUESTS, (q) => q.registre);

  console.log('\n── Divers ──');
  console.log(`  défi d'ami ......... ${defiAmi}/${n}`);
  console.log(`  quêtes mystère ..... ${hidden}/${n} (fragment: ${withFragment})`);
  console.log(`  skill_bonus ........ ${withBonus}/${n}`);
  console.log(`  avec contexte ...... ${withContext}/${n}`);
  console.log(`  registre ........... quête ${registre.quete || 0} · expérience ${registre.experience || 0}`);
  if (hidden < 4) warnings.push(`seulement ${hidden} quêtes mystère (hidden)`);
}

function reportTemplates() {
  const combos = QUEST_TEMPLATES.reduce((s, t) => s + templateCombos(t), 0);
  const byFam = tally(QUEST_TEMPLATES, (t) => t.famille);
  console.log('\n── Génératif (templates + slots) ──');
  console.log(`  templates .......... ${QUEST_TEMPLATES.length}`);
  console.log(`  combinaisons ....... ~${combos.toLocaleString('fr-FR')}`);
  console.log(`  par famille ........ ${FAMILY_KEYS.map((f) => `${f} ${byFam[f] || 0}`).join(' · ')}`);
  for (const f of FAMILY_KEYS) {
    if (!byFam[f]) warnings.push(`aucun template pour la famille ${f}`);
  }
}

/* ─── Run ─────────────────────────────────────────────────────────────────── */
console.log('════════════════════════════════════════════════════════');
console.log(`  Banque de quêtes — ${QUESTS.length} curées, ${QUEST_TEMPLATES.length} templates`);
console.log('════════════════════════════════════════════════════════');

checkDuplicateText();
checkOrphanPools();
checkEmptyFamilies();

reportFamilies();
reportEffortMatrix();
reportAudace();
reportFlags();
reportTemplates();

console.log('\n────────────────────────────────────────────────────────');
if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} point(s) d'attention (banque mince, pas bloquant) :`);
  for (const w of warnings) console.log(`   · ${w}`);
}
if (errors.length) {
  console.log(`\n❌ ${errors.length} erreur(s) dure(s) :`);
  for (const e of errors) console.log(`   · ${e}`);
  console.log('');
  process.exit(1);
}
console.log('\n✅ Aucune erreur dure. Vois docs/QUESTS.md pour ajouter des quêtes.');
