import { THEMES, DEFAULT_THEME, THEME_KEYS } from '../data/themes.js';

export function applyTheme(themeKey) {
  const key = THEME_KEYS.includes(themeKey) ? themeKey : DEFAULT_THEME;
  document.documentElement.dataset.theme = key;
  document.body.dataset.theme = key;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const gcs = typeof globalThis.getComputedStyle === 'function'
    ? globalThis.getComputedStyle.bind(globalThis)
    : null;
  if (!gcs) return;
  try {
    const color = (
      gcs(document.documentElement).getPropertyValue('--theme-color')
      || gcs(document.documentElement).getPropertyValue('--bg')
      || ''
    ).trim();
    if (color) meta.setAttribute('content', color);
  } catch {
    /* environnements sans CSSOM complet */
  }
}

/** Ligne du sélecteur de thèmes (pastilles). */
export function themePickerHtml(active) {
  return `<div class="theme-picker">${THEME_KEYS.map((k) => `
    <button class="theme-dot${k === active ? ' active' : ''}"
            style="background:${THEMES[k].dot}"
            data-action="set-theme" data-id="${k}"
            title="${THEMES[k].label}" aria-label="Thème ${THEMES[k].label}"></button>`).join('')}</div>`;
}
