// RNG injectable. Par défaut Math.random ; en test, un générateur déterministe.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const defaultRng = () => Math.random();

export function pick(arr, rng = defaultRng) {
  return arr[Math.floor(rng() * arr.length)];
}

export function shuffle(arr, rng = defaultRng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Tirage pondéré : items = [{value, weight}]. */
export function weightedPick(items, rng = defaultRng) {
  const total = items.reduce((s, it) => s + Math.max(0, it.weight), 0);
  if (total <= 0) return items.length ? items[0].value : undefined;
  let r = rng() * total;
  for (const it of items) {
    r -= Math.max(0, it.weight);
    if (r <= 0) return it.value;
  }
  return items[items.length - 1].value;
}
