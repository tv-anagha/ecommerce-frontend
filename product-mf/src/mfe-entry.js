/**
 * Microfrontend entry — import from shell via Module Federation:
 *   import { ProductCatalog } from 'product_mf/ProductCatalog'
 */
export { ProductCatalog } from "./components/ProductCatalog/ProductCatalog.jsx";
export { ProductGrid, ProductCard } from "./components/index.js";
export { fetchProducts } from "./api/productsApi.js";
