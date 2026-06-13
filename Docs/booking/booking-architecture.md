# Booking — Architecture & Internals

How the Booking code is structured. For the simple story see [booking-flow.md](./booking-flow.md);
for endpoints see [booking-apis.md](./booking-apis.md).

> Plain-English summary: same layered shape — route → controller → service. Every route needs a
> logged-in user, and every read/write is scoped to that user's `id`.

## Layered design

```
HTTP request
   │
   ▼
routes/bookingRoute.ts ──► authenticate → controller   (no role restriction; any logged-in user)
   │
   ▼
controllers/bookingController.ts ──► thin: read req (body/params), pass req.user, send JSON
   │
   ▼
services/bookingService.ts ──► all booking logic (Prisma)
   │
   └─► config/prisma.ts → PostgreSQL (Booking, RoomType, RoomInventory)
```

## File map

| File | Responsibility |
|------|----------------|
| [routes/bookingRoute.ts](../../Backend/src/routes/bookingRoute.ts) | 5 routes, all behind `authenticate` |
| [controllers/bookingController.ts](../../Backend/src/controllers/bookingController.ts) | Request/response glue (thin) |
| [services/bookingService.ts](../../Backend/src/services/bookingService.ts) | All create/list/detail/cancel/availability logic |
| [middleware/auth.ts](../../Backend/src/middleware/auth.ts) | `authenticate` (401) |
| [config/prisma.ts](../../Backend/src/config/prisma.ts) | Shared Prisma client |
| [utils/AppError.ts](../../Backend/src/utils/AppError.ts) | Error class (400/404/409 etc.) |

Mounted in [routes/index.ts](../../Backend/src/routes/index.ts) at `/api/v1/bookings`.

## Route ordering (important)

`GET /my` is declared **before** `GET /:id`. If the order were reversed, Express would match
`/my` against `/:id` (with `id = "my"`). Static segments always go before dynamic `:params`.

## Service functions

| Function | Route | What it does |
|----------|-------|--------------|
| `addBooking(inputs, user)` | POST `/` | validate dates/room/occupancy → create booking (`pending`) |
| `checkAvailability(input)` | POST `/check-availability` | per-night `room_inventory` math + Pass 1 price (read-only) |
| `bookingsUser(user)` | GET `/my` | the user's bookings, newest first |
| `detailsBooking(id, user)` | GET `/:id` | `findFirst({ id, userId })` → 404 if not theirs |
| `bookingCancel(id, input, user)` | POST `/:id/cancel` | owner + state guard → set `cancelled` |

## Ownership scoping (the core rule)

Bookings belong to a user, so reads/writes use **`findFirst({ where: { id, userId: user.id } })`**
(not `findUnique` by `id` alone). This means another user's booking simply returns **404** — a guest
can never see or cancel someone else's booking.

> Note: `findUnique` can't take a non-unique filter like `userId`, which is why `findFirst` is used.

## Availability math (shared logic)

`checkAvailability` computes, for the nights `[checkin, checkout)`:
- pull all `room_inventory` rows in one query (`date: { gte: checkin, lt: checkout }`)
- per night `available = totalRooms − bookedRooms − blockedRooms`
- `minAvailable` = the smallest of those; **a night with no row counts as 0** (detected via
  `inventory.length !== numNights`)
- `available = minAvailable >= roomsRequested`

This is the exact logic `addBooking` (hold) and `bookingCancel` (release) will reuse in Pass 2.

## Data model touched

- **Booking** (`bookings`) — created `pending`; key fields `bookingRef`, `userId`, `hotelId`,
  `roomTypeId`, `ratePlanId`, `checkinDate`, `checkoutDate`, `numNights`, `roomTotal`, `totalAmount`,
  `status`, `paymentStatus`, `source`, `cancelledAt`, `cancellationReason`.
- **RoomType** (`room_types`) — active check, `basePrice`, `maxOccupancy`.
- **RoomInventory** (`room_inventory`) — per-night `totalRooms`/`bookedRooms`/`blockedRooms`.

## Known limitations (Pass 2)

- **No real availability/hold on create** — `addBooking` saves without checking `room_inventory` or
  decrementing it, so under concurrency two guests could grab the last room. Pass 2 adds the
  availability check (→409), the inventory hold (`bookedRooms += numRooms`, `holdExpiresAt` 15-min),
  and wraps create+hold in **`prisma.$transaction`** (PRD §4.3).
- **Pricing is basic** — `basePrice × nights × rooms`. Pass 2 uses `room_rates.finalRate` + GST
  (PRD §19.2) + coupon discount.
- **Cancel doesn't refund or release rooms yet** — Pass 2 computes the refund from
  `hotel_policies.freeCancellationHours` and gives the inventory back, in a transaction.
- **`bookingRef`** is a simple timestamp string; Pass 2 should make it collision-safe.
- Pagination not yet on `/my` (PRD §10.1 cursor-based) — fine for small lists, add later.
