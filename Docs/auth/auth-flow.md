# Authentication — User Flow (the simple story)

This file explains *what happens* during each auth journey, in plain language.
No deep code knowledge needed. For endpoints see [auth-apis.md](./auth-apis.md);
for internals see [auth-architecture.md](./auth-architecture.md).

## The big picture

```
            ┌──────────────┐
 Sign up →  │  Verify it's │ →  Log in  →  Get 2 tokens  →  Use the app
 / Log in   │  really you  │               (access +          (token proves
            └──────────────┘                refresh)           who you are)
```

Two tokens are issued when you log in:

- **Access token** — short-lived (15 min). Sent with every request to prove who you are.
- **Refresh token** — long-lived (7 days). Used to get a new access token when the old
  one expires, so you don't have to log in again every 15 minutes.

Think of it like a theme park: the **access token** is a ride wristband that expires
quickly; the **refresh token** is your ticket that lets you get a new wristband.

---

## 1. Email + password sign-up

```
You: register (name, email, password)
      │
      ▼
Server: saves account (password is hashed), emails you a verification link
      │
      ▼
You: click the link  →  email marked "verified"
      │
      ▼
You: log in  →  receive access + refresh tokens
```

- You **must verify your email** before you can log in.
- The password is never stored as-is — it's **hashed** (scrambled one-way).

## 2. Phone + OTP login

```
You: enter phone number
      │
      ▼
Server: sends a 6-digit code by SMS (valid 5 minutes)
      │
      ▼
You: enter the code  →  verified  →  receive tokens
```

- The code expires in 5 minutes and can only be used once.

## 3. Google login

```
You: click "Sign in with Google"  →  Google gives the app a token
      │
      ▼
App sends that token to the server
      │
      ▼
Server: checks it with Google, finds/creates your account, returns tokens
```

- No password needed; Google vouches for you.

## 4. Forgot / reset password

```
You: "I forgot my password" (enter email)
      │
      ▼
Server: if the email exists, emails a reset link (valid 1 hour)
      │
      ▼
You: open link, set a new password
      │
      ▼
Server: saves it AND logs you out everywhere (all old sessions end)
```

- For privacy, the server gives the **same response whether or not the email exists**
  (so no one can fish for which emails are registered).
- Changing the password **ends all existing sessions** — anyone using an old token is
  kicked out.

## 5. Hotel-admin login (extra security — MFA)

Hotel admins manage real properties and bookings, so they get an **extra step**:

```
Hotel admin: log in (email + password)
      │
      ▼
Server: password correct → sends a 6-digit code by SMS (does NOT log in yet)
      │
      ▼
Hotel admin: enter the code  →  now logged in (tokens issued)
```

- This is **MFA (multi-factor authentication)** — something you know (password) +
  something you have (your phone).
- Regular guests log in in **one step**; only hotel admins get the OTP step.

## 6. Staying logged in (refresh)

```
Access token expires (after 15 min)
      │
      ▼
App quietly sends the refresh token  →  server returns a fresh pair
      │
      ▼
The old refresh token is thrown away (rotation) — a stolen old one is useless
```

## 7. Safety nets you don't see

| Protection | What it does |
|------------|--------------|
| **Account lockout** | After 5 wrong password tries, login is blocked for 15 minutes |
| **Rate limiting** | Too many requests too fast are slowed down |
| **Disabled accounts** | Banned/inactive users can't log in |
| **Verification** | You must verify email before using a password login |

---

**Next:** see [auth-apis.md](./auth-apis.md) for the exact requests and responses.
