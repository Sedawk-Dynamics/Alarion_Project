import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../config/redis.js';

/**
 * Global API rate limiter (PRD §10.1, §12.4).
 * 100 requests/min for authenticated requests, 30/min for unauthenticated,
 * keyed per user (when known) or per IP. Backed by Redis so the limit is
 * shared across all API instances.
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: (req) => (req.headers.authorization ? 100 : 30),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    return userId ? `user:${userId}` : ipKeyGenerator(req.ip ?? '');
  },
  store: new RedisStore({
    // ioredis exposes `call`; cast keeps the store's loose typing happy.
    sendCommand: (...args: string[]) => (redis as any).call(...args),
    prefix: 'rl:api:',
  }),
  handler: (_req, res) =>
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please slow down.',
      },
    }),
});
