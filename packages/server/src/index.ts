import { IS_DEV, SERVER_PORT } from './config';
import app from './app';

console.log(`*******************************************`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`IS_DEV: ${IS_DEV}`);
console.log(`*******************************************`);

const server = app.listen(SERVER_PORT, () => {
  console.log(`[INFO] Server listening on http://localhost:${SERVER_PORT}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`[ERROR] Port ${SERVER_PORT} is already in use`);
  } else if (error.code === 'EACCES') {
    console.error(`[ERROR] Permission denied to bind to port ${SERVER_PORT}`);
  } else {
    console.error(`[ERROR] Server failed to start:`, error.message);
  }
  process.exit(1);
});
