# Word Unscrambler

A fullstack TypeScript word unscrambler app built with React, Vite, and Express
in a npm workspaces monorepo.

## Quick Start

```bash
# Install all dependencies (root + all workspaces)
npm install

# Start both frontend and backend dev servers concurrently
npm run dev
```

- Frontend: http://localhost:5173 (Vite + React)
- Backend API: http://localhost:3000 (Express + Node.js)

## Project Structure

```
word-unscrambler/
  packages/
    client/     # React 19 + TypeScript + Vite 7
    server/     # Express 5 + TypeScript + Node.js 18+
  package.json          # Root monorepo config (workspaces)
  tsconfig.base.json    # Shared TypeScript config
```

## Available Scripts

```bash
npm run dev           # Start both servers (concurrently)
npm run dev:client    # Frontend only (Vite on :5173)
npm run dev:server    # Backend only (Express on :3000)
npm run build         # Production build (all workspaces)
npm run test          # Run all unit/integration tests
npm run test:coverage # Generate coverage reports
npm run test:e2e      # Run E2E tests (Playwright)
npm run test:e2e:ui   # Run E2E tests in interactive UI mode
npm run test:all      # Run unit + integration + E2E tests
npm run lint          # Lint all workspaces
npm run lint:fix      # Automatically fix linting issues
npm run type-check    # TypeScript strict check (all workspaces)
npm run format        # Auto-format with Prettier
npm run format:check  # Check if formatting is needed
```

## Testing

This project uses a three-tier testing strategy:

- **Unit Tests (60%):** Vitest in `packages/client` and `packages/server`
  - Frontend: React components, hooks, utilities
  - Backend: Express routes, services, utilities
  - Run locally: `npm test` (watch mode)
  - Coverage: `npm run test:coverage` (70% minimum threshold)

- **Integration Tests (30%):** Vitest + Supertest in `packages/server`
  - API route testing with real Express app
  - Service method integration
  - Run with: `npm test` (tests in `src/__tests__/routes/`)

- **E2E Tests (10%):** Playwright in `e2e/`
  - Full user workflows across frontend + backend
  - Cross-browser testing (Chrome, Firefox, Safari)
  - Run locally: `npm run test:e2e` or `npm run test:e2e:ui`
  - Reports: `playwright-report/index.html` after test run

**Coverage Requirements:**

- Minimum 70% coverage on lines, functions, branches, and statements
- Run `npm run test:coverage` to see HTML reports in `packages/client/coverage/`
  and `packages/server/coverage/`

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (User)                            │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP/WebSocket
┌─────────────────▼───────────────────────────────────────────────┐
│              Frontend (React 19 + Vite)                          │
│            localhost:5173                                       │
├─────────────────────────────────────────────────────────────────┤
│  SearchForm → useWordFetcher → ResultsDisplay                   │
│  (Input)     (API Client)     (Display grouped by length)       │
│                       ↓                                          │
│              ErrorBoundary (Error handling)                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │ GET /unscrambler/v1/words?letters=xyz
┌─────────────────▼───────────────────────────────────────────────┐
│              Backend (Express 5)                                 │
│            localhost:3000                                       │
├─────────────────────────────────────────────────────────────────┤
│  CORS Middleware → Route Handler → Validation → Service         │
│                    validateLetters()  DictionaryService          │
│                                       ├─ canFormWord()           │
│                                       ├─ findWords()             │
│                                       └─ Dictionary (Set)        │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                 Data Layer                                       │
│  Dictionary: 1,129 English words (3–10 chars)                   │
│  Source: SCOWL 2024.11.24 (data/words.txt)                      │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Input** — User types letters in SearchForm (e.g., "rst")
2. **Validation** — validateLetters() checks 3–10 chars, letters + ? only
3. **Query** — useWordFetcher sends `GET /unscrambler/v1/words?letters=rst`
4. **Matching** — DictionaryService.findWords() filters dictionary:
   - `canFormWord()` counts available letters
   - Supports `?` wildcard for any one letter
   - Returns sorted array grouped by word length
5. **Display** — ResultsDisplay renders results grouped and sorted
6. **Error Handling** — ErrorBoundary catches React errors; useWordFetcher
   handles API errors

### Component Responsibilities

| Component          | Purpose                                  |
| ------------------ | ---------------------------------------- |
| **SearchForm**     | Accept input, validate, handle submit    |
| **ResultsDisplay** | Group words by length, sort, render      |
| **ResultCard**     | Display one group with count and styling |
| **useWordFetcher** | Manage API calls, loading state, errors  |
| **ErrorBoundary**  | Catch React errors, prevent white screen |

### Key Files

- **Frontend:** `packages/client/src/components/` (SearchForm, ResultsDisplay,
  ResultCard)
- **Backend:** `packages/server/src/` (routes, services, validators)
- **Tests:** `packages/*/src/**/*.test.{ts,tsx}` + `e2e/**/*.spec.ts`
- **Config:** `playwright.config.ts`, `.github/workflows/ci.yml`

## Word Dictionary

The word list is sourced from **SCOWL (Spell Checker Oriented Word Lists)**
version 2024.11.24, filtered to include only English words with 3–10 characters.
The word list is loaded at server startup from `data/words.txt`.

## Tech Stack

- **Frontend:** React 19, TypeScript 5, Vite 7, Tailwind CSS + shadcn/ui
- **Backend:** Express 5, TypeScript 5, Node.js 18+ LTS
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **Tooling:** ESLint 10, Prettier 3, tsx (dev server), concurrently

## Environment Variables

Copy example files before starting:

```bash
cp packages/client/.env.example packages/client/.env.local
cp packages/server/.env.example packages/server/.env.local
```

## Troubleshooting

### Port Conflicts (5173 or 3000 Already in Use)

**Problem:** `Error: listen EADDRINUSE: address already in use :::5173` or
`:::3000`

**Solution:**

```bash
# Option 1: Kill the process using the port (macOS/Linux)
lsof -i :5173  # Find process ID on frontend port
kill -9 <PID>

# Option 2: Use different ports
VITE_PORT=5174 npm run dev:client
PORT=3001 npm run dev:server
```

### npm ci Installation Failures

**Problem:** `ERR! code ERR_SOCKET_TIMEOUT` or network-related npm errors

**Solution:**

```bash
# Clear npm cache and retry
npm cache clean --force
npm ci --legacy-peer-deps

# Or configure higher timeout
npm config set fetch-timeout 120000
npm ci --legacy-peer-deps
```

### E2E Tests Fail or Timeout

**Problem:** Tests fail with "Target page, context or browser has been closed"
or timeout after 45s

**Solution:**

```bash
# Option 1: Extend timeout (default 45s)
PLAYWRIGHT_TIMEOUT=60000 npm run test:e2e

# Option 2: Run with UI for debugging
npm run test:e2e:ui

# Option 3: Check if dev server is running on the correct port
PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e

# Option 4: Clear Playwright cache
rm -rf ~/.cache/ms-playwright
npx playwright install --with-deps
```

### Tests Pass Locally but Fail in CI

**Problem:** Tests work on local machine but fail in CI pipeline

**Possible causes & solutions:**

- **Node version mismatch:** Ensure local Node version matches CI (Node 20 LTS)
  ```bash
  node --version  # Should be v20.x.x
  ```
- **Environment variables:** Set `.env.local` files
  ```bash
  cp packages/client/.env.example packages/client/.env.local
  cp packages/server/.env.example packages/server/.env.local
  ```
- **Cache issues:** Clear build artifacts
  ```bash
  npm run clean  # If available
  rm -rf packages/*/dist packages/*/coverage
  npm ci --legacy-peer-deps
  npm run build
  ```

### Bundle Size Exceeds Limit (100 KB)

**Problem:** `Bundle exceeds limit of 100KB (current: 120.5KB)`

**Solution:**

```bash
# 1. Review what's contributing to bundle size
npm run build

# 2. Identify largest files in the output
# Look for the bundle report showing file breakdown and % of total

# 3. Optimize or temporarily increase limit
BUNDLE_LIMIT_KB=150 npm run build  # Test higher limit
```

### Development Server Issues

**Problem:** Hot module replacement (HMR) not working or slow

**Solution:**

- Restart dev server: `npm run dev`
- Check for file watcher limits (macOS): `sysctl kern.maxfiles` should be >10000
- Restart TypeScript language server in editor if type errors aren't updating

## Based On

Adapted from
[fullstack-typescript](https://github.com/gilamran/fullstack-typescript) starter
kit, restructured as an npm workspaces monorepo.
