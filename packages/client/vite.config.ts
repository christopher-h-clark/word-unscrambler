import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getPort = (): number => {
  const portEnv = process.env.VITE_PORT;
  if (!portEnv) return 5173;
  const port = parseInt(portEnv, 10);
  if (isNaN(port)) {
    console.warn(`⚠️ Invalid VITE_PORT="${portEnv}", using default 5173`);
    return 5173;
  }
  return port;
};

const getApiUrl = (): string => {
  const url = process.env.VITE_API_URL || 'http://localhost:3000';
  try {
    new URL(url);
    return url;
  } catch {
    console.warn(`⚠️ Invalid VITE_API_URL="${url}", using default http://localhost:3000`);
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
      '/api': getApiUrl(),
    },
  },
  build: {
    outDir: 'dist',
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
