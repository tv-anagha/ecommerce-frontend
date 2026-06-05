import { useCallback, useEffect, useState } from "react";
import {
  addCartItem,
  decreaseCartItemQuantity,
  fetchCart,
  getCartItemCount,
  parseCartItems,
} from "../api/cartApi.js";

export function useCart(user) {
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);
  const [removingProductId, setRemovingProductId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const userId = user?.id ?? user?.userId;

  const applyCartData = useCallback((data) => {
    const parsed = parseCartItems(data);
    setItems(parsed);
    setItemCount(getCartItemCount(data));
  }, []);

  const refreshCart = useCallback(
    async ({ silent = false } = {}) => {
      if (!userId) return;

      if (!silent) setCartLoading(true);
      try {
        const data = await fetchCart(userId, user.token);
        applyCartData(data);
      } catch {
        setItems([]);
        setItemCount(0);
      } finally {
        if (!silent) setCartLoading(false);
      }
    },
    [userId, user?.token, applyCartData],
  );

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const openCart = useCallback(() => {
    setIsOpen(true);
    refreshCart();
  }, [refreshCart]);

  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback(
    async (product) => {
      const productId = product?.id ?? product?.productId;
      if (!userId || productId == null) {
        setError("Sign in and select a valid product.");
        return;
      }

      setAddingProductId(productId);
      setError("");

      try {
        await addCartItem({
          userId,
          productId,
          quantity: 1,
          token: user.token,
        });

        // POST returns a single line item — refetch full cart
        await refreshCart({ silent: true });
      } catch (err) {
        setError(err.message ?? "Could not add to cart");
      } finally {
        setAddingProductId(null);
      }
    },
    [userId, user?.token, refreshCart],
  );

  const removeFromCart = useCallback(
    async (productId) => {
      if (!userId || productId == null) return;

      const line = items.find(
        (item) => String(item.productId) === String(productId),
      );
      const currentQuantity = line?.quantity ?? 1;

      setRemovingProductId(productId);
      setError("");

      try {
        await decreaseCartItemQuantity({
          userId,
          productId,
          currentQuantity,
          token: user.token,
        });

        // PATCH/DELETE return one item or empty — refetch full cart
        await refreshCart({ silent: true });
      } catch (err) {
        setError(err.message ?? "Could not remove item");
      } finally {
        setRemovingProductId(null);
      }
    },
    [userId, user?.token, items, refreshCart, applyCartData],
  );

  const clearError = useCallback(() => setError(""), []);

  return {
    items,
    itemCount,
    cartLoading,
    addingProductId,
    removingProductId,
    isOpen,
    error,
    addToCart,
    removeFromCart,
    openCart,
    closeCart,
    refreshCart,
    clearError,
  };
}
