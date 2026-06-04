# user-mf

User account microfrontend — sign in and registration (email + password only).

## Backend contract

Expects **user-service** on port **8082**:

| Method | Path | Body |
|--------|------|------|
| `POST` | `/users/login` | `{ "email", "password" }` |
| `POST` | `/register` | `{ "email", "password" }` |

Success response (example):

```json
{
  "email": "you@example.com",
  "token": "eyJ...",
  "userId": 2
}
```

The frontend normalizes this to `{ id, email, token }` for session storage.

## Dev

Use the **shell** from repo root: `npm run dev` → http://localhost:5173

Standalone: `npm run dev:user` → http://localhost:5175

Leave `VITE_API_BASE_URL` empty to proxy `/api/users/*` → port 8082.
