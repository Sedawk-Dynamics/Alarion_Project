import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

/**
 * Verify the Bearer access token and attach { id, role } to req.user (§12.1).
 * Rejects with 401 when the token is missing, malformed, or expired.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = header.slice(7);
  try {
    const secret = process.env.JWT_ACCESS_SECRET as string;
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    req.user = { id: payload.sub as string, role: payload.role as string };
    next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
}

/**
 * Allow only the given roles (RBAC, §12.1). Must run after `authenticate`.
 * e.g. router.get('/admin', authenticate, requireRole('super_admin'), handler)
 */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Authentication required', 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
}


