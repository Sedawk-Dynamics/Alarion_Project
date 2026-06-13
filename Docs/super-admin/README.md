# Super Admin Panel — Overview

This is the entry point for the **Super Admin** part of the Alarion backend. These endpoints
let Alarion's own operations team onboard hotels and oversee the whole platform — bookings,
users, and revenue — across **all** hotels.

> **In one line:** admin-only endpoints to onboard/edit hotels and view platform-wide
> dashboards, bookings, users, and revenue — every route locked behind login **and** the
> `super_admin` role.

## The routes (all under `/api/v1/admin`, all protected)

| Method | Route | What it does |
|--------|-------|--------------|
| POST | `/admin/hotels` | Onboard (create) a new hotel |
| PUT | `/admin/hotels/:id` | Update an existing hotel's details (partial) |
| GET | `/admin/analytics/dashboard` | Platform headline metrics (bookings, revenue, hotels, users) |
| GET | `/admin/bookings` | All bookings across all hotels (filtered, paginated) |
| GET | `/admin/users` | All registered users (search, filter, paginated) |
| GET | `/admin/revenue` | Revenue analytics (totals + breakdown) |

Code: [routes](../../Backend/src/routes/superAdminRoutes.ts) →
[controller](../../Backend/src/controllers/superAdminController.ts) →
[service](../../Backend/src/services/superAdminServices.ts).

## Feature status (current build)

- ✅ Hotel **onboarding** (core hotel row) — PRD §6.2.1
- ✅ Hotel **update** (partial, incl. activate/deactivate) — PRD §6.2.2
- ✅ **Dashboard** headline metrics (bookings today/week/month, revenue, active hotels, guests) — PRD §6.1
- ✅ **All bookings** with filters (hotel, status, payment, date range) — PRD §6.3
- ✅ **All users** with search + role/status filters — PRD §6.4
- ✅ **Revenue** totals + breakdown by hotel / room type — PRD §6.5
- ⏳ **Pass 2 (not built yet):** nested onboarding (images, amenities, room types, rate plans,
  policies), net revenue/commission, by-city breakdown, conversion funnel, ADR/cancellation trends

## Which doc do I read?

| I want to… | Read |
|------------|------|
| Understand the journeys in plain language | [super-admin-flow.md](./super-admin-flow.md) |
| Call the endpoints (params/response/errors) | [super-admin-apis.md](./super-admin-apis.md) |
| Understand the code structure & internals | [super-admin-architecture.md](./super-admin-architecture.md) |

## Key rules (apply across all routes)

- **Admin only** — every route runs `authenticate` then `requireRole('super_admin')`. No guest or
  hotel admin can reach them.
- **Platform-wide** — a super admin sees **all** hotels' data; results are never scoped to "their" hotel.
- **Detail vs list:** updating a missing hotel returns **404**; list endpoints return `[]`, never 404.
- **Pagination:** `?page` & `?limit`, defaults page 1 / 20 per page.
- **No password leakage:** the users endpoint `select`s safe fields only — `passwordHash` is never returned.
