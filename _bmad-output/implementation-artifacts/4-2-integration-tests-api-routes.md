---
storyId: '4.2'
storyKey: '4-2-integration-tests-api-routes'
epic: 4
epicTitle: 'Testing & Quality Assurance'
title: 'Write Integration Tests for API Routes (Supertest)'
created: '2026-04-19'
lastUpdated: '2026-04-19'
completionStatus: 'ready-for-dev'
contextSource: 'Epic 4.2 + Project Context + Stories 2.1-2.4 + Git History'
devReadyDate: '2026-04-19'
---

# Story 4.2: Write Integration Tests for API Routes

## Story Overview

**Epic:** 4 - Testing & Quality Assurance  
**Story ID:** 4.2  
**Depends On:** Stories 2.1, 2.2, 2.3, 2.4 (all API routes must exist); Story
4.1 (unit test patterns established)  
**Blocks:** Story 4.3 (E2E tests depend on API working)  
**Completion:** 30% of test pyramid (integration tests)

**User Story:**

> As a **test engineer**, I want to create integration tests for the backend API
> using Supertest, so that API behavior is verified end-to-end (validation,
> dictionary lookup, error handling).

---

## Acceptance Criteria

✅ **AC4.2.1:** Integration tests file at
`packages/server/src/routes/__tests__/words.test.ts`

✅ **AC4.2.2:** Tests verify valid input scenarios:

- Valid input (abc) returns 200 with words array
- Empty results (xyz) return 200 with empty array (not error)
- Sorting: words returned are alphabetically sorted
- Filtering: only 3-10 letter words returned

✅ **AC4.2.3:** Tests verify invalid input scenarios:

- Input too short (ab) returns 400 with LENGTH error
- Input too long (abcdefghijk) returns 400 with LENGTH error
- Non-alphabetic input (ab@cd) returns 400 with INVALID_CHAR error
- Missing letters parameter returns 400

✅ **AC4.2.4:** Tests verify wildcard support:

- Wildcard input (h?llo) returns 200 with matching words
- Multiple wildcards (h??lo) returns 200
- Only wildcards (???) returns 200

✅ **AC4.2.5:** Tests verify response format:

- Success: { "words": [...] } with 200 status
- Error: { "error": "MESSAGE" } with 400/500 status

✅ **AC4.2.6:** Tests use Supertest to make actual HTTP requests (not mocked)

✅ **AC4.2.7:** Coverage for routes >= 80%

✅ **AC4.2.8:** All tests pass: `npm run test -w packages/server` returns exit
code 0

---

## Developer Context & Critical Guardrails

### Project State

**Backend API Complete (Stories 2.1-2.4):**

- ✅ Story 2.1: Express app with middleware, CORS, error handling
- ✅ Story 2.2: DictionaryService with word lookup and wildcard
- ✅ Story 2.3: Input validation (validateLetters function)
- ✅ Story 2.4: GET /unscrambler/v1/words endpoint

**Epic 4 Progress:**

- ✅ Story 4.1: React component unit tests (60% of pyramid)
- ⏳ Story 4.2 (THIS): API integration tests (30% of pyramid)
- ⚪ Story 4.3: E2E tests with Playwright (10% of pyramid)

**Testing Pyramid:**

```
      /\
     /  \  ← E2E (10%) Story 4.3
    /────\
   /      \  ← Integration (30%) Story 4.2 ← YOU ARE HERE
  /────────\
 /          \ ← Unit (60%) Story 4.1
/____________\
```

### File Structure

```
packages/server/
├── src/
│   ├── routes/
│   │   ├── words.ts                      (Story 2.4 - DONE)
│   │   ├── index.ts                      (Story 2.1 - DONE)
│   │   └── __tests__/
│   │       └── words.test.ts             ← NEW/UPDATE (THIS STORY)
│   ├── services/
│   │   └── dictionary.ts                 (Story 2.2 - DONE)
│   ├── validators/
│   │   └── letters.ts                    (Story 2.3 - DONE)
│   ├── app.ts                            (Story 2.1 - DONE)
│   └── index.ts                          (Story 2.1 - DONE)
├── data/
│   └── words.txt                         (Dictionary file - ~1000 words)
├── __tests__/
│   └── routes/
│       └── words.test.ts                 ← INTEGRATION TESTS
└── vitest.config.ts                      (Story 1.4 - DONE)
```

### API Under Test

**Endpoint:** `GET /unscrambler/v1/words?letters={letters}`

**Request:**

```
GET /unscrambler/v1/words?letters=abc HTTP/1.1
```

**Success Response (200):**

```json
{
  "words": ["abc", "bac", "cab"]
}
```

**Error Response (400):**

```json
{
  "error": "Supplied text must be 3-10 characters in length."
}
```

**Error Response (500):**

```json
{
  "error": "Server error. Please try again later."
}
```

### Integration vs Unit Testing

**Unit Testing (Story 4.1):**

- Test components in isolation
- Mock dependencies
- Fast, focused, many tests
- Example: SearchForm accepts input

**Integration Testing (Story 4.2 - THIS):**

- Test multiple components together
- Make actual HTTP requests
- Test full request/response cycle
- Example: API endpoint validates input AND calls dictionary

**Why Both Matter:**

- Unit tests catch component bugs quickly
- Integration tests verify components work together
- Together they provide confidence in entire feature

---

## Architecture Compliance

### From project-context.md

✅ **Testing Strategy (Test Pyramid):**

- 60% Unit (Story 4.1) ✅
- 30% Integration (Story 4.2 - THIS)
- 10% E2E (Story 4.3)

✅ **Testing Framework:**

- Vitest 1.0+ for test runner
- Supertest for HTTP request testing
- Already configured in Story 1.4

✅ **Coverage Requirements:**

- Minimum 70% overall
- Minimum 80% for modified files

✅ **Test Organization:**

- Integration tests in `__tests__/routes/` directory
- File naming: `{route-name}.test.ts`
- Run with `npm run test -w packages/server`

---

## Test Cases & Implementation

### File: `packages/server/src/routes/__tests__/words.test.ts`

**Test Framework Setup:**

```typescript
import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import app from '../../app';
import { DictionaryService } from '../../services/dictionary';
import path from 'path';

const WORDS_FILE = path.resolve(__dirname, '../../../data/words.txt');

beforeEach(() => {
  // Reset and reinitialize dictionary before each test
  DictionaryService.reset();
  DictionaryService.initialize(WORDS_FILE);
});
```

**Test Groups & Cases:**

### Group 1: Valid Input (AC4.2.2)

```typescript
describe('GET /unscrambler/v1/words - Valid Input', () => {
  // AC4.2.2.a: Valid input returns 200 with words array
  test('returns 200 with words array for valid input (abc)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=abc');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('words');
    expect(Array.isArray(res.body.words)).toBe(true);
    expect(res.body.words.length).toBeGreaterThan(0);
  });

  // AC4.2.2.b: Empty results return 200 with empty array (not error)
  test('returns 200 with empty array when no words match (xyz)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=xyz');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('words');
    expect(res.body.words).toEqual([]);
    expect(res.body).not.toHaveProperty('error');
  });

  // AC4.2.2.c: Sorting - words returned alphabetically sorted
  test('returns words sorted alphabetically', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=abc');
    expect(res.status).toBe(200);
    const sorted = [...res.body.words].sort();
    expect(res.body.words).toEqual(sorted);
  });

  // AC4.2.2.d: Filtering - only 3-10 letter words returned
  test('returns only words 3-10 characters long', async () => {
    const res = await request(app).get(
      '/unscrambler/v1/words?letters=abcdefghij'
    );
    expect(res.status).toBe(200);
    res.body.words.forEach((word: string) => {
      expect(word.length).toBeGreaterThanOrEqual(3);
      expect(word.length).toBeLessThanOrEqual(10);
    });
  });

  // Additional: Multiple valid inputs
  test('returns correct words for different valid inputs', async () => {
    const inputs = ['abc', 'eat', 'cat'];
    for (const letters of inputs) {
      const res = await request(app).get(
        `/unscrambler/v1/words?letters=${letters}`
      );
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    }
  });
});
```

### Group 2: Invalid Input (AC4.2.3)

```typescript
describe('GET /unscrambler/v1/words - Invalid Input', () => {
  // AC4.2.3.a: Too short returns 400
  test('returns 400 for input too short (< 3 chars)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=ab');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).not.toHaveProperty('words');
  });

  // AC4.2.3.b: Too long returns 400
  test('returns 400 for input too long (> 10 chars)', async () => {
    const res = await request(app).get(
      '/unscrambler/v1/words?letters=abcdefghijk'
    );
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('3-10');
  });

  // AC4.2.3.c: Non-alphabetic (except ?) returns 400
  test('returns 400 for non-alphabetic input (ab@cd)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=ab@cd');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // AC4.2.3.d: Missing parameter returns 400
  test('returns 400 for missing letters parameter', async () => {
    const res = await request(app).get('/unscrambler/v1/words');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // Additional: Numbers in input
  test('returns 400 for numbers in input (abc123)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=abc123');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // Additional: Special characters
  test('returns 400 for special characters (abc!@#)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=abc!@%');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
```

### Group 3: Wildcard Support (AC4.2.4)

```typescript
describe('GET /unscrambler/v1/words - Wildcard Support', () => {
  // AC4.2.4.a: Single wildcard returns 200
  test('accepts single wildcard (h?llo)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=h?llo');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.words)).toBe(true);
  });

  // AC4.2.4.b: Multiple wildcards return 200
  test('accepts multiple wildcards (h??lo)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=h??lo');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.words)).toBe(true);
  });

  // AC4.2.4.c: Only wildcards return 200
  test('accepts input with only wildcards (???)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=???');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.words)).toBe(true);
  });

  // Additional: Wildcard at different positions
  test('wildcard at start (?bc) returns 200', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=?bc');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.words)).toBe(true);
  });

  test('wildcard at end (ab?) returns 200', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=ab?');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.words)).toBe(true);
  });

  // Additional: Wildcard with invalid length still fails
  test('wildcard with invalid total length (?) returns 400', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=?');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
```

### Group 4: Response Format (AC4.2.5)

```typescript
describe('GET /unscrambler/v1/words - Response Format', () => {
  // AC4.2.5.a: Success has "words", no "error"
  test('success response has "words" property and no "error" property', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=abc');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('words');
    expect(res.body).not.toHaveProperty('error');
  });

  // AC4.2.5.b: Error has "error", no "words"
  test('error response has "error" property and no "words" property', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=ab');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).not.toHaveProperty('words');
  });

  // Additional: Verify words array is always array (not object)
  test('words property is always an array', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=abc');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.words)).toBe(true);
  });

  // Additional: Verify error is always string
  test('error property is always a string', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=ab');
    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error.length).toBeGreaterThan(0);
  });
});
```

### Group 5: Case Insensitivity

```typescript
describe('GET /unscrambler/v1/words - Case Insensitivity', () => {
  test('accepts uppercase input (ABC)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=ABC');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.words)).toBe(true);
  });

  test('accepts mixed case input (AbC)', async () => {
    const res = await request(app).get('/unscrambler/v1/words?letters=AbC');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.words)).toBe(true);
  });

  test('lowercase and uppercase return same results', async () => {
    const resLower = await request(app).get(
      '/unscrambler/v1/words?letters=abc'
    );
    const resUpper = await request(app).get(
      '/unscrambler/v1/words?letters=ABC'
    );
    expect(resLower.body.words).toEqual(resUpper.body.words);
  });
});
```

### Group 6: Performance

```typescript
describe('GET /unscrambler/v1/words - Performance', () => {
  test('responds within 10 seconds for typical input', async () => {
    const start = Date.now();
    const res = await request(app).get('/unscrambler/v1/words?letters=abc');
    const elapsed = Date.now() - start;
    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(10000); // 10 seconds
  });

  test('responds within 1 second for typical input', async () => {
    const start = Date.now();
    const res = await request(app).get('/unscrambler/v1/words?letters=abc');
    const elapsed = Date.now() - start;
    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(1000); // 1 second (typical)
  });
});
```

---

## Test Quality Standards

### Supertest Best Practices

✅ **Good (Integration testing):**

```typescript
// Make real HTTP request through app
const res = await request(app).get('/unscrambler/v1/words?letters=abc');
expect(res.status).toBe(200);
```

❌ **Bad (Unit testing, belongs in Story 4.1):**

```typescript
// Mock the route handler
vi.mock('./words', () => ({...}))
expect(mockHandler).toHaveBeenCalled();
```

### Test Organization

- **One file:** `words.test.ts` (one route endpoint)
- **Grouped by behavior:** Valid input, Invalid input, Wildcard, Response
  format, etc.
- **Clear test names:** Describe what is tested, not how
- **Setup/Teardown:** Initialize dictionary before each test

### Dictionary Setup

```typescript
beforeEach(() => {
  DictionaryService.reset();
  DictionaryService.initialize(WORDS_FILE);
});
```

**Why:**

- Ensures consistent dictionary state for each test
- Tests don't affect each other
- Dictionary always loaded fresh

---

## Previous Story Learnings (Stories 2.1-2.4, 4.1)

### From Story 4.1 (Unit Testing Pattern)

**What We Learned:**

- Semantic assertions (toHaveProperty, toContain)
- Test grouping (describe blocks)
- Setup/Teardown (beforeEach, afterEach)

**Applied Here:**

- Use describe() for grouping tests by scenario
- Use semantic expect() assertions
- Initialize app state before each test

### From Stories 2.1-2.4 (API Implementation)

**What Exists:**

- Express app with routes mounted
- DictionaryService ready for use
- Input validation via validateLetters()
- Error handling middleware

**Test This:**

- Request/response cycle (Supertest makes real HTTP requests)
- Status codes (200 for success, 400 for validation error, 500 for server error)
- Response format (words array or error message)

### Pattern Consistency

**Unit Tests (Story 4.1):**

- Query by semantic selectors
- Test component behavior
- Mock callbacks

**Integration Tests (Story 4.2 - THIS):**

- Make real HTTP requests
- Test full request/response cycle
- Initialize shared resources (dictionary)

---

## Git & Commit Guidelines

### Commit Message Format

```
test(api): add integration tests for /unscrambler/v1/words endpoint

- Add comprehensive integration tests using Supertest
- Test valid input scenarios: 200 status, correct response format
- Test invalid input scenarios: 400 status, appropriate error messages
- Test wildcard support: single, multiple, and wildcard-only inputs
- Test response format consistency: words vs error properties
- Test case insensitivity: uppercase, lowercase, mixed case
- Test performance: typical < 1s, max < 10s
- Add 27 test cases covering all acceptance criteria
- All tests pass: npm run test -w packages/server
- Coverage: 85%+ for routes

Closes #4-2
```

### Files to Commit

- `packages/server/src/routes/__tests__/words.test.ts` (NEW or UPDATED)

### Branch Name

```
test/4-2-integration-tests-api
```

---

## Success Criteria Summary

When Story 4.2 is DONE:

1. ✅ words.test.ts created/updated with all test cases
2. ✅ 27+ test cases written (6+ in each group)
3. ✅ Valid input tests (4): 200 status, words array, sorting, filtering
4. ✅ Invalid input tests (6): length errors, non-alphabetic, missing param
5. ✅ Wildcard tests (5): single, multiple, wildcard-only
6. ✅ Response format tests (4): success/error shape consistency
7. ✅ Case insensitivity tests (3): uppercase, lowercase, mixed
8. ✅ Performance tests (2): typical and max response time
9. ✅ All tests pass: `npm run test -w packages/server` exits 0
10. ✅ Coverage >= 80% for routes
11. ✅ Dictionary initialized before each test
12. ✅ No TypeScript errors: `npm run type-check -w packages/server`
13. ✅ ESLint passes: `npm run lint -w packages/server`
14. ✅ No new dependencies added
15. ✅ Ready for code review and Story 4.3

---

## Story Completion Tracking

**Status:** ready-for-dev  
**Created:** 2026-04-19  
**Previous Story:** 4.1 (React unit tests - Epic 4 starts)  
**Next Story:** 4.3 (E2E tests with Playwright)

---

## Dev Agent Record

### Ready for Implementation

This story file provides complete integration testing context:

- ✅ Test file location and naming
- ✅ Supertest framework setup and patterns
- ✅ 27+ test cases across 6 groups
- ✅ Dictionary initialization pattern
- ✅ Request/response assertion patterns
- ✅ Expected status codes and response shapes
- ✅ Coverage targets (≥ 80%)
- ✅ Performance baselines (< 1s typical, < 10s max)
- ✅ Previous story patterns to follow

### Files to Create/Update

- [ ] `packages/server/src/routes/__tests__/words.test.ts` (NEW or MAJOR UPDATE)

### Files to Reference (Already Exist)

- `packages/server/src/routes/words.ts` — Endpoint being tested
- `packages/server/src/services/dictionary.ts` — Dictionary service
- `packages/server/src/validators/letters.ts` — Input validation
- `packages/server/src/app.ts` — Express app
- `packages/server/data/words.txt` — Dictionary file

### Implementation Notes

- Use Supertest to make real HTTP requests to app
- Initialize DictionaryService before each test (beforeEach)
- Test 27+ scenarios across 6 groups
- Assert on response status codes, body properties, and content
- No mocking of Express handlers (this is integration testing)
- Mock only DictionaryService if needed for edge cases
- All tests must pass before story is complete

---

## Dependencies & External Libraries

### Required (Already Installed from Story 1.4)

- **Vitest 1.0+** (test runner)
- **Supertest** (HTTP request testing)
- **Express** (application being tested)

### No New Dependencies

✅ All required testing libraries already configured.

---

## Related Stories & Dependencies

**Depends On:**

- Story 2.1 (Express app setup)
- Story 2.2 (DictionaryService)
- Story 2.3 (Input validation)
- Story 2.4 (GET /words endpoint)
- Story 1.4 (Testing infrastructure - Vitest setup)
- Story 4.1 (Unit test patterns)

**Blocks:**

- Story 4.3 (E2E tests depend on API working correctly)

**Part of Pyramid:**

- Story 4.1: Unit tests (60%)
- Story 4.2: Integration tests (30%) ← YOU ARE HERE
- Story 4.3: E2E tests (10%)

---

## Testing Checklist (Before Completing)

- [ ] words.test.ts created/updated with all test cases
- [ ] All 27+ tests pass: `npm run test -w packages/server` returns 0
- [ ] Coverage report shows >= 80% for routes
- [ ] No TypeScript errors: `npm run type-check -w packages/server` returns 0
- [ ] ESLint passes: `npm run lint -w packages/server` returns 0
- [ ] DictionaryService initialized before each test
- [ ] Tests grouped by behavior (describe blocks)
- [ ] All assertions use semantic matchers
- [ ] Commit message follows format
- [ ] Branch name follows naming convention

---

## Critical Notes

### Integration vs Unit

This is INTEGRATION testing:

- ✅ Use real HTTP requests (Supertest)
- ✅ Test end-to-end request/response
- ✅ Initialize real services (DictionaryService)
- ❌ Don't mock Express handlers
- ❌ Don't test DictionaryService internals (done in unit tests)

### Supertest Pattern

```typescript
// Import app and supertest
import request from 'supertest';
import app from '../../app';

// Make HTTP request
const res = await request(app).get('/unscrambler/v1/words?letters=abc');

// Assert on HTTP properties
expect(res.status).toBe(200);
expect(res.body).toHaveProperty('words');
```

### Dictionary Initialization

```typescript
beforeEach(() => {
  // Reset dictionary to ensure clean state
  DictionaryService.reset();
  // Reinitialize with test data
  DictionaryService.initialize(WORDS_FILE);
});
```

---

## Common Pitfalls to Avoid

❌ **DON'T:**

- Mock the Express route handler (unit test, not integration)
- Test DictionaryService internals (done in unit tests)
- Forget to initialize dictionary in beforeEach
- Use hardcoded file paths (use path.resolve)
- Test multiple endpoints in one test
- Skip performance tests

✅ **DO:**

- Make real HTTP requests through app
- Test request/response cycle
- Initialize services before each test
- Use relative paths with path.resolve
- One scenario per test
- Verify response status codes AND body content

---

## Next Steps for Dev Agent

1. Create/update words.test.ts with all test groups
2. Implement 27+ test cases (6 groups: valid, invalid, wildcard, format, case,
   perf)
3. Initialize DictionaryService in beforeEach
4. Run `npm run test -w packages/server` to verify all pass
5. Check coverage: `npm run test -w packages/server -- --coverage`
6. Verify TypeScript: `npm run type-check -w packages/server`
7. Verify ESLint: `npm run lint -w packages/server`
8. Commit with proper message
9. Mark story as `in-progress` in sprint-status.yaml

---

**Development Complete When:** All 27+ tests pass, coverage >= 80%, no
TypeScript errors, ESLint clean, ready for code review and Story 4.3.

---
