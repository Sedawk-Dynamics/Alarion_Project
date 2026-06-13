import { z } from 'zod';

/**
 * Zod request schemas for the auth endpoints (PRD §10.1 — request validation).
 * Each maps to the body a controller reads.
 */

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('A valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export const sendOtpSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, 'A valid phone number is required'),
});

export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, 'A valid phone number is required'),
  otp: z.string().regex(/^[0-9]{6}$/, 'OTP must be 6 digits'),
});

export const loginVerifyOtpSchema = z.object({
  userId: z.uuid('A valid user id is required'),
  otp: z.string().regex(/^[0-9]{6}$/, 'OTP must be 6 digits'),
});

export const googleSchema = z.object({
  idToken: z.string().min(1, 'Google ID token is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.email('A valid email is required'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
