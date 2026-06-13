# Authentication — Overview

This is the entry point for understanding how authentication works in the Alarion
backend. Auth lets a user prove who they are and then stay signed in securely.

> **In one line:** a user signs up / logs in (email, phone OTP, or Google) → the
> server issues two JWT tokens (a short-lived **access** token and a long-lived
> **refresh** token) → those tokens keep the user logged in, with verification,
> MFA, lockout, and rate-limiting protecting the flow.

## The three ways to log in

| Method | How it works |
|--------|--------------|
| **Email + password** | Register → verify email → log in |
| **Phone + OTP** | Enter phone → receive 6-digit SMS code → verify |
| **Google** | Frontend gets a Google ID token → backend verifies it |

## Feature checklist (all implemented)

- ✅ Email + password registration with **email verification**
- ✅ Phone registration / login with **OTP (SMS)**
- ✅ **Google OAuth 2.0** login (token-based)
- ✅ **Forgot / reset password** (email link)
- ✅ **JWT** access (15 min) + refresh (7 days) with **rotation**
- ✅ **RBAC** — roles embedded in the token (`guest`, `hotel_admin`, `super_admin`)
- ✅ **MFA (SMS OTP)** required for hotel-admin logins
- ✅ **Brute-force lockout** (5 failed logins → 15-min cooldown)
- ✅ **Session invalidation** on password change
- ✅ **Rate limiting** (100/min authenticated, 30/min unauthenticated)
- ✅ **CORS** restricted to an allowlist
- ✅ **Request validation** (Zod) + consistent error format
- ✅ **Hybrid sessions** — Redis (fast) + `user_sessions` table (durable)

## Which doc do I read?

| I want to… | Read |
|------------|------|
| Understand the journeys in plain language | [auth-flow.md](./auth-flow.md) |
| Call the endpoints (request/response/errors) | [auth-apis.md](./auth-apis.md) |
| Understand the code structure & internals | [auth-architecture.md](./auth-architecture.md) |

## Known limitation

Phone-only OTP signup currently conflicts with the schema, which marks `email` as
**required**. Until that's resolved (make `email` optional, or require an existing
account for phone OTP), creating a brand-new user via phone OTP alone will fail.
See [auth-architecture.md → Known limitations](./auth-architecture.md#known-limitations).
