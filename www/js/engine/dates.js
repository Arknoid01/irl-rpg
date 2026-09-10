// Helpers de date. `now` est toujours injectable pour les tests.
//
// TOUT est en heure LOCALE : « le jour » de l'app commence à minuit chez le
// joueur, pas à minuit UTC (une appli du quotidien — les quêtes « du jour »
// doivent suivre ta journée). `dayPart`, `msUntilNextMidnight` et le timer de
// main.js s'alignent sur la même frontière.

export function iso(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayStr(now = new Date()) {
  return iso(now);
}

export function shiftDays(dateStr, delta) {
  // Ancre à midi local : ± N jours reste sur le bon jour calendaire, même en
  // traversant un changement d'heure d'été.
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + delta);
  return iso(d);
}

export function yesterdayStr(now = new Date()) {
  return shiftDays(iso(now), -1);
}

export function daysBetween(aStr, bStr) {
  const a = new Date(`${aStr}T12:00:00`).getTime();
  const b = new Date(`${bStr}T12:00:00`).getTime();
  return Math.round((b - a) / 86400000);
}

/** 'matin' | 'midi' | 'soir' selon l'heure locale. */
export function dayPart(now = new Date()) {
  const h = now.getHours();
  if (h < 11) return 'matin';
  if (h < 18) return 'midi';
  return 'soir';
}

/**
 * Millisecondes jusqu'au prochain minuit local, plus une marge de sécurité
 * (en secondes) pour être sûr d'avoir franchi la date. Sert à programmer la
 * réinitialisation des quêtes du jour quand l'app reste ouverte (main.js) —
 * même frontière que `todayStr`.
 */
export function msUntilNextMidnight(now = new Date(), marginSec = 5) {
  const next = new Date(
    now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, marginSec, 0,
  );
  return next.getTime() - now.getTime();
}
