import 'express';

/**
 * Adds the authenticated user (set by the `authenticate` middleware)
 * to Express's Request type.
 */
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}
