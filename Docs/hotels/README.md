# Hotel Search & Discovery — Overview

This is the entry point for the public **hotel & city search** part of the Alarion
backend. These endpoints let a guest browse cities, search hotels, view a hotel's
details, its rooms, and its reviews — all **without logging in**.

> **In one line:** public, read-only endpoints that answer "what cities/hotels exist,
> what does this hotel offer, and what do guests say" — filtered to only active hotels
> and approved reviews, and paginated (20/page).

## The routes (all public `GET`, under `/api/v1`)

| Method | Route | What it does |
|--------|-------|--------------|
| GET | `/hotels/search` | Search active hotels in a city + filters (star, property type, review score, amenities) + sort, paginated |
| GET | `/hotels/:slug` | Full detail for one active hotel (404 if not found) |
| GET | `/hotels/:id/rooms` | Active room types of a hotel |
| GET | `/hotels/:id/reviews` | Approved reviews for a hotel, newest first (paginated) |
| GET | `/cities` | List active cities |
| GET | `/cities/:slug/hotels` | Active hotels in a city (404 if city not found, paginated) |

Code: [routes](../../Backend/src/routes/hotelSearchRoute.ts) →
[controller](../../Backend/src/controllers/hotelSearchController.ts) →
[service](../../Backend/src/services/hotelSearchService.ts).

## Feature status (current build)

- ✅ Search hotels by **city**
- ✅ Filters: **star rating**, **property type**, **review score**, **amenities** (must have all)
- ✅ **Sorting**: rating / popularity (default: featured first, then rating)
- ✅ Hotel **detail** by slug
- ✅ Hotel **room list**
- ✅ Hotel **reviews** (approved only, paginated)
- ✅ **Cities** list + **hotels in a city**
- ✅ **Pagination** (20/page) on all listings
- ⏳ **Tier 2 (not built yet):** date availability, guests/occupancy, price-range filter,
  price sorting, distance, review aggregate summary, query validation

## Which doc do I read?

| I want to… | Read |
|------------|------|
| Understand the journeys in plain language | [hotels-flow.md](./hotels-flow.md) |
| Call the endpoints (params/response/errors) | [hotels-apis.md](./hotels-apis.md) |
| Understand the code structure & internals | [hotels-architecture.md](./hotels-architecture.md) |

## Key rules (apply across all routes)

- **Public** — no authentication required (guests browse before signing in).
- **Active only** — only `status: 'active'` hotels and `isActive: true` cities are returned.
- **Approved only** — only `status: 'approved'` reviews are shown publicly.
- **Detail vs list:** a missing single item (hotel by slug, city by slug) returns **404**;
  an empty **list** returns `[]` with `200` (never 404).
- **Pagination:** `?page` & `?limit` query params, defaults page 1 / 20 per page.

## Known limitations (Tier 2 — pending)

Availability and pricing for specific dates are **not yet** computed. Search and the
rooms endpoint currently return hotels/rooms and their static info, but **not** real-time
availability or the price for a chosen stay. See
[hotels-architecture.md → Known limitations](./hotels-architecture.md#known-limitations).
