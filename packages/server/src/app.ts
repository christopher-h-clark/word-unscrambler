import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { CORS_ORIGIN } from './config';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// 1. CORS (origin must be set via CORS_ORIGIN env var; defaults to http://localhost:5173 in dev)
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
  })
);

// 2. Body parsing (with size limits to prevent large payload attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// 3. Health check
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok' });
});

// 4. API routes
app.use(routes);

// 5. Static assets (production only)
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  // Frontend served via express.static; SPA routing handled by index.html served from static
}

// 6. 404 handler for undefined routes (JSON response, non-production)
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not found' });
});

// 7. Error handler (must be last)
app.use(errorHandler);

export default app;
