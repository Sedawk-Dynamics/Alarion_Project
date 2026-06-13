# Payment Module (Razorpay) — Overview

This is the entry point for the **payment** part of the Alarion backend. After a guest creates a
booking (status `pending`), these endpoints take the money via **Razorpay** and confirm the booking
— and refund it on cancellation.

> **In one line:** create a Razorpay order, let the guest pay on Razorpay's UI, then **verify the
> signature** (and back it up with a **webhook**) to confirm the booking; refund captured payments
> when needed. Card data never touches our server (PRD §12.3).

## The routes (under `/api/v1/payments`)

| Method | Route | Auth | What it does |
|--------|-------|------|--------------|
| POST | `/payments/create-order` | login | Create a Razorpay order for a booking's amount |
| POST | `/payments/verify` | login | Verify the payment signature → confirm the booking |
| POST | `/payments/:id/refund` | login | Refund a captured payment |
| POST | `/payments/webhook` | **public** | Razorpay → us: reliable confirm/fail (signature-verified) |

Code: [routes](../../Backend/src/routes/paymentRoute.ts) →
[controller](../../Backend/src/controllers/paymentController.ts) →
[service](../../Backend/src/services/paymentService.ts) →
[util](../../Backend/src/utils/razorpay.ts).

## Feature status (current build)

- ✅ **create-order** — validates amount from the DB, creates Razorpay order, saves a `payments` row (`pending`)
- ✅ **verify** — HMAC signature check → captures payment + confirms booking (atomic, idempotent)
- ✅ **refund** — refunds a captured payment via Razorpay, records a `refunds` row, flips payment/booking
- ⏳ **webhook** — route + controller wired; the **handler service is still a stub** (to build)

## Which doc do I read?

| I want to… | Read |
|------------|------|
| Understand the flow in plain language | [payment-flow.md](./payment-flow.md) |
| Call the endpoints (params/response/errors) | [payment-apis.md](./payment-apis.md) |
| Understand the code structure & internals | [payment-architecture.md](./payment-architecture.md) |

## Key rules (apply across the module)

- **No card data on our server** — the guest pays on Razorpay's UI; we only handle ids + signatures + amounts.
- **Amount comes from the DB**, never the request body (PRD §12.3) — else a user could underpay.
- **Money is in paise** — ₹7,500 = `750000` (× 100 when creating the order/refund).
- **Confirm only after signature is valid** — `/verify` and `/webhook` are the only places a booking becomes `confirmed`.
- **Idempotent** — `/verify` and `/webhook` may both fire for one payment; processing twice is a no-op.
- **Webhook is public** — secured by a signature, not a JWT, so it must NOT sit behind `authenticate`.
