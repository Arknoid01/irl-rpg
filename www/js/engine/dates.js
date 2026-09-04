// Helpers de date. `now` est toujours injectable pour les tests.

export function iso(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10);
}

export function todayStr(now = new Date()) {
  return iso(now);
}

export function shiftDays(dateStr, delta) {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return iso(d);
}

export function yesterdayStr(now = new Date()) {
  return shiftDays(iso(now), -1);
}

export function daysBetween(aStr, bStr) {
  const a = new Date(aStr + 'T12:00:00Z').getTime();
  const b = new Date(bStr + 'T12:00:00Z').getTime();
  return Math.round((b - a) / 86400000);
}

/** 'matin' | 'midi' | 'soir' selon l'heure locale. */
export function dayPart(now = new Date()) {
  const h = now.getHours();
  if (h < 11) return 'matin';
  if (h < 18) return 'midi';
  return 'soir';
}
