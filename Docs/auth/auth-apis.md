# Authentication — API Reference

Technical reference for every auth endpoint: request body, responses, validation,
and errors. All routes are prefixed with **`/api/v1/auth`**.

> Plain-English summary: every endpoint takes JSON and returns JSON in a fixed
> shape. Most are public; `/me` needs a token. Bad input is rejected before it
> reaches the logic.

## Response envelope

**Success**
```json
{ "success": true, "message": "Human-readable message", "data": { } }
```

**Error** (PRD §10.1 format)
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "...", "details": [] } }
```
`details` appears only for validation errors.

## Endpoint summary

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/register` | – | Email + password signup |
| POST | `/verify-email` | – | Confirm email via token |
| POST | `/login` | – | Email/phone login (may require MFA) |
| POST | `/login/verify-otp` | – | Hotel-admin MFA step 2 |
| POST | `/otp/send` | – | Send phone OTP |
| POST | `/otp/verify` | – | Verify phone OTP |
| POST | `/google` | – | Google login (ID token) |
| POST | `/refresh` | – | Exchange refresh token for new pair |
| POST | `/forgot-password` | – | Request password reset email |
| POST | `/reset-password` | – | Set new password via token |
| GET  | `/me` | ✅ Bearer | Current authenticated user |

---

## POST /register
**Body**
```json
{ "name": "Mayank", "email": "a@b.com", "password": "secret12" }
```
**Validation:** `name` ≥ 1 char · `email` valid · `password` ≥ 8 chars
**201**
```json
{ "success": true, "message": "Registration successful. Please verify your email.",
  "data": { "id": "...", "email": "a@b.com", "role": "guest", "emailVerified": false } }
```
**Errors:** `409 CONFLICT` (email already registered), `422 VALIDATION_ERROR`

## POST /verify-email
**Body** `{ "token": "<from email link>" }`
**200** → `data` = the verified user. **Errors:** `400 BAD_REQUEST` (invalid/expired token)

## POST /login
**Body** `{ "identifier": "a@b.com", "password": "secret12" }` (`identifier` = email or phone)

**200 — normal user**
```json
{ "success": true, "message": "Login successful.",
  "data": { "user": { }, "accessToken": "...", "refreshToken": "..." } }
```
**200 — hotel admin (MFA required)**
```json
{ "success": true, "message": "OTP sent for verification.",
  "data": { "mfaRequired": true, "userId": "..." } }
```
**Errors:** `401 UNAUTHORIZED` (bad credentials) · `403 FORBIDDEN` (disabled / email not verified) ·
`429 TOO_MANY_REQUESTS` (locked after 5 fails) · `422 VALIDATION_ERROR`

## POST /login/verify-otp  *(hotel-admin MFA step 2)*
**Body** `{ "userId": "<uuid from /login>", "otp": "123456" }`
**200** → `{ user, accessToken, refreshToken }`
**Errors:** `400` (invalid/expired OTP), `403` (disabled), `404` (user not found)

## POST /otp/send
**Body** `{ "phone": "+919876543210" }` (10–15 digits, optional leading `+`)
**200** → `{ "sent": true }`

## POST /otp/verify
**Body** `{ "phone": "+919876543210", "otp": "123456" }`
**200** → `{ user, accessToken, refreshToken }`
**Errors:** `400` (expired / invalid OTP)

## POST /google
**Body** `{ "idToken": "<Google ID token from frontend>" }`
**200** → `{ user, accessToken, refreshToken }`
**Errors:** `400` (no/invalid token)

## POST /refresh
**Body** `{ "refreshToken": "..." }`
**200** → `{ "accessToken": "...", "refreshToken": "..." }` (a **new** pair; old one is revoked)
**Errors:** `401` (missing / invalid / revoked refresh token)

## POST /forgot-password
**Body** `{ "email": "a@b.com" }`
**200** → `{ "success": true, "message": "If the email exists, a reset link has been sent." }`
*(Always the same response — no email enumeration.)*

## POST /reset-password
**Body** `{ "token": "<from email>", "password": "newsecret12" }`
**200** → success. **Side effect:** all of that user's sessions are revoked.
**Errors:** `400` (invalid/expired token), `422`

## GET /me  *(protected)*
**Header** `Authorization: Bearer <accessToken>`
**200** → `data` = current user (no password hash)
**Errors:** `401` (missing/invalid/expired token)

---

## Error codes

| Code | HTTP | Meaning |
|------|------|---------|
| `VALIDATION_ERROR` | 422 | Body failed validation; see `details[]` |
| `BAD_REQUEST` | 400 | Invalid/expired token or OTP |
| `UNAUTHORIZED` | 401 | Bad credentials / missing / invalid token |
| `FORBIDDEN` | 403 | Account disabled or email unverified |
| `NOT_FOUND` | 404 | User/route not found |
| `CONFLICT` | 409 | Email already registered |
| `TOO_MANY_REQUESTS` | 429 | Rate limit or login lockout hit |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error |

## Rate limits & lockout

- **Global:** 100 requests/min (authenticated) · 30/min (unauthenticated), per user/IP.
- **Login lockout:** 5 failed attempts on an identifier → 15-min block (`429`).

## Validation example (422)
```json
{ "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "Validation failed",
    "details": [
      { "field": "email", "message": "A valid email is required" },
      { "field": "password", "message": "Password must be at least 8 characters" } ] } }
```
