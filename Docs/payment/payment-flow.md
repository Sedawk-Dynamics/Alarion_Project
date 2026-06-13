# Payment — Flow (the simple story)

How a guest pays, in plain language. For endpoints see [payment-apis.md](./payment-apis.md);
for internals see [payment-architecture.md](./payment-architecture.md).

> The golden rule: **card details never touch our server.** The guest types them on Razorpay's
> secure screen. Our backend only deals with order ids, payment ids, signatures, and amounts.

## The big picture

```
Booking (pending)
   → create-order (Razorpay)
   → guest pays on Razorpay
   → verify (signature)  AND/OR  webhook  → Booking confirmed + paid
   → refund (if cancelled)
```

## 1. Create the order

```
Guest clicks "Pay" on a pending booking
      │
      ▼
POST /payments/create-order { bookingId }
      │
      ▼
Server reads the ₹ amount FROM the booking row → asks Razorpay for an order
→ saves a payments row (status: pending) → returns { orderId, amount, keyId } to the browser
```
The browser uses `orderId` + `keyId` to open Razorpay Checkout.

## 2. Guest pays (on Razorpay)

```
Razorpay's popup opens → guest pays by UPI / card / netbanking
      │
      ▼
Razorpay hands the browser 3 values:
  razorpay_order_id, razorpay_payment_id, razorpay_signature
```
The card details stayed with Razorpay the whole time.

## 3. Verify (the fast path)

```
Browser → POST /payments/verify { the 3 values }
      │
      ▼
Server recomputes the signature with its secret key:
  match?  → payment captured + booking CONFIRMED
  no match? → reject (someone faked it)
```

## 4. Webhook (the safety net)

```
Razorpay → POST /payments/webhook   (server-to-server, even if the browser closed)
      │
      ▼
Server checks the webhook signature → confirms/fails the payment reliably
```
Why both #3 and #4? If the guest closes the tab right after paying, #3 never happens — but the
webhook still arrives. The code handles either, **without double-counting** (idempotent).

## 5. Refund (on cancellation)

```
Admin/guest cancels → POST /payments/:id/refund { amount? }
      │
      ▼
Server tells Razorpay to send money back (full or partial) →
records a refunds row, marks the payment + booking refunded
```

## The simple rules behind all of it

| Rule | Meaning |
|------|---------|
| No card data | the guest pays on Razorpay, not on us |
| Amount from DB | we never trust an amount from the browser |
| Paise not rupees | ₹7,500 = 750000 |
| Confirm only if signature is real | a fake "I paid" is rejected |
| Two confirm paths | verify (fast) + webhook (reliable), processed once |
