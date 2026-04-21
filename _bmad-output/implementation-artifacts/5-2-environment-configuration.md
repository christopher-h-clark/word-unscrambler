---
storyId: '5.2'
storyKey: '5-2-environment-configuration'
epic: 5
epicTitle: 'Deployment & Documentation'
title: 'Set Up Environment Configuration for Development and Production'
created: '2026-04-20'
status: 'ready-for-dev'
contextSource: 'Epic 5.2 + Architecture + Project Context'
devReadyDate: '2026-04-20'
---

# Story 5.2: Set Up Environment Configuration for Development and Production

## Story Overview

**Epic:** 5 - Deployment & Documentation  
**Story ID:** 5.2  
**Depends On:** Story 5-1 (Dockerfile & docker-compose created) ✅  
**Blocks:** Story 5-3 (deployment documentation), Story 5-4 (MVP release)  
**Value:** Enables flexible deployment configuration across environments

**User Story:**

> As a **devops engineer**, I want to configure environment variables for both
> development and production deployment, so that the app can be configured
> differently per environment.

---

## Acceptance Criteria

✅ **AC5.2.1:** Create `.env.example` files (committed to git)

✅ **AC5.2.2:** Create `.env.local` files (git-ignored, never committed)

✅ **AC5.2.3:** Add `.env.local` to `.gitignore` in both workspaces

✅ **AC5.2.4:** Frontend environment: `packages/client/.env.example` and
`.env.local`

✅ **AC5.2.5:** Backend environment: `packages/server/.env.example` and
`.env.local`

✅ **AC5.2.6:** Frontend variables: `REACT_APP_API_URL`

✅ **AC5.2.7:** Backend variables: `NODE_ENV`, `PORT`, `WORD_LIST_PATH`,
`CORS_ORIGIN`

✅ **AC5.2.8:** Developers can copy `.env.example` → `.env.local` for local
development

✅ **AC5.2.9:** Production uses CI/CD environment variables (GitHub Secrets or
similar)

✅ **AC5.2.10:** Application loads variables correctly in both development and
production

✅ **AC5.2.11:** No secrets hardcoded in source code or examples

✅ **AC5.2.12:** Environment configuration documented in DEVELOPMENT.md

---

## Developer Context & Critical Guardrails

### Project State at Story Start

**Complete Infrastructure:**

- ✅ Epic 1-4: Complete application (foundation, backend, frontend, testing)
- ✅ Story 5-1: Dockerfile and docker-compose created

**This Story:** Configure environment variables for different deployment
contexts

### Architecture Guidance (from architecture.md)

**Environment Configuration Strategy:**

- Each workspace has `.env.example` (committed) and `.env.local` (git-ignored)
- No root `.env` files; each workspace manages its own configuration
- Development: Developers copy `.env.example` → `.env.local` locally
- Production: CI/CD sets variables via GitHub Secrets or infrastructure
- `.env.local` is git-ignored and never committed

**Variable Purposes:**

**Frontend (`packages/client/.env.example`):**

```
REACT_APP_API_URL=http://localhost:3000
```

- Purpose: URL to backend API
- Development: `http://localhost:3000` (local backend)
- Production: `https://api.yourdomain.com` or similar

**Backend (`packages/server/.env.example`):**

```
NODE_ENV=development
PORT=3000
WORD_LIST_PATH=./data/words.txt
CORS_ORIGIN=http://localhost:5173
```

- `NODE_ENV`: `development` or `production` (affects error handling, logging)
- `PORT`: Server listen port (default 3000)
- `WORD_LIST_PATH`: Path to dictionary file
- `CORS_ORIGIN`: Allowed origin for CORS (frontend URL)

### Previous Story Patterns (Story 5-1)

From Docker story:

- ✅ Comprehensive implementation strategy
- ✅ Multi-part process with clear steps
- ✅ Testing verification before completion
- ✅ Proper git commit guidelines
- ✅ Success criteria checklist

### Current Git State

Recent commits show deployment workflow starting:

```
167871d Fix minor inconsistencies
42d2449 Code Review Story 4-5
879ec0c perf(validation): validate bundle size and performance targets
```

Pattern: Commit format includes scope, description, and purpose

---

## Implementation Strategy

### Part 1: Create Frontend Environment Files

**Location:** `packages/client/.env.example` (committed)

**Content:**

```env
# Frontend API Configuration
# =========================
# API endpoint for the backend service
# Development: Points to local backend (port 3000)
# Production: Points to production API URL
REACT_APP_API_URL=http://localhost:3000
```

**Why This Variable:**

- Used in `packages/client/src/hooks/useWordFetcher.ts`
- Pattern: `fetch(process.env.REACT_APP_API_URL + endpoint)`
- REACT*APP* prefix required by Vite to expose to frontend

**Create `.env.local` File:**

Developers create this locally:

```bash
cd packages/client
cp .env.example .env.local
```

Contents of `packages/client/.env.local` (git-ignored):

```env
REACT_APP_API_URL=http://localhost:3000
```

**Production Override:**

For production deployment, set via GitHub Secrets or environment:

```bash
# In GitHub Actions or CI/CD
export REACT_APP_API_URL=https://api.yourdomain.com
npm run build
```

### Part 2: Create Backend Environment Files

**Location:** `packages/server/.env.example` (committed)

**Content:**

```env
# Backend Server Configuration
# ============================

# Node.js environment
# development: Use development-friendly error handling, verbose logging
# production: Use production-optimized error handling, minimal logging
NODE_ENV=development

# Server configuration
# Port to listen on (default 3000)
PORT=3000

# Dictionary file location
# Path to word list file relative to server working directory
WORD_LIST_PATH=./data/words.txt

# CORS configuration
# Allowed origin for frontend requests
# Development: localhost:5173 (Vite dev server)
# Production: https://yourdomain.com
CORS_ORIGIN=http://localhost:5173
```

**Why These Variables:**

- `NODE_ENV`: Controls error handling, logging verbosity, minification
- `PORT`: Configurable server port (for docker-compose, proxies, etc.)
- `WORD_LIST_PATH`: Location of dictionary file (can be different paths)
- `CORS_ORIGIN`: Security control for cross-origin requests

**Create `.env.local` File:**

Developers create this locally:

```bash
cd packages/server
cp .env.example .env.local
```

Contents of `packages/server/.env.local` (git-ignored):

```env
NODE_ENV=development
PORT=3000
WORD_LIST_PATH=./data/words.txt
CORS_ORIGIN=http://localhost:5173
```

**Production Override:**

For production deployment:

```bash
# Via GitHub Secrets or environment
export NODE_ENV=production
export PORT=3000
export WORD_LIST_PATH=./packages/server/data/words.txt
export CORS_ORIGIN=https://yourdomain.com
npm run build
```

### Part 3: Update `.gitignore` Files

**Global `.gitignore` (project root):**

Add or verify these entries exist:

```
# Environment variables (git-ignored, never commit)
.env
.env.local
.env.*.local

# Build outputs (generated)
dist/
build/
node_modules/

# IDE and OS (standard)
.DS_Store
.vscode/
.idea/

# Testing (optional)
coverage/
.nyc_output/

# Logs (optional)
logs/
*.log
```

**Frontend `.gitignore` (packages/client/.gitignore):**

Verify or add:

```
.env.local
.env.*.local
```

**Backend `.gitignore` (packages/server/.gitignore):**

Verify or add:

```
.env.local
.env.*.local
```

### Part 4: Code Integration - Verify Environment Loading

**Frontend (`packages/client/src/hooks/useWordFetcher.ts`):**

Verify it uses environment variable:

```typescript
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const useWordFetcher = () => {
  const fetchWords = async (letters: string) => {
    const response = await fetch(
      `${apiUrl}/unscrambler/v1/words?letters=${encodeURIComponent(letters)}`
    );
    // ... rest of implementation
  };
  // ...
};
```

**Backend (`packages/server/src/index.ts`):**

Verify it loads environment variables:

```typescript
import 'dotenv/config';

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const wordListPath = process.env.WORD_LIST_PATH || './data/words.txt';

console.log(`[INFO] Starting server in ${nodeEnv} mode on port ${port}`);
console.log(`[INFO] CORS origin: ${corsOrigin}`);
console.log(`[INFO] Dictionary path: ${wordListPath}`);

try {
  DictionaryService.initialize(wordListPath);
} catch (error) {
  console.error('[FATAL] Dictionary load failed:', error);
  process.exit(1);
}

const app = createApp(corsOrigin);
app.listen(port, () => {
  console.log(`[INFO] Server running on port ${port}`);
});
```

**Backend (`packages/server/src/app.ts`):**

Verify CORS is configured:

```typescript
import cors from 'cors';

export const createApp = (corsOrigin: string) => {
  const app = express();

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );

  // ... rest of app configuration
  return app;
};
```

### Part 5: Update `package.json` Scripts

**Verify frontend has `.env.local` setup:**

No changes needed; Vite automatically loads `.env.local`

**Verify backend has dotenv installed:**

In `packages/server/package.json`:

```json
{
  "dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    ...
  }
}
```

Add `import 'dotenv/config';` at top of `packages/server/src/index.ts`

### Part 6: Development Workflow Setup

**For new developers:**

```bash
# 1. Clone repo
git clone <repo-url>
cd word-unscrambler

# 2. Install dependencies
npm install

# 3. Configure frontend
cd packages/client
cp .env.example .env.local
# Edit .env.local if needed (default is usually fine)

# 4. Configure backend
cd ../server
cp .env.example .env.local
# Edit .env.local if needed (default is usually fine)

# 5. Go back to root and start dev servers
cd ../..
npm run dev

# Servers start on:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3000
```

### Part 7: Production Deployment Configuration

**GitHub Secrets Setup (for CI/CD):**

In GitHub repository settings → Secrets and variables → Actions:

```
FRONTEND_API_URL = https://api.yourdomain.com
BACKEND_NODE_ENV = production
BACKEND_PORT = 3000
BACKEND_WORD_LIST_PATH = ./packages/server/data/words.txt
BACKEND_CORS_ORIGIN = https://yourdomain.com
```

**CI/CD Integration Example (`.github/workflows/deploy.yml`):**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Build with production environment
      - name: Build frontend
        env:
          REACT_APP_API_URL: ${{ secrets.FRONTEND_API_URL }}
        run: npm run build -w packages/client

      - name: Build backend
        env:
          NODE_ENV: ${{ secrets.BACKEND_NODE_ENV }}
          PORT: ${{ secrets.BACKEND_PORT }}
          WORD_LIST_PATH: ${{ secrets.BACKEND_WORD_LIST_PATH }}
          CORS_ORIGIN: ${{ secrets.BACKEND_CORS_ORIGIN }}
        run: npm run build -w packages/server

      # Deploy to production
      - name: Deploy
        run: # deployment commands here
```

---

## Critical Implementation Notes

### `.env.local` Must Be Git-Ignored

**Critical:** Never commit `.env.local` files

```bash
# Verify in .gitignore
grep -i "\.env\.local" .gitignore

# If missing, add it
echo ".env.local" >> .gitignore
```

**Check git status:**

```bash
git status

# Should NOT show .env.local files
# If they appear, remove from git:
git rm --cached packages/client/.env.local
git rm --cached packages/server/.env.local
```

### Environment Variable Naming

**Frontend variables** must start with `REACT_APP_`:

- ✅ `REACT_APP_API_URL` (exposed to frontend)
- ❌ `API_URL` (NOT exposed, Vite filters by prefix)

**Backend variables** use any name:

- ✅ `NODE_ENV`, `PORT`, `CORS_ORIGIN`, `WORD_LIST_PATH`

### Development vs. Production URLs

**Development:**

```
Frontend runs on: http://localhost:5173
Backend runs on: http://localhost:3000
Frontend config: REACT_APP_API_URL=http://localhost:3000
Backend config: CORS_ORIGIN=http://localhost:5173
```

**Production (example):**

```
Frontend runs on: https://yourdomain.com
Backend runs on: https://yourdomain.com (or https://api.yourdomain.com)
Frontend config: REACT_APP_API_URL=https://api.yourdomain.com
Backend config: CORS_ORIGIN=https://yourdomain.com
```

### No Secrets in Examples

**IMPORTANT:** `.env.example` files should NEVER contain:

- ❌ API keys
- ❌ Database passwords
- ❌ JWT secrets
- ❌ Private tokens

Example should have safe defaults:

```env
# Good - safe defaults
REACT_APP_API_URL=http://localhost:3000

# Bad - contains secrets
REACT_APP_API_KEY=sk_live_abc123def456
```

---

## Testing Checklist (Before Completing)

- [ ] `packages/client/.env.example` created with `REACT_APP_API_URL`
- [ ] `packages/client/.env.local` created (git-ignored, not committed)
- [ ] `packages/server/.env.example` created with all 4 variables
- [ ] `packages/server/.env.local` created (git-ignored, not committed)
- [ ] `.gitignore` includes `.env.local` entries
- [ ] `.env.local` files NOT in git status (properly ignored)
- [ ] Frontend code uses `process.env.REACT_APP_API_URL`
- [ ] Backend code imports dotenv: `import 'dotenv/config';`
- [ ] Backend loads variables: `process.env.PORT`, `process.env.CORS_ORIGIN`,
      etc.
- [ ] Development workflow verified:
  - [ ] `cd packages/client && cp .env.example .env.local` works
  - [ ] `cd packages/server && cp .env.example .env.local` works
  - [ ] `npm run dev` starts without errors
  - [ ] Frontend loads API from `REACT_APP_API_URL`
  - [ ] Backend listens on `PORT` from environment
  - [ ] CORS configured with `CORS_ORIGIN`
- [ ] Production configuration documented
- [ ] Environment variables can be overridden via CI/CD
- [ ] No secrets in `.env.example` files
- [ ] All variables documented with purpose
- [ ] No hardcoded URLs or ports in source code

---

## Git & Commit Guidelines

### Commit Message Format

```
build(config): set up environment configuration for dev and production

- Create packages/client/.env.example with REACT_APP_API_URL
- Create packages/client/.env.local (git-ignored for local development)
- Create packages/server/.env.example with NODE_ENV, PORT, WORD_LIST_PATH, CORS_ORIGIN
- Create packages/server/.env.local (git-ignored for local development)
- Update .gitignore to exclude .env.local files
- Verify frontend loads REACT_APP_API_URL from environment
- Verify backend loads dotenv and uses process.env variables
- Configure CORS with environment variable
- Document development workflow: copy .env.example → .env.local
- Support production configuration via GitHub Secrets or CI/CD

No hardcoded secrets in example files or source code.
All environment variables can be overridden per deployment context.

Closes #5-2
```

### Files to Commit

```
NEW:
- packages/client/.env.example
- packages/server/.env.example

MODIFIED:
- .gitignore (add .env.local if not already present)
- packages/client/.gitignore (verify .env.local is ignored)
- packages/server/.gitignore (verify .env.local is ignored)

NOT COMMITTED:
- packages/client/.env.local (git-ignored)
- packages/server/.env.local (git-ignored)
```

### Branch Name

```
build/5-2-environment-configuration
```

---

## Success Criteria Summary

When Story 5.2 is DONE:

1. ✅ `packages/client/.env.example` created with `REACT_APP_API_URL`
2. ✅ `packages/client/.env.local` created (git-ignored)
3. ✅ `packages/server/.env.example` created with 4 variables
4. ✅ `packages/server/.env.local` created (git-ignored)
5. ✅ `.env.local` entries in `.gitignore`
6. ✅ `.env.local` files NOT in git tracking
7. ✅ Frontend loads API URL from environment
8. ✅ Backend imports dotenv
9. ✅ Backend loads all 4 variables correctly
10. ✅ CORS configured with environment variable
11. ✅ Development workflow documented and tested
12. ✅ Production configuration strategy documented
13. ✅ No secrets in example files
14. ✅ All variables documented with purpose
15. ✅ Environment variables overridable per context
16. ✅ Application runs locally with .env.local files
17. ✅ Application runs in production with CI/CD variables
18. ✅ Code contains no hardcoded URLs or configuration
19. ✅ Commit with proper message and branch name
20. ✅ Ready for Story 5-3 (deployment documentation)

---

## Story Dependencies & Flow

**Depends On:**

- Story 5-1: Dockerfile & docker-compose created ✅

**Blocks:**

- Story 5-3 (deployment documentation)
- Story 5-4 (MVP release)

**Epic 5 Progression:**

```
5-1: Dockerfile & docker-compose ✅
  ↓
5-2: Environment configuration ← YOU ARE HERE
  ↓
5-3: Deployment documentation
  ↓
5-4: MVP release & production readiness
```

---

## Implementation Resources

### Environment Configuration Concepts

- [Node.js dotenv package](https://www.npmjs.com/package/dotenv)
- [Vite environment variables](https://vitejs.dev/guide/env-and-modes.html)
- [GitHub Secrets management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

### Related Files in Project

- `packages/client/src/hooks/useWordFetcher.ts` (verify API URL usage)
- `packages/server/src/index.ts` (verify dotenv import and variable loading)
- `packages/server/src/app.ts` (verify CORS configuration)
- `.gitignore` (root and workspace levels)
- `package.json` (verify dotenv dependency)

### Pattern Examples from Architecture

From `architecture.md`:

```
Environment Configuration: .env.local per Workspace
├─ packages/client/.env.local (git-ignored)
├─ packages/server/.env.local (git-ignored)
├─ Both loaded at startup
├─ Developers copy from .example files
└─ Production uses GitHub Secrets or CI/CD
```

---

## Dev Notes from Previous Stories

From Story 5-1 patterns:

- ✅ Comprehensive implementation strategy with multiple parts
- ✅ Configuration examples for development and production
- ✅ Security considerations (no secrets in examples)
- ✅ Testing checklist before completion
- ✅ Git guidelines with proper format
- ✅ Success criteria measurable and specific

Apply these patterns to this story.

---

## Next Steps for Dev Agent

1. Create `packages/client/.env.example` with `REACT_APP_API_URL`
2. Create `packages/client/.env.local` (copy from .example)
3. Create `packages/server/.env.example` with 4 variables
4. Create `packages/server/.env.local` (copy from .example)
5. Verify `.gitignore` has `.env.local` entries
6. Verify `packages/client/.env.local` is git-ignored
7. Verify `packages/server/.env.local` is git-ignored
8. Add `import 'dotenv/config';` to `packages/server/src/index.ts`
9. Verify frontend code uses `process.env.REACT_APP_API_URL`
10. Verify backend loads all environment variables
11. Test locally: `npm run dev` (both servers start)
12. Verify frontend connects to backend via API URL
13. Test with different values: change API URL in `.env.local`, verify frontend
    connects
14. Commit with proper message and branch name
15. Verify all acceptance criteria met

---

**Development Complete When:** All `.env` files created, properly git-ignored,
environment variables loaded in code, development workflow tested, production
configuration documented, all acceptance criteria verified, commit pushed with
proper message.

---

## Story Metadata

**Created:** 2026-04-20  
**Status:** ready-for-dev  
**Epic:** 5 - Deployment & Documentation  
**Story Number:** 2 of 4  
**Estimated Complexity:** Low (simple file creation and configuration)  
**Dependencies:** Story 5-1 complete  
**Next Story:** 5-3-deployment-documentation  
**Ready for Implementation:** ✅ YES

---
