import { useCallback, useState } from "react";
import { fetchProducts } from "../api/productsApi.js";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setProducts([]);
      setError(err.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, loadProducts };
}
