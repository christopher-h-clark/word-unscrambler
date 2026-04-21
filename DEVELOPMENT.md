# Development Guide

Complete guide for setting up and working with the word-unscrambler project.

## Table of Contents

1. [Local Setup](#local-setup)
2. [Workspace Structure](#workspace-structure)
3. [Development Workflow](#development-workflow)
4. [Testing](#testing)
5. [Building](#building)
6. [Git Workflow](#git-workflow)
7. [Troubleshooting](#troubleshooting)

## Local Setup

### Prerequisites

- Node.js 18+ LTS ([download](https://nodejs.org))
- npm 8+ (comes with Node.js)
- Git

**Managing Multiple Node.js Versions:**

If you work on multiple projects with different Node versions, consider a
version manager:

- **macOS/Linux:** [nvm](https://github.com/nvm-sh/nvm) (recommended) or
  [fnm](https://github.com/Schniz/fnm)
- **Windows:** [fnm](https://github.com/Schniz/fnm) or
  [nodenv](https://github.com/nodenv/nodenv)
- **Any OS:** [volta](https://docs.volta.sh/) for project-level version locking

> **Note:** All `npm` commands in this guide must be run from the **project
> root** directory (`word-unscrambler/`), not from inside individual workspace
> directories.

### Installation

```bash
# 1. Clone repository
git clone <repo-url>
cd word-unscrambler

# 2. Install all dependencies (installs for all workspaces)
npm install

# 3. Configure frontend environment
cd packages/client
cp .env.example .env.local
# Edit .env.local if needed (usually defaults work)

# 4. Configure backend environment
cd ../server
cp .env.example .env.local
# Edit .env.local if needed (usually defaults work)

# 5. Return to root
cd ../..
```

### Verify Installation

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 8+)
npm --version

# List installed packages
npm list --depth=0
```

### Troubleshoot Installation Issues

**If npm install fails with timeout or network errors:**

```bash
# Increase npm fetch timeout (default 60s)
npm config set fetch-timeout 120000

# Clear npm cache and retry
npm cache clean --force
npm install

# If still failing, try legacy-peer-deps flag
npm install --legacy-peer-deps
```

**If you see "ERR! code ERR_SOCKET_TIMEOUT":**

- Your network is slow or npm registry is temporarily unavailable
- Wait a moment and retry: `npm install`
- Or configure a higher timeout and retry

**If node_modules is corrupted:**

```bash
# Clean slate: remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Workspace Structure

Monorepo with two independent workspaces:

```
word-unscrambler/
├── packages/client/               # React frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── SearchForm.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useWordFetcher.ts
│   │   ├── services/            # API utilities
│   │   │   └── api.ts
│   │   └── App.tsx
│   ├── .env.example             # Environment template
│   ├── .env.local               # Local config (git-ignored)
│   └── package.json
│
├── packages/server/              # Express backend
│   ├── src/
│   │   ├── routes/              # API endpoints
│   │   │   └── words.ts
│   │   ├── services/            # Business logic
│   │   │   └── dictionary.ts
│   │   ├── middleware/          # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── corsConfig.ts
│   │   └── index.ts             # Server startup
│   ├── data/
│   │   └── words.txt            # Word list
│   ├── .env.example             # Environment template
│   ├── .env.local               # Local config (git-ignored)
│   ├── openapi.yaml             # API specification
│   └── package.json
│
├── e2e/                         # End-to-end tests
│   ├── word-lookup.spec.ts
│   ├── error-handling.spec.ts
│   └── multiple-lookups.spec.ts
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md
│   └── API.md
│
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI/CD
│
└── README.md
```

## Development Workflow

### Start Development Servers

```bash
npm run dev
```

This starts both frontend and backend concurrently:

```
Frontend: http://localhost:5173 (Vite dev server with HMR)
Backend:  http://localhost:3000 (Express)
```

### Start Servers Individually

```bash
# Terminal 1: Frontend only
npm run dev:client

# Terminal 2: Backend only
npm run dev:server
```

### Frontend Development

**Component Development:**

1. Edit component in `packages/client/src/components/`
2. Component automatically reloads (HMR)
3. View changes at `http://localhost:5173`

**Hook Development:**

1. Edit hook in `packages/client/src/hooks/`
2. Components using the hook automatically update
3. Write tests alongside (`.test.ts` file)

**Styling with Tailwind:**

1. Use Tailwind classes in JSX
2. Changes apply instantly via HMR
3. Unused classes automatically purged in production build

### Backend Development

**Route Development:**

1. Edit route in `packages/server/src/routes/`
2. Backend automatically restarts (via tsx --watch)
3. API immediately available at new endpoint

**Service Development:**

1. Edit service in `packages/server/src/services/`
2. Routes importing service are automatically reloaded
3. Write tests alongside (in `__tests__/services/`)

**Test API Quickly:**

```bash
# With backend running on port 3000
curl "http://localhost:3000/unscrambler/v1/words?letters=abc"
```

## Testing

### Run All Tests

```bash
npm run test
```

### Run Tests by Workspace

```bash
npm run test:client     # Frontend tests (Vitest + React Testing Library)
npm run test:server     # Backend tests (Vitest + Supertest)
npm run test:e2e        # E2E tests (Playwright)
```

### Run Specific Test File

```bash
npm run test -- SearchForm.test.tsx
npm run test:server -- words.test.ts
```

### Watch Mode (Auto-Rerun on Changes)

```bash
npm run test -- --watch
```

### Coverage Report

```bash
npm run test -- --coverage
```

### E2E Test Development

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test e2e/word-lookup.spec.ts

# Debug mode (step through)
npx playwright test --debug
```

## Building

### Build Both Workspaces

```bash
npm run build
```

Outputs:

- Frontend: `packages/client/dist/` (static HTML/CSS/JS)
- Backend: `packages/server/dist/` (compiled JavaScript)

### Build Individual Workspaces

```bash
npm run build:client    # Vite production build
npm run build:server    # TypeScript compilation
```

### Verify Build Size

```bash
cd packages/client
npm run build
du -sh dist/
ls -lh dist/index*.js
```

Should show < 100KB gzipped.

## Git Workflow

### Branch Naming

```
feature/description      # New features
fix/description          # Bug fixes
refactor/description     # Code improvements
test/description         # Test additions
docs/description         # Documentation
chore/description        # Maintenance
```

Example:

```
feature/5-3-deployment-docs
fix/api-cors-error
test/add-performance-tests
```

### Commit Messages

```
{type}({scope}): {subject}

{body}

{footer}
```

Example:

```
docs(deployment): create deployment documentation

- Create DEPLOYMENT.md with production setup steps
- Add environment configuration examples
- Document health checks and rollback procedures
- Include troubleshooting section

Closes #5-3
```

### Creating a Pull Request

1. **Create feature branch:**

   ```bash
   git checkout -b feature/description
   ```

2. **Make changes and commit:**

   ```bash
   git add .
   git commit -m "type(scope): description"
   ```

3. **Push to GitHub:**

   ```bash
   git push origin feature/description
   ```

4. **Open PR on GitHub:**
   - Compare: your branch → main
   - Add description of changes
   - Reference related issues

5. **Wait for CI/CD and reviews:**
   - All checks must pass
   - At least one approval required
   - Address feedback in new commits

6. **Merge when ready:**
   ```bash
   # GitHub will handle squash merge
   ```

## Code Quality

### Pre-Commit Checks

Before committing, the following run automatically:

- ESLint (code style)
- Prettier (code formatting)
- TypeScript type checking

### Type Safety

TypeScript strict mode is enforced:

```bash
npm run type-check      # Verify types
```

### Linting

```bash
npm run lint            # Run ESLint
npm run lint:fix        # Fix auto-fixable issues
npm run format          # Run Prettier
```

## Troubleshooting

### Ports Already in Use

**Problem:** `Error: listen EADDRINUSE :::3000`

**Solution (macOS/Linux):**

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev:server
```

**Solution (Windows):**

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with the process ID from netstat output)
taskkill /PID <PID> /F

# Or use different port
$env:PORT=3001; npm run dev:server
```

### Module Not Found

**Problem:** `Cannot find module 'react'`

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Vite Errors

**Problem:** `[vite] Internal server error: Failed to resolve import`

**Solution:**

```bash
# Clear Vite cache
rm -rf packages/client/node_modules/.vite

# Restart dev server
npm run dev:client
```

### Dictionary Load Error

**Problem:** `[FATAL] Dictionary load failed: ENOENT`

**Solution:**

```bash
# Verify dictionary file exists
ls -la packages/server/data/words.txt

# Check environment variable
grep WORD_LIST_PATH packages/server/.env.local
```

### Tests Failing

**Problem:** Tests that passed before now fail

**Solution:**

```bash
# Clear test cache
npm run test -- --clearCache

# Run tests again
npm run test
```

## Environment Variables

### Frontend (`packages/client/.env.local`)

```env
REACT_APP_API_URL=http://localhost:3000
```

### Backend (`packages/server/.env.local`)

```env
NODE_ENV=development
PORT=3000
WORD_LIST_PATH=./data/words.txt
CORS_ORIGIN=http://localhost:5173
```

## Documentation

- [README.md](README.md) - Project overview
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Tech decisions
- [API.md](docs/API.md) - API endpoints

---

**Next:** See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment steps.
