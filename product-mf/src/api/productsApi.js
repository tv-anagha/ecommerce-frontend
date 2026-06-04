// Product microservice base URL (no trailing slash).
// Leave unset in Vite dev to use /api/products proxy → localhost:8081/products
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

function productsUrl() {
  return API_BASE ? `${API_BASE}/products` : "/api/products";
}

/**
 * Fetches products from the product microservice (GET /products on port 8081).
 */
export async function fetchProducts() {
  const res = await fetch(productsUrl());

  if (!res.ok) {
    throw new Error(
      `Failed to load products (${res.status}) from ${productsUrl()}`,
    );
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.products ?? [];
}
