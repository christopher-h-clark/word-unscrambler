---
project_name: word-unscrambler
user_name: Chris
date: 2026-04-16
sections_completed: [technology_stack, language_specific_rules, framework_specific_rules, code_quality_and_style, development_workflow, critical_dont_miss_rules]
existing_patterns_found: 0
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Frontend Stack
- React 18+ (currently 18.2+ recommended)
- TypeScript 5.0+ (strict mode required)
- Vite 5+ (build tool - frontend only, no Node polyfills)
- Target ES2020+ 
- Target browsers: Chrome/Edge 90+, Firefox 88+, Safari 14+
- Bundle size constraint: Keep frontend bundle <100KB gzipped (no dictionary)

### Backend Stack
- Node.js 18+ (LTS recommended)
- Express 4.18+ (REST API server)
- TypeScript 5.0+ (strict mode required)
- ts-node or tsx for development
- File-based dictionary: Wiktionary word list loaded at startup

### Shared Architecture
- Single Node.js server can serve both frontend (Vite build) and backend API
- Frontend makes HTTP requests to `/unscrambler/v1/words?letters=abc`
- Backend runs on configurable port (default 3000)
- Supports independent deployment: frontend to CDN, backend to separate server

### API Specification
- **Endpoint**: `GET /unscrambler/v1/words?letters={letters}`
- **Response**: `{ words: string[] }` (array of valid words, 3+ letters only)
- **Backend validates input**: letters parameter must be alphabetic only

### Testing
- **Frontend**: Vitest 1.0+ (component & unit tests)
- **Backend**: Vitest 1.0+ (API unit tests) + Supertest (HTTP integration tests)
- **E2E**: Playwright 1.40+ (full stack integration tests across browsers)
  - Must test word lookup flow end-to-end
  - Must verify API response matches displayed results

### Build & Deployment
- Frontend: `vite build` → produces static assets
- Backend: `tsc` → compiles TypeScript to JavaScript
- Development: Vite dev server (frontend) + `tsx` or `ts-node` (backend)
- Production: Serve frontend static files from Express, API on same origin

### Dictionary Management
- Word list stored as file (CSV, JSON, or newline-delimited text)
- Loaded once on server startup into memory (trie or Set structure)
- Must be efficiently searchable (trie recommended for prefix matching)
- File path configurable via environment variable

### Dependency Selection Rules
- **Frontend deps**: Keep lightweight, no build-time polyfills needed
- **Backend deps**: Only production-critical deps in package.json
- All dependencies must have TypeScript definitions or @types packages
- Word-list parsing must be efficient (avoid regex if possible)
- Use exact versions in package.json, not ranges
- Audit with `npm audit` before adding

### Development Workflow
- Full stack dev from root: `npm run dev` (concurrently runs both packages via `concurrently` or similar tool)
- Frontend-only from root: `npm run dev:client` (runs `packages/client` dev server)
- Backend-only from root: `npm run dev:server` (runs `packages/server` dev server)
- Package-specific: `npm run dev -w packages/client` or `cd packages/client && npm run dev`

---

## Language-Specific Rules

### TypeScript Configuration
- **Strict mode required**: `"strict": true` in tsconfig.json (both frontend and backend)
- **Module resolution**: Use `moduleResolution: "bundler"` for Vite compatibility
- **Frontend target**: ES2020 (supports all current browsers)
- **Backend target**: ES2020 (Node.js 18+)
- **Imports must be explicit**: Avoid wildcard imports (`import *`), import only what you use

### Type Safety Requirements
- No `any` types without explicit `// @ts-expect-error` comment and justification
- All function parameters must be typed (no implicit `any`)
- All React components must have explicit return types or use `React.FC<Props>`
- API responses must be typed with interfaces/types before use

### Naming Conventions
- **Files**: kebab-case for components (`word-input.tsx`), camelCase for utilities (`wordValidator.ts`)
- **React Components**: PascalCase (`WordInput`, `SearchResults`)
- **Functions/Variables**: camelCase (`validateWord`, `fetchWords`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_WORD_LENGTH`, `API_BASE_URL`)
- **Private/Internal**: Prefix with `_` (`_internalHelper`)

### Import/Export Patterns
- Use ES6 `import/export` syntax, not CommonJS
- Group imports: React/third-party, then local modules, then types
- Export types and interfaces, not just implementations
- Backend routes: `export default router` for Express router instances

### Async/Await Patterns
- **Prefer async/await** over `.then()` chains
- Always handle errors with try/catch or `.catch()` fallback
- Never fire-and-forget promises without handling rejection
- API calls must have timeout handling (especially fetch)

### Error Handling
- **Frontend**: Use Error boundaries for React component errors
- **API calls**: Wrap in try/catch, return user-friendly error messages
- **Backend**: All endpoints must have error handlers; return status codes (400, 500, etc.)
- **Validation errors**: Return 400 with error message describing what failed

### Null Safety
- Check for null/undefined before accessing properties
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- React: Null checks before rendering (`{word && <div>{word}</div>}`)

---

## Framework-Specific Rules

**Reference:** See root `api-specification.md` or monorepo docs for complete API contract, error codes, and CORS configuration.

### Project Structure (Monorepo)

**Root directory:**
```
word-unscrambler/
  package.json              # Root monorepo config (workspaces: ["packages/client", "packages/server"])
  tsconfig.base.json        # Shared TypeScript config
  .gitignore
  .eslintrc.json
  .prettierrc.json
  README.md
  CHANGELOG.md
  
  packages/
    client/                 # Frontend (React + Vite)
      src/
        components/
          WordInput.tsx           # Input form (controlled, onChange handler)
          SearchResults.tsx       # Display results list
          ErrorBoundary.tsx       # Error boundary wrapper
        hooks/
          useWordFetcher.ts       # Custom hook: fetch words from API
        types/
          index.ts                # TypeScript types (API response, etc.)
        services/
          api.ts                  # Fetch wrapper with timeout, error handling
        __tests__/
          components/             # Vitest component tests
          hooks/                  # Vitest hook tests
          services/               # Vitest API tests
        App.tsx
        main.tsx
      vite.config.ts
      tsconfig.json
      package.json
      index.html
      
    server/                 # Backend (Express + Node.js)
      src/
        routes/
          words.ts              # GET /api/words endpoint, validation
        services/
          dictionary.ts         # Dictionary load, word lookup logic
        types/
          index.ts              # TypeScript interfaces
        __tests__/
          routes/               # Supertest route tests
          services/             # Vitest service tests
        middleware/
          errorHandler.ts       # Centralized error handling
        app.ts                  # Express setup (CORS, middleware, routes)
        index.ts                # Server startup, dictionary init
      data/
        words.txt               # Wiktionary words (3-7 letters, one per line)
      tsconfig.json
      package.json
```

**Monorepo setup:**
- Root `package.json` defines workspaces: `["packages/client", "packages/server"]`
- Each workspace has its own `package.json` with dependencies
- Shared TypeScript config at root (`tsconfig.base.json`) referenced by each workspace
- Scripts at root (`npm run dev`, `npm run test`) manage both packages via workspace commands
- Single git repository for entire monorepo

### React Component Patterns
- **Functional components only**: No class components
- **Hooks only**: `useState`, `useEffect`, `useContext` as needed
- **Custom hooks for API**: Extract data fetching into `useWordFetcher` hook
- **Props as TypeScript interfaces**: Define `interface WordInputProps { onSubmit: (letters: string) => void }` at top of file
- **Conditional rendering**: Use ternary or logical AND; keep JSX clean
- **Key prop required**: Always use stable keys in lists (never array indices)
- **Error display**: If API returns error, display sanitized message instead of results (no stack traces)
- **Empty state handling**: If no words found, display: "No words match your letters. Try different letters!"
- **Loading state**: Show spinner while fetching; clear on response or error

### State Management
- **Local state first**: Use `useState` within component, lift only when needed
- **Context only if global**: Use Context only for state needed by 3+ components (not fetching state)
- **Avoid prop drilling**: Max 2 levels deep between components; use custom hook or Context beyond
- **No Redux**: App is simple enough without it

### Performance Rules
- **Bundle size**: Keep React bundle <100KB gzipped (excludes Wiktionary dictionary file)
- **API response time**: Expect < 10 seconds max per request; timeout at 10s
- **Debounce input**: Debounce user input 300ms before calling API (prevent spam)
- **Lazy loading**: Not needed for this simple app; can add later if needed

### API Integration (Frontend)

**Rules:**
- **See `api-specification.md`** for full endpoint documentation, request/response schemas, and error codes
- **Fetch with timeout**: Wrap all fetch calls in timeout handler (10 second max)
- **Always handle errors**: Catch errors and display user-friendly message
- **Loading state**: Show spinner while fetching; hide on response/error
- **Error message**: Display only sanitized messages; never expose stack traces or file paths
- **Types first**: Define TypeScript type for API response before using it

**Fetch wrapper example:**
```typescript
// services/api.ts
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const TIMEOUT_MS = 10000;

type WordsResponse = { words: string[] };

export async function fetchWords(letters: string): Promise<string[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(
      `${API_BASE}/api/words?letters=${encodeURIComponent(letters)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    const data: WordsResponse = await response.json();
    return data.words;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw new Error(error instanceof Error ? error.message : 'Network error');
  }
}
```

### Express Server Patterns

**Rules:**
- **Route organization**: Group routes by feature (e.g., `routes/words.ts` for `/api/words`)
- **Middleware order**: CORS → validation → routes → error handler (last)
- **TypeScript handlers**: Type all handler signatures: `(req: Request, res: Response): void`
- **Error handling**: All routes must wrap in try/catch; return proper HTTP status codes
- **Input validation**: Validate `letters` param before dictionary lookup; return 400 if invalid
- **Sanitized errors**: Never return stack traces; use generic messages only
- **CORS**: See `api-specification.md` for development/production CORS configuration

**Route handler pattern:**
```typescript
// routes/words.ts
import { Router, Request, Response } from 'express';
import { DictionaryService } from '../services/dictionary';

const router = Router();

router.get('/unscrambler/v1/words', (req: Request, res: Response): void => {
  try {
    const { letters } = req.query;

    // Input validation
    if (!letters || typeof letters !== 'string') {
      res.status(400).json({ error: 'Invalid input: letters parameter required' });
      return;
    }

    if (letters.length < 3 || letters.length > 10) {
      res.status(400).json({ error: 'Invalid input: letters must be 3-10 characters' });
      return;
    }

    // Letters + ? only
    if (!/^[a-z?]+$/i.test(letters)) {
      res.status(400).json({ error: 'Invalid input: letters must be alphanumeric and ? only' });
      return;
    }

    // Dictionary lookup
    const words = DictionaryService.findWords(letters.toLowerCase());
    res.status(200).json({ words });
  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

export default router;
```

### Dictionary Loading

**Rules:**
- **Startup phase**: Load dictionary file once when server starts (synchronously or async)
- **Source**: Wiktionary English 3-7 letter words; initial corpus ~1,000 words
- **Format**: Newline-delimited text (one word per line) or JSON array
- **Data structure**: Use Set or Trie for fast O(1) or O(k) lookup
- **Error handling**: If file missing/corrupted, fail loudly at startup; don't start with empty dictionary
- **Environment variable**: `WORD_LIST_PATH` for production path override
- **File location**: `packages/server/data/words.txt`

**Dictionary service pattern:**
```typescript
// services/dictionary.ts
import fs from 'fs';

export class DictionaryService {
  private static words: Set<string>;

  static initialize(filePath: string): void {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const wordList = content.split('\n').filter(w => w.trim().length > 0);
      this.words = new Set(wordList.map(w => w.toLowerCase()));
      console.log(`Dictionary loaded: ${wordList.length} words`);
    } catch (error) {
      throw new Error(`Failed to load dictionary from ${filePath}`);
    }
  }

  static findWords(letters: string): string[] {
    if (!this.words) throw new Error('Dictionary not initialized');
    // Return words that can be formed from input letters
    return Array.from(this.words)
      .filter(word => this.canFormWord(word, letters))
      .sort();
  }

  private static canFormWord(word: string, letters: string): boolean {
    const letterMap = new Map<string, number>();
    // Count available letters (? is wildcard, counts as 1)
    for (const letter of letters) {
      letterMap.set(letter, (letterMap.get(letter) || 0) + 1);
    }
    // Check if word can be formed
    for (const letter of word) {
      if (!letterMap.has(letter) && !letterMap.has('?')) return false;
      letterMap.set(letter, (letterMap.get(letter) || 0) - 1);
    }
    return true;
  }
}

// In app startup (index.ts):
try {
  const dictPath = process.env.WORD_LIST_PATH || './data/words.txt';
  DictionaryService.initialize(dictPath);
} catch (error) {
  console.error('Fatal: Could not initialize dictionary', error);
  process.exit(1);
}
```

### Security Rules (OWASP Top 10)

**Input Validation:**
- Whitelist allowed characters: letters a-z (case-insensitive) + `?` (wildcard)
- Enforce length: minimum 3, maximum 10 characters
- Reject anything else with 400 Bad Request
- No unsafe regex patterns (protect against ReDoS)

**Error Handling:**
- Sanitize all error messages; never expose stack traces, file paths, or system internals
- Log errors server-side for debugging
- Return generic messages to client: "Server error. Please try again later."

**CORS Configuration:**
- Development: Allow `http://localhost:3000` (or Vite dev server port)
- Production: Restrict to actual frontend domain via `CORS_ORIGIN` env var
- See `api-specification.md` for Express CORS middleware setup

**Dependencies & Updates:**
- Run `npm audit` before each deployment
- Keep Node.js, Express, and all packages current
- Review security advisories regularly

**HTTPS (Production):**
- All production deployments must use HTTPS
- Set security headers (future implementation):
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`

### Testing Strategy (Test Pyramid)

**Distribution:**
- **60% Unit Tests** (Vitest): Component renders, dictionary lookups, input validation
- **30% Integration Tests** (Vitest + Supertest): API contract, dictionary initialization
- **10% E2E Tests** (Playwright): User flow, cross-browser validation

**React Component Tests (Vitest + React Testing Library):**

```typescript
// __tests__/components/WordInput.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WordInput } from '../../components/WordInput';

// Mock the API
vi.mock('../../services/api');

test('displays results when API returns words', async () => {
  const { fetchWords } = await import('../../services/api');
  vi.mocked(fetchWords).mockResolvedValue(['abc', 'bac', 'cab']);

  render(<WordInput />);
  
  const input = screen.getByPlaceholderText(/enter letters/i);
  await userEvent.type(input, 'abc');
  
  await waitFor(() => {
    expect(screen.getByText('abc')).toBeInTheDocument();
  });
});

test('displays error when API fails', async () => {
  const { fetchWords } = await import('../../services/api');
  vi.mocked(fetchWords).mockRejectedValue(new Error('Server error'));

  render(<WordInput />);
  
  const input = screen.getByPlaceholderText(/enter letters/i);
  await userEvent.type(input, 'abc');
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});

test('displays "no words match" when empty array returned', async () => {
  const { fetchWords } = await import('../../services/api');
  vi.mocked(fetchWords).mockResolvedValue([]);

  render(<WordInput />);
  
  const input = screen.getByPlaceholderText(/enter letters/i);
  await userEvent.type(input, 'xyz');
  
  await waitFor(() => {
    expect(screen.getByText(/no words match/i)).toBeInTheDocument();
  });
});
```

**Express Route Tests (Supertest):**

```typescript
// __tests__/routes/words.test.ts
import request from 'supertest';
import app from '../../app';

describe('GET /unscrambler/v1/words', () => {
  test('returns 200 with words array for valid input', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=abc');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('words');
    expect(Array.isArray(res.body.words)).toBe(true);
  });

  test('returns 400 for input too short (< 3 chars)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=ab');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 for input too long (> 10 chars)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=abcdefghijk');
    expect(res.status).toBe(400);
  });

  test('returns 200 with empty array when no words match', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=xyz');
    expect(res.status).toBe(200);
    expect(res.body.words).toEqual([]);
  });

  test('returns 400 for non-alphabetic input (except ?)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=ab@cd');
    expect(res.status).toBe(400);
  });

  test('accepts wildcard (?) in input', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=h?llo');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.words)).toBe(true);
  });
});
```

**E2E Tests (Playwright):**

```typescript
// e2e/word-lookup.spec.ts
import { test, expect } from '@playwright/test';

test('happy path: user enters letters and sees results', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  const input = page.locator('input[placeholder*="letters"]');
  await input.fill('abc');
  
  await expect(page.locator('button:has-text("Find Words")')).toBeVisible();
  await page.click('button:has-text("Find Words")');
  
  await expect(page.locator('text=abc')).toBeVisible({ timeout: 10000 });
});

test('displays error for invalid input (too short)', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  const input = page.locator('input[placeholder*="letters"]');
  await input.fill('ab');
  await page.click('button:has-text("Find Words")');
  
  await expect(page.locator('text=/error|invalid/i')).toBeVisible();
});

test('displays "no words match" message for no results', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  const input = page.locator('input[placeholder*="letters"]');
  await input.fill('xyz');
  await page.click('button:has-text("Find Words")');
  
  await expect(page.locator('text=/no words match/i')).toBeVisible();
});

test('works across browsers', async ({ page, browserName }) => {
  // This test runs on all configured browsers (Chrome, Firefox, Safari)
  await page.goto('http://localhost:3000');
  await expect(page.locator('input')).toBeVisible();
  // ... rest of test
});
```

**Error Scenarios Covered:**
- Invalid input (too short/long, non-alphabetic) → 400, error message displayed
- Network timeout → User sees timeout error (timeout: 10s)
- Server error (500) → Sanitized error message displayed
- No words found → "No words match..." message (NOT an error, 200 response)
- Dictionary load fails → Server fails at startup with error

**Performance Baselines:**
- API response time: < 10 seconds per request
- Frontend render: < 1 second from response to visible results
- Bundle size: < 100KB gzipped (verified in build process)
- Dictionary load: < 5 seconds at server startup

---

## Code Quality & Style Rules

### ESLint & Prettier Configuration

**ESLint:**
- Extend `eslint:recommended` and `@typescript-eslint/recommended`
- Enable TypeScript rules for strict type checking
- Enforce `no-unused-vars`, `no-implicit-any`, `no-console` (warnings in dev, errors in production)
- Rules for React: `react/jsx-uses-react`, `react/function-component-definition`

**Prettier:**
- Print width: 100 characters
- Tab width: 2 spaces
- Single quotes: true
- Trailing comma: es5
- Semi-colons: true
- Arrow parens: always

**Pre-commit hook:** Run Prettier on staged files before commit (husky + lint-staged)

### File & Folder Organization

**React Components:**
- One component per file
- Component file name matches export name (PascalCase): `WordInput.tsx`
- Place related test file adjacent: `WordInput.tsx` + `WordInput.test.tsx`
- Props interface in same file, named `{ComponentName}Props`

**Utilities & Services:**
- Utility files: camelCase, lowercase module names: `wordValidator.ts`, `apiClient.ts`
- Services: export as named or default; prefer `export const` for clarity
- Custom hooks: `use{Name}` convention, placed in `hooks/` folder

**Test Files:**
- Unit tests: `__tests__/` folder, same structure as `src/`
- E2E tests: `e2e/` folder at project root
- Test filename: `{component}.test.ts` or `{feature}.spec.ts`

**Backend Routes:**
- Organize by feature: `routes/words.ts` for word-related endpoints
- Each route file exports Router instance: `export default router`
- Index router file combines all routes: `routes/index.ts`

### Naming Conventions

**Variables & Functions:**
- camelCase: `const fetchWords = ...`, `const isLoading = ...`
- Boolean variables: prefix with `is`, `has`, `should`: `isLoading`, `hasError`
- Private/internal: prefix with `_`: `_internalHelper`

**Constants:**
- UPPER_SNAKE_CASE: `const MAX_LETTERS = 10`, `const API_TIMEOUT = 10000`
- Exported from config file: `src/constants.ts`

**CSS Classes & IDs:**
- kebab-case: `word-list`, `search-results-container`
- BEM methodology optional but recommended for complex components

**React Components:**
- PascalCase: `WordInput`, `SearchResults`, `ErrorBoundary`
- Avoid generic names: ❌ `Container`, `Wrapper`; ✅ `SearchContainer`, `ResultsWrapper`

### Code Organization

**Component Internal Structure:**
```typescript
// 1. Imports (third-party, local, types)
import React, { useState, useEffect } from 'react';
import { fetchWords } from '../services/api';
import type { WordsResponse } from '../types';

// 2. Props interface
interface WordInputProps {
  onSubmit: (letters: string) => void;
}

// 3. Component definition
export const WordInput: React.FC<WordInputProps> = ({ onSubmit }) => {
  // 4. Hooks (useState, useEffect, custom hooks)
  const [input, setInput] = useState('');
  
  // 5. Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  // 6. Effects
  useEffect(() => {
    // cleanup if needed
  }, []);

  // 7. Render
  return <div>...</div>;
};

// 8. Export
export default WordInput;
```

**Service/Utility Structure:**
```typescript
// Imports at top
import axios from 'axios';

// Type definitions
type Result = { success: boolean; data?: any };

// Main function(s)
export async function fetchData() { ... }

// Helper functions
const parseResponse = (data: unknown): Result => { ... };

// Exports
export { parseResponse };
```

### Import/Export Standards

**Frontend:**
- Use ES6 modules: `import/export` (no CommonJS `require`)
- Group imports in order:
  1. External packages (`react`, `react-dom`)
  2. Local components (relative paths)
  3. Types/interfaces (from `../types`)
  4. Styles (if using CSS imports)

```typescript
import React, { useState } from 'react';
import type { WordsResponse } from '../types/index';
import { SearchResults } from './SearchResults';
import { useWordFetcher } from '../hooks/useWordFetcher';
```

**Backend:**
- Use ES6 `import/export` syntax (TypeScript with `module: "ESNext"`)
- Type imports: `import type { Request, Response }` to avoid circular dependencies
- Route exports: `export default router` for Express Router instances

### Comment & Documentation Standards

**No unnecessary comments.** Code should be self-explanatory. Add comments only when:
- Why a decision was made (not what the code does)
- Workarounds for bugs or framework limitations
- Complex algorithms or non-obvious logic

**Example — Good comment:**
```typescript
// Debounce API calls to avoid excessive requests while user is typing
const debouncedFetch = debounce(async (letters: string) => {
  const words = await fetchWords(letters);
}, 300);
```

**JSDoc comments (optional):**
- Use only for exported public functions/components that aren't obvious
- Keep JSDoc brief:

```typescript
/**
 * Fetch words matching the given letters.
 * @param letters - Letters to unscramble (3-10 chars)
 * @returns Promise resolving to array of matching words
 */
export async function fetchWords(letters: string): Promise<string[]> {
  // implementation
}
```

### Dead Code & Cleanup

**Before committing:**
- Remove console.log statements (except critical errors)
- Delete commented-out code (use git history if needed)
- Remove unused imports and variables
- Delete unused test files

**Never commit:**
- Debugging code (`debugger;` statements)
- Temporary workarounds without TODO comment
- Large commented-out blocks

### Lint & Format Enforcement

**Pre-commit hooks (husky):**
```bash
# .husky/pre-commit
npx lint-staged
```

**lint-staged config (package.json):**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

**CI/CD checks:**
- Run `npm run lint` in CI pipeline (fail on errors)
- Run `npm run format:check` to verify Prettier formatting
- Run `npm run type-check` to verify TypeScript compilation

### TypeScript-Specific Rules

**No implicit any:**
- All function parameters typed
- All return types explicit or inferred (not implicit)
- Enable `noImplicitAny: true` in tsconfig.json

**Type definitions:**
- Export types from `types/` folder for reuse
- Use `type` for aliases, `interface` for object shapes (or pick one style)
- Avoid `any`; use `unknown` and narrow with type guards if needed

**Error handling:**
- Type catch errors: `catch (error: unknown)`
- Check `error instanceof Error` before accessing properties

### Testing Code Standards

**Test file structure:**
```typescript
describe('WordInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays input field', () => {
    render(<WordInput onSubmit={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('calls onSubmit with input value', async () => {
    const onSubmit = vi.fn();
    render(<WordInput onSubmit={onSubmit} />);
    // ... test logic
  });
});
```

**Test naming:**
- Test names describe behavior: `test('displays error when API fails', ...)`
- Not implementation details: ❌ `test('calls fetchWords', ...)`

**Assertions:**
- Use semantic matchers: `toBeInTheDocument()`, `toHaveTextContent()`, not `toBeTruthy()`
- Test user-visible behavior, not implementation

### Bundle Size & Performance Checks

**Build script output:**
- `npm run build` should output bundle size (use Vite's built-in reporting)
- Fail build if bundle > 100KB gzipped (set as CI threshold)

**Dev performance:**
- HMR (Hot Module Replacement) must update in < 1 second
- Lint check must complete in < 10 seconds

### Accessibility Standards

**Keyboard navigation:**
- All interactive elements must be keyboard accessible (buttons, links, form inputs)
- Tab order must be logical
- Focus visible (default browser outline or custom style)

**Semantic HTML:**
- Use `<button>` for buttons (not `<div onClick>`)
- Use `<label>` associated with `<input>` (for accessibility)
- Form fields must have `aria-label` or associated label

**Contrast & Text:**
- Text contrast ratio ≥ 4.5:1 (WCAG AA standard)
- Font size ≥ 14px minimum

---

## Development Workflow Rules

### Git Branch Naming

**Format:** `{type}/{issue-id}-{short-description}` or `{type}/{short-description}` (if no issue tracker)

**Types:**
- `feature/` — New feature: `feature/WORD-123-input-validation` or `feature/case-insensitive`
- `fix/` — Bug fix: `fix/WORD-456-api-timeout` or `fix/timeout-error-handling`
- `refactor/` — Code refactoring: `refactor/simplify-dictionary-lookup`
- `test/` — Test additions: `test/e2e-coverage`
- `docs/` — Documentation: `docs/api-specification`
- `chore/` — Maintenance: `chore/update-dependencies`

**Rules:**
- Use lowercase
- Separate words with hyphens
- Short description (3-5 words max)
- No spaces or special characters
- Example: ✅ `feature/case-insensitive-search`; ❌ `Feature/word search`

**Stale branch cleanup:**
- Auto-delete merged branches (GitHub setting)
- Manually delete local branches after merge: `git branch -d feature/xyz`

### Commit Message Format

**Format:**
```
{type}({scope}): {subject}

{body}

{footer}
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

**Scope (required):** Component or system affected:
- Frontend: `ui`, `input`, `results`, `api`
- Backend: `api`, `dictionary`, `validation`
- Shared: `types`, `config`

Examples: `feat(api): add wildcard support`, `fix(ui): handle error display`

**Subject:**
- Imperative mood: "add" not "added" or "adds"
- Lowercase (except proper nouns)
- No period at end
- Max 50 characters

**Body (optional):**
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

**Example:**
```
feat(api): add wildcard support for letters parameter

Users can now use ? as a wildcard to match any single letter.
Improves search flexibility without changing API contract.

Closes #123
```

**Merge strategy:**
- Squash commits before merge (keeps history clean): `git rebase -i main`
- Final commit message should follow format above
- Never force-push to main; use squash workflow on feature branch before merge

### Pull Request Requirements

**Before creating PR:**
1. Branch must be up to date with `main`: `git rebase origin/main`
2. All tests pass locally: `npm run test` (coverage ≥ 70%)
3. Linting passes: `npm run lint` (no warnings treated as errors)
4. TypeScript strict mode: `npm run type-check` (no `any` without `// @ts-expect-error`)
5. Bundle size acceptable: `npm run build` outputs size; must be < 100KB gzipped
6. No secrets detected: `npm run secrets:check` (or manual scan)

**PR title format:**
- Same as commit message subject: `feat(api): add wildcard support`
- Concise and descriptive (max 50 chars)

**PR description template:**
```markdown
## What changed?
Brief summary of changes (1-2 sentences).

## Why?
Context: which feature or bug this addresses.

## How to test?
Step-by-step: "1. Start server. 2. Enter 'abc'. 3. Verify results appear."

## Test coverage
- Unit tests added: [count or files]
- E2E scenarios: [list any new user flows tested]
- Coverage: [before] → [after] %

## Checklist
- [ ] Tests pass locally (coverage ≥ 70%)
- [ ] No linting errors
- [ ] TypeScript strict mode passes
- [ ] Bundle size < 100KB gzipped
- [ ] No secrets in code
- [ ] Commits squashed with proper messages

## Related issues
Closes #123
```

**PR review expectations:**
- Assignee: At least one reviewer (peer review)
- Reviewer checks: code standards, security, test coverage, logic
- Author responds to all comments before re-requesting review
- All conversations must be resolved before merge
- No merge with failing CI checks
- Branch must be up to date with main at merge time (rebase if main updated)

### CI/CD Pipeline

**On every pull request (GitHub Actions):**

1. **Checkout & Install** (fail-fast)
   - Install dependencies: `npm install` or `npm ci --frozen-lockfile` (installs root + all workspaces)
   - Fail if package-lock.json doesn't match

2. **Type Check** (fail-fast, max 30s)
   - TypeScript strict mode: `npm run type-check` (all workspaces)
   - Fail on any `any` without `// @ts-expect-error` comment

3. **Linting & Formatting** (fail-fast, max 30s)
   - ESLint: `npm run lint` (all workspaces, errors only)
   - Prettier: `npm run format:check` (all workspaces)

4. **Build** (fail-fast, max 60s)
   - Frontend + Backend: `npm run build` (all workspaces)
   - Output bundle size (gzipped and uncompressed) for client
   - Fail if client bundle > 100KB gzipped
   - Warn if delta from main > 10KB

5. **Security Checks** (max 30s)
   - Dependency audit: `npm audit --audit-level=moderate` (all workspaces, fail if found)
   - Secrets scan: detect hardcoded tokens, passwords (fail if found)

6. **Unit & Integration Tests** (max 120s per suite, continue on failure)
   - Client: `npm run test -w packages/client` (Vitest)
   - Server: `npm run test -w packages/server` (Vitest + Supertest)
   - Fail if coverage < 70%
   - Fail if any test fails

7. **E2E Tests** (max 180s total, continue on failure)
   - Playwright: Chrome, Firefox, Safari (or Chrome, Firefox, Android)
   - Per-test timeout: 30s (with 2x automatic retry for flakiness)
   - Fail if any test fails after retry
   - Monitor flakiness trend (< 10% fail-on-first-run is acceptable)

**Performance gates:**
- Bundle size: < 100KB gzipped (fail)
- Bundle delta: < 10KB increase from main (warn)
- Test coverage: ≥ 70% overall, ≥ 80% for modified files (fail if not met)
- Dictionary startup: < 5s (validation in startup test)

**On merge to main:**
1. All CI checks pass
2. At least 1 approval from reviewer
3. Branch up to date with main
4. Auto-deploy to staging environment
5. Run smoke tests in staging (health check, basic word lookup)
6. Manual approval required for production deployment

**Merge failure consequences:**
- Cannot merge until all CI checks pass
- Notifications to PR author
- No bypass of failing checks

### Local Development Workflow

**Initial setup:**
```bash
git clone <repo>
cd word-unscrambler
npm install          # Installs dependencies for root and all workspaces
cp packages/client/.env.example packages/client/.env.local
cp packages/server/.env.example packages/server/.env.local
npm run dev          # Starts both frontend and backend from root
```

**npm run dev contract (from root):**
- Starts frontend dev server on `http://localhost:5173` (Vite)
- Starts backend dev server on `http://localhost:3000` (tsx --watch)
- Waits for both servers ready before returning (5s timeout)
- Prints port numbers and URLs
- Exits with error code 1 if either server fails
- HMR enabled: changes reflect in < 1 second
- Both servers restart on file save
- Uses `concurrently` or similar tool to manage both processes

**Environment variables (separate .env.local per workspace, not committed):**

**packages/client/.env.local:**
```
REACT_APP_API_URL=http://localhost:3000
```

**packages/server/.env.local:**
```
NODE_ENV=development
PORT=3000
WORD_LIST_PATH=./data/words.txt
CORS_ORIGIN=http://localhost:5173
```

**Running servers individually:**
```bash
npm run dev:client   # Vite on 5173 (from root or packages/client)
npm run dev:server   # Express on 3000 (from root or packages/server)
```

**Workspace-specific commands:**
```bash
npm run -w packages/client test    # Run client tests
npm run -w packages/server build   # Build server only
npm run lint -w packages/client    # Lint client only
```

**Before committing (local quality check from root):**
```bash
npm run type-check      # TypeScript strict check (all workspaces)
npm run lint --fix      # ESLint auto-fix (all workspaces)
npm run format          # Prettier auto-format (all workspaces)
npm run test            # All tests across all workspaces (unit + integration + E2E)
npm run build           # Verify production build succeeds (all workspaces)
```

**For workspace-specific checks:**
```bash
npm run type-check -w packages/client  # Only client types
npm run lint -w packages/server --fix  # Only server linting
```

**Dictionary management (local dev):**
- File: `packages/server/data/words.txt` (git-tracked, committed)
- Format: one word per line, lowercase
- Updates: edit file, server auto-reloads (watch mode)
- No migrations needed; changes apply on restart

### Logging & Debugging

**Frontend logging:**
- **Development**: `console.log()` permitted for debugging
- **Production**: All `console.log()` stripped by build (`NODE_ENV === 'development'` guard)
- React Error Boundaries for component errors
- Never log sensitive data
- ESLint rule `no-console` warns on commits (must be removed)

**Backend logging:**
- Format: `[LEVEL] [timestamp] message`
- Levels: ERROR (red), WARN (yellow), INFO, DEBUG
- Include request context (letters param, etc.)
- Errors to stderr; info/debug to stdout
- Never log sensitive data
- Keep lines < 200 chars

**Example backend logging:**
```typescript
try {
  const letters = req.query.letters as string;
  const words = DictionaryService.findWords(letters);
  console.log(`[INFO] Found ${words.length} words for "${letters}"`);
  res.status(200).json({ words });
} catch (error) {
  console.error(`[ERROR] Word lookup failed: ${error instanceof Error ? error.message : String(error)}`);
  res.status(500).json({ error: 'Server error. Please try again later.' });
}
```

### Deployment & Release Process

**Deployment environments:**

1. **Staging** (auto-deploy after main merge)
   - Auto-deploys when PR merges to main
   - Full CI/CD + smoke tests (health check, word lookup test)
   - Manual approval required to promote to production

2. **Production** (manual promotion from staging)
   - Requires manual approval in CI/CD
   - Deployment command: `npm run deploy:prod` (or CI/CD trigger)
   - Health check post-deploy (automated rollback if fails)
   - Rollback available: revert to previous commit and redeploy

**Release versioning:** Semantic Versioning (MAJOR.MINOR.PATCH)
- `0.1.0` — Initial alpha release
- `1.0.0` — Production ready
- `1.1.0` — New features added
- `1.1.1` — Bug fixes only

**Release checklist:**
1. All PRs merged to main and staging tests pass
2. Update root `package.json` version and `CHANGELOG.md` (monorepo)
3. Optionally update `packages/client/package.json` and `packages/server/package.json` versions
4. Create git tag: `git tag v1.1.0`
5. Push tag: `git push origin v1.1.0` (CI/CD auto-deploys)
6. Verify staging deployment succeeds
7. Manual approval to promote to production
8. Verify production health check passes
9. Announce release (optional: GitHub Release notes)

**Rollback procedure (if production breaks):**
```bash
git revert HEAD
git push origin main
# CI/CD auto-deploys reverted code to staging then production
```

**Dictionary updates (migrations):**
- File-based, no database migrations
- Update `server/data/words.txt` and commit to main
- Changes take effect on server restart (automatic on deploy)
- No data loss; history in git

### Environment Variables & Secrets Management

**Frontend (.env.local — not committed):**
Located at `packages/client/.env.local`
```
REACT_APP_API_URL=http://localhost:3000
```

**Backend (.env.local — not committed):**
Located at `packages/server/.env.local`
```
NODE_ENV=development
PORT=3000
WORD_LIST_PATH=./data/words.txt
CORS_ORIGIN=http://localhost:5173
```

**Reference files (.env.example — committed):**

**packages/client/.env.example:**
```
REACT_APP_API_URL=http://localhost:3000
```

**packages/server/.env.example:**
```
NODE_ENV=development
PORT=3000
WORD_LIST_PATH=./data/words.txt
CORS_ORIGIN=http://localhost:5173
```

**Production environment variables (GitHub Secrets or CI/hosting):**
```
NODE_ENV=production
CORS_ORIGIN=https://word-unscrambler.example.com
WORD_LIST_PATH=/app/data/words.txt
```

**Secrets management rules:**
- **Never commit `.env.local`** (add to `.gitignore`)
- Developers copy from `.env.example`: `cp .env.example .env.local`
- Secrets in production use GitHub Secrets:
  - Create in Settings → Secrets → New secret
  - Reference in CI/CD: `${{ secrets.SOME_SECRET }}`
  - Secrets never logged in output
- Rotation: change secrets quarterly or after exposure
- Pre-commit hook scans for secrets; CI/CD also scans (fail merge if found)

### Code Review Standards

**Reviewer responsibilities:**
- Verify code meets standards: linting, types correct, tests exist
- Security check: input validation, sanitized errors, no secrets
- Logic review: solves problem? Edge cases handled?
- Performance: no obvious inefficiencies, bundle impact?
- Test coverage: new code has tests (happy path + errors)
- Suggest improvements (friendly tone)
- Approve only if all checks pass

**Author responsibilities:**
- Respond to all comments within 24 hours
- Make changes or explain disagreement respectfully
- Re-request review after changes (don't assume auto re-check)
- Keep PR focused (one feature/fix per PR)
- Don't merge your own PR

**Merge criteria (all must be true):**
- All CI checks pass (type-check, lint, tests, security, coverage ≥ 70%)
- At least one approval from peer
- All review conversations resolved
- Branch up to date with main (`git rebase origin/main`)
- Commits squashed into single logical commit
- No force-push to main

---

## Critical Don't-Miss Rules

### API Contract Violations (Security & Data Integrity)

**❌ DON'T: Return raw error messages from backend**
- Bad: `res.status(500).json({ error: error.message })` (exposes stack traces, file paths)
- Good: `res.status(500).json({ error: 'Server error. Please try again later.' })`
- Risk: Information disclosure vulnerability (OWASP A01:2021)

**❌ DON'T: Accept letters param without whitelist validation**
- Bad: `const words = DictionaryService.findWords(req.query.letters)` (no validation)
- Good: Validate length (3-10), regex match `/^[a-z?]+$/i`, reject anything else with 400
- Risk: Injection attack, algorithm complexity attack, unexpected behavior

**❌ DON'T: Allow frontend to skip the API**
- Bad: Embedding dictionary in frontend build (defeats server-side validation)
- Good: API is the only source of truth; frontend always calls backend
- Risk: Client-side manipulation, cache poisoning, security bypass

**❌ DON'T: Return different response shapes for success/error**
- Bad: Success: `{ words: [...] }`, Error: `"Invalid input"` (inconsistent)
- Good: Always `{ words: [...] }` or `{ error: "..." }` with consistent status codes
- Risk: Frontend error handling breaks, type mismatches in production

### Word Validation Logic (Correctness)

**❌ DON'T: Assume case-sensitive matching**
- Bad: Comparing user input "ABC" with dictionary "abc" (case-sensitive fail)
- Good: Normalize to lowercase: `letters.toLowerCase()`
- Risk: User types capitals, gets no results (feature looks broken)

**❌ DON'T: Forget about the wildcard (?) character**
- Bad: Treating `?` as a literal letter instead of wildcard
- Good: `?` matches any single letter during lookup
- Risk: Wildcard feature broken, users confused

**❌ DON'T: Include words < 3 letters in results**
- Bad: Returning "a", "to", "is" when minimum is 3 letters
- Good: Filter results: `words.filter(w => w.length >= 3)`
- Risk: Violates API contract, breaks E2E tests, wrong answers

**❌ DON'T: Return unsorted results**
- Bad: Results: [cab, abc, bac] (random order)
- Good: Sort alphabetically: `words.sort()`
- Risk: Results look unstable, flaky E2E tests (order varies each run)

**❌ DON'T: Include words not formable from input**
- Bad: User enters "ab", results include "lab" or "cab" (has letters not in input)
- Good: Verify each word contains only input letters (Trie or Set-based lookup)
- Risk: Core feature broken, users get wrong answers

### Frontend/Backend Communication (Integration)

**❌ DON'T: Hardcode backend URL in frontend**
- Bad: `const API_URL = 'http://localhost:3000'` (hardcoded in code)
- Good: Use `process.env.REACT_APP_API_URL` from `.env.local`
- Risk: Breaks in production, different setups fail

**❌ DON'T: Forget to handle network timeout**
- Bad: `fetch(url)` without timeout (hangs forever)
- Good: Wrap in `AbortController` with 10s timeout; catch and display error
- Risk: User sees loading spinner forever; no error feedback

**❌ DON'T: Display raw API errors to user**
- Bad: Showing `error.message` directly (technical jargon)
- Good: Catch error, return user-friendly message
- Risk: User confused, poor UX, information disclosure

**❌ DON'T: Fire-and-forget promises**
- Bad: `fetchWords(input)` without await or `.catch()`
- Good: `await fetchWords(...)` with error handling
- Risk: Silent failures, unhandled rejections, memory leaks

### Dictionary Management (Data Integrity)

**❌ DON'T: Ship with empty or corrupted dictionary**
- Bad: Missing `WORD_LIST_PATH` file (silently starts with 0 words)
- Good: Verify file exists on startup; fail loudly with error
- Risk: API returns empty results for all inputs (silent corruption)

**❌ DON'T: Load dictionary on every request**
- Bad: `fs.readFileSync()` on each API call (100ms+ per request)
- Good: Load once at startup, store in memory
- Risk: Slow startup, excessive memory, violates < 10s target

**❌ DON'T: Assume dictionary file format**
- Bad: Reading lines without handling edge cases (trailing whitespace, empty lines)
- Good: Filter empty lines, trim whitespace, validate each entry
- Risk: Corruption: "abc" becomes "abc " (fails matching)

**❌ DON'T: Update dictionary without restarting server**
- Bad: Edit `words.txt`, expect API to return new words immediately
- Good: Changes take effect only after server restart (deployment process)
- Risk: Confusion about when changes go live, stale cached data

### React/Frontend Anti-Patterns

**❌ DON'T: Make API calls without loading/error states**
- Bad: `const [words, setWords] = useState([]); fetchWords().then(setWords);` (no loading/error)
- Good: Manage `loading`, `error`, and `words` states separately
- Risk: User can't tell if loading or broken, poor UX

**❌ DON'T: Update state in useEffect without dependencies**
- Bad: `useEffect(() => { setWords(...); })` (runs every render)
- Good: `useEffect(() => { setWords(...); }, [letters])` (runs only when letters change)
- Risk: Infinite loops, API spam, performance degradation

**❌ DON'T: Render thousands of words without pagination**
- Bad: `{words.map(w => <div>{w}</div>)}` with 10K words
- Good: Show first 100, add "Load more", or use virtualization
- Risk: Browser freezes, memory leak, unusable UI

**❌ DON'T: Forget Error Boundary**
- Bad: Component error crashes entire app (white screen)
- Good: Wrap with `<ErrorBoundary>` to catch and display error
- Risk: Bad UX, production incident, user can't recover

### Express/Backend Anti-Patterns

**❌ DON'T: Return HTTP 200 for errors**
- Bad: `res.json({ error: "Invalid input" })` (status 200, response.ok is true)
- Good: `res.status(400).json({ error: "Invalid input" })`
- Risk: Frontend error handling fails (checks `response.ok`)

**❌ DON'T: Skip input validation**
- Bad: `DictionaryService.findWords(req.query.letters)` (no validation)
- Good: Validate first, return 400 with clear message if invalid
- Risk: Garbage input, unexpected behavior, possible crashes

**❌ DON'T: Log sensitive data**
- Bad: `console.log(process.env.API_KEY)` (credentials in logs)
- Good: Log only safe, non-sensitive data
- Risk: Secrets exposed, security breach, compliance violation

**❌ DON'T: Use synchronous operations in handlers**
- Bad: `const data = fs.readFileSync(...)` in route handler (blocks)
- Good: Pre-load at startup; use async/await for any I/O
- Risk: Server hangs, timeout, denial of service

### Testing Anti-Patterns

**❌ DON'T: Test implementation details instead of behavior**
- Bad: `expect(mockFetch).toHaveBeenCalledWith(...)` (testing internals)
- Good: `expect(screen.getByText('abc')).toBeInTheDocument()` (testing user sees result)
- Risk: Tests break on refactoring, don't catch real bugs

**❌ DON'T: Hardcode test data**
- Bad: `expect(words).toContain('abc')` (fragile if dictionary changes)
- Good: Use test fixtures with known data; mock dictionary for unit tests
- Risk: Flaky tests, false negatives, hard to debug

**❌ DON'T: Skip E2E tests for "simple" flows**
- Bad: Assuming "user types 'abc' → sees results" works (unit tests pass)
- Good: E2E tests entire flow: input → API → results
- Risk: Integration bugs missed, real-world breakage in production

**❌ DON'T: Disable flaky tests with `skip` or `.only`**
- Bad: `.test.skip('flaky test', ...)` (test never runs)
- Good: Fix the flakiness (retry logic, better waits, fixtures)
- Risk: Skipped tests don't catch bugs, hidden failures

### TypeScript Anti-Patterns

**❌ DON'T: Use `any` without justification**
- Bad: `const result: any = fetchWords(...)`
- Good: `const result: WordsResponse = fetchWords(...)`
- Risk: Loses type safety, bugs at runtime

**❌ DON'T: Ignore TypeScript errors with `// @ts-ignore`**
- Bad: `// @ts-ignore fetchWords(invalidArg)` (suppress instead of fix)
- Good: Fix the error, or use `// @ts-expect-error <reason>` with explanation
- Risk: Type safety defeated, bugs introduced

**❌ DON'T: Accept `unknown` without type narrowing**
- Bad: `catch (error: unknown) { console.log(error.message); }` (might not have message)
- Good: `catch (error: unknown) { const msg = error instanceof Error ? error.message : String(error); }`
- Risk: Runtime error on non-Error objects

**❌ DON'T: Return different types conditionally**
- Bad: `return success ? words : null` (sometimes array, sometimes null)
- Good: `return { success: boolean, words: string[] }` (always same shape)
- Risk: Frontend type checking fails, `cannot read property of undefined`

### Performance & Bundle Anti-Patterns

**❌ DON'T: Import entire library for one function**
- Bad: `import * as lodash from 'lodash'` (100KB)
- Good: `import debounce from 'lodash/debounce'` (5KB)
- Risk: Bundle bloat, exceeds 100KB limit

**❌ DON'T: Load full Wiktionary without filtering**
- Bad: Loading all 50K+ words on startup
- Good: Load only 3-7 letter words; ~1000 initially
- Risk: Slow startup, excessive memory, violates < 5s requirement

**❌ DON'T: Make synchronous Trie/Set construction in handlers**
- Bad: Building data structure on each request
- Good: Build at startup, reuse for all requests
- Risk: Blocks requests, timeout, poor performance

### Security & Deployment Anti-Patterns

**❌ DON'T: Commit secrets (API keys, tokens, passwords)**
- Bad: `const API_KEY = "sk_live_xxx"` in code
- Good: Use environment variables; GitHub Secrets for production
- Risk: Public exposure, unauthorized access, security breach

**❌ DON'T: Deploy without running CI/CD**
- Bad: Force-push to main, skip tests, deploy directly
- Good: Merge PRs normally; CI/CD checks run; manual approval for production
- Risk: Bugs in production, data corruption, security vulnerabilities

**❌ DON'T: Assume staging == production**
- Bad: "Works in staging, shipping to production"
- Good: Run smoke tests in production post-deploy; monitor errors
- Risk: Silent failures in production, user impact

**❌ DON'T: Skip cross-browser testing**
- Bad: "Works in Chrome, should work everywhere"
- Good: E2E tests on Chrome, Firefox, Safari
- Risk: Feature broken in other browsers, user unable to use app

### Dictionary Edge Cases

**❌ DON'T: Return duplicates**
- Bad: `["abc", "abc", "bac"]` (same word twice)
- Good: Use Set to eliminate duplicates
- Risk: User sees duplicate results, looks broken

**❌ DON'T: Return words > 7 letters**
- Bad: Including 8+ letter words not in spec
- Good: Filter: `words.filter(w => w.length <= 7)`
- Risk: Violates spec, wrong results

**❌ DON'T: Forget about uppercase/lowercase**
- Already handled: normalize to lowercase before lookup
- Good: User enters "ABC", treated as "abc"
- Risk: Case sensitivity breaks feature

### Common Gotchas During Development

**Environment variables:**
- ❌ DON'T: Reference `REACT_APP_API_URL` in backend (frontend-only)
- ❌ DON'T: Reference `NODE_ENV` in frontend without build-time substitution
- ✅ DO: Frontend uses `REACT_APP_*` prefix; backend uses `*` directly

**Port conflicts:**
- ❌ DON'T: Assume port 3000/5173 is free
- ✅ DO: Use `PORT` env var; handle "address in use" gracefully

**Async/Await:**
- ❌ DON'T: Forget `await` in async function
- ❌ DON'T: Ignore promise rejection
- ✅ DO: Always await API calls, wrap in try/catch

**Git workflow:**
- ❌ DON'T: Force-push to main
- ❌ DON'T: Merge without peer approval
- ✅ DO: Use feature branches, require review, squash commits before merge
