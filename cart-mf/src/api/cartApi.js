const CART_BASE = (import.meta.env.VITE_CART_API_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

function cartUrl(path) {
  return CART_BASE ? `${CART_BASE}${path}` : `/api${path}`;
}

function buildHeaders(token) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  // Only send JWT if cart-service validates it (omit if causing 500 in dev)
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

function toInt(value, label) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
  return n;
}

function isCartLineItem(data) {
  return (
    data != null &&
    typeof data === "object" &&
    data.productId != null &&
    data.quantity != null
  );
}

/** Normalize cart API responses to CartItem[] */
export function parseCartItems(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (isCartLineItem(data)) return [data];
  return [];
}

export function getCartItemCount(data) {
  if (data == null) return 0;
  if (typeof data.itemCount === "number") return data.itemCount;
  if (typeof data.count === "number") return data.count;
  if (isCartLineItem(data)) return Number(data.quantity) || 1;
  if (Array.isArray(data.items)) {
    return data.items.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
      0,
    );
  }
  if (Array.isArray(data)) {
    return data.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  }
  return 0;
}

function formatError(res, data, fallback) {
  const detail =
    data?.error ?? data?.message ?? (typeof data === "string" ? data : null);
  return detail ? `${fallback}: ${detail}` : `${fallback} (${res.status})`;
}

/** GET /carts/:userId */
export async function fetchCart(userId, token) {
  const uid = toInt(userId, "userId");
  const res = await fetch(cartUrl(`/carts/${uid}`), {
    headers: buildHeaders(token),
  });

  const data = await parseResponse(res);

  // Empty or missing cart — treat as zero items
  if (res.status === 404) {
    return { items: [] };
  }

  if (!res.ok) {
    throw new Error(formatError(res, data, "Failed to load cart"));
  }

  return data;
}

/** POST /carts/:userId/items — body: { productId, quantity } per CartItem json tags */
export async function addCartItem({ userId, productId, quantity = 1, token }) {
  const uid = toInt(userId, "userId");
  const pid = toInt(productId, "productId");
  const qty = toInt(quantity, "quantity");

  const res = await fetch(cartUrl(`/carts/${uid}/items`), {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({
      productId: pid,
      quantity: qty,
    }),
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(formatError(res, data, "Failed to add to cart"));
  }

  return data;
}

/** PATCH /carts/:userId/items/:productId */
export async function updateCartItem({
  userId,
  productId,
  quantity,
  token,
}) {
  const uid = toInt(userId, "userId");
  const pid = toInt(productId, "productId");
  const qty = toInt(quantity, "quantity");

  const res = await fetch(cartUrl(`/carts/${uid}/items/${pid}`), {
    method: "PATCH",
    headers: buildHeaders(token),
    body: JSON.stringify({ quantity: qty }),
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(formatError(res, data, "Failed to update cart"));
  }

  return data;
}

/** Decrease quantity by 1; DELETE line when quantity reaches 0 */
export async function decreaseCartItemQuantity({
  userId,
  productId,
  currentQuantity,
  token,
}) {
  const qty = Number(currentQuantity) || 1;

  if (qty > 1) {
    return updateCartItem({
      userId,
      productId,
      quantity: qty - 1,
      token,
    });
  }

  return removeCartItem({ userId, productId, token });
}

/** DELETE /carts/:userId/items/:productId — removes entire line */
export async function removeCartItem({ userId, productId, token }) {
  const uid = toInt(userId, "userId");
  const pid = toInt(productId, "productId");

  const res = await fetch(cartUrl(`/carts/${uid}/items/${pid}`), {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(formatError(res, data, "Failed to remove item"));
  }

  return data;
}
