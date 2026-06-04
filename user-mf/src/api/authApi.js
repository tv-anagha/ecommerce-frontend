const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

/** Build URL: dev proxy uses /api prefix, direct uses service base */
function authUrl(path) {
  return API_BASE ? `${API_BASE}${path}` : `/api${path}`;
}

async function parseResponse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.trim() };
  }
}

/** Map backend payload { email, token, userId } to app session shape */
export function normalizeAuthUser(data) {
  if (!data?.email) return null;
  return {
    id: data.userId ?? data.id,
    email: data.email,
    token: data.token,
  };
}

async function authRequest(path, email, password) {
  const url = authUrl(path);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const message =
      data?.error ?? data?.message ?? `Request failed (${res.status}) at ${url}`;
    throw new Error(message);
  }

  return normalizeAuthUser(data) ?? data;
}

/** POST /users/login */
export function login(email, password) {
  return authRequest("/users/login", email, password);
}

/** POST /register (user-service register route) */
export function register(email, password) {
  return authRequest("/register", email, password);
}
