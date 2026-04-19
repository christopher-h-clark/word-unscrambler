import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { CORS_ORIGIN } from './config';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// 1. CORS
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
  })
);

// 2. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 3. Health check
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok' });
});

// 4. Static assets (production only)
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req: Request, res: Response): void => {
    try {
      res.sendFile(path.join(clientDist, 'index.html'));
    } catch {
      res.status(404).json({ error: 'Not found' });
    }
  });
}

// 5. 404 handler for undefined routes (JSON response, non-production)
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not found' });
});

// 6. Error handler (must be last)
app.use(errorHandler);

export default app;
