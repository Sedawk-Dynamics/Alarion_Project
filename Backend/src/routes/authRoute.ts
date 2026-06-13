import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  loginVerifyOtpSchema,
  sendOtpSchema,
  verifyOtpSchema,
  googleSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

const route = Router();

// Email + password signup (sends verification email)
route.post('/register', validate(registerSchema), authController.registerUser);
// Confirm email via token from the verification link
route.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);

// Email/phone login -> returns tokens, or { mfaRequired } for hotel admins
route.post('/login', validate(loginSchema), authController.loginUser);
// Hotel-admin MFA step 2: verify SMS OTP -> returns tokens
route.post('/login/verify-otp', validate(loginVerifyOtpSchema), authController.loginVerifyOtp);

// Phone OTP
route.post('/otp/send', validate(sendOtpSchema), authController.sendOtp);
route.post('/otp/verify', validate(verifyOtpSchema), authController.verifyOtp);

// Google OAuth 2.0 (token-based: frontend sends a Google ID token)
route.post('/google', validate(googleSchema), authController.googleAuth);

// Exchange refresh token for a new access token
route.post('/refresh', validate(refreshSchema), authController.refreshToken);

// Password recovery
route.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
route.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// Current authenticated user (protected)
route.get('/me', authenticate, authController.getMe);

export default route;
