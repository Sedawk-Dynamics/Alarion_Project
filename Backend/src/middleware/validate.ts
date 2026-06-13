import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/AppError.js';

/**
 * Validate req.body against a Zod schema (PRD §10.1).
 * On failure, forwards a 422 AppError whose `details` lists each bad field,
 * which the central error handler renders as
 *   { success: false, error: { code: 'VALIDATION_ERROR', message, details } }.
 * On success, req.body is replaced with the parsed (typed/cleaned) data.
 */
export const validate =(schema: ZodType) =>(req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return next(new AppError('Validation failed', 422, 'VALIDATION_ERROR', details));
    }
    req.body = result.data;
    next();
  };


  