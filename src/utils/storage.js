/**
 * Safe localStorage utilities and unified auth/order session storage
 */
export function saved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export const AUTH_KEYS = {
  LOGGED_IN: 'aanur_is_logged_in',
  TOKEN: 'aanur_auth_token',
  PROFILE: 'aanur_profile_info',
};

export const STORAGE_KEYS = {
  ORDERS: 'aanur_profile_orders',
  PREFERENCES: 'aanur_profile_preferences',
  ADDRESSES: 'aanur_profile_addresses',
};

export const authStorage = {
  getToken() {
    try {
      return localStorage.getItem(AUTH_KEYS.TOKEN) || null;
    } catch {
      return null;
    }
  },
  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(AUTH_KEYS.TOKEN, token);
      } else {
        localStorage.removeItem(AUTH_KEYS.TOKEN);
      }
    } catch {}
  },
  getUser() {
    return saved(AUTH_KEYS.PROFILE, null);
  },
  setUser(user) {
    try {
      if (user) {
        localStorage.setItem(AUTH_KEYS.PROFILE, JSON.stringify(user));
        localStorage.setItem(AUTH_KEYS.LOGGED_IN, 'true');
      } else {
        this.clearAuth();
      }
    } catch {}
  },
  isLoggedIn() {
    try {
      return localStorage.getItem(AUTH_KEYS.LOGGED_IN) === 'true';
    } catch {
      return false;
    }
  },
  clearAuth() {
    try {
      localStorage.removeItem(AUTH_KEYS.LOGGED_IN);
      localStorage.removeItem(AUTH_KEYS.TOKEN);
      localStorage.removeItem(AUTH_KEYS.PROFILE);
    } catch {}
  },
};

export const ordersStorage = {
  getOrders() {
    const list = saved(STORAGE_KEYS.ORDERS, []);
    return Array.isArray(list) ? list : [];
  },
  saveOrder(newOrder) {
    try {
      const prev = this.getOrders();
      const updated = [newOrder, ...prev.filter((o) => o?.orderRef !== newOrder.orderRef)];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },
};

export function isAdminUser(user) {
  if (!user) return false;
  const adminEmail = (
    import.meta.env?.VITE_STORE_ADMIN_EMAIL ||
    import.meta.env?.STORE_ADMIN_EMAIL ||
    ''
  ).trim().toLowerCase();
  return Boolean(
    user.isAdmin ||
    user.role === 'admin' ||
    (adminEmail && user.email?.toLowerCase() === adminEmail)
  );
}
