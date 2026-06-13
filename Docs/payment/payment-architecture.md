# Payment — Architecture & Internals

How the payment code is structured. For the simple story see [payment-flow.md](./payment-flow.md);
for endpoints see [payment-apis.md](./payment-apis.md).

> Plain-English summary: route → controller → service → **razorpay util**. The util is the only place
> that talks to Razorpay / holds the secret keys; the service holds the business logic + DB writes.

## Layered design

```
HTTP request
   │
   ▼
routes/paymentRoute.ts ──► authenticate (except /webhook) → controller
   │
   ▼
controllers/paymentController.ts ──► thin: read req, call service, send JSON
   │
   ▼
services/paymentService.ts ──► business logic + DB (Prisma)
   │           │
   │           └─► prisma → PostgreSQL (Payment, Booking, Refund)
   ▼
utils/razorpay.ts ──► Razorpay SDK + signature checks (holds RAZORPAY_* secrets)
```

## File map

| File | Responsibility |
|------|----------------|
| [routes/paymentRoute.ts](../../Backend/src/routes/paymentRoute.ts) | 4 routes; webhook is public, the rest need auth |
| [controllers/paymentController.ts](../../Backend/src/controllers/paymentController.ts) | Request/response glue (thin) |
| [services/paymentService.ts](../../Backend/src/services/paymentService.ts) | order / verify / refund / webhook logic |
| [utils/razorpay.ts](../../Backend/src/utils/razorpay.ts) | SDK client + `createOrder` / `verifyPaymentSignature` / `verifyWebhookSignature` / `refundPayment` |

Mounted in [routes/index.ts](../../Backend/src/routes/index.ts) at `/api/v1/payments`.

## The util (`utils/razorpay.ts`)

| Function | What it does |
|----------|--------------|
| `createOrder(amountInPaise, receipt)` | `razorpay.orders.create(...)` → returns the order |
| `verifyPaymentSignature(orderId, paymentId, signature)` | HMAC-SHA256 of `orderId\|paymentId` with **key secret** → true/false |
| `verifyWebhookSignature(rawBody, signature)` | HMAC-SHA256 of the **raw body** with **webhook secret** → true/false |
| `refundPayment(paymentId, amountInPaise?)` | `razorpay.payments.refund(...)` (omit amount = full) |

- Secrets (`RAZORPAY_KEY_ID/KEY_SECRET/WEBHOOK_SECRET`) live **only** here.
- Signature checks use Node `crypto` + a constant-time compare (`timingSafeEqual`) to resist timing attacks.

## Service functions

| Function | Route | What it does |
|----------|-------|--------------|
| `razorpayOrder(input, user)` | POST `/create-order` | owner-scoped booking → amount from DB → `createOrder` → save `payments` (`pending`) |
| `paymentVerify(inputs, user)` | POST `/verify` | verify signature → `$transaction`: payment `captured` + booking `confirmed` (idempotent) |
| `refundInitiate(id, body, user)` | POST `/:id/refund` | captured-only → `refundPayment(razorpayPaymentId, paise)` → `$transaction`: create `refunds` row + flip payment/booking |
| `webhookHandle(body, signature)` | POST `/webhook` | (stub) verify webhook signature → confirm/fail reliably |

## Two "payment ids" (important)

- **`payments.id`** — our DB row id; this is the `:id` in `/payments/:id/refund`.
- **`payments.razorpayPaymentId`** (`pay_xxx`) — Razorpay's id; this is what `refundPayment()` needs.

`refundInitiate` looks the row up by **our** id, then refunds using the **Razorpay** id stored on it.

## Idempotency & atomicity

- **Idempotent:** `paymentVerify` returns early if the payment is already `captured`, so `/verify` and
  the webhook can both fire for one payment without double-confirming.
- **Atomic:** capturing a payment + confirming a booking (and refund + flips) run inside
  `prisma.$transaction`, so they succeed or fail together — never a paid-but-unconfirmed state.

## Data model touched

- **Payment** (`payments`) — `bookingId`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`,
  `amount`, `currency`, `status` (`pending→captured→refunded/partially_refunded`).
- **Booking** (`bookings`) — `paymentStatus`, `status` (`pending→confirmed`), `confirmedAt`, `refundAmount`.
- **Refund** (`refunds`) — `paymentId`, `bookingId`, `razorpayRefundId`, `amount`, `reason`, `status`.

## Known limitations / to-build

- **Webhook handler is a stub** — needs: verify `x-razorpay-signature` (raw body), parse the event
  (`payment.captured` / `payment.failed`), and update payment/booking idempotently.
- **Raw body for webhook** — the `/webhook` route must use `express.raw({ type: 'application/json' })`
  (app-level), or the signature hash won't match the parsed JSON.
- **GST / coupon** in pricing and the **15-min hold expiry** auto-cancel are handled elsewhere (booking module / a job).
- **Refund status** is recorded as `initiated`; a webhook (`refund.processed`) should later flip it to processed.
