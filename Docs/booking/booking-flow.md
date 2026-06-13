# Booking — User Flow (the simple story)

What happens when a guest books, in plain language. For endpoints see
[booking-apis.md](./booking-apis.md); for internals see [booking-architecture.md](./booking-architecture.md).

> Every booking action needs the guest to be **logged in**. A booking always belongs to the
> user who created it — you can only see and cancel **your own**.

## The big picture

```
Check availability  →  Create booking (pending)  →  Pay (separate)  →  View / cancel in "My Bookings"
```

## 1. Check availability (before booking)

```
Guest picks a room type + dates + how many rooms
      │
      ▼
POST /bookings/check-availability
      │
      ▼
Server looks at room_inventory for each night → "available: true/false" + the price
```
"No rooms free" is a normal answer (`available: false`), not an error.

## 2. Create a booking

```
Guest confirms room + dates + guest details
      │
      ▼
POST /bookings   (must be logged in)
      │
      ▼
Server checks dates (min 1 night), room is active, fits the guests →
creates the booking as "pending" (awaiting payment)
```
The booking is saved under the guest's account (`userId`). Payment happens next via Razorpay
(a separate module) — until then the booking stays `pending`.

## 3. My bookings

```
Guest opens "My Bookings"
      │
      ▼
GET /bookings/my
      │
      ▼
Shows all of the guest's bookings, newest first
```

## 4. Booking details

```
Guest clicks one booking
      │
      ▼
GET /bookings/:id
      │
      ▼
Shows that booking — but only if it belongs to the guest (else "not found")
```

## 5. Cancel a booking

```
Guest clicks "Cancel"
      │
      ▼
POST /bookings/:id/cancel
      │
      ▼
If the booking is still upcoming (pending/confirmed) → it's marked "cancelled"
(with the time + reason). Refund + giving the rooms back come later (Pass 2).
```
A booking that's already checked-in / checked-out / cancelled **can't** be cancelled.

## The simple rules behind all of it

| Rule | Meaning |
|------|---------|
| Login required | you must be signed in to do anything here |
| Your own only | you see/cancel only your bookings |
| Min 1 night | check-out must be after check-in |
| "Full" is normal | check-availability returns false, not an error |
| Pending first | a new booking waits for payment before it's confirmed |
