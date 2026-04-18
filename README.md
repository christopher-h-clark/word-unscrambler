# Word Unscrambler

A fullstack TypeScript word unscrambler app built with React, Vite, and Express in a npm workspaces monorepo.

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
- Run `npm run test:coverage` to see HTML reports in `packages/client/coverage/` and `packages/server/coverage/`

## Word Dictionary

The word list is sourced from **SCOWL (Spell Checker Oriented Word Lists)** version 2024.11.24, filtered to include only English words with 3–10 characters. The word list is loaded at server startup from `data/words.txt`.

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

## Based On

Adapted from [fullstack-typescript](https://github.com/gilamran/fullstack-typescript) starter kit, restructured as an npm workspaces monorepo.
