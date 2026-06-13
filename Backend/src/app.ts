import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// Trust the first proxy hop so req.ip reflects the real client (for rate limiting).
app.set('trust proxy', 1);

// ---- CORS: restrict to an allowlist (§12.4) ----
const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl, server-to-server) that send no Origin.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

// ---- global middleware ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- health check ----
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// ---- API routes (versioned per architecture.md) ----
app.use('/api/v1', apiLimiter, routes);

// ---- 404 + error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

// ---- start server ----
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
