import express from 'express';
import { apiRouter } from './routes/api-router';
import { CORS_ORIGIN } from './config';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

try {
  app.use(apiRouter());
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  throw new Error(`Failed to initialize API router: ${message}`, { cause: error });
}

export default app;
