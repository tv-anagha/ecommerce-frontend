import { useCallback, useState } from "react";
import { placeOrder } from "../api/ordersApi.js";

export function useCheckout(user) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = user?.id ?? user?.userId;

  const checkout = useCallback(async () => {
    if (!userId) {
      setError("Sign in to checkout.");
      return null;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const placed = await placeOrder(userId, user.token);
      setOrder(placed);
      return placed;
    } catch (err) {
      setError(err.message ?? "Checkout failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, user?.token]);

  const clearOrder = useCallback(() => {
    setOrder(null);
    setError("");
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return {
    order,
    loading,
    error,
    checkout,
    clearOrder,
    clearError,
  };
}
