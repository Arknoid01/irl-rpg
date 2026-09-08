// Achat in-app — la « Collection des Mondes » (DECISIONS D12 + D17).
//
// UN seul produit non consommable : `collection_des_mondes` (~6,99 €), qui
// débloque les 6 thèmes payants d'un coup. Achat unique, à vie, jamais
// pay-to-win (cosmétique pur).
//
// Plugin : `capacitor-plugin-cdv-purchase` (édition Capacitor de
// cordova-plugin-purchase / Fovea). Il parle DIRECTEMENT à Google Play
// Billing / StoreKit — aucun serveur tiers, cohérent D11. RevenueCat écarté
// (backend obligatoire).
//
// Ce projet n'a pas de bundler : on n'importe donc pas le paquet ES. On passe
// par le pont natif bas niveau `window.Capacitor.Plugins.PurchasePlugin`
// (classe `cc.fovea.iap.PurchasePlugin`, enregistrée par `npx cap sync`).
// L'API bas niveau et la forme des payloads viennent de
// `android/.../PurchasePlugin.java` du plugin — mais le déroulé complet
// (flow d'achat, acquittement, événements) reste **à vérifier sur appareil**
// avec un compte de test Play Console. Toute la surface incertaine est
// isolée dans `nativeBilling`.

/** Identifiant du produit à déclarer en Play Console / App Store Connect. */
export const COLLECTION_PRODUCT = 'collection_des_mondes';

/** Thèmes débloqués par la Collection (tous les payants ; nordique est gratuit). */
export const COLLECTION_THEMES = ['sombre', 'cyberpunk', 'enquete', 'mystique', 'postapo', 'cockpit'];

function nativePlugin() {
  const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;
  if (!cap || typeof cap.isNativePlatform !== 'function' || !cap.isNativePlatform()) return null;
  return (cap.Plugins && cap.Plugins.PurchasePlugin) || null;
}

// ─── Impl « dev » : pas de store, déblocage direct et gratuit ────────────────
// C'est l'état actuel de la boutique (bouton « Débloquer la Collection » sans
// paiement) sur le web et tant que le store n'est pas branché.
const devBilling = {
  mode: 'dev',
  real: false,
  async listProducts() {
    return [{ productId: COLLECTION_PRODUCT, price: null }];
  },
  async purchase() {
    return { ok: true, dev: true, themes: COLLECTION_THEMES.slice() };
  },
  async restore() {
    return { ok: true, themes: [] };
  },
};

// ─── Impl native : window.Capacitor.Plugins.PurchasePlugin ───────────────────
function nativeBilling(plugin) {
  let initPromise = null;
  const ensureInit = () => {
    if (!initPromise) initPromise = Promise.resolve(plugin.init({})).catch(() => {});
    return initPromise;
  };

  const isOurPurchase = (p) => {
    if (!p) return false;
    const ids = p.productIds || (p.productId ? [p.productId] : []);
    return Array.isArray(ids) && ids.includes(COLLECTION_PRODUCT);
  };
  const isOwned = (p) => {
    if (!p) return false;
    // getPurchaseState : 1 = purchased, 2 = pending (cf. PurchasePlugin.java).
    const st = p.getPurchaseState ?? p.purchaseState ?? p.state;
    if (st === 1 || st === 'purchased') return true;
    if (st === 2 || st === 'pending' || p.pending) return false;
    return true; // pas d'info d'état : présent dans getPurchases = possédé
  };
  const tokenOf = (p) => (p && (p.purchaseToken || p.token)) || null;

  async function acknowledgeIfNeeded(purchases) {
    for (const p of purchases || []) {
      if (isOurPurchase(p) && !p.acknowledged && tokenOf(p)) {
        try { await plugin.acknowledgePurchase({ purchaseToken: tokenOf(p) }); } catch { /* réessayé au prochain lancement */ }
      }
    }
  }

  /** Interroge les achats existants (résultat via l'événement `setPurchases`). */
  function queryPurchases(timeoutMs = 8000) {
    return new Promise((resolve) => {
      let done = false;
      let handle = null;
      const finish = (list) => {
        if (done) return;
        done = true;
        if (handle && typeof handle.remove === 'function') handle.remove();
        resolve(list || []);
      };
      Promise.resolve(plugin.addListener('setPurchases', (data) => finish((data && data.purchases) || [])))
        .then((h) => { handle = h; })
        .catch(() => {});
      Promise.resolve(plugin.getPurchases()).catch(() => finish([]));
      setTimeout(() => finish([]), timeoutMs);
    });
  }

  /** Attend l'issue du flux d'achat déclenché par buy(). */
  function waitForPurchase(timeoutMs = 180000) {
    return new Promise((resolve) => {
      let done = false;
      let handle = null;
      const finish = (res) => {
        if (done) return;
        done = true;
        if (handle && typeof handle.remove === 'function') handle.remove();
        resolve(res);
      };
      Promise.resolve(plugin.addListener('purchasesUpdated', (data) => {
        const list = (data && data.purchases) || [];
        if (list.some(isOurPurchase)) finish({ ok: true, purchases: list });
      })).then((h) => { handle = h; }).catch(() => {});
      setTimeout(() => finish({ ok: false, error: 'timeout' }), timeoutMs);
    });
  }

  return {
    mode: 'native',
    real: true,

    async listProducts() {
      try {
        await ensureInit();
        const res = await plugin.getAvailableProducts({ inAppSkus: [COLLECTION_PRODUCT], subsSkus: [] });
        const raw = (res && res.products) || [];
        const p = raw.find((x) => (x.productId || x.id) === COLLECTION_PRODUCT) || raw[0];
        const price = p && (p.formatted_price || p.priceString || p.price || null);
        return [{ productId: COLLECTION_PRODUCT, price: price || null }];
      } catch {
        return [{ productId: COLLECTION_PRODUCT, price: null }];
      }
    },

    async purchase() {
      try {
        await ensureInit();
        const existing = await queryPurchases();
        if (existing.some((p) => isOurPurchase(p) && isOwned(p))) {
          await acknowledgeIfNeeded(existing);
          return { ok: true, themes: COLLECTION_THEMES.slice() };
        }
        const settled = waitForPurchase();
        try {
          await plugin.buy({ productId: COLLECTION_PRODUCT });
        } catch (e) {
          const msg = String((e && e.message) || e);
          if (/cancel/i.test(msg)) return { ok: false, cancelled: true };
          return { ok: false, error: msg };
        }
        const r = await settled;
        if (!r.ok) return { ok: false, error: r.error || 'purchase-failed' };
        await acknowledgeIfNeeded(r.purchases);
        return { ok: true, themes: COLLECTION_THEMES.slice() };
      } catch (e) {
        const msg = String((e && e.message) || e);
        if (/cancel/i.test(msg)) return { ok: false, cancelled: true };
        return { ok: false, error: msg };
      }
    },

    async restore() {
      try {
        await ensureInit();
        const list = await queryPurchases();
        const owns = list.some((p) => isOurPurchase(p) && isOwned(p));
        if (owns) await acknowledgeIfNeeded(list);
        return { ok: true, themes: owns ? COLLECTION_THEMES.slice() : [] };
      } catch (e) {
        return { ok: false, error: String((e && e.message) || e) };
      }
    },
  };
}

/** Implémentation de facturation adaptée à la plateforme courante. */
export function getBilling() {
  const plugin = nativePlugin();
  return plugin ? nativeBilling(plugin) : devBilling;
}

/** true si un vrai store est branché (achat payant réel possible). */
export function billingIsReal() {
  return getBilling().real;
}
