import path from 'path';
import fs from 'fs';
import { IS_DEV, SERVER_PORT } from './config';
import app from './app';
import { DictionaryService } from './services/dictionary';

console.log(`*******************************************`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`IS_DEV: ${IS_DEV}`);
console.log(`*******************************************`);

async function startServer(): Promise<void> {
  // Initialize dictionary BEFORE starting server — fail loudly if missing
  try {
    const dictPath = process.env.WORD_LIST_PATH || path.join(__dirname, '..', 'data', 'words.txt');

    if (!fs.existsSync(dictPath)) {
      throw new Error(
        `Dictionary file not found at ${dictPath}. ` +
          `Set WORD_LIST_PATH environment variable to specify a custom location.`
      );
    }

    await DictionaryService.initialize(dictPath);
  } catch (error) {
    console.error(
      '[ERROR] Fatal: Could not initialize dictionary:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }

  const port = SERVER_PORT;
  const maxRetries = 10;
  let retries = 0;

  function tryListen(attemptPort: number): void {
    const server = app.listen(attemptPort, () => {
      console.log(`[INFO] Server listening on http://localhost:${attemptPort}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE' && retries < maxRetries) {
        console.warn(
          `[WARN] Port ${attemptPort} is already in use, trying port ${attemptPort + 1}`
        );
        retries++;
        tryListen(attemptPort + 1);
      } else if (error.code === 'EADDRINUSE') {
        console.error(
          `[ERROR] Port ${attemptPort} is already in use (tried ${maxRetries} alternatives)`
        );
        process.exit(1);
      } else if (error.code === 'EACCES') {
        console.error(`[ERROR] Permission denied to bind to port ${attemptPort}`);
        process.exit(1);
      } else {
        console.error(`[ERROR] Server failed to start:`, error.message);
        process.exit(1);
      }
    });

    // Graceful shutdown handlers (important when running as PID 1 in Docker)
    const gracefulShutdown = (): void => {
      console.log('[INFO] Shutting down gracefully...');
      server.close(() => {
        console.log('[INFO] Server closed');
        process.exit(0);
      });
      // Force exit after 30 seconds if graceful shutdown hangs
      setTimeout(() => {
        console.error('[ERROR] Forced shutdown after 30s timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  }

  tryListen(port);
}

startServer().catch((error) => {
  console.error('[ERROR] Fatal error during startup:', error);
  process.exit(1);
});
