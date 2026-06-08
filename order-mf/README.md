# order-mf

Order / checkout microfrontend — integrates with order-service on port **8084**.

## API

| Method | Path | Body |
|--------|------|------|
| `POST` | `/orders` | `{ "userId" }` |
| `GET` | `/orders/:id` | — |

Order-service reads the cart (8083) and product prices (8081), persists the order, and publishes a Kafka event.
