import { formatCurrency } from "../../utils/formatCurrency.js";
import { getProductImage } from "../../utils/getProductImage.js";
import "./ProductCard.css";

function StarRating({ rating = 0, reviewCount }) {
  const stars = Math.min(5, Math.max(0, Math.round(Number(rating))));
  const filled = "★".repeat(stars);
  const empty = "☆".repeat(5 - stars);

  return (
    <div className="product-card__rating" aria-label={`${rating} out of 5 stars`}>
      <span className="product-card__stars" aria-hidden="true">
        <span className="product-card__stars-filled">{filled}</span>
        <span className="product-card__stars-empty">{empty}</span>
      </span>
      {reviewCount != null && (
        <span className="product-card__reviews">({reviewCount})</span>
      )}
    </div>
  );
}

export function ProductCard({ product, onAddToCart, addingProductId }) {
  const {
    id,
    name,
    title,
    price,
    originalPrice,
    description,
    category,
    rating,
    reviewCount,
    inStock = true,
    isPrime,
  } = product;

  const displayName = name ?? title ?? "Untitled product";
  const isAdding =
    addingProductId != null && String(addingProductId) === String(id);
  const discount =
    originalPrice && price && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <article className="product-card" data-product-id={id}>
      <a href={`#product-${id}`} className="product-card__image-link">
        <img
          className="product-card__image"
          src={getProductImage(product)}
          alt={displayName}
          loading="lazy"
        />
      </a>

      <div className="product-card__body">
        {category && (
          <span className="product-card__category">{category}</span>
        )}

        <h3 className="product-card__title">
          <a href={`#product-${id}`}>{displayName}</a>
        </h3>

        {(rating > 0 || reviewCount) && (
          <StarRating rating={rating} reviewCount={reviewCount} />
        )}

        {isPrime && <span className="product-card__prime">prime</span>}

        <div className="product-card__price-block">
          {discount != null && (
            <span className="product-card__discount">-{discount}%</span>
          )}
          <span className="product-card__price">{formatCurrency(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className="product-card__original-price">
              M.R.P.: <s>{formatCurrency(originalPrice)}</s>
            </span>
          )}
        </div>

        {description && (
          <p className="product-card__description">{description}</p>
        )}

        <p className="product-card__delivery">
          {inStock ? "FREE delivery" : "Currently unavailable"}
        </p>

        <button
          type="button"
          className="product-card__cta"
          disabled={!inStock || isAdding}
          onClick={() => onAddToCart?.(product)}
        >
          {!inStock
            ? "Out of Stock"
            : isAdding
              ? "Adding…"
              : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
