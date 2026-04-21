import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getPort = (): number => {
  const portEnv = process.env.VITE_PORT;
  if (!portEnv) return 5173;
  const port = parseInt(portEnv, 10);
  if (isNaN(port)) {
    const msg = `Invalid VITE_PORT="${portEnv}", using default 5173`;
    if (process.env.CI !== 'true') console.warn(`⚠️ ${msg}`);
    return 5173;
  }
  return port;
};

// Note: Uses REACT_APP_* prefix (Create React App convention) rather than VITE_*
// to match frontend/.env.example for consistency across the monorepo
const getApiUrl = (): string => {
  const url = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  try {
    new URL(url);
    return url;
  } catch {
    const msg = `Invalid REACT_APP_API_URL="${url}", using default http://localhost:3000`;
    if (process.env.CI !== 'true') console.warn(`⚠️ ${msg}`);
    return 'http://localhost:3000';
  }
};

export default defineConfig({
  plugins: [react({ babel: { plugins: ['babel-plugin-react-compiler'] } })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: getPort(),
    strictPort: false,
    proxy: {
      '/unscrambler': getApiUrl(),
    },
  },
  build: {
    outDir: 'dist',
    manifest: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
