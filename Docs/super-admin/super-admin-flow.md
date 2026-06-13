# Super Admin — User Flow (the simple story)

What the Alarion operations team does with these endpoints, in plain language. For endpoints
see [super-admin-apis.md](./super-admin-apis.md); for internals see
[super-admin-architecture.md](./super-admin-architecture.md).

> Every action here needs an admin who is **logged in** and has the **`super_admin`** role.
> A guest or a hotel admin who calls these gets a **403 Forbidden**.

## The big picture

```
Log in as super admin
      │
      ▼
Onboard hotels  →  Edit hotels  →  Watch the platform (dashboard, bookings, users, revenue)
```

## 1. Onboard a new hotel

```
Admin fills the "Add hotel" form (name, address, city, star rating, contact, …)
      │
      ▼
POST /admin/hotels
      │
      ▼
Server checks the slug is free → creates the hotel → records WHO added it
```
If the slug (the hotel's web-name, e.g. `taj-jaipur`) is already taken → "slug already exists" (409).

## 2. Edit a hotel

```
Admin changes some fields (or flips it active / inactive)
      │
      ▼
PUT /admin/hotels/:id
      │
      ▼
Server finds the hotel → updates ONLY the fields sent → returns the updated hotel
```
If the hotel id doesn't exist → "Hotel not found" (404). Only the fields you send change;
everything else stays the same.

## 3. The dashboard (headline numbers)

```
Admin opens the dashboard
      │
      ▼
GET /admin/analytics/dashboard
      │
      ▼
Shows: bookings today / this week / this month, total revenue,
       how many hotels are active, how many guests registered
```

## 4. Browse all bookings

```
Admin opens "All bookings" and (optionally) filters
      │
      ▼
GET /admin/bookings?hotelId=…&status=…&paymentStatus=…&from=…&to=…
      │
      ▼
Shows bookings across EVERY hotel, newest first, 20 per page
```

## 5. Browse all users

```
Admin searches users by name / email / phone, or filters by role / status
      │
      ▼
GET /admin/users?search=…&role=…&status=…
      │
      ▼
Shows matching users, 20 per page — never the password
```

## 6. Revenue analytics

```
Admin opens "Revenue" and picks a date range + grouping
      │
      ▼
GET /admin/revenue?from=…&to=…&groupBy=hotel|roomType
      │
      ▼
Shows total revenue, total bookings, average booking value,
and a revenue split per hotel (or per room type)
```

## The simple rules behind all of it

| Rule | Meaning |
|------|---------|
| Admin only | must be logged in AND a super admin |
| Platform-wide | sees all hotels, not just one |
| Missing hotel → 404 | editing a hotel that doesn't exist errors |
| Empty list → `[]` | "no results" is normal, not an error |
| Paginated | long lists come 20 at a time |
| No password | user lists never include the password hash |
