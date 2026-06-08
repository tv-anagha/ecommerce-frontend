const ORDER_BASE = (import.meta.env.VITE_ORDER_API_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

function orderUrl(path) {
  return ORDER_BASE ? `${ORDER_BASE}${path}` : `/api${path}`;
}

function buildHeaders(token) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
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

function formatError(res, data, fallback) {
  const detail =
    data?.error ?? data?.message ?? (typeof data === "string" ? data : null);
  return detail ? `${fallback}: ${detail}` : `${fallback} (${res.status})`;
}

function toInt(value, label) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`Invalid ${label}`);
  }
  return n;
}

/** POST /orders — places order from user's cart (order-service fetches cart + products) */
export async function placeOrder(userId, token) {
  const uid = toInt(userId, "userId");

  const res = await fetch(orderUrl("/orders"), {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId: uid }),
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(formatError(res, data, "Checkout failed"));
  }

  return data;
}

/** GET /orders/:id */
export async function getOrder(orderId, token) {
  const id = toInt(orderId, "orderId");

  const res = await fetch(orderUrl(`/orders/${id}`), {
    headers: buildHeaders(token),
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(formatError(res, data, "Failed to load order"));
  }

  return data;
}
