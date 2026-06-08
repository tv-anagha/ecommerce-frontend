import { enrichCartItems } from "../../utils/enrichCartItems.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import "./CartPanel.css";

export function CartPanel({
  isOpen,
  items = [],
  products = [],
  loading = false,
  removingProductId = null,
  checkoutLoading = false,
  checkoutError = "",
  onClose,
  onRemove,
  onCheckout,
}) {
  if (!isOpen) return null;

  const enriched = enrichCartItems(items, products);
  const totalQuantity = enriched.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0,
  );
  const subtotal = enriched.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0,
  );

  return (
    <div className="cart-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        className="cart-panel__backdrop"
        aria-label="Close cart"
        onClick={onClose}
      />

      <aside className="cart-panel__drawer">
        <header className="cart-panel__header">
          <h2>Shopping Cart</h2>
          <button type="button" className="cart-panel__close" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="cart-panel__body">
          {loading && !enriched.length ? (
            <p className="cart-panel__status">Loading cart…</p>
          ) : enriched.length === 0 ? (
            <p className="cart-panel__empty">Your cart is empty.</p>
          ) : (
            <ul className="cart-panel__list">
              {enriched.map((item) => {
                const isRemoving =
                  removingProductId != null &&
                  String(removingProductId) === String(item.productId);

                return (
                  <li key={item.id ?? `${item.productId}`} className="cart-panel__item">
                    {item.imageUrl ? (
                      <img
                        className="cart-panel__thumb"
                        src={item.imageUrl}
                        alt=""
                      />
                    ) : (
                      <div className="cart-panel__thumb cart-panel__thumb--placeholder" />
                    )}

                    <div className="cart-panel__details">
                      <p className="cart-panel__name">{item.name}</p>
                      <p className="cart-panel__meta">
                        Qty: {item.quantity}
                        {item.price != null && (
                          <> · {formatCurrency(item.price)} each</>
                        )}
                      </p>
                      {item.price != null && (
                        <p className="cart-panel__line-total">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      className="cart-panel__remove"
                      disabled={isRemoving}
                      onClick={() => onRemove?.(item.productId)}
                      title={
                        item.quantity > 1
                          ? "Remove one from cart"
                          : "Remove from cart"
                      }
                    >
                      {isRemoving ? "…" : item.quantity > 1 ? "−1" : "Remove"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="cart-panel__footer">
          {checkoutError && (
            <p className="cart-panel__checkout-error" role="alert">
              {checkoutError}
            </p>
          )}
          <div className="cart-panel__subtotal">
            <span>
              Subtotal ({totalQuantity}{" "}
              {totalQuantity === 1 ? "item" : "items"})
            </span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <button
            type="button"
            className="cart-panel__checkout"
            disabled={enriched.length === 0 || loading || checkoutLoading}
            onClick={onCheckout}
          >
            {checkoutLoading ? "Placing order…" : "Proceed to Checkout"}
          </button>
        </footer>
      </aside>
    </div>
  );
}
