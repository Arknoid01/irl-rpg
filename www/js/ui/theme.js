import { THEMES, DEFAULT_THEME, THEME_KEYS } from '../data/themes.js';

export function applyTheme(themeKey) {
  const key = THEME_KEYS.includes(themeKey) ? themeKey : DEFAULT_THEME;
  document.documentElement.dataset.theme = key;
  document.body.dataset.theme = key;
}

/** Ligne du sélecteur de thèmes (pastilles). */
export function themePickerHtml(active) {
  return `<div class="theme-picker">${THEME_KEYS.map((k) => `
    <button class="theme-dot${k === active ? ' active' : ''}"
            style="background:${THEMES[k].dot}"
            data-action="set-theme" data-id="${k}"
            title="${THEMES[k].label}" aria-label="Thème ${THEMES[k].label}"></button>`).join('')}</div>`;
}
