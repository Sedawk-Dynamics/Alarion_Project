# Super Admin — API Reference

Technical reference for the Super Admin endpoints. All routes are under **`/api/v1/admin`** and
require a valid access token **and** the `super_admin` role.

> Plain-English summary: admin-only endpoints. Create/update inputs come from the **body**;
> list/analytics inputs come from the **query string**. Responses use the standard
> `{ success, message, data }` envelope.

## Auth on every route

```
authenticate            → must send a valid Bearer access token (else 401)
requireRole('super_admin') → token's role must be super_admin (else 403)
```

## Response envelope

**Success**
```json
{ "success": true, "message": "...", "data": ... }
```
**Error** (PRD §10.1 format)
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

## Endpoint summary

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/admin/hotels` | Onboard a new hotel |
| PUT | `/admin/hotels/:id` | Update a hotel (partial) |
| GET | `/admin/analytics/dashboard` | Platform headline metrics |
| GET | `/admin/bookings` | All bookings (filtered) |
| GET | `/admin/users` | All users (searchable) |
| GET | `/admin/revenue` | Revenue analytics |

---

## POST /admin/hotels
Create one hotel (core row — PRD §6.2.1, Pass 1).

**Body — required:** `name`, `slug`, `addressLine1`, `cityId`, `state`, `pincode`,
`latitude`, `longitude`, `starRating`
**Body — optional:** `legalName`, `gstNumber`, `description`, `shortDescription`, `addressLine2`,
`propertyType` (`hotel`|`resort`|`boutique`|`service_apartment`), `contactPhone`, `contactEmail`,
`websiteUrl`, `mainImageUrl`, `commissionPct`
**Set by server:** `createdById` (from the token, not the body).

**201** → `data` = the created hotel.
**409** → slug already exists.

> Nested onboarding (images, amenities, room types, rate plans, policies) is Pass 2 — not yet accepted.

## PUT /admin/hotels/:id
Partial update of a hotel (PRD §6.2.2). Send only the fields you want to change.

**Params:** `id` (hotel id)
**Body:** any subset of the hotel fields above, plus `status` (`active`|`inactive`|`pending`|`suspended`) to activate/deactivate.

**200** → `data` = the updated hotel.
**404** → hotel id not found.
**409** → new slug already used by another hotel.

## GET /admin/analytics/dashboard
Platform headline metrics (PRD §6.1).

**Query:** `period?` (`today`|`week`|`month`) — optional (Pass 2 scoping).
**200** → `data`:
```json
{
  "bookings": { "today": 0, "week": 0, "month": 0 },
  "revenue": { "gross": 0 },
  "activeHotels": 0,
  "registeredUsers": 0
}
```

## GET /admin/bookings
All bookings across all hotels, filtered + paginated (PRD §6.3).

**Query (all optional):** `hotelId`, `status`, `paymentStatus`, `from`, `to` (date range on `createdAt`),
`page` (1), `limit` (20).
**200** → `data` = array of bookings, newest first.
**Empty** → `data: []`.

## GET /admin/users
All registered users, searchable + filtered (PRD §6.4).

**Query (all optional):** `search` (matches name/email/phone), `role` (`guest`|`hotel_admin`|`super_admin`),
`status`, `page` (1), `limit` (20).
**200** → `data` = array of users with safe fields only: `id, name, email, phone, role, status, createdAt`.
**Empty** → `data: []`.
> `passwordHash` is never returned.

## GET /admin/revenue
Revenue analytics (PRD §6.5, Pass 1).

**Query (all optional):** `from`, `to` (date range on `createdAt`), `groupBy` (`hotel` default | `roomType`).
**200** → `data`:
```json
{
  "grossRevenue": 0,
  "totalBookings": 0,
  "averageBookingValue": 0,
  "groupBy": "hotelId",
  "breakdown": [ { "hotelId": "…", "_sum": { "totalAmount": 0 }, "_count": 0 } ]
}
```
> Net revenue/commission and by-city breakdown are Pass 2.

---

## Pagination
List endpoints use **offset pagination**: `skip = (page - 1) * limit`, `take = limit`.
Defaults: **page 1, 20 per page**.

## Error codes (relevant here)

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing/invalid access token |
| `FORBIDDEN` | 403 | Logged in but not a super admin |
| `NOT_FOUND` | 404 | Hotel id not found (update) |
| `CONFLICT` | 409 | Slug already exists |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error |
