# Authentication — Architecture & Internals

How the auth code is structured and why. For the simple story see
[auth-flow.md](./auth-flow.md); for endpoints see [auth-apis.md](./auth-apis.md).

> Plain-English summary: requests flow through thin layers
> (route → controller → service). The **service** holds all the logic and talks to
> **PostgreSQL (Prisma)** for users/sessions and **Redis** for short-lived tokens.

## Layered design

```
HTTP request
   │
   ▼
routes/authRoute.ts ──► maps URL → middleware → controller
   │                     (validate, rate-limit, authenticate)
   ▼
controllers/authController.ts ──► thin: read req, call service, send JSON
   │
   ▼
services/authService.ts ──► all business logic
   │
   ├─► config/prisma.ts   → PostgreSQL (User, UserSession)
   ├─► config/redis.ts    → OTP, tokens, lockout, rate-limit
   └─► utils/notifications → email / SMS
```

**Rule:** controllers never touch the DB; services never touch `req`/`res`.

## File map

| File | Responsibility |
|------|----------------|
| [routes/authRoute.ts](../../Backend/src/routes/authRoute.ts) | Endpoint → middleware → controller wiring |
| [controllers/authController.ts](../../Backend/src/controllers/authController.ts) | Request/response glue (thin) |
| [services/authService.ts](../../Backend/src/services/authService.ts) | All auth logic (hashing, JWT, OTP, Google, sessions) |
| [middleware/validate.ts](../../Backend/src/middleware/validate.ts) | Zod body validation → 422 |
| [middleware/auth.ts](../../Backend/src/middleware/auth.ts) | `authenticate` + `requireRole` (RBAC) |
| [middleware/rateLimiter.ts](../../Backend/src/middleware/rateLimiter.ts) | Global rate limit (Redis-backed) |
| [middleware/errorHandler.ts](../../Backend/src/middleware/errorHandler.ts) | 404 + central error formatter |
| [validations/authValidation.ts](../../Backend/src/validations/authValidation.ts) | Zod schemas per endpoint |
| [config/prisma.ts](../../Backend/src/config/prisma.ts) | Shared Prisma client |
| [config/redis.ts](../../Backend/src/config/redis.ts) | Shared ioredis client |
| [utils/AppError.ts](../../Backend/src/utils/AppError.ts) | Error class (statusCode + code + details) |
| [utils/notifications.ts](../../Backend/src/utils/notifications.ts) | `sendEmail` / `sendSms` (provider stubs) |
| [app.ts](../../Backend/src/app.ts) | Express app: CORS, JSON, rate limit, routes, errors |

## Token strategy (JWT)

| Token | Lifetime | Carries | Purpose |
|-------|----------|---------|---------|
| **Access** | 15 min | `sub` (user id), `role` | Sent on each request; read by `authenticate` |
| **Refresh** | 7 days | `sub`, `jti` (unique id) | Get a new pair; rotated on use |

- **Rotation:** every `/refresh` deletes the used token and issues a new pair, so a
  stolen old refresh token can't be reused.
- **Role in the access token** is what powers RBAC without a DB hit per request.

## Redis usage (short-lived keys with TTL)

| Key pattern | TTL | Purpose |
|-------------|-----|---------|
| `verify:email:<token>` | 24 h | Email verification link |
| `otp:<phone>` | 5 min | Phone OTP (stored hashed) |
| `mfa:login:<userId>` | 5 min | Hotel-admin login OTP |
| `reset:password:<token>` | 1 h | Password reset link |
| `refresh:<userId>:<jti>` | 7 d | Refresh-token whitelist (fast check) |
| `login:fail:<identifier>` | 15 min* | Failed-login counter (lockout) |
| `rl:api:*` | 1 min | Rate-limit counters |

\* The 15-minute TTL is set **when the 5th failure occurs** (the moment the account
locks), so the cooldown is a full 15 minutes measured from the locking attempt — not
from the first miss. Counts 1–4 have no TTL and are cleared by the 5th failure or a
successful login.

### Brute-force lockout — how it works

```
wrong #1..4 → counter increments (no timer yet)
wrong #5    → counter = 5  → 15-min TTL set  → account locked 🔒
attempt #6  → blocked with 429 (password not even checked)
...15 min after the 5th failure → key auto-expires → unlocked
successful login at any point → counter deleted (fresh slate)
```

## Hybrid session storage (Redis + Postgres)

Refresh tokens are tracked in **two** places:

- **Redis** (`refresh:<userId>:<jti>`) — fast per-request check on the hot path.
- **`user_sessions` table** — durable source of truth (survives a Redis flush;
  enables device/IP audit and "log out other devices").

Both must agree for a refresh to succeed. On rotation or revoke, both are cleared.

```
issueTokens()        → write Redis key + insert user_sessions row
refreshToken()       → check both → delete old from both → issue new
revokeUserSessions() → delete all Redis keys + all user_sessions rows for the user
```

## Security features → PRD mapping

| Feature | Where | PRD |
|---------|-------|-----|
| bcrypt hashing (12 rounds) | `authService` | §12.2 |
| JWT access(15m)+refresh(7d) | `issueTokens` | §12.1 |
| Role-based access control | `auth.ts` middleware + role in token | §12.1, §4.3 |
| MFA (SMS OTP) for hotel admins | `login` / `verifyLoginOtp` | §12.1 |
| Session invalidation on password change | `resetPassword` → `revokeUserSessions` | §12.1 |
| Brute-force lockout (5 / 15 min) | `login` + Redis | §12.1 |
| Rate limiting (100 / 30 per min) | `rateLimiter.ts` | §10.1, §12.4 |
| Request validation (Zod) | `validate.ts` + schemas | §10.1, §12.4 |
| CORS allowlist | `app.ts` | §12.4 |
| Consistent error format | `AppError` + `errorHandler` | §10.1 |
| No email enumeration | `forgotPassword` | best practice |

## Data model (relevant fields)

**User** (`users`)
```
id, email (unique), phone (unique, optional), passwordHash (optional),
name, role (guest|hotel_admin|super_admin), status (active|inactive|banned),
emailVerified, phoneVerified, avatarUrl, googleId, lastLoginAt, createdAt, updatedAt
```

**UserSession** (`user_sessions`)
```
id, userId → User, refreshToken (the jti, unique), deviceInfo?, ipAddress?,
expiresAt, createdAt
```

## Middleware reference

| Middleware | Effect |
|------------|--------|
| `validate(schema)` | Parse/clean `req.body`; 422 with `details` on failure |
| `authenticate` | Verify Bearer access token → set `req.user = { id, role }`; else 401 |
| `requireRole(...roles)` | 403 unless `req.user.role` is allowed (run after `authenticate`) |
| `apiLimiter` | 100/min auth, 30/min unauth, per user/IP |
| `notFound` / `errorHandler` | Uniform 404 and error responses |

Usage example for future protected domains:
```ts
router.get('/admin/users', authenticate, requireRole('super_admin'), listUsers);
router.get('/hotel/dashboard', authenticate, requireRole('hotel_admin'), dashboard);
```

## Environment variables

```
DATABASE_URL          PostgreSQL connection
REDIS_URL             Redis connection
JWT_ACCESS_SECRET     Signs access tokens
JWT_REFRESH_SECRET    Signs refresh tokens
JWT_ACCESS_TTL        Access token lifetime (e.g. 15m)
APP_URL               Frontend base URL (used in email links)
CORS_ORIGINS          Comma-separated allowed origins
GOOGLE_CLIENT_ID      Verifies Google ID tokens
PORT                  Server port
```

## Known limitations

- **Phone-only signup vs required email:** the `users.email` column is currently
  **required**, but phone-OTP signup creates a user without an email — so brand-new
  phone-only signups fail at the DB layer. Fix options: make `email` optional
  (`email String? @unique`) + migrate, **or** require an existing account for phone OTP.
- **`deviceInfo` / `ipAddress`** on `user_sessions` are not yet populated (left null);
  thread `req.ip` / user-agent into `issueTokens` to enable per-device session listing.
- **Email/SMS providers** in `utils/notifications.ts` are stubs (console logs) — wire
  SendGrid / MSG91 for production.
