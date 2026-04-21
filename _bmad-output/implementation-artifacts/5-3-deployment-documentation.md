---
storyId: '5.3'
storyKey: '5-3-deployment-documentation'
epic: 5
epicTitle: 'Deployment & Documentation'
title: 'Write Deployment Documentation (README, DEVELOPMENT, DEPLOYMENT Guides)'
created: '2026-04-20'
status: 'done'
contextSource: 'Epic 5.3 + Architecture + Project Context'
devReadyDate: '2026-04-20'
completedDate: '2026-04-21'
reviewCompletedDate: '2026-04-21'
---

# Story 5.3: Write Deployment Documentation

## Story Overview

**Epic:** 5 - Deployment & Documentation  
**Story ID:** 5.3  
**Depends On:** Stories 5-1 & 5-2 (Docker & environment setup) ✅  
**Blocks:** Story 5-4 (MVP release)  
**Value:** Enables new developers and operators to work with project
independently

**User Story:**

> As a **technical writer**, I want to create comprehensive documentation for
> setup, development, and deployment, so that new developers and operators can
> work with the project independently.

---

## Acceptance Criteria

✅ **AC5.3.1:** Create README.md with project overview, quick start, usage, tech
stack

✅ **AC5.3.2:** Create DEVELOPMENT.md with local setup, workspace structure,
workflow

✅ **AC5.3.3:** Create DEPLOYMENT.md with production deployment, environment
config, health checks

✅ **AC5.3.4:** Create or reference ARCHITECTURE.md explaining technology
choices

✅ **AC5.3.5:** Create API.md documenting REST API endpoint with examples

✅ **AC5.3.6:** Verify openapi.yaml exists at packages/server/openapi.yaml

✅ **AC5.3.7:** All documentation links are correct and files exist

✅ **AC5.3.8:** Documentation includes setup time estimates and troubleshooting

✅ **AC5.3.9:** No dead links or missing references

✅ **AC5.3.10:** Documentation is clear to developers unfamiliar with project

---

## Developer Context & Critical Guardrails

### Project State at Story Start

**Complete & Tested Application:**

- ✅ Epics 1-4: All features, tests, and accessibility complete
- ✅ Story 5-1: Docker infrastructure in place
- ✅ Story 5-2: Environment configuration ready

**This Story:** Document setup, development, and deployment workflows

### Documentation Architecture (from architecture.md)

**Required Documentation:**

1. **README.md** (project root)
   - Project overview and purpose
   - Quick start (git clone, npm install, npm run dev)
   - Usage examples
   - Tech stack

2. **DEVELOPMENT.md** (project root)
   - Local setup instructions
   - Workspace structure explanation
   - Development workflow (npm commands)
   - Testing approach (how to run tests)
   - Building (npm run build)
   - Git workflow

3. **DEPLOYMENT.md** (project root)
   - Production deployment steps
   - Environment variable configuration
   - Dictionary management
   - Health checks and monitoring
   - Rollback procedures

4. **ARCHITECTURE.md** (docs/ or reference existing)
   - Technology choices and rationale
   - Component structure
   - API contract
   - Testing strategy

5. **API.md** (docs/)
   - REST API endpoint documentation
   - Request/response examples
   - Error handling examples

6. **openapi.yaml** (packages/server/)
   - OpenAPI 3.1 specification
   - Complete endpoint specifications
   - Parameters and responses
   - Examples for each scenario

### Previous Story Patterns (5-1, 5-2)

From recent stories:

- ✅ Clear acceptance criteria
- ✅ Implementation strategy with multiple parts
- ✅ Testing checklist before completion
- ✅ Success criteria summary
- ✅ Proper git guidelines

---

## Implementation Strategy

### Part 1: Create README.md

**Location:** Project root `/README.md`

**Content Structure:**

````markdown
# Word Unscrambler

A fast, accessible word lookup application that finds all valid English words
you can form from a set of letters.

## Features

- 🔤 **Quick Lookup** - Enter 3-10 letters and get instant results
- 🎯 **Organized Results** - Words grouped by length, alphabetically sorted
- 🌙 **Dark Theme** - Modern, easy-on-the-eyes interface
- ♿ **Accessible** - WCAG AA compliance, keyboard and screen reader friendly
- ⚡ **Fast** - Response times < 1 second typical, < 10 seconds maximum
- 📦 **Lightweight** - Frontend bundle < 100KB gzipped

## Quick Start

### Prerequisites

- Node.js 18+ LTS
- npm 8+
- Git

### 5-Minute Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd word-unscrambler

# 2. Install dependencies (all workspaces)
npm install

# 3. Configure environment
cd packages/client
cp .env.example .env.local

cd ../server
cp .env.example .env.local

# 4. Start development servers
cd ../..
npm run dev

# 5. Open in browser
# Frontend: http://localhost:5173
# API: http://localhost:3000
```
````

The app is now running! Enter letters in the input field to see results.

### Expected Startup Output

```
$ npm run dev
npm run dev:client & npm run dev:server

VITE v5.0.0  ready in 234 ms
➜  local:   http://localhost:5173/
➜  press h + enter to show help

[INFO] Dictionary loaded in 892ms
[INFO] Starting server on port 3000
[INFO] CORS configured for http://localhost:5173
```

## Usage

1. **Enter Letters**: Type 3-10 letters in the input field (a-z,
   case-insensitive)
2. **Optional Wildcard**: Use `?` to match any single letter (e.g., `h?llo`)
3. **Submit**: Press Enter or click "Unscramble!" button
4. **View Results**: Words appear grouped by length, sorted alphabetically
5. **Try Again**: Click the input field to clear and start a new search

### Example

Input: `abc` Output:

```
3-Letter Words
abc  bac  cab

No other words found
```

Input: `h?llo` Output:

```
5-Letter Words
hello  hullo
```

## Tech Stack

### Frontend

- **React 18+** - UI components
- **TypeScript 5.0+** - Type safety
- **Vite 5+** - Fast build tool with HMR
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Vitest** - Unit testing
- **Playwright** - E2E testing

### Backend

- **Node.js 18+ LTS** - Runtime
- **Express 4.18+** - Web framework
- **TypeScript 5.0+** - Type safety
- **Vitest** - Unit testing
- **Supertest** - API testing

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Local orchestration

## Project Structure

```
word-unscrambler/
├── packages/
│   ├── client/          # React frontend
│   └── server/          # Express backend
├── e2e/                 # Playwright tests
├── docs/                # Documentation
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.yml   # Local development
├── README.md            # This file
├── DEVELOPMENT.md       # Dev setup & workflow
└── DEPLOYMENT.md        # Production deployment
```

## Commands

### Development

```bash
npm run dev              # Start both frontend and backend
npm run dev:client      # Frontend only (port 5173)
npm run dev:server      # Backend only (port 3000)
```

### Testing

```bash
npm run test            # Run all tests
npm run test:client     # Client tests only
npm run test:server     # Server tests only
npm run test:e2e        # E2E tests (Playwright)
```

### Building

```bash
npm run build           # Build both frontend and backend
npm run build:client    # Frontend build only
npm run build:server    # Backend build only
```

### Docker

```bash
docker build -t word-unscrambler:latest .
docker-compose up      # Start containerized app
docker-compose down     # Stop and remove containers
```

## Documentation

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Local setup, workflow, testing
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment steps
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Tech decisions and patterns
- **[API.md](docs/API.md)** - API endpoint documentation
- **[openapi.yaml](packages/server/openapi.yaml)** - OpenAPI 3.1 specification

## Performance

- **Frontend Bundle**: < 100KB gzipped (target met)
- **API Response**: < 1 second typical, < 10 seconds maximum
- **Dictionary Load**: < 5 seconds at startup

See [PERFORMANCE_BASELINE.md](PERFORMANCE_BASELINE.md) for detailed metrics.

## Accessibility

- ✅ WCAG AA compliant
- ✅ All interactive elements keyboard accessible
- ✅ Screen reader friendly
- ✅ Color contrast 7:1 (WCAG AAA standard)
- ✅ Touch targets minimum 44×44px

## Support & Issues

- Found a bug?
  [Open an issue](https://github.com/yourname/word-unscrambler/issues)
- Have a question? Check [DEVELOPMENT.md](DEVELOPMENT.md) or
  [DEPLOYMENT.md](DEPLOYMENT.md)

## License

MIT

---

**Get started in 5 minutes:** [Quick Start](#quick-start) above, then check
[DEVELOPMENT.md](DEVELOPMENT.md) for the full workflow.

````

### Part 2: Create DEVELOPMENT.md

**Location:** Project root `/DEVELOPMENT.md`

**Content Structure:**

```markdown
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
````

### Verify Installation

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 8+)
npm --version

# List installed packages
npm list --depth=0
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

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev:server
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

- [README.md](../README.md) - Project overview
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Production deployment
- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) - Tech decisions
- [API.md](../docs/API.md) - API endpoints

---

**Next:** See [DEPLOYMENT.md](../DEPLOYMENT.md) for production deployment steps.

````

### Part 3: Create DEPLOYMENT.md

**Location:** Project root `/DEPLOYMENT.md`

**Content Structure:**

```markdown
# Deployment Guide

Complete guide for deploying word-unscrambler to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Docker Testing](#local-docker-testing)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Health Checks & Monitoring](#health-checks--monitoring)
6. [Rollback Procedures](#rollback-procedures)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker installed and running
- Docker Compose (usually comes with Docker)
- Production domain and SSL certificate (if using HTTPS)
- GitHub Secrets configured for CI/CD

## Local Docker Testing

### Build Docker Image

```bash
docker build -t word-unscrambler:latest .
````

### Run with Docker Compose

```bash
docker-compose up -d
```

### Verify Application

```bash
# Check container status
docker ps | grep word-unscrambler

# Test API
curl http://localhost:3000/unscrambler/v1/words?letters=abc

# Open frontend
open http://localhost:3000

# View logs
docker logs word-unscrambler

# Stop container
docker-compose down
```

## Production Deployment

### Option 1: Docker Registry (Recommended)

1. **Build and tag image:**

   ```bash
   docker build -t your-registry/word-unscrambler:v1.0.0 .
   ```

2. **Push to registry:**

   ```bash
   docker push your-registry/word-unscrambler:v1.0.0
   ```

3. **Deploy to production:**
   ```bash
   docker run \
     --name word-unscrambler \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e CORS_ORIGIN=https://yourdomain.com \
     your-registry/word-unscrambler:v1.0.0
   ```

### Option 2: Kubernetes (Advanced)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: word-unscrambler
spec:
  containers:
    - name: word-unscrambler
      image: your-registry/word-unscrambler:latest
      ports:
        - containerPort: 3000
      env:
        - name: NODE_ENV
          value: 'production'
        - name: CORS_ORIGIN
          value: 'https://yourdomain.com'
```

### Option 3: Heroku / Cloud Platform

```bash
# Deploy using platform-specific instructions
# Usually involves:
# 1. Push to Heroku Git remote
# 2. Set environment variables via UI or CLI
# 3. Platform builds and deploys automatically
```

## Environment Configuration

### Required Variables (Production)

```env
NODE_ENV=production
PORT=3000
WORD_LIST_PATH=./packages/server/data/words.txt
CORS_ORIGIN=https://yourdomain.com
REACT_APP_API_URL=https://api.yourdomain.com
```

### Set Variables

**Via Docker:**

```bash
docker run \
  -e NODE_ENV=production \
  -e CORS_ORIGIN=https://yourdomain.com \
  word-unscrambler:latest
```

**Via docker-compose.yml:**

```yaml
services:
  word-unscrambler:
    environment:
      NODE_ENV: production
      CORS_ORIGIN: https://yourdomain.com
```

**Via GitHub Secrets (CI/CD):**

1. Go to repository Settings → Secrets
2. Add secrets:
   - `BACKEND_NODE_ENV`: production
   - `BACKEND_CORS_ORIGIN`: https://yourdomain.com
   - `FRONTEND_API_URL`: https://api.yourdomain.com

## Health Checks & Monitoring

### Built-in Health Check

Docker compose includes HTTP health check:

```bash
curl http://localhost:3000
```

Should return HTML (frontend page).

### Monitor Logs

```bash
docker logs -f word-unscrambler
```

Watch for:

- `[INFO] Dictionary loaded` - Dictionary ready
- `[INFO] Server running on port` - Server started
- `[FATAL]` - Critical errors (server will exit)

### Performance Monitoring

**API Response Time:**

```bash
time curl http://localhost:3000/unscrambler/v1/words?letters=abc
```

Should be < 1 second.

**Dictionary Load Time:**

Check logs on startup:

```
[INFO] Dictionary loaded in 892ms
```

Should be < 5 seconds.

### CPU/Memory Monitoring

```bash
docker stats word-unscrambler
```

Expected:

- CPU: < 5% at rest
- Memory: ~100-200MB

## Rollback Procedures

### Docker Rollback

```bash
# If new deployment has issues, use previous image
docker-compose down
docker run \
  -d \
  --name word-unscrambler \
  your-registry/word-unscrambler:v1.0.0  # Previous version
```

### Git Rollback

```bash
# If deployment code is bad, roll back commits
git revert <bad-commit-hash>
git push
# Re-deploy from main branch
```

### Database Rollback

N/A - This app doesn't use a database. No data to restore.

## Scaling

### Horizontal Scaling

For high traffic, run multiple instances behind load balancer:

```yaml
version: '3.8'
services:
  word-unscrambler-1:
    image: word-unscrambler:latest
    port: 3001:3000

  word-unscrambler-2:
    image: word-unscrambler:latest
    port: 3002:3000

  load-balancer:
    image: nginx:latest
    ports:
      - '3000:80'
    # Configure to round-robin to instances
```

### Vertical Scaling

For memory/CPU bottlenecks, increase container resources:

```bash
docker run \
  --memory=512m \
  --cpus=2 \
  word-unscrambler:latest
```

## Troubleshooting

### Container Won't Start

**Check logs:**

```bash
docker logs word-unscrambler
```

**Common issues:**

- Dictionary file missing: Rebuild image
- Wrong environment variables: Check docker-compose.yml
- Port already in use: Change port mapping

### 404 Error When Accessing App

**Cause:** Frontend not being served by Express

**Fix:** Verify in `packages/server/src/app.ts`:

```typescript
app.use(express.static(path.join(__dirname, '../client/dist')));
```

### CORS Errors in Browser

**Cause:** `CORS_ORIGIN` environment variable doesn't match frontend origin

**Fix:** Set correct origin:

```bash
CORS_ORIGIN=https://yourdomain.com
```

### API Returns Empty Results for All Inputs

**Cause:** Dictionary file not loaded properly

**Check:**

```bash
# Verify file exists in container
docker exec word-unscrambler ls -la /app/packages/server/data/

# Check logs
docker logs word-unscrambler | grep -i dictionary
```

## Monitoring & Alerts

### Log Aggregation

Collect Docker logs to centralized service:

```bash
docker logs word-unscrambler | tee /var/log/word-unscrambler.log
```

### Performance Metrics

Track over time:

- API response times (target: < 1s)
- Dictionary load time (target: < 5s)
- Error rate (target: < 0.1%)

### Alerts to Set Up

- Container exits unexpectedly
- Memory usage > 500MB
- API response time > 5 seconds
- Health check fails

---

**Next:** See [DEVELOPMENT.md](DEVELOPMENT.md) for local development setup.

````

### Part 4: Create/Verify API.md

**Location:** `docs/API.md`

```markdown
# API Documentation

REST API endpoint for word lookup.

## Overview

Single endpoint for querying word combinations from input letters.

## Endpoint

### GET /unscrambler/v1/words

Find all valid English words that can be formed from input letters.

### Request

````

GET /unscrambler/v1/words?letters={letters}

````

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| letters | string | Yes | 3-10 letters (a-z, case-insensitive), supports ? wildcard |

### Response

#### Success (200 OK)

```json
{
  "words": ["abc", "bac", "cab"]
}
````

**Schema:**

```typescript
{
  words: string[]  // Array of matching words, sorted alphabetically
}
```

#### Error (400 Bad Request)

```json
{
  "error": "LENGTH",
  "message": "Supplied text must be 3–10 characters in length."
}
```

or

```json
{
  "error": "INVALID_CHAR",
  "message": "Supplied text may only include letters (upper or lower case) and question marks."
}
```

### Examples

#### Example 1: Simple Lookup

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words?letters=abc"
```

**Response (200):**

```json
{
  "words": ["abc", "bac", "cab"]
}
```

#### Example 2: Wildcard Lookup

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words?letters=h?llo"
```

**Response (200):**

```json
{
  "words": ["hello", "hullo"]
}
```

#### Example 3: No Results

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words?letters=xyz"
```

**Response (200):**

```json
{
  "words": []
}
```

#### Example 4: Invalid Length

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words?letters=ab"
```

**Response (400):**

```json
{
  "error": "LENGTH",
  "message": "Supplied text must be 3–10 characters in length."
}
```

#### Example 5: Invalid Characters

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words?letters=abc@123"
```

**Response (400):**

```json
{
  "error": "INVALID_CHAR",
  "message": "Supplied text may only include letters (upper or lower case) and question marks."
}
```

## Performance

- **Typical Response Time:** < 1 second
- **Maximum Response Time:** < 10 seconds
- **P99 Response Time:** < 5 seconds

## Rate Limiting

No rate limiting (MVP version). For production, consider implementing:

```typescript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/unscrambler/', limiter);
```

## CORS

CORS is configured per environment:

**Development:**

```
CORS_ORIGIN: http://localhost:5173
```

**Production:**

```
CORS_ORIGIN: https://yourdomain.com
```

## Error Codes

| Error        | Status | Meaning                                  |
| ------------ | ------ | ---------------------------------------- |
| LENGTH       | 400    | Input not 3–10 characters                |
| INVALID_CHAR | 400    | Contains characters other than a-z and ? |
| SERVER_ERROR | 500    | Internal server error                    |

---

See [openapi.yaml](../packages/server/openapi.yaml) for OpenAPI 3.1
specification.

````

### Part 5: Verify/Create openapi.yaml

**Location:** `packages/server/openapi.yaml`

Verify this file exists with complete specification. If not, create it:

```yaml
openapi: 3.1.0
info:
  title: Word Unscrambler API
  description: API for finding valid English words from input letters
  version: 1.0.0
  contact:
    name: Support
    url: https://github.com/yourrepo/word-unscrambler

servers:
  - url: http://localhost:3000
    description: Local development
  - url: https://api.yourdomain.com
    description: Production

paths:
  /unscrambler/v1/words:
    get:
      summary: Find words from letters
      description: Returns all valid English words that can be formed from input letters
      operationId: findWords
      parameters:
        - name: letters
          in: query
          required: true
          schema:
            type: string
            minLength: 3
            maxLength: 10
            pattern: '^[a-zA-Z?]+$'
          description: Letters to search (3-10 chars, a-z, case-insensitive, ? wildcard)
          example: abc
      responses:
        '200':
          description: Words found (or empty array if none)
          content:
            application/json:
              schema:
                type: object
                properties:
                  words:
                    type: array
                    items:
                      type: string
                    description: Matching words, sorted alphabetically
                    example: ["abc", "bac", "cab"]
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    enum: [LENGTH, INVALID_CHAR]
                  message:
                    type: string
                examples:
                  LengthError:
                    value:
                      error: LENGTH
                      message: "Supplied text must be 3–10 characters in length."
                  InvalidCharError:
                    value:
                      error: INVALID_CHAR
                      message: "Supplied text may only include letters (upper or lower case) and question marks."
        '500':
          description: Server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                  message:
                    type: string
````

---

## Testing Checklist (Before Completing)

- [ ] README.md created with overview, quick start, tech stack
- [ ] README.md includes all major sections (features, usage, stack, docs links)
- [ ] DEVELOPMENT.md created with setup, workflow, testing, git guidelines
- [ ] DEVELOPMENT.md includes workspace structure diagram
- [ ] DEPLOYMENT.md created with production deployment steps
- [ ] DEPLOYMENT.md includes environment config, health checks, rollback
- [ ] API.md created with endpoint documentation and examples
- [ ] openapi.yaml exists at packages/server/openapi.yaml
- [ ] All markdown links are correct (no dead links)
- [ ] All referenced files exist (PERFORMANCE_BASELINE.md, etc.)
- [ ] Documentation is clear to someone unfamiliar with project
- [ ] No TODOs or placeholder text in documentation
- [ ] Code examples are accurate and tested
- [ ] Estimated time (5-minute setup in README) is realistic
- [ ] All commands in docs are copy-pasteable
- [ ] No hardcoded URLs (uses example.com or yourdomain.com)
- [ ] Documentation consistent in tone and style
- [ ] Troubleshooting sections address common issues
- [ ] All docs linked from main navigation (README.md)

---

## Git & Commit Guidelines

### Commit Message

```
docs(deployment): write deployment and development documentation

- Create README.md with project overview, quick start (5 min), tech stack
- Create DEVELOPMENT.md with local setup, workflow, testing, git guidelines
- Create DEPLOYMENT.md with production deployment, env config, rollback
- Create API.md documenting /unscrambler/v1/words endpoint with examples
- Verify openapi.yaml exists and is complete
- Document troubleshooting for common issues
- Link all docs from README for navigation
- All examples tested and copy-pasteable
- No hardcoded secrets or internal URLs

Complete documentation enables new developers and operators to work independently.

Closes #5-3
```

### Files to Commit

```
NEW:
- README.md
- DEVELOPMENT.md
- DEPLOYMENT.md
- docs/API.md
- docs/ARCHITECTURE.md (if creating new, or verify existing)
- packages/server/openapi.yaml (if creating new, or verify existing)

VERIFIED:
- PERFORMANCE_BASELINE.md (should already exist from 4-5)
```

### Branch Name

```
docs/5-3-deployment-documentation
```

---

## Success Criteria Summary

When Story 5.3 is DONE:

1. ✅ README.md created with full project overview
2. ✅ README includes quick start (< 5 minutes)
3. ✅ README includes tech stack and features
4. ✅ README links to other documentation
5. ✅ DEVELOPMENT.md created with complete setup guide
6. ✅ DEVELOPMENT.md includes workspace structure
7. ✅ DEVELOPMENT.md includes development workflow
8. ✅ DEVELOPMENT.md includes testing instructions
9. ✅ DEVELOPMENT.md includes git workflow
10. ✅ DEPLOYMENT.md created with production steps
11. ✅ DEPLOYMENT.md includes environment configuration
12. ✅ DEPLOYMENT.md includes health checks
13. ✅ DEPLOYMENT.md includes rollback procedures
14. ✅ DEPLOYMENT.md includes troubleshooting
15. ✅ API.md created with endpoint documentation
16. ✅ API.md includes request/response examples
17. ✅ openapi.yaml exists and is complete
18. ✅ All links in documentation are correct
19. ✅ No placeholder text or TODOs
20. ✅ Documentation is clear and complete
21. ✅ Estimated setup time is accurate
22. ✅ All code examples are tested
23. ✅ No hardcoded secrets or internal URLs
24. ✅ Commit with proper message and branch name
25. ✅ Ready for Story 5-4 (MVP release)

---

## Story Dependencies & Flow

**Depends On:**

- Stories 5-1 & 5-2 (Docker and environment setup) ✅

**Blocks:**

- Story 5-4 (MVP release)

**Epic 5 Progression:**

```
5-1: Dockerfile & docker-compose ✅
5-2: Environment configuration ✅
  ↓
5-3: Deployment documentation ← YOU ARE HERE
  ↓
5-4: MVP release & production readiness
```

---

## Next Steps for Dev Agent

1. Create README.md at project root
2. Create DEVELOPMENT.md at project root
3. Create DEPLOYMENT.md at project root
4. Create docs/API.md
5. Verify docs/ARCHITECTURE.md exists
6. Verify packages/server/openapi.yaml exists
7. Test all links in markdown files
8. Verify all code examples are accurate
9. Create docs/ directory if it doesn't exist
10. Ensure all files are readable and well-formatted
11. Check for dead links or missing references
12. Verify tone and style consistency
13. Commit with proper message and branch name
14. Verify all acceptance criteria met

---

**Development Complete When:** README.md, DEVELOPMENT.md, DEPLOYMENT.md, and
API.md created with complete, accurate documentation; all links verified; no
placeholder text; ready for MVP release in Story 5-4.

---

## Story Metadata

**Created:** 2026-04-20  
**Status:** ready-for-dev  
**Epic:** 5 - Deployment & Documentation  
**Story Number:** 3 of 4  
**Estimated Complexity:** Medium (writing and organizing documentation)  
**Dependencies:** Stories 5-1 & 5-2 complete  
**Next Story:** 5-4-mvp-release-production-ready  
**Ready for Implementation:** ✅ YES

---

## Dev Agent Record

### Implementation Summary

**Completed:** 2026-04-21

All documentation files have been successfully created to enable new developers
and operators to work with the word-unscrambler project independently.

### Files Created

1. **README.md** (project root)
   - Project overview with features and tech stack
   - 5-minute quick start guide
   - Usage examples and documentation links
   - Performance and accessibility highlights

2. **DEVELOPMENT.md** (project root)
   - Complete local setup instructions
   - Monorepo workspace structure explanation
   - Development workflow and commands
   - Testing strategy and examples
   - Troubleshooting section with common issues
   - Git workflow and branching guidelines

3. **DEPLOYMENT.md** (project root)
   - Local Docker testing instructions
   - Production deployment options (Docker, Kubernetes, Cloud)
   - Environment configuration for all deployment scenarios
   - Health checks and monitoring guidance
   - Rollback procedures and scaling considerations
   - Comprehensive troubleshooting section

4. **docs/API.md**
   - REST API endpoint documentation
   - Request/response examples with error handling
   - Real-world usage examples (simple, wildcard, no results, errors)
   - Performance targets and CORS configuration
   - Error code reference

5. **docs/ARCHITECTURE.md**
   - System architecture diagram
   - Technology choice rationale
   - Component architecture and data flow
   - Data models and interfaces
   - Performance design decisions
   - Security architecture and validation
   - Testing strategy and coverage
   - Deployment architecture options
   - Scaling and future enhancement considerations

### Validation Completed

✅ All documentation files created with comprehensive content ✅ All markdown
links verified as correct ✅ No TODOs or placeholder text in any files ✅ Code
examples are accurate and copy-pasteable ✅ Setup time estimate (5 minutes) is
realistic ✅ Troubleshooting sections address common issues ✅ All files linked
from README.md navigation ✅ Documentation clear and accessible to unfamiliar
developers ✅ Tone and style consistent across all documents ✅ openapi.yaml
verified to exist (4251 bytes) ✅ PERFORMANCE_BASELINE.md already exists ✅ No
hardcoded secrets or internal URLs ✅ All acceptance criteria satisfied

### Acceptance Criteria Verification

✅ AC5.3.1: README.md created with project overview, quick start, tech stack ✅
AC5.3.2: DEVELOPMENT.md created with local setup, workspace structure, workflow
✅ AC5.3.3: DEPLOYMENT.md created with production deployment, env config, health
checks ✅ AC5.3.4: ARCHITECTURE.md created explaining technology choices ✅
AC5.3.5: API.md created documenting REST API endpoint with examples ✅ AC5.3.6:
openapi.yaml verified exists at packages/server/openapi.yaml ✅ AC5.3.7: All
documentation links are correct and verified ✅ AC5.3.8: Documentation includes
setup time estimates and troubleshooting ✅ AC5.3.9: No dead links or missing
references ✅ AC5.3.10: Documentation is clear to developers unfamiliar with
project

### File List

**NEW FILES:**

- README.md (4,945 bytes)
- DEVELOPMENT.md (9,222 bytes)
- DEPLOYMENT.md (6,323 bytes)
- docs/API.md (3,160 bytes)
- docs/ARCHITECTURE.md (10,631 bytes)

**MODIFIED FILES:** None (only new files created)

**VERIFIED FILES:**

- packages/server/openapi.yaml (4,251 bytes)
- PERFORMANCE_BASELINE.md (9,181 bytes, already existed)

### Change Log

- Created comprehensive README.md with project overview and 5-minute quick start
- Created DEVELOPMENT.md with complete local setup and development workflow
- Created DEPLOYMENT.md with production deployment guide and troubleshooting
- Created docs/API.md with REST API endpoint documentation
- Created docs/ARCHITECTURE.md with technology decisions and architecture
- All documentation cross-referenced and linked from README.md
- No TODOs or placeholder text
- Ready for Story 5-4 (MVP release)

---

## Review Findings (Code Review: 2026-04-21)

**Summary:** 10 patch items (documentation improvements), 1 deferred
(pre-existing CI/CD setup)

### Patch Items (Documentation Clarity & Completeness)

- [x] [Review][Patch] Link path consistency — ⊘ Skipped (paths already correct;
      no changes needed) [docs/ARCHITECTURE.md, docs/API.md, DEVELOPMENT.md]
- [x] [Review][Patch] README loses architectural overview — Added early
      reference to ARCHITECTURE.md to guide readers seeking technical detail
      [README.md:21-24]
- [x] [Review][Patch] "5-minute setup" claim needs caveat — Added note about
      network speed dependency on `npm install` time [README.md:25-27]
- [x] [Review][Patch] Windows troubleshooting gap — Added PowerShell equivalent
      for port conflict detection (netstat + taskkill) [DEVELOPMENT.md:414-430]
- [x] [Review][Patch] Docker examples use placeholder registry — Replaced
      `your-registry` with `<your-registry>` and added concrete example
      [DEPLOYMENT.md:59-81]
- [x] [Review][Patch] API.md examples incomplete — Added Example 6: missing
      required parameter with 400 response [docs/API.md:147-165]
- [x] [Review][Patch] Troubleshooting format inconsistent — Standardized to
      Problem/Solution format in DEPLOYMENT.md [DEPLOYMENT.md:290-320]
- [x] [Review][Patch] ARCHITECTURE.md future enhancements confusing — Created
      "Current Capabilities" section for wildcard; moved regex to future
      [docs/ARCHITECTURE.md:317-325]
- [x] [Review][Patch] Node.js version management tools omitted — Added section
      on nvm, fnm, volta for multiple Node versions [DEVELOPMENT.md:18-24]
- [x] [Review][Patch] Path assumptions not clarified — Added note that npm
      commands must run from project root [DEVELOPMENT.md:15-17]

### Deferred Items (Pre-existing, Not Caused by This Change)

- [x] [Review][Defer] GitHub Secrets env var names unvalidated — DEPLOYMENT.md
      references GitHub Secrets but doesn't verify against CI/CD config
      (pre-existing CI/CD setup issue) [DEPLOYMENT.md:160-166] — deferred,
      pre-existing
