import { useEffect } from "react";
import { useProducts } from "../../hooks/useProducts.js";
import { ProductGrid } from "../ProductGrid/ProductGrid.jsx";
import "./ProductCatalog.css";

/**
 * Root UI for the product microfrontend.
 * Shell mounts this after authentication with autoLoad.
 */
export function ProductCatalog({ user, onSignOut, autoLoad = false }) {
  const { products, loading, error, loadProducts } = useProducts();

  useEffect(() => {
    if (autoLoad) {
      loadProducts();
    }
  }, [autoLoad, loadProducts]);

  const handleAddToCart = (product) => {
    // Cart MFE will handle this in a later sprint
    console.info("[product-mf] Add to cart:", product.id ?? product.name);
  };

  return (
    <div className="product-catalog">
      <header className="product-catalog__header">
        <div className="product-catalog__header-inner">
          <span className="product-catalog__logo">shop</span>
          <h1 className="product-catalog__title">Product Catalog</h1>
          {(user?.email || onSignOut) && (
            <div className="product-catalog__header-actions">
              {user?.email && (
                <span className="product-catalog__user">
                  Hello, {user.email}
                </span>
              )}
              {onSignOut && (
                <button
                  type="button"
                  className="product-catalog__sign-out"
                  onClick={onSignOut}
                >
                  Sign out
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="product-catalog__main">
        <section className="product-catalog__toolbar">
          <div>
            <h2 className="product-catalog__section-title">Results</h2>
            {products.length > 0 && (
              <p className="product-catalog__count">
                {products.length} {products.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>
          <button
            type="button"
            className="product-catalog__load-btn"
            onClick={loadProducts}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load Products"}
          </button>
        </section>

        {error && (
          <div className="product-catalog__error" role="alert">
            {error}
            <span className="product-catalog__error-hint">
              Product service: <code>http://localhost:8081/products</code>. In dev, keep{" "}
              <code>VITE_API_BASE_URL</code> empty and restart <code>npm run dev</code>{" "}
              so Vite proxies <code>/api/products</code> → port 8081.
            </span>
          </div>
        )}

        {loading && !products.length ? (
          <div className="product-catalog__skeleton" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-catalog__skeleton-card" />
            ))}
          </div>
        ) : (
          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            emptyMessage="Click “Load Products” to fetch from your product service."
          />
        )}
      </main>
    </div>
  );
}
