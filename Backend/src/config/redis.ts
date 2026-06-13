import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Shared Redis client used for sessions, OTP storage, refresh-token
 * whitelisting, and rate limiting (architecture.md data layer).
 */
const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');

redis.on('error', (err: Error) => {
  console.error('Redis connection error:', err);
});

export default redis;
