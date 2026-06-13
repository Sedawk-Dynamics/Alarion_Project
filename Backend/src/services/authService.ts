import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../config/prisma.js';
import redis from '../config/redis.js';
import { AppError } from '../utils/AppError.js';
import { sendEmail, sendSms } from '../utils/notifications.js';
import dotenv from 'dotenv';
dotenv.config();

// ---- config (from env) ----
const SALT_ROUNDS = 12;
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const ACCESS_TTL = process.env.JWT_ACCESS_TTL ?? '15m';
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const OTP_TTL_SECONDS = 5 * 60; // 5 min
const EMAIL_TOKEN_TTL_SECONDS = 60 * 60 * 24; // 24h
const RESET_TOKEN_TTL_SECONDS = 60 * 60; // 1h
const MAX_LOGIN_ATTEMPTS = 5; // lock after 5 failed logins (§12.1)
const LOGIN_LOCK_SECONDS = 15 * 60; // 15 min cooldown
const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';

// Only the client ID is needed to verify Google ID tokens (token-based flow).
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---- internal helpers ----
/** Remove sensitive fields before returning a user to the client. */
function sanitize(user: any) {
  const { passwordHash, ...safe } = user;
  return safe;
}

/**
 * Issue access + refresh JWTs. The refresh token's jti is whitelisted in
 * Redis so it can be rotated/revoked (session management).
 */
async function issueTokens(user: { id: string; role: string }) {
  const jti = crypto.randomUUID();
  const accessToken = jwt.sign({ sub: user.id, role: user.role }, ACCESS_SECRET, {
    expiresIn: ACCESS_TTL,
  } as jwt.SignOptions);
  const refreshToken = jwt.sign({ sub: user.id, jti }, REFRESH_SECRET, {
    expiresIn: REFRESH_TTL_SECONDS,
  } as jwt.SignOptions);

  // Redis = fast-path whitelist; user_sessions (Postgres) = durable source of truth.
  await redis.set(`refresh:${user.id}:${jti}`, '1', 'EX', REFRESH_TTL_SECONDS);
  await prisma.userSession.create({
    data: {
      userId: user.id,
      refreshToken: jti,
      expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000),
    },
  });

  return { accessToken, refreshToken };
}

// ---- service methods ----

// register
export async function register(input: { name: string; email: string; password: string }) {
  const { name, email, password } = input;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, emailVerified: false },
  });

  const token = crypto.randomBytes(32).toString('hex');
  await redis.set(`verify:email:${token}`, user.id, 'EX', EMAIL_TOKEN_TTL_SECONDS);

  await sendEmail({
    to: email,
    subject: 'Verify your email',
    html: `<p>Welcome! Verify your email: <a href="${APP_URL}/verify-email?token=${token}">Verify</a></p>`,
  });

  return sanitize(user);
}



// verifyEmail
export async function verifyEmail(token: string) {
  if (!token) throw new AppError('Verification token is required', 400);

  const userId = await redis.get(`verify:email:${token}`);
  if (!userId) throw new AppError('Invalid or expired verification token', 400);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });
  await redis.del(`verify:email:${token}`);
  return sanitize(user);
}


/** Record a failed login attempt in Redis; sets the 15-min window on the first miss. */
async function registerLoginFailure(failKey: string) {
  const count = await redis.incr(failKey);
  if (count === 5) await redis.expire(failKey, LOGIN_LOCK_SECONDS);
}



// login
export async function login(input: { identifier: string; password: string }) {
  const { identifier, password } = input;
  const failKey = `login:fail:${identifier}`;

  // Brute-force lockout: block once too many recent failures (§12.1).
  const attempts = Number(await redis.get(failKey)) || 0;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    throw new AppError(
      'Account locked due to too many failed attempts. Try again later.',
      429,
    );
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
  });
  if (!user || !user.passwordHash) {
    await registerLoginFailure(failKey);
    throw new AppError('Invalid credentials', 401);
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    await registerLoginFailure(failKey);
    throw new AppError('Invalid credentials', 401);
  }

  if (user.status !== 'active') throw new AppError('Account is disabled', 403);

  if (!user.emailVerified) throw new AppError('Please verify your email first', 403);

  // Password is correct — clear the failed-attempt counter.
  await redis.del(failKey);

  // MFA for hotel admins (§12.1): defer tokens until an SMS OTP is verified.
  if (user.role === 'hotel_admin') {
    if (!user.phone) throw new AppError('No phone number on file for MFA', 400);
    const otp = String(crypto.randomInt(100000, 1000000));
    const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);
    await redis.set(`mfa:login:${user.id}`, otpHash, 'EX', OTP_TTL_SECONDS);
    await sendSms(user.phone, `Your login code is ${otp}. It expires in 5 minutes.`);
    return { mfaRequired: true, userId: user.id };
  }

  const loggedIn = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = await issueTokens(loggedIn);
  return { user: sanitize(loggedIn), ...tokens };
}


/**
 * Step 2 of hotel-admin login: verify the SMS OTP and issue tokens (§12.1).
 */
export async function verifyLoginOtp(input: { userId: string; otp: string }) {
  const { userId, otp } = input;

  const stored = await redis.get(`mfa:login:${userId}`);
  if (!stored) throw new AppError('OTP expired or not found', 400);

  const ok = await bcrypt.compare(otp, stored);
  if (!ok) throw new AppError('Invalid OTP', 400);
  await redis.del(`mfa:login:${userId}`);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  if (user.status !== 'active') throw new AppError('Account is disabled', 403);

  const loggedIn = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = await issueTokens(loggedIn);
  return { user: sanitize(loggedIn), ...tokens };
}

// sendOtp


export async function sendOtp(phone: string) {
  if (!phone) throw new AppError('Phone number is required', 400);

  const otp = String(crypto.randomInt(100000, 1000000)); // 6 digits
  const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);
  await redis.set(`otp:${phone}`, otpHash, 'EX', OTP_TTL_SECONDS);

  await sendSms(phone, `Your verification code is ${otp}. It expires in 5 minutes.`);

  return { sent: true };
}



// verifyOtp
export async function verifyOtp(input: { phone: string; otp: string }) {
  const { phone, otp } = input;

  const stored = await redis.get(`otp:${phone}`);
  if (!stored) throw new AppError('OTP expired or not found', 400);

  const ok = await bcrypt.compare(otp, stored);
  if (!ok) throw new AppError('Invalid OTP', 400);
  await redis.del(`otp:${phone}`);

  // Sign up on first verification, otherwise log in.
  // `name` is required by the schema; use a placeholder the user can edit later.
  const user = await prisma.user.upsert({
    where: { phone },
    update: { phoneVerified: true },
    create: { phone, phoneVerified: true, name: 'User' },
  });

  if (user.status !== 'active') throw new AppError('Account is disabled', 403);

  const loggedIn = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = await issueTokens(loggedIn);
  return { user: sanitize(loggedIn), ...tokens };
}




// googleLogin — frontend obtains a Google ID token and POSTs it here (PRD §10.2)
export async function googleLogin(idToken: string) {
  if (!idToken) throw new AppError('Google ID token is required', 400);

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) throw new AppError('Google account has no email', 400);

  const user = await prisma.user.upsert({
    where: { email: payload.email },
    update: { googleId: payload.sub },
    create: {
      email: payload.email,
      name: payload.name ?? payload.email,
      googleId: payload.sub,
      avatarUrl: payload.picture,
      emailVerified: true,
    },
  });

  if (user.status !== 'active') throw new AppError('Account is disabled', 403);

  const loggedIn = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const issued = await issueTokens(loggedIn);
  return { user: sanitize(loggedIn), ...issued };
}



// refreshToken (with rotation)
export async function refreshToken(token: string) {
  if (!token) throw new AppError('Refresh token is required', 401);

  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const jti = payload.jti as string;
  const key = `refresh:${payload.sub}:${jti}`;

  // Source of truth is the user_sessions row; Redis is the fast check.
  const session = await prisma.userSession.findUnique({ where: { refreshToken: jti } });
  const exists = await redis.get(key);
  if (!session || !exists) throw new AppError('Refresh token has been revoked', 401);

  const user = await prisma.user.findUnique({ where: { id: payload.sub as string } });
  if (!user) throw new AppError('User not found', 404);

  // Rotate: invalidate the used token in both stores, issue a fresh pair.
  await redis.del(key);
  await prisma.userSession.delete({ where: { refreshToken: jti } });
  return issueTokens(user);
}



// forgotPassword (no email enumeration)
export async function forgotPassword(email: string) {
  if (!email) throw new AppError('Email is required', 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    await redis.set(`reset:password:${token}`, user.id, 'EX', RESET_TOKEN_TTL_SECONDS);
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `<p>Reset your password: <a href="${APP_URL}/reset-password?token=${token}">Reset</a></p>`,
    });
  }
  // Always resolve the same way regardless of whether the email exists.
}



/**
 * Revoke every active refresh token for a user by deleting all
 * `refresh:<userId>:*` keys (SCAN avoids blocking Redis on large keyspaces).
 */
async function revokeUserSessions(userId: string) {
  const pattern = `refresh:${userId}:*`;
  let cursor = '0';
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = next;
    if (keys.length) await redis.del(...keys);
  } while (cursor !== '0');

  // Clear the durable session rows too (source of truth).
  await prisma.userSession.deleteMany({ where: { userId } });
}



// resetPassword
export async function resetPassword(input: { token: string; password: string }) {
  const { token, password } = input;
  if (!token) throw new AppError('Reset token is required', 400);

  const userId = await redis.get(`reset:password:${token}`);
  if (!userId) throw new AppError('Invalid or expired reset token', 400);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  await redis.del(`reset:password:${token}`);

  // Session invalidation on password change (§12.1): kill all refresh tokens.
  await revokeUserSessions(userId);
}



// getMe — current authenticated user's profile
export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  return sanitize(user);
}





