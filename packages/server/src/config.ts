import dotenv from 'dotenv';
import path from 'path';

const IS_DEV = process.env.NODE_ENV !== 'production';

if (IS_DEV) {
  try {
    dotenv.config({ path: path.join(process.cwd(), 'packages', 'server', '.env.local') });
    dotenv.config({ path: path.join(process.cwd(), '.env.local') });
  } catch (error) {
    console.warn(
      '[WARN] Failed to load .env files:',
      error instanceof Error ? error.message : String(error)
    );
  }
}

const SERVER_PORT = parseInt(process.env.PORT || '3000', 10);

const DEFAULT_CORS_ORIGIN = 'http://localhost:5173';
const CORS_ORIGIN = process.env.CORS_ORIGIN?.trim() || DEFAULT_CORS_ORIGIN;

const IS_PROD = !IS_DEV;
if (IS_PROD && process.env.CORS_ORIGIN?.trim() === undefined) {
  console.warn(
    '[WARN] CORS_ORIGIN not set; using default (localhost:5173). Set CORS_ORIGIN env var for production.'
  );
}

export { CORS_ORIGIN, IS_DEV, IS_PROD, SERVER_PORT };
