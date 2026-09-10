// Retour haptique — seulement sur les moments positifs (quête accomplie,
// palier, souvenir, titre). Sous Capacitor : @capacitor/haptics (accès par le
// pont bas niveau, pas d'import ES — ce projet n'a pas de bundler). Sur le web,
// ou si prefers-reduced-motion est demandé : no-op silencieux.
//
// Jamais de vibration sur une perte, une série cassée ou un rappel : la
// philosophie anti-culpabilité (DECISIONS D3) vaut aussi pour le toucher.

function plugin() {
  const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;
  return cap && cap.Plugins && cap.Plugins.Haptics;
}

function reduceMotion() {
  try {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function run(fn) {
  const H = plugin();
  if (!H || reduceMotion()) return;
  try {
    const r = fn(H);
    if (r && typeof r.catch === 'function') r.catch(() => { /* plateforme sans moteur haptique */ });
  } catch {
    /* pont indisponible */
  }
}

/** Petit tap — objet gagné, titre, indice. */
export function tapLight() {
  run((H) => H.impact({ style: 'LIGHT' }));
}

/** Tap franc — quête accomplie. */
export function tapMedium() {
  run((H) => H.impact({ style: 'MEDIUM' }));
}

/** Petite célébration — montée de niveau, révélation de mini-arc. */
export function celebrate() {
  run((H) => H.notification({ type: 'SUCCESS' }));
}
