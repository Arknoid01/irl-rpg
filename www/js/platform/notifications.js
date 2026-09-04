// Rappel quotidien. Sous Capacitor : @capacitor/local-notifications (planifié
// côté client, aucun serveur). Sur le web : pas de planification fiable -> no-op.

import { i18n } from '../i18n/index.js';

const DAILY_ID = 1001;

function localNotifications() {
  const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;
  return cap && cap.Plugins && cap.Plugins.LocalNotifications;
}

export function isNative() {
  const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;
  return !!(cap && cap.isNativePlatform && cap.isNativePlatform());
}

export async function syncDailyReminder(state) {
  const LN = localNotifications();
  if (!LN) return { scheduled: false, reason: 'web' };

  try {
    await LN.cancel({ notifications: [{ id: DAILY_ID }] });
    if (!state.notifications.enabled) return { scheduled: false, reason: 'disabled' };

    const perm = await LN.requestPermissions();
    if (perm.display !== 'granted') return { scheduled: false, reason: 'denied' };

    await LN.schedule({
      notifications: [{
        id: DAILY_ID,
        title: 'IRL RPG',
        body: i18n.t('notif_body'),
        schedule: {
          on: { hour: state.notifications.hour, minute: 0 },
          repeats: true,
          allowWhileIdle: true,
        },
      }],
    });
    return { scheduled: true };
  } catch (e) {
    return { scheduled: false, reason: 'error', error: String(e) };
  }
}

export async function shareText(text, title) {
  const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;
  const Share = cap && cap.Plugins && cap.Plugins.Share;
  if (Share) {
    try { await Share.share({ title, text }); return true; } catch { return false; }
  }
  if (typeof navigator !== 'undefined' && navigator.share) {
    try { await navigator.share({ title, text }); return true; } catch { return false; }
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try { await navigator.clipboard.writeText(text); return 'copied'; } catch { return false; }
  }
  return false;
}
