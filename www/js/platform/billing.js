// Achats in-app — déblocage des thèmes payants (D12).
//
// Suit le style des autres modules platform/ : le plugin natif est atteint
// via window.Capacitor.Plugins, jamais par un import ES du paquet. Le bundle
// web reste donc sans dépendance, et surtout : le plugin parle directement au
// Play Store / à StoreKit, aucun serveur tiers — cohérent D11 (zéro cloud).
//
// Plugin cible : @capacitor-community/in-app-purchases. À installer quand un
// accès Play Console / App Store Connect permettra de tester un vrai achat :
//   npm i @capacitor-community/in-app-purchases && npx cap sync
// puis déclarer un produit NON consommable par thème payant (achat unique,
// cf. D12) : theme_sombre · theme_cyberpunk · theme_enquete · theme_mystique
// · theme_postapo · theme_cockpit
//
// ⚠️ Les noms de méthodes (getProducts / purchaseProduct / restorePurchases)
// et la forme des réponses ci-dessous sont à revérifier contre la version
// exacte du plugin au moment du `npm i` — impossible à tester dans cet
// environnement. Toute la surface incertaine est isolée dans `nativeBilling`.

export const THEME_PRODUCTS = {
  sombre: 'theme_sombre',
  cyberpunk: 'theme_cyberpunk',
  enquete: 'theme_enquete',
  mystique: 'theme_mystique',
  postapo: 'theme_postapo',
  cockpit: 'theme_cockpit',
};

const PRODUCT_THEME = Object.fromEntries(
  Object.entries(THEME_PRODUCTS).map(([theme, id]) => [id, theme]),
);

// Prix affichés tant que le store ne renvoie pas les vrais (web, hors ligne,
// plugin absent). Vide pour l'instant — le store fait foi quand il répond ;
// un thème sans entrée s'affiche sans prix.
const PLACEHOLDER_PRICE = {};

function nativePlugin() {
  const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;
  if (!cap || typeof cap.isNativePlatform !== 'function' || !cap.isNativePlatform()) return null;
  return (cap.Plugins && cap.Plugins.InAppPurchases) || null;
}

function placeholderList() {
  return Object.keys(THEME_PRODUCTS).map((theme) => ({
    theme,
    productId: THEME_PRODUCTS[theme],
    price: PLACEHOLDER_PRICE[theme] || null,
  }));
}

// ─── Impl « dev » : pas de store, déblocage direct et gratuit ────────────────
// C'est l'état actuel de la boutique (bouton « Débloquer » sans paiement).
const devBilling = {
  mode: 'dev',
  real: false,
  async listProducts() {
    return placeholderList();
  },
  async purchase(theme) {
    if (!THEME_PRODUCTS[theme]) return { ok: false, error: 'unknown-product' };
    return { ok: true, dev: true };
  },
  async restore() {
    return { ok: true, themes: [] };
  },
};

// ─── Impl native : @capacitor-community/in-app-purchases ─────────────────────
function nativeBilling(plugin) {
  return {
    mode: 'native',
    real: true,

    async listProducts() {
      try {
        const res = await plugin.getProducts({ productIds: Object.values(THEME_PRODUCTS) });
        const raw = (res && (res.products || res.data)) || [];
        const mapped = raw
          .map((p) => {
            const id = p.id || p.productId;
            return {
              theme: PRODUCT_THEME[id],
              productId: id,
              price: p.priceString || p.price || null,
            };
          })
          .filter((p) => p.theme);
        return mapped.length ? mapped : placeholderList();
      } catch {
        return placeholderList();
      }
    },

    async purchase(theme) {
      const productId = THEME_PRODUCTS[theme];
      if (!productId) return { ok: false, error: 'unknown-product' };
      try {
        const res = await plugin.purchaseProduct({ productId });
        if (res && (res.cancelled || res.userCancelled || res.responseCode === 1)) {
          return { ok: false, cancelled: true };
        }
        return { ok: true, transaction: res || null };
      } catch (e) {
        const msg = String((e && e.message) || e);
        if (/cancel/i.test(msg)) return { ok: false, cancelled: true };
        return { ok: false, error: msg };
      }
    },

    async restore() {
      try {
        const res = await plugin.restorePurchases();
        const owned = (res && (res.purchases || res.data)) || [];
        const themes = [...new Set(
          owned.map((p) => PRODUCT_THEME[p.productId || p.id]).filter(Boolean),
        )];
        return { ok: true, themes };
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
