import { ProductCard } from "../ProductCard/ProductCard.jsx";
import "./ProductGrid.css";

export function ProductGrid({ products, onAddToCart, emptyMessage }) {
  if (!products?.length) {
    return (
      <p className="product-grid__empty" role="status">
        {emptyMessage ?? "No products to display."}
      </p>
    );
  }

  return (
    <ul className="product-grid" role="list">
      {products.map((product) => (
        <li key={product.id ?? product.sku ?? product.name} className="product-grid__item">
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </li>
      ))}
    </ul>
  );
}
