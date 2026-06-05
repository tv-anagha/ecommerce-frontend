import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@product-mf": path.resolve(dir, "../product-mf/src"),
      "@user-mf": path.resolve(dir, "../user-mf/src"),
      "@cart-mf": path.resolve(dir, "../cart-mf/src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api/products": {
        target: "http://localhost:8081",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/products/, "/products"),
      },
      "/api/users": {
        target: "http://localhost:8082",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
      "/api/register": {
        target: "http://localhost:8082",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
      "/api/carts": {
        target: "http://localhost:8083",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
