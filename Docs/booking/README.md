# Booking Module — Overview

This is the entry point for the customer **Booking** part of the Alarion backend. These endpoints
let a **logged-in guest** create a booking, view their bookings, cancel one, and pre-check
availability/price for a stay.

> **In one line:** authenticated guest endpoints to create / view / cancel bookings (scoped to the
> user) plus a read-only availability + price check used in the booking funnel.

## The routes (all under `/api/v1/bookings`, all require login)

| Method | Route | What it does |
|--------|-------|--------------|
| POST | `/bookings` | Create a new booking (status `pending`, awaiting payment) |
| POST | `/bookings/check-availability` | Read-only: are rooms free for these dates + the price |
| GET | `/bookings/my` | List the logged-in user's bookings (newest first) |
| GET | `/bookings/:id` | One booking's details (only if it's the user's) |
| POST | `/bookings/:id/cancel` | Cancel the user's own booking |

Code: [routes](../../Backend/src/routes/bookingRoute.ts) →
[controller](../../Backend/src/controllers/bookingController.ts) →
[service](../../Backend/src/services/bookingService.ts).

## Feature status (current build — Pass 1)

- ✅ **Create booking** — date validation (min 1 night), active-room + occupancy check, basic price, row created
- ✅ **My bookings** — user's bookings, newest first
- ✅ **Booking details** — owner-scoped, 404 otherwise
- ✅ **Cancel** — owner-scoped, state guard (only `pending`/`confirmed`), sets `cancelled` + `cancelledAt` + reason
- ✅ **Check availability** — per-night `room_inventory` math + Pass 1 price
- ⏳ **Pass 2 (not built yet):** real availability check + inventory hold on create, real `room_rates` pricing + GST + coupon, refund calculation + inventory release on cancel, all inside `prisma.$transaction`

## Which doc do I read?

| I want to… | Read |
|------------|------|
| Understand the journeys in plain language | [booking-flow.md](./booking-flow.md) |
| Call the endpoints (params/response/errors) | [booking-apis.md](./booking-apis.md) |
| Understand the code structure & internals | [booking-architecture.md](./booking-architecture.md) |

## Key rules (apply across all routes)

- **Auth required** — every route runs `authenticate`; bookings are tied to `req.user.id` (PRD §5.4.2).
- **Owner-scoped** — a guest can only see/cancel **their own** bookings (`where: { id, userId }`).
- **Detail vs list:** a missing/again not-yours booking returns **404**; the list returns `[]`.
- **Min stay 1 night**; check-availability returns `available: false` (it does **not** error when full).
- **Currency INR**; payment is a separate Razorpay step (booking is created `pending`).
