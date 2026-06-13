# Hotel Search — Architecture & Internals

How the hotel-search code is structured. For the simple story see
[hotels-flow.md](./hotels-flow.md); for endpoints see [hotels-apis.md](./hotels-apis.md).

> Plain-English summary: same layered shape as auth — route → controller → service.
> The service queries PostgreSQL (Prisma) for active hotels/cities/rooms/reviews.
> These endpoints are public and read-only (no auth, no Redis).

## Layered design

```
HTTP request
   │
   ▼
routes/hotelSearchRoute.ts  ──► maps URL → controller (no auth middleware — public)
   │
   ▼
controllers/hotelSearchController.ts ──► thin: read req (params/query), call service, send JSON
   │
   ▼
services/hotelSearchService.ts ──► all query logic (Prisma)
   │
   └─► config/prisma.ts → PostgreSQL (Hotel, City, RoomType, Review)
```

## File map

| File | Responsibility |
|------|----------------|
| [routes/hotelSearchRoute.ts](../../Backend/src/routes/hotelSearchRoute.ts) | 6 public GET routes |
| [controllers/hotelSearchController.ts](../../Backend/src/controllers/hotelSearchController.ts) | Request/response glue (thin) |
| [services/hotelSearchService.ts](../../Backend/src/services/hotelSearchService.ts) | All search/detail/list query logic |
| [config/prisma.ts](../../Backend/src/config/prisma.ts) | Shared Prisma client |
| [utils/AppError.ts](../../Backend/src/utils/AppError.ts) | Error class (404 for missing items) |

Mounted in [routes/index.ts](../../Backend/src/routes/index.ts) at `/api/v1` (alongside `/auth`).

## Service functions

| Function | Route | What it does |
|----------|-------|--------------|
| `searchHotels(query)` | `/hotels/search` | active hotels in a city + incremental filters + sort + pagination |
| `hotelBySlug(slug)` | `/hotels/:slug` | one active hotel by slug; **404** if none |
| `roomTypes(id)` | `/hotels/:id/rooms` | active room types of a hotel, ordered |
| `reviews(id, page?, limit?)` | `/hotels/:id/reviews` | approved reviews, newest first, paginated |
| `citiesActive()` | `/cities` | active cities ordered by displayOrder |
| `hotelCity(slug, page, limit)` | `/cities/:slug/hotels` | resolve city → **404** if missing → its active hotels, paginated |

## How `searchHotels` builds its query (the key pattern)

The filter is built **incrementally** — a condition is added only when its query param
is present, so unused filters don't constrain the results:

```
where = { cityId: <resolved city id>, status: 'active' }
  + starRating   → where.starRating = { gte: N }
  + propertyType → where.propertyType = value
  + minRating    → where.avgRating = { gte: N }
  + amenities    → where.AND = [ { amenities: { some: { amenityId } } }, ... ]  // must have ALL
sort:
  rating     → orderBy avgRating desc
  popularity → orderBy totalReviews desc
  default    → [ isFeatured desc, avgRating desc ]
pagination: skip = (page-1)*limit, take = limit
```

## Pagination

Offset-based on every listing: `skip = (page - 1) * limit`, `take = limit`.
`page`/`limit` arrive as **strings** from the query and are converted with defaults
(`Number(page) || 1`, `Number(limit) || 20`).

## Data model touched (relevant fields)

**Hotel** (`hotels`)
```
id, name, slug (unique), cityId → City, status (active|inactive|pending|suspended),
starRating, propertyType, avgRating, totalReviews, isFeatured, mainImageUrl,
description, shortDescription, address..., latitude, longitude
relations: city, images, amenities (HotelAmenity[]), roomTypes, reviews
```

**City** (`cities`): `id, name, slug (unique), isActive, displayOrder`
**RoomType** (`room_types`): `id, hotelId, name, bedType, maxOccupancy, basePrice, amenities (JSON), images (JSON), status, displayOrder`
**Review** (`reviews`): `id, hotelId, userId, overallRating, comment, photos (JSON), status (pending|approved|rejected|flagged), createdAt`
**HotelAmenity** (`hotel_amenities`): join table `hotelId ↔ amenityId`

## Conventions (match the auth module)

- Controllers are **thin**; all logic in the service.
- Response envelope: `{ success, message, data }`; errors via `AppError` → central handler.
- **Public** routes — no `authenticate`/`requireRole`.
- **Detail lookups** throw `AppError(..., 404)` when missing; **list endpoints** return `[]`.
- Only `active` hotels / `isActive` cities / `approved` reviews are exposed.

## Known limitations

These are the **Tier 2** pieces, not yet implemented (each needs a join beyond the Hotel table):

- **Date availability** — filtering hotels/rooms by free rooms for `checkIn`–`checkOut`
  needs `RoomInventory` (`available = totalRooms − bookedRooms − blockedRooms`, min across nights).
- **Pricing for a stay** — per-night/total price needs `RoomRate.finalRate`.
- **Price-range filter & price sorting** — depend on the pricing above.
- **Guests/occupancy filter** and **distance** sorting.
- **Reviews aggregate summary** — average rating + total count (needs `aggregate` + `count`);
  currently only the page of reviews is returned.
- **Search input validation** — no Zod query schema yet; an invalid `propertyType`/`sort`
  would reach Prisma at runtime. (Intentionally skipped for now.)
- `searchHotels` builds its `where`/`orderBy` as `any` (dynamic filter object); could be
  typed with `Prisma.HotelWhereInput` later.
