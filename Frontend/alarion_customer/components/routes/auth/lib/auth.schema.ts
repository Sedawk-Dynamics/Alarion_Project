import { z } from 'zod';

const email = z.email('Enter a valid email');

// --- Sign in ---
export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

// --- Sign up --- (matches POST /auth/register exactly)
export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name'),
  email,
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>; // { email: string; password: string }
export type SignupInput = z.infer<typeof signupSchema>; // { name; email; password }
