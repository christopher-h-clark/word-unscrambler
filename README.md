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
npm run test          # Run all tests
npm run lint          # Lint all workspaces
npm run type-check    # TypeScript strict check (all workspaces)
npm run format        # Auto-format with Prettier
```

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
