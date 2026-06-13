# Hotel Search — API Reference

Technical reference for the public hotel & city endpoints. All routes are under
**`/api/v1`** and require **no authentication**.

> Plain-English summary: read-only GET endpoints. Search/listing inputs come from the
> **query string**. Responses use the standard `{ success, message, data }` envelope.

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

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/hotels/search` | – | Search active hotels in a city (+ filters/sort, paginated) |
| GET | `/hotels/:slug` | – | Hotel detail by slug |
| GET | `/hotels/:id/rooms` | – | Active room types of a hotel |
| GET | `/hotels/:id/reviews` | – | Approved reviews (paginated) |
| GET | `/cities` | – | List active cities |
| GET | `/cities/:slug/hotels` | – | Active hotels in a city (paginated) |

---

## GET /hotels/search
Search active hotels within a city, with optional filters and sorting.

**Query params**
| Param | Type | Notes |
|-------|------|-------|
| `city` | string (slug) | **required in practice** — without it, returns `[]` |
| `starRating` | number | minimum stars (e.g. `4` → 4★ and up) |
| `propertyType` | enum | `hotel` \| `resort` \| `boutique` \| `service_apartment` |
| `minRating` | number | minimum guest review score (e.g. `4.0`) |
| `amenities` | string | comma-separated amenity ids; hotel must have **all** |
| `sort` | string | `rating` \| `popularity` (default: featured first, then rating) |
| `page` | number | default `1` |
| `limit` | number | default `20` |

**Example**
```
GET /api/v1/hotels/search?city=jaipur&starRating=4&propertyType=resort&sort=rating&page=1
```
**200** → `data` = array of active hotels (current page).
**404** → city slug not found.
**Empty** → `data: []` when `city` missing or no hotels match.

> ⏳ Not yet supported: `checkIn`/`checkOut` availability, guests/occupancy,
> price-range filter, price sorting, distance.

## GET /hotels/:slug
Full detail for one active hotel.
**200** → `data` = the hotel object.
**404** → `Hotel not found` (no active hotel with that slug).

## GET /hotels/:id/rooms
Active room types for a hotel (`:id` = hotel id), ordered by display order.
**200** → `data` = array of room types (name, description, bedType, occupancy, basePrice, amenities, images).
**Empty** → `data: []` if the hotel has no active rooms.
> ⏳ Availability count and per-night price for specific dates are Tier 2 (not yet returned).

## GET /hotels/:id/reviews
Approved reviews for a hotel, newest first, paginated.
**Query params:** `page` (default 1), `limit` (default 20).
**200** → `data` = array of approved reviews (current page).
**Empty** → `data: []` if none.
> ⏳ Aggregate summary (average rating, total count) is Tier 2 (not yet returned).

## GET /cities
List active cities, ordered by `displayOrder`.
**200** → `data` = array of active cities. **Empty** → `[]`.

## GET /cities/:slug/hotels
Active hotels in a city (`:slug` = city slug), paginated.
**Query params:** `page` (default 1), `limit` (default 20).
**200** → `data` = array of active hotels in that city.
**404** → `City not found` (no active city with that slug).
**Empty** → `data: []` if the city has no active hotels.

---

## Pagination

All listing endpoints use **offset pagination**: `skip = (page - 1) * limit`, `take = limit`.
Defaults: **page 1, 20 per page** (PRD §5.2.3).

## Error codes (relevant here)

| Code | HTTP | Meaning |
|------|------|---------|
| `NOT_FOUND` | 404 | Hotel/city slug not found |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error |

> Note: detail lookups (`/hotels/:slug`, `/cities/:slug/hotels`) return **404** when the
> item doesn't exist; pure list endpoints return an empty array, never 404.
