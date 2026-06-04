const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

/**
 * Fetches products from the product service (owned by this MFE's backend contract).
 */
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);

  if (!res.ok) {
    throw new Error(`Failed to load products (${res.status})`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.products ?? [];
}
