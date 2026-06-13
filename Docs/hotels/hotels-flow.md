# Hotel Search — User Flow (the simple story)

What happens when a guest browses and searches, in plain language. For endpoints
see [hotels-apis.md](./hotels-apis.md); for internals see
[hotels-architecture.md](./hotels-architecture.md).

> These are all **public** — a guest can browse everything **without logging in**.
> Booking is the only part that needs an account (separate module).

## The big picture

```
Browse cities  →  Search hotels in a city  →  Open a hotel  →  See its rooms + reviews
```

## 1. Browse cities

```
Guest opens the homepage
      │
      ▼
App asks for the list of cities  (GET /cities)
      │
      ▼
Shows city cards (Jaipur, Goa, …) — only "active" cities appear
```

## 2. Search hotels

```
Guest picks a city + (optionally) filters: stars, property type, rating, amenities
      │
      ▼
App searches  (GET /hotels/search?city=jaipur&starRating=4&...)
      │
      ▼
Server returns the matching ACTIVE hotels for that city, 20 per page,
sorted (featured first by default, or by rating / popularity)
```

What the guest can narrow by **today**:
- ⭐ **Star rating** (e.g. 4★ and up)
- 🏨 **Property type** (hotel / resort / boutique / service apartment)
- 👍 **Guest review score** (e.g. 4.0+)
- 🛎️ **Amenities** (must have all the ones they tick)
- ↕️ **Sort** by rating or popularity

> Not yet available: searching by **dates/availability** and **price** — that's the
> "Tier 2" work still to come (see Known limitations).

## 3. Open a hotel (detail page)

```
Guest clicks a hotel card
      │
      ▼
App asks for that hotel  (GET /hotels/:slug)
      │
      ▼
Shows the full hotel: name, stars, address, description, images, policies
```
If the slug doesn't match an active hotel → the app shows a "not found" (404).

## 4. See the rooms

```
On the hotel page
      │
      ▼
App asks for the rooms  (GET /hotels/:id/rooms)
      │
      ▼
Shows each room type: name, beds, occupancy, amenities, base price, images
```
> Per-night price for *specific dates* and "how many rooms are free" come later (Tier 2).

## 5. Read the reviews

```
Guest scrolls to "Guest Reviews"
      │
      ▼
App asks for reviews  (GET /hotels/:id/reviews?page=1)
      │
      ▼
Shows approved reviews, newest first, 20 per page
```
Only **approved** reviews are shown — pending/flagged ones stay hidden.

## 6. "Hotels in a city" page

```
Guest clicks a city card ("All hotels in Goa")
      │
      ▼
App asks  (GET /cities/:slug/hotels?page=1)
      │
      ▼
Shows active hotels in that city, 20 per page
```
If the city slug doesn't exist → "city not found" (404).

## The simple rules behind all of it

| Rule | Meaning |
|------|---------|
| Public | no login needed to browse |
| Active only | hidden/inactive hotels & cities never show |
| Approved only | only moderated reviews are public |
| Paginated | long lists come 20 at a time |
| Missing item → 404 | a single hotel/city that doesn't exist errors |
| Empty list → `[]` | "no results" is normal, not an error |
