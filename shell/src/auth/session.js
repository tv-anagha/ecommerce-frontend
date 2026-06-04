const STORAGE_KEY = "ecommerce_user";

export function saveSession(user) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.email ? user : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY);
}
