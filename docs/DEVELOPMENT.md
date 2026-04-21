# Development Guide

## Environment Configuration

This project uses environment variables for configuration in both development
and production. Environment variables are managed per workspace using
`.env.local` files (which are git-ignored for security).

### Initial Setup

1. **Copy environment example files:**

```bash
# Frontend
cp packages/client/.env.example packages/client/.env.local

# Backend
cp packages/server/.env.example packages/server/.env.local
```

2. **Verify the files exist:**

```bash
ls -la packages/client/.env.local packages/server/.env.local
```

### Frontend Environment (packages/client/.env.local)

The frontend uses a single environment variable:

- **`REACT_APP_API_URL`** — Backend API endpoint
  - **Development default**: `http://localhost:3000`
  - **Production**: Points to your API domain (e.g., `https://api.example.com`)
  - **When to change**: If running backend on a different port or host

### Backend Environment (packages/server/.env.local)

The backend uses four environment variables:

- **`NODE_ENV`** — Runtime environment
  - **Development**: `development`
  - **Production**: `production`

- **`PORT`** — Server port
  - **Development**: `3000` (default)
  - **Change if**: Port 3000 is already in use on your machine

- **`WORD_LIST_PATH`** — Path to dictionary file
  - **Development**: `./data/words.txt` (relative to server root)
  - **Production**: `/app/packages/server/data/words.txt` (Docker path)
  - **Change if**: Dictionary file is in a different location

- **`CORS_ORIGIN`** — Frontend origin for CORS
  - **Development**: `http://localhost:5173` (Vite dev server)
  - **Docker**: `http://localhost:3000` (or override at runtime)
  - **Production**: Your frontend domain (e.g., `https://example.com`)

### Running Locally

1. **Start both frontend and backend:**

```bash
npm run dev
```

This starts:

- Frontend dev server on `http://localhost:5173`
- Backend API server on `http://localhost:3000`
- Both with hot-reload enabled

2. **Or start separately:**

```bash
# Frontend only (port 5173)
npm run dev:client

# Backend only (port 3000)
npm run dev:server
```

3. **Verify both are running:**

```bash
# Test frontend
curl http://localhost:5173/

# Test backend health check
curl http://localhost:3000/api/health

# Test API endpoint
curl 'http://localhost:3000/unscrambler/v1/words?letters=abc'
```

### Changing Configuration

If you need to change environment variables:

1. **Edit the `.env.local` file** in the relevant workspace
2. **Restart the server** (changes don't auto-reload in Vite for env vars)
3. **Verify with a health check or API call**

Example: If you want the backend to use a different port:

```bash
# packages/server/.env.local
PORT=4000
```

Then restart the backend and test:

```bash
npm run dev:server  # Restarts on port 4000
curl http://localhost:4000/api/health
```

### Production Environment Variables

For production deployments (Docker, CI/CD), environment variables are provided
via:

- **GitHub Secrets** (for CI/CD workflows)
- **Docker runtime** (for container deployments)
- **System environment** (for server deployments)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production configuration details.

### Security Notes

- **Never commit `.env.local` files** — they contain sensitive configuration
- **Never include secrets in `.env.example`** — use safe default values only
- **In production**, use GitHub Secrets or secure environment variable
  management
- The `.gitignore` and `.dockerignore` ensure local env files are never
  accidentally committed

### Troubleshooting

**"Port 3000 is already in use"**

- Change `PORT` in `packages/server/.env.local` to an available port
  (e.g., 4000)

**"CORS error: Origin not allowed"**

- Verify `CORS_ORIGIN` in `packages/server/.env.local` matches your frontend URL
- Default is `http://localhost:5173` for development

**"Dictionary file not found"**

- Verify `WORD_LIST_PATH` points to the correct file location
- Default is `./data/words.txt` relative to the server directory

**"API requests hang or timeout"**

- Check that backend is running: `curl http://localhost:3000/api/health`
- Verify `REACT_APP_API_URL` in `packages/client/.env.local` is correct

---

**Next Steps**: See [project-context.md](../project-context.md) for full
technology stack details, or check the root [README.md](../README.md) for quick
start.
