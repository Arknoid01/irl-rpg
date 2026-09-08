// Ripple au clic — cosmétique, thèmes payants uniquement (cf. DECISIONS.md
// D12). Actif seulement si data-theme est un thème payant (cyberpunk : halo
// néon ; sombre : diffusion d'encre) ET prefers-reduced-motion n'est pas
// demandé. L'apparence du ripple est définie dans le CSS de chaque thème ;
// pour les thèmes gratuits, aucun élément n'est créé ni écouteur utile.

const RIPPLE_THEMES = new Set(['cyberpunk', 'sombre']);

function reduceMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initRipples() {
  document.addEventListener('click', (e) => {
    if (!RIPPLE_THEMES.has(document.documentElement.dataset.theme)) return;
    if (reduceMotion()) return;
    const el = e.target.closest('.btn, .tab, .iconbtn');
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = `${size}px`;
    span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.appendChild(span);

    const remove = () => span.remove();
    span.addEventListener('animationend', remove, { once: true });
    setTimeout(remove, 700); // délai de secours si l'événement ne part pas
  });
}
