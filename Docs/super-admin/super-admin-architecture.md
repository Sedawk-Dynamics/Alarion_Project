# Super Admin — Architecture & Internals

How the Super Admin code is structured. For the simple story see
[super-admin-flow.md](./super-admin-flow.md); for endpoints see [super-admin-apis.md](./super-admin-apis.md).

> Plain-English summary: same layered shape as the rest of the app — route → controller → service.
> The difference is the **guard**: every route is admin-only, and the services query across **all**
> hotels (not scoped to one).

## Layered design

```
HTTP request
   │
   ▼
routes/superAdminRoutes.ts ──► authenticate → requireRole('super_admin') → controller
   │
   ▼
controllers/superAdminController.ts ──► thin: read req (body/params/query), call service, send JSON
   │
   ▼
services/superAdminServices.ts ──► all query logic (Prisma)
   │
   └─► config/prisma.ts → PostgreSQL (Hotel, Booking, User)
```

## File map

| File | Responsibility |
|------|----------------|
| [routes/superAdminRoutes.ts](../../Backend/src/routes/superAdminRoutes.ts) | 6 admin routes, each guarded |
| [controllers/superAdminController.ts](../../Backend/src/controllers/superAdminController.ts) | Request/response glue (thin) |
| [services/superAdminServices.ts](../../Backend/src/services/superAdminServices.ts) | All onboarding/update/analytics query logic |
| [middleware/auth.ts](../../Backend/src/middleware/auth.ts) | `authenticate` (401) + `requireRole` (403) |
| [config/prisma.ts](../../Backend/src/config/prisma.ts) | Shared Prisma client |
| [utils/AppError.ts](../../Backend/src/utils/AppError.ts) | Error class (404/409 etc.) |

Mounted in [routes/index.ts](../../Backend/src/routes/index.ts) at `/api/v1/admin`.

## The guard (what makes these "admin only")

Each route is declared like:
```ts
route.post('/hotels', authenticate, requireRole('super_admin'), controller.onboardHotel);
```
- **`authenticate`** verifies the Bearer access token and attaches `req.user = { id, role }` (401 if missing/expired).
- **`requireRole('super_admin')`** rejects anyone whose token role isn't `super_admin` (403).

Because the role is enforced here, the **list/analytics services don't need `req.user`** — only
`onboardHotel`/`detailsUpdate` use it (for `createdById`).

## Service functions

| Function | Route | What it does |
|----------|-------|--------------|
| `hotelOnboard(inputs, user)` | POST `/hotels` | unique-slug check → `hotel.create`, stamps `createdById` |
| `detailsUpdate(id, inputs, user)` | PUT `/hotels/:id` | 404 if missing → slug-clash check → partial `hotel.update` |
| `dashboardSummary(query)` | GET `/analytics/dashboard` | 6 counts/sums via `Promise.all` |
| `bookings(query)` | GET `/bookings` | incremental `where` + paginate, newest first |
| `users(query)` | GET `/users` | `OR` search + filters + `select` (no password) |
| `revDetails(query)` | GET `/revenue` | `aggregate` totals + `groupBy` breakdown |

## Patterns used (shared with hotel-search)

- **Incremental `where`** — a filter condition is added only when its query param is present, so
  unused filters don't constrain results (`bookings`, `users`, `revDetails`).
- **`Promise.all`** — independent reads run together (dashboard's 6 metrics).
- **`select` whitelist** — `users` returns only safe columns; `passwordHash` never leaves the DB layer.
- **Detail vs list** — `detailsUpdate` throws `AppError(404)`; list endpoints return `[]`.
- **Partial update** — `detailsUpdate` passes the input straight to `data`; Prisma skips `undefined` fields.

## Date handling (dashboard)

`dashboardSummary` derives three midnights from `new Date()`:
- **today** → `new Date(year, month, date)` (midnight today)
- **week** → today's midnight minus 6 days (last 7 days incl. today; JS rolls negative days into the previous month)
- **month** → `new Date(year, month, 1)` (1st of this month)

Each metric counts bookings with `createdAt >= ` that midnight (`gte`).

## Data model touched

- **Hotel** (`hotels`) — create/update; `createdById` records the onboarding admin.
- **Booking** (`bookings`) — `createdAt`, `totalAmount`, `status`, `paymentStatus`, `hotelId`, `roomTypeId`.
- **User** (`users`) — `name`, `email`, `phone`, `role`, `status`, `createdAt` (password hidden).

## Known limitations (Pass 2)

- **Nested onboarding** — images, amenities, room types, rate plans, policies (one transaction).
- **Net revenue / commission** — needs each hotel's `commissionPct`.
- **By-city revenue** — needs booking → hotel → city join.
- **Conversion funnel, ADR, cancellation/refund, user-acquisition** trends (PRD §6.5).
- **Dashboard `period`** input is accepted but not yet applied (the `_query` underscore marks it unused).
- Services build `where` as `any` (dynamic filter object) — could be typed with `Prisma.*WhereInput` later.
