# Payment — API Reference

Technical reference for the Razorpay payment endpoints. All under **`/api/v1/payments`**.

> Plain-English summary: `create-order`/`verify`/`refund` need a logged-in user; `webhook` is public
> (verified by signature). Responses use the standard `{ success, message, data }` envelope.

## Auth
- `create-order`, `verify`, `:id/refund` → `authenticate` (Bearer access token).
- `webhook` → **no auth**; verified by the `x-razorpay-signature` header instead.

## Endpoint summary

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/payments/create-order` | login | Create a Razorpay order |
| POST | `/payments/verify` | login | Verify signature → confirm booking |
| POST | `/payments/:id/refund` | login | Refund a captured payment |
| POST | `/payments/webhook` | – | Razorpay webhook handler |

---

## POST /payments/create-order
Create a Razorpay order for a pending booking (PRD §5.4 step 4).

**Body:** `{ bookingId }`
**Server-side:** amount is read from `booking.totalAmount` (not the body), converted to paise.

**201** → `data`:
```json
{
  "orderId": "order_Nabc123",
  "amount": 750000,
  "currency": "INR",
  "keyId": "rzp_test_xxx",
  "bookingRef": "BK...",
  "payment": "<payments row id>"
}
```
**400** → booking already paid (`paymentStatus = captured`).
**404** → booking not found / not the caller's.

## POST /payments/verify
Confirm a payment from the browser (PRD §5.4 step 5).

**Body:** `{ razorpayOrderId, razorpayPaymentId, razorpaySignature }`
**200** → `data = { payment, booking }` (payment `captured`, booking `confirmed`).
**400** → signature verification failed.
**404** → no payment for that order id.
> Idempotent: if already `captured`, returns the existing payment without re-processing.

## POST /payments/:id/refund
Refund a captured payment (PRD §5.7).

**Params:** `id` = the **payments row id**.
**Body:** `{ amount?, reason? }` — omit `amount` for a full refund; pass ₹ (≤ captured amount) for partial.
**201** → `data` = the created `refunds` row.
**400** → payment not `captured`, missing `razorpayPaymentId`, or invalid amount.
**404** → payment not found.
> Internally refunds via Razorpay using the stored `razorpayPaymentId` (not the `:id`).

## POST /payments/webhook
Razorpay → server confirmation (reliable path). **Public**, signature-verified.

**Headers:** `x-razorpay-signature`
**Body:** raw Razorpay event JSON (route must use `express.raw` so the signature matches).
**200** → acknowledged.
> Handler service is currently a stub — to build.

---

## Error codes (relevant here)

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing/invalid token (non-webhook routes) |
| `BAD_REQUEST` | 400 | Already paid / bad signature / invalid refund amount |
| `NOT_FOUND` | 404 | Booking or payment not found |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error |
