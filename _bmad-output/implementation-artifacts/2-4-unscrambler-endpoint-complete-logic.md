---
storyId: '2.4'
storyKey: '2-4-unscrambler-endpoint-complete-logic'
status: 'done'
epic: 2
epicTitle: 'Backend API Implementation'
title: 'Implement GET /unscrambler/v1/words Endpoint with Complete Logic'
created: '2026-04-18'
lastUpdated: '2026-04-20'
completionStatus: 'done'
contextSource: 'Epic 2.4 + Project Context (Route Pattern) + API Spec'
devReadyDate: '2026-04-18'
---

# Story 2.4: Implement GET /unscrambler/v1/words Endpoint with Complete Logic

## Story Overview

**Epic:** 2 - Backend API Implementation  
**Story ID:** 2.4  
**Depends On:** Story 2.2 (Dictionary Service) + Story 2.3 (Input Validation)

**User Story:**

> As a **backend developer**, I want to create the GET /unscrambler/v1/words
> endpoint that validates input and returns word results, so that the frontend
> can fetch words by making a single API call.

---

## Acceptance Criteria

✅ **AC4.1:** Endpoint: GET /unscrambler/v1/words?letters={letters}

✅ **AC4.2:** Validates letters parameter using validateLetters() function from
Story 2.3

✅ **AC4.3:** Calls DictionaryService.findWords() for dictionary lookup

✅ **AC4.4:** Returns 200 OK with response body: { "words": ["abc", "bac",
"cab"] }

✅ **AC4.5:** Words are sorted alphabetically (DictionaryService handles this)

✅ **AC4.6:** Empty results return { "words": [] } with 200 OK (not an error)

✅ **AC4.7:** Invalid input returns 400 with appropriate error message from
validateLetters()

✅ **AC4.8:** Server errors (dictionary failure, etc.) return 500 with sanitized
message

✅ **AC4.9:** Response time < 10 seconds (typical < 1 second)

✅ **AC4.10:** Endpoint mounted and accessible at /unscrambler/v1/words

---

## Developer Context & Critical Guardrails

### Project State

**Epic 2 Progress:**

- ✅ Story 2.1: Express app with middleware, CORS, error handling
- ✅ Story 2.2: Dictionary Service with word lookup and wildcard support
- ✅ Story 2.3: Input Validation for letters parameter
- ⏳ Story 2.4 (THIS): GET /unscrambler/v1/words endpoint (combines 2.2 + 2.3)
- ⏪ Story 2.5: OpenAPI Specification (documents this endpoint)

**What This Story Enables:**

- Fully functional API endpoint for frontend to call
- Frontend can now complete word lookup flows
- Foundation for E2E testing and integration

### File Structure

```
packages/server/src/
├── routes/
│   ├── index.ts             ← ROUTE AGGREGATOR (NEW or UPDATE)
│   └── words.ts             ← WORDS ENDPOINT (NEW - THIS STORY)
├── services/
│   └── dictionary.ts        ← (Created in 2.2)
├── validators/
│   └── letters.ts           ← (Created in 2.3)
├── app.ts                   ← (Created in 2.1, will mount routes)
└── index.ts                 ← (Created in 2.1, initializes everything)
```

### Exact Implementation Pattern from project-context.md

```typescript
// routes/words.ts
import { Router, Request, Response } from 'express';
import { DictionaryService } from '../services/dictionary';
import { validateLetters } from '../validators/letters';

const router = Router();

router.get('/unscrambler/v1/words', (req: Request, res: Response): void => {
  try {
    const { letters } = req.query;

    // Input validation
    const validation = validateLetters(letters);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    // Dictionary lookup
    const words = DictionaryService.findWords(validation.normalizedLetters!);
    res.status(200).json({ words });
  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

export default router;
```

---

## Implementation Guidance

### 1. Create packages/server/src/routes/words.ts

**Purpose:** Express router for word lookup endpoint

**Structure:**

**A. Imports:**

```typescript
import { Router, Request, Response } from 'express';
import { DictionaryService } from '../services/dictionary';
import { validateLetters } from '../validators/letters';
```

**B. Router Setup:**

```typescript
const router = Router();
```

**C. GET /unscrambler/v1/words Handler:**

- Extract `letters` from `req.query`
- Call `validateLetters(letters)`
- If validation fails: return 400 with error message
- If validation succeeds: call
  `DictionaryService.findWords(validation.normalizedLetters)`
- Return 200 with `{ "words": [...] }`
- Catch any errors: return 500 with sanitized message

**D. Export:**

```typescript
export default router;
```

### 2. Create or Update packages/server/src/routes/index.ts

**Purpose:** Aggregate all routes into single export

**Structure:**

```typescript
import { Router } from 'express';
import wordsRouter from './words';

const router = Router();

// Mount routes
router.use(wordsRouter);

export default router;
```

### 3. Update packages/server/src/app.ts

**Purpose:** Mount routes in Express app (likely already structured for this)

**In app.ts, after middleware, add:**

```typescript
import routes from './routes';

// ... CORS and other middleware setup ...

// Mount routes
app.use(routes);

// Error handler (must be last)
app.use(errorHandler);
```

**Route Mounting Order:**

1. CORS middleware
2. Body parser middleware
3. **Routes** ← Add routes here
4. Error handler (LAST)

---

## Architecture Compliance

From project-context.md:

✅ **Route Organization:**

- [ ] Group routes by feature: routes/words.ts for /unscrambler/v1/words
- [ ] Export Router instances: `export default router`

✅ **Middleware Order:**

- [ ] CORS → body parser → routes → error handler (correct order)

✅ **TypeScript Handlers:**

- [ ] Type signature: `(req: Request, res: Response): void`
- [ ] All imports properly typed

✅ **Error Handling:**

- [ ] All routes wrapped in try/catch
- [ ] Return proper HTTP status codes (200, 400, 500)
- [ ] Sanitized error messages (no stack traces)

✅ **API Contract:**

- [ ] Endpoint: GET /unscrambler/v1/words
- [ ] Response: { "words": [...] }
- [ ] Validation before lookup
- [ ] Error response: { "error": "MESSAGE" }

---

## Testing Requirements

**Integration Tests:** Create packages/server/src/routes/**tests**/words.test.ts

**Test Cases (Supertest + Vitest):**

```typescript
import request from 'supertest';
import app from '../../app';

describe('GET /unscrambler/v1/words', () => {
  describe('valid input', () => {
    test('returns 200 with words array for valid input', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('words');
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('returns empty array when no words match', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=xyz');
      expect(res.status).toBe(200);
      expect(res.body.words).toEqual([]);
    });

    test('returns sorted words', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.status).toBe(200);
      const sorted = [...res.body.words].sort();
      expect(res.body.words).toEqual(sorted);
    });
  });

  describe('invalid input', () => {
    test('returns 400 for missing letters parameter', async () => {
      const res = await request(app).get('/unscrambler/v1/words');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test('returns 400 for input too short (< 3 chars)', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('3–10');
    });

    test('returns 400 for input too long (> 10 chars)', async () => {
      const res = await request(app).get(
        '/unscrambler/v1/words?letters=abcdefghijk'
      );
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('3–10');
    });

    test('returns 400 for non-alphabetic input (except ?)', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab@cd');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('letters');
    });

    test('returns 400 for numbers in input', async () => {
      const res = await request(app).get(
        '/unscrambler/v1/words?letters=abc123'
      );
      expect(res.status).toBe(400);
    });
  });

  describe('wildcard support', () => {
    test('accepts wildcard (?) in input', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=h?llo');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('wildcard only (?) is valid', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=???');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });
  });

  describe('response format', () => {
    test('response always has "words" property', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.body).toHaveProperty('words');
      expect(!res.body.hasOwnProperty('error')).toBe(true);
    });

    test('error response has "error" property', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab');
      expect(res.body).toHaveProperty('error');
      expect(!res.body.hasOwnProperty('words')).toBe(true);
    });
  });

  describe('case-insensitivity', () => {
    test('accepts uppercase input', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ABC');
      expect(res.status).toBe(200);
    });

    test('accepts mixed case input', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=AbC');
      expect(res.status).toBe(200);
    });
  });

  describe('error messages', () => {
    test('error message is user-friendly, not technical', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab');
      expect(res.body.error).not.toContain('regex');
      expect(res.body.error).not.toContain('validation');
      expect(res.body.error).toContain('3–10');
    });
  });

  describe('performance', () => {
    test('responds in < 1 second for typical queries', async () => {
      const start = Date.now();
      await request(app).get('/unscrambler/v1/words?letters=abc');
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(1000);
    });
  });
});
```

**Manual Testing (Before Code Review):**

```bash
# 1. Start server
npm run dev:server

# 2. Test valid request
curl 'http://localhost:3000/unscrambler/v1/words?letters=abc'
# Expected: { "words": ["abc", "bac", "cab", ...] }

# 3. Test empty results
curl 'http://localhost:3000/unscrambler/v1/words?letters=xyz'
# Expected: { "words": [] }

# 4. Test invalid input (too short)
curl 'http://localhost:3000/unscrambler/v1/words?letters=ab'
# Expected: { "error": "Supplied text must be 3–10 characters in length." }

# 5. Test invalid characters
curl 'http://localhost:3000/unscrambler/v1/words?letters=ab@cd'
# Expected: { "error": "Supplied text may only include letters..." }

# 6. Test wildcard
curl 'http://localhost:3000/unscrambler/v1/words?letters=h?llo'
# Expected: { "words": ["hallo", "hello", ...] } (words matching pattern)

# 7. Run integration tests
npm run test -w packages/server -- words.test.ts
```

---

## Dependencies & Versions

**Already Installed:**

- Express 4.18+ ✅
- TypeScript 5.0+ ✅
- Supertest (from Epic 1) ✅

**No additional npm packages needed** for this story.

---

## Code Quality Standards

From project-context.md:

✅ **TypeScript:**

- [ ] Type signature: `(req: Request, res: Response): void`
- [ ] Return types explicit: `: void`
- [ ] No implicit `any`

✅ **Naming:**

- [ ] camelCase: wordsRouter, validateLetters
- [ ] PascalCase: Request, Response, Router

✅ **Error Handling:**

- [ ] Try/catch wraps entire route handler
- [ ] Server errors return 500 with generic message
- [ ] Validation errors return 400 with user message

---

## Critical Implementation Notes

**DO:**

- ✅ Import validateLetters and DictionaryService
- ✅ Call validateLetters first (fail fast)
- ✅ Return 400 if validation fails
- ✅ Call DictionaryService with normalized input (lowercase)
- ✅ Return 200 with { "words": [...] } on success
- ✅ Always have "words" property in success response
- ✅ Wrap in try/catch for error handling

**DON'T:**

- ❌ Skip validation (security risk)
- ❌ Return validation error messages directly (might leak implementation
  details)
- ❌ Return different response format for success vs error
- ❌ Use response.ok check without proper status codes
- ❌ Forget to normalize input before dictionary lookup
- ❌ Return stack traces or file paths in error responses

---

## Related Stories & Dependencies

**Previous Stories (Must Complete First):**

- Story 2.1: Express app foundation
- Story 2.2: Dictionary Service
- Story 2.3: Input Validation

**Next Story (2.5):** OpenAPI Specification

- Will document this endpoint
- Expects endpoint to be fully implemented and working

**Used By:**

- Frontend (Epic 3): All searches call this endpoint
- E2E tests: Verify complete user flows
- Integration tests: Validate API contract

---

## Git & Commit Guidelines

**Commit Message Format:**

```
feat(api): implement get /unscrambler/v1/words endpoint

- Create routes/words.ts with endpoint handler
- Integrate validateLetters() validation
- Call DictionaryService.findWords() for lookup
- Return properly formatted responses (200 with words, 400/500 errors)
- Add comprehensive integration tests using Supertest
- Handle all error scenarios with sanitized messages

Closes #2-4
```

**Files to Commit:**

- `packages/server/src/routes/words.ts`
- `packages/server/src/routes/index.ts` (new or updated)
- `packages/server/src/routes/__tests__/words.test.ts`
- `packages/server/src/app.ts` (updated to mount routes)

---

## Success Criteria Summary

When Story 2.4 is DONE:

1. ✅ GET /unscrambler/v1/words endpoint exists and is accessible
2. ✅ Validates input using validateLetters()
3. ✅ Performs dictionary lookup using DictionaryService
4. ✅ Returns 200 with { "words": [...] }
5. ✅ Returns 400 with error message for invalid input
6. ✅ Returns 500 with sanitized message for server errors
7. ✅ Empty results return { "words": [] } (200, not error)
8. ✅ All 15+ integration tests pass
9. ✅ Manual curl testing works for all scenarios
10. ✅ TypeScript strict mode passes
11. ✅ Response time < 1 second typical
12. ✅ Ready for Story 2.5 (OpenAPI Documentation)

---

## Dev Agent Record

### Implementation Plan

1. Create `packages/server/src/routes/words.ts` — Express router with GET
   `/unscrambler/v1/words` handler that calls `validateLetters()` then
   `DictionaryService.findWords()`.
2. Create `packages/server/src/routes/index.ts` — Route aggregator exporting a
   combined router.
3. Update `packages/server/src/app.ts` — Mount routes after body parsing
   middleware and before 404 handler.
4. Create `packages/server/src/routes/__tests__/words.test.ts` — 14 integration
   tests covering valid input, invalid input, wildcards, response format,
   case-insensitivity, error messages, and performance.

### Completion Notes

- All 14 integration tests written and passing (70 total across the server
  package — no regressions).
- TypeScript strict mode passes with no errors.
- Routes mounted in correct middleware order: CORS → body parser → routes → 404
  → error handler.
- `DictionaryService.initialize()` called in `beforeEach` in tests using real
  `words.txt` (1128 words loaded).
- Non-alphabetic error message contains "letters" (satisfies
  `toContain('letters')` assertion).

---

## File List

- `packages/server/src/routes/words.ts` (new)
- `packages/server/src/routes/index.ts` (new)
- `packages/server/src/routes/__tests__/words.test.ts` (new)
- `packages/server/src/app.ts` (modified — added routes import and
  `app.use(routes)`)

---

## Change Log

- 2026-04-19: Implemented Story 2.4 — GET /unscrambler/v1/words endpoint with
  full validation, dictionary lookup, error handling, and 14 integration tests.

---

## Review Findings

### Patch Items (Completed)

- [x] [Review][Patch] Non-null assertion lacks runtime check
      [packages/server/src/routes/words.ts:8-20] — FIXED: Added defensive
      check + contract documentation comment.

- [x] [Review][Patch] Comment numbering error [packages/server/src/app.ts:46-51]
      — FIXED: Corrected comment numbers (5→6, 6→7).

- [x] [Review][Patch] Validation error may contain undefined
      [packages/server/src/routes/words.ts:12-13] — FIXED: Added defensive check
      `validation.error || 'Invalid input.'`

- [x] [Review][Patch] Catch-all error handler masks root cause
      [packages/server/src/routes/words.ts:18-21] — FIXED: Added console.error()
      logging with error details before sanitized response.

- [x] [Review][Patch] Query parameter whitespace not stripped
      [packages/server/src/validators/letters.ts:10-28] — FIXED: Added `.trim()`
      before length check and validation.

- [x] [Review][Patch] CORS configuration documentation
      [packages/server/src/app.ts:11] — FIXED: Added comment about CORS_ORIGIN
      env var and default fallback.

- [x] [Review][Patch] validateLetters() contract undocumented
      [packages/server/src/routes/words.ts:9-11] — FIXED: Added code comment
      documenting the contract guarantee.

### Deferred Items (Pre-existing, Architectural)

- [x] [Review][Defer] Dictionary may be uninitialized on request during startup
      [HIGH] — If request arrives before DictionaryService.initialize()
      completes, returns generic 500. Requires health check endpoint and
      initialization locking. Pre-existing, not caused by this story.

- [x] [Review][Defer] DictionaryService tightly coupled as static dependency —
      No dependency injection makes unit testing difficult. Requires refactoring
      to accept service instance. Pre-existing architectural.

- [x] [Review][Defer] Dictionary search O(n) unbounded on large datasets — Full
      array scan per request. With 1000+ word datasets, performance acceptable;
      at 1M+ words, timeout risk. Requires caching layer. Pre-existing
      architectural.

- [x] [Review][Defer] No rate limiting or request throttling — Unprotected
      endpoint vulnerable to resource exhaustion. Requires express-rate-limit
      middleware or reverse proxy rate limiting. Pre-existing, not this story.

- [x] [Review][Defer] Dictionary file load path dependency — Deployment must
      include packages/server/data/words.txt; no fallback. Ensure in deployment
      checklist. Pre-existing.

- [x] [Review][Defer] Production static asset fallback swallows errors —
      sendFile() errors caught broadly, return 404. Not in endpoint code but in
      app.ts fallback. Pre-existing architectural.

- [x] [Review][Defer] Concurrent state sharing via static DictionaryService —
      Tests call reset(); production safe but fragile. Refactor to
      instance-based or immutable state. Pre-existing architectural.

---

## Story Completion Tracking

**Status:** done  
**Created:** 2026-04-18  
**Dev Agent:** Amelia (claude-sonnet-4-6)  
**Review Agent:** CR - Code Review (Amelia)  
**Completed:** 2026-04-19  
**Code Review Date:** 2026-04-19  
**Code Review Result:** APPROVED — All 10 ACs met, 7 patches applied & verified
(70/70 tests pass)

---

**Execution Sequence:**

1. Story 2.1 (Express app) → Dev & Code Review
2. Story 2.2 (Dictionary Service) → Dev & Code Review
3. Story 2.3 (Input Validation) → Dev & Code Review
4. Story 2.4 (API Endpoint) → Dev & Code Review (COMBINES 2.2 + 2.3)
5. Story 2.5 (OpenAPI Documentation) → Dev & Code Review

**Next Action:** After Story 2.3 passes code review, run `/bmad-dev-story` for
Story 2.4.
