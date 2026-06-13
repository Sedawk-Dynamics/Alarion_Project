import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';

// POST /api/v1/auth/register
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const data = await authService.register({ name, email, password });
    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/verify-email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const data = await authService.verifyEmail(token);
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/login
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, password } = req.body; // identifier = email or phone
    const data = await authService.login({ identifier, password });
    // Hotel admins must complete an SMS OTP step before receiving tokens.
    const message = 'mfaRequired' in data
      ? 'OTP sent for verification.'
      : 'Login successful.';
    return res.status(200).json({ success: true, message, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/login/verify-otp  (hotel-admin MFA step 2)
export const loginVerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, otp } = req.body;
    const data = await authService.verifyLoginOtp({ userId, otp });
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data, // { user, accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/otp/send
export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;
    const data = await authService.sendOtp(phone);
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/otp/verify
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp } = req.body;
    const data = await authService.verifyOtp({ phone, otp });
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      data, // { user, accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/google  (frontend sends a Google ID token)
export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;
    const data = await authService.googleLogin(idToken);
    return res.status(200).json({
      success: true,
      message: 'Google authentication successful.',
      data, // { user, accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/refresh
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refreshToken(refreshToken);
    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
      data, // { accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    return res.status(200).json({
      success: true,
      message: 'If the email exists, a reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/reset-password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword({ token, password });
    return res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/auth/me  (protected — requires a valid access token)
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.getMe(req.user!.id);
    return res.status(200).json({ success: true, message: 'Current user.', data });
  } catch (err) {
    next(err);
  }
};
