# cart-mf

Cart microfrontend — integrates with cart-service on port **8083**.

## Backend routes

| Method | Path | Body |
|--------|------|------|
| `GET` | `/health` | — |
| `GET` | `/carts/:userId` | — |
| `POST` | `/carts/:userId/items` | `{ "productId", "quantity" }` |
| `PATCH` | `/carts/:userId/items/:productId` | `{ "quantity" }` |
| `DELETE` | `/carts/:userId/items/:productId` | — |

Dev proxy: `/api/carts/*` → `http://localhost:8083/carts/*`
