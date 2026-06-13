# Booking — API Reference

Technical reference for the customer Booking endpoints. All routes are under **`/api/v1/bookings`**
and require a valid access token (any logged-in user).

> Plain-English summary: create/view/cancel inputs come from body/params; everything is scoped to
> `req.user`. Responses use the standard `{ success, message, data }` envelope.

## Auth on every route
```
authenticate → must send a valid Bearer access token (else 401)
```
No specific role is required — any authenticated user can book (PRD §5.4.2). The booking is tied to
their `userId`.

## Response envelope
**Success**
```json
{ "success": true, "message": "...", "data": ... }
```
**Error** (PRD §10.1)
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

## Endpoint summary

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/bookings` | Create a booking |
| POST | `/bookings/check-availability` | Availability + price pre-check |
| GET | `/bookings/my` | List the user's bookings |
| GET | `/bookings/:id` | One booking (owner only) |
| POST | `/bookings/:id/cancel` | Cancel the user's booking |

---

## POST /bookings
Create a booking (PRD §5.4, Pass 1).

**Body — required:** `hotelId`, `roomTypeId`, `ratePlanId`, `checkinDate`, `checkoutDate`,
`guestName`, `guestEmail`
**Body — optional:** `numRooms` (1), `numAdults` (1), `numChildren` (0), `guestPhone`, `specialRequests`
**Set by server:** `userId` (from token), `bookingRef`, `numNights`, `roomTotal`/`totalAmount`,
`status: pending`, `paymentStatus: pending`, `source: platform_direct`.

**201** → `data` = the created booking.
**400** → less than 1 night / room not in that hotel / guests exceed occupancy.
**404** → room type not found or not active.

> Pass 2: real availability check (→409), `room_rates` pricing + GST, inventory hold, transaction.

## POST /bookings/check-availability
Read-only check (PRD §5.4.1).

**Body:** `roomTypeId`, `checkinDate`, `checkoutDate`, `numRooms?` (1)
**200** → `data`:
```json
{
  "available": true,
  "roomTypeId": "…",
  "nights": 3,
  "roomsRequested": 1,
  "minAvailable": 4,
  "pricePerNight": 2500,
  "totalPrice": 7500
}
```
Returns `available: false` when full — **not** an error. **404** if the room type is missing/inactive.

## GET /bookings/my
The logged-in user's bookings, newest first (PRD §5.5.2).
**200** → `data` = array of the user's bookings. **Empty** → `[]`.

## GET /bookings/:id
One booking's details — only if it belongs to the caller (PRD §5.5.2).
**200** → `data` = the booking.
**404** → no such booking, or it isn't the caller's.

## POST /bookings/:id/cancel
Cancel the user's own booking (PRD §5.7, Pass 1).
**Params:** `id`. **Body:** `reason?`
**200** → `data` = the cancelled booking (`status: cancelled`, `cancelledAt`, `cancellationReason`).
**400** → booking isn't `pending`/`confirmed` (already checked-in/out/cancelled).
**404** → not found / not the caller's.

> Pass 2: refund amount from `hotel_policies.freeCancellationHours`, release held inventory.

---

## Error codes (relevant here)

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `BAD_REQUEST` | 400 | Invalid dates / occupancy / non-cancellable state |
| `NOT_FOUND` | 404 | Booking or room type not found (or not yours) |
| `CONFLICT` | 409 | (Pass 2) rooms not available for the stay |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error |
