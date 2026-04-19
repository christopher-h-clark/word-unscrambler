# Contributing to Word Unscrambler

Thank you for your interest in contributing! This guide covers development
workflow, code standards, and testing expectations.

## Development Workflow

### 1. Setup

```bash
# Clone repository
git clone <repo-url>
cd word-unscrambler

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow [Code Standards](#code-standards)
- Keep commits atomic and descriptive
- Push frequently to sync with main

### 3. Test Locally

```bash
npm run test          # Run all unit/integration tests
npm run test:coverage # Verify 70% coverage threshold
npm run type-check    # TypeScript strict mode
npm run lint          # ESLint rules
npm run format:check  # Prettier format
npm run build         # Production build
```

### 4. Submit Pull Request

- Push to your feature branch
- Open PR against `main`
- Fill out [PR template](.github/pull_request_template.md)
- Ensure all CI checks pass
- Request review from @christopher-h-clark

## Code Standards

### TypeScript

- **Strict mode required** — No `any` types without explicit justification
- **Explicit return types** — All functions must declare return type
- **No unused variables** — Leading underscore allowed for intentional unused
  (`_unused`)
- **Import paths** — Use `@` alias for `src/` paths in client package

### React Components

- **Functional components only** — Exception: Error boundaries (class components
  required)
- **Custom hooks** — Extract logic into hooks, prefix with `use`
- **Props typing** — Define `Props` interface for all components
- **Composition over inheritance** — Use composition patterns

### Backend

- **Express middleware** — Middleware should be pure (no external side effects)
- **Service pattern** — Database/API logic in `services/` folder
- **Error handling** — All async operations must have try/catch or .catch()
- **Environment variables** — Use `config.ts` for centralized config

### Testing

- **Unit tests** — Test functions in isolation with mocks
- **Integration tests** — Test Express routes with real middleware/services
- **E2E tests** — Test full user workflows end-to-end
- **Coverage requirements** — Minimum 70% on statements, functions, branches,
  lines

### Linting & Formatting

- **ESLint** — `npm run lint` (must pass before commit)
- **Prettier** — `npm run format` auto-formats code
- **Pre-commit hook** — Runs lint-staged + tests automatically

## Commit Conventions

Use conventional commit format:

```
type(scope): short description (< 50 chars)

Optional body with more detail. Wrapped at 72 chars.
Include the "why" not just the "what".

Closes #123
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`

**Scope:** `client`, `server`, `ci`, `docs` (optional but recommended)

**Examples:**

```
feat(client): add ResultsDisplay component with grouping
fix(server): handle concurrent dictionary initialization
refactor(server): extract DictionaryService from app.ts
test(client): add SearchForm unit tests
docs: add troubleshooting section to README
```

## Testing Requirements

### Before Submitting PR

- [ ] `npm run test:run` passes (all unit/integration tests)
- [ ] `npm run test:coverage` ≥ 70% threshold
- [ ] `npm run test:e2e` passes (or documented skip reason)
- [ ] `npm run type-check` has no errors
- [ ] `npm run lint` has no errors
- [ ] `npm run build` succeeds with `BUNDLE_LIMIT_KB=100`

### Test Organization

- **Client tests:** `packages/client/src/**/*.test.tsx`
- **Server tests:** `packages/server/src/**/*.test.ts`
- **E2E tests:** `e2e/**/*.spec.ts`

## Environment Variables

### For Development

```bash
# Client
cp packages/client/.env.example packages/client/.env.local

# Server
cp packages/server/.env.example packages/server/.env.local
```

### CI/CD Overrides

Available environment variables for custom CI/CD behavior:

```bash
# Bundle size validation
BUNDLE_LIMIT_KB=100

# E2E testing
PLAYWRIGHT_TIMEOUT=45000
PLAYWRIGHT_BASE_URL=http://localhost:5173
```

See [Troubleshooting](README.md#troubleshooting) for common issues.

## Architecture Overview

### Frontend (React)

```
packages/client/src/
  ├── components/     # React components (functional)
  ├── hooks/          # Custom React hooks (useWordFetcher, etc.)
  ├── types/          # Shared TypeScript interfaces
  └── lib/            # Utilities (classname helpers, etc.)
```

### Backend (Express)

```
packages/server/src/
  ├── app.ts          # Express app setup
  ├── index.ts        # Server startup
  ├── config.ts       # Environment config
  ├── routes/         # API route handlers
  ├── services/       # Business logic (DictionaryService)
  ├── validators/     # Input validation
  └── __tests__/      # Test files (parallel structure)
```

### Data Flow

```
Browser → Vite (5173) → Express API (3000) → DictionaryService → words.txt
   ↓                         ↓
React Components      Route Handlers
(SearchForm)          (GET /unscrambler/v1/words)
(ResultsDisplay)      Validation, error handling
```

## Troubleshooting

See [README Troubleshooting](README.md#troubleshooting) for:

- Port conflicts
- npm ci installation failures
- E2E test timeouts
- Local vs CI test discrepancies
- Bundle size optimization

## Questions?

- **Code style:** Check ESLint rules in `eslint.config.mjs`
- **TypeScript:** See `tsconfig.json` in each package
- **Testing:** Vitest config in each package's `vitest.config.ts`
- **Build:** Check Vite config in `packages/client/vite.config.ts`

## Code Review Expectations

- Tests must pass 100% before review
- Coverage must meet 70% threshold
- No console errors or debug code
- Commit messages must be descriptive
- PR description should explain the "why"

Thank you for contributing! 🙏
