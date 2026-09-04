// Habillage natif (StatusBar Capacitor). No-op sur le web.

import { isNative } from './notifications.js';

function statusBar() {
  const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;
  return cap && cap.Plugins && cap.Plugins.StatusBar;
}

/** Aligne la barre de statut système sur le thème (fond sombre du carnet). */
export async function syncStatusBar(themeKey) {
  const SB = statusBar();
  if (!SB || !isNative()) return;
  try {
    const darkChrome = true; // fond cuir / journal toujours sombre
    await SB.setStyle({ style: darkChrome ? 'DARK' : 'LIGHT' });
    if (SB.setBackgroundColor) {
      const colors = {
        nordique: '#17130f',
        sombre: '#120e0d',
        cyberpunk: '#0e1218',
      };
      await SB.setBackgroundColor({ color: colors[themeKey] || '#17130f' });
    }
  } catch {
    /* plugin absent / non supporté */
  }
}
