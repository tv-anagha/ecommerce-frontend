import { formatCurrency } from "../../utils/formatCurrency.js";
import "./OrderConfirmation.css";

export function OrderConfirmation({ order, onClose }) {
  if (!order) return null;

  const items = order.items ?? [];
  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : null;

  return (
    <div className="order-confirm" role="dialog" aria-modal="true" aria-label="Order confirmation">
      <button
        type="button"
        className="order-confirm__backdrop"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="order-confirm__card">
        <div className="order-confirm__success-icon" aria-hidden="true">
          ✓
        </div>
        <h2>Order placed!</h2>
        <p className="order-confirm__meta">
          Order <strong>#{order.id}</strong>
          {createdAt && <> · {createdAt}</>}
        </p>

        <ul className="order-confirm__items">
          {items.map((item) => (
            <li key={item.id ?? `${item.productId}`}>
              <span className="order-confirm__item-name">
                {item.productName ?? `Product #${item.productId}`}
              </span>
              <span className="order-confirm__item-qty">× {item.quantity}</span>
              <span className="order-confirm__item-price">
                {formatCurrency((item.price ?? 0) * (item.quantity ?? 1))}
              </span>
            </li>
          ))}
        </ul>

        <div className="order-confirm__total">
          <span>Total paid</span>
          <strong>{formatCurrency(order.totalAmount)}</strong>
        </div>

        <p className="order-confirm__note">
          Your order was published to Kafka for downstream processing.
        </p>

        <button type="button" className="order-confirm__done" onClick={onClose}>
          Continue shopping
        </button>
      </div>
    </div>
  );
}
