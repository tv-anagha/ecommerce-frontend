import "./CartBadge.css";

export function CartBadge({ count = 0, loading = false, onClick }) {
  const label =
    count === 0
      ? "Cart empty"
      : `${count} ${count === 1 ? "item" : "items"} in cart`;

  return (
    <button
      type="button"
      className="cart-badge"
      aria-label={`${label}. Open cart`}
      title={label}
      onClick={onClick}
    >
      <span className="cart-badge__icon" aria-hidden="true">
        🛒
      </span>
      <span className="cart-badge__count">
        {loading ? "…" : count}
      </span>
    </button>
  );
}
