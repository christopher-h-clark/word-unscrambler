---
storyId: '2.3'
storyKey: '2-3-input-validation-letters-parameter'
status: 'ready-for-dev'
epic: 2
epicTitle: 'Backend API Implementation'
title: 'Implement Input Validation for Letters Parameter'
created: '2026-04-18'
lastUpdated: '2026-04-18'
completionStatus: 'Context Analysis Complete'
contextSource: 'Epic 2.3 + Project Context (Validation Patterns) + API Spec'
devReadyDate: '2026-04-18'
---

# Story 2.3: Implement Input Validation for Letters Parameter

## Story Overview

**Epic:** 2 - Backend API Implementation  
**Story ID:** 2.3  
**Depends On:** Story 2.2 (Dictionary Service)

**User Story:**

> As a **backend developer**, I want to validate the letters query parameter before dictionary lookup, so that invalid input is rejected with clear error messages (no server errors).

---

## Acceptance Criteria

✅ **AC3.1:** Validate that letters parameter is present and is a string

✅ **AC3.2:** Validate length constraint: 3-10 characters (return 400 with "LENGTH" error code if violated)

✅ **AC3.3:** Validate character whitelist: only a-z, A-Z, and ? allowed (return 400 with "INVALID_CHAR" if violated)

✅ **AC3.4:** Normalize uppercase letters to lowercase for internal processing

✅ **AC3.5:** Error messages are user-friendly:

- LENGTH: "Supplied text must be 3–7 characters in length."
- INVALID_CHAR: "Supplied text may only include letters (upper or lower case) and question marks."

✅ **AC3.6:** Error responses use { "error": "MESSAGE" } format with 400 status code

✅ **AC3.7:** All validation logic is reusable and testable (extracted to utility function)

✅ **AC3.8:** Input validation completes in < 100ms for typical inputs

---

## Developer Context & Critical Guardrails

### Project State

**Epic 2 Progress:**

- ✅ Story 2.1: Express app with middleware, CORS, error handling
- ✅ Story 2.2: Dictionary Service with word lookup and wildcard support
- ⏳ Story 2.3 (THIS): Input Validation for letters parameter
- ⏪ Story 2.4: GET /unscrambler/v1/words endpoint (depends on 2.3)
- ⏪ Story 2.5: OpenAPI Specification (documents 2.4)

**What This Story Enables:**

- Safe gateway for API endpoint before expensive dictionary lookups
- Proper error handling and user-friendly messages
- Foundation for Story 2.4 (endpoint implementation)

### File Structure to Create

```
packages/server/src/
├── services/
│   ├── dictionary.ts        ← (Already created in 2.2)
│   └── (future services)
├── validators/              ← NEW FOLDER
│   ├── letters.ts           ← INPUT VALIDATION UTILITY (NEW)
│   └── __tests__/
│       └── letters.test.ts  ← VALIDATION TESTS (NEW)
├── app.ts                   ← (Created in 2.1)
├── index.ts                 ← (Updated in 2.2)
└── middleware/
    └── errorHandler.ts      ← (Created in 2.1)
```

### Validation Requirements from API Spec & Project Context

**From api-specification.md:**

```
Input: 3-10 characters; alphanumeric (a-z, A-Z) plus ? (wildcard)
Validation Rules:
- Minimum 3 characters, maximum 10 characters
- Allowed characters: letters (a-z, A-Z) and question mark (?)
- All input is treated case-insensitively
- Non-alphabetic characters (except ?) and out-of-range lengths → 400 Bad Request
```

**From project-context.md:**

```typescript
// Input validation pattern
if (!letters || typeof letters !== 'string') {
  res.status(400).json({ error: 'Invalid input: letters parameter required' });
  return;
}

if (letters.length < 3 || letters.length > 10) {
  res.status(400).json({ error: 'Invalid input: letters must be 3-10 characters' });
  return;
}

if (!/^[a-z?]+$/i.test(letters)) {
  res.status(400).json({ error: 'Invalid input: letters must be alphanumeric and ? only' });
  return;
}
```

---

## Implementation Guidance

### 1. Create packages/server/src/validators/letters.ts

**Purpose:** Reusable validation logic for letters parameter

**Type Definitions:**

```typescript
interface ValidationResult {
  valid: boolean;
  error?: string;
  normalizedLetters?: string;
}

type ValidationError = 'MISSING' | 'LENGTH' | 'INVALID_CHAR';
```

**Main Validation Function:**

```typescript
export function validateLetters(input: unknown): ValidationResult {
  // Check presence and type
  if (input === undefined || input === null || typeof input !== 'string') {
    return {
      valid: false,
      error: 'Supplied text parameter is required.',
    };
  }

  // Check length
  if (input.length < 3 || input.length > 10) {
    return {
      valid: false,
      error: 'Supplied text must be 3–10 characters in length.',
    };
  }

  // Check character whitelist (a-z, A-Z, ?)
  if (!/^[a-z?]+$/i.test(input)) {
    return {
      valid: false,
      error: 'Supplied text may only include letters (upper or lower case) and question marks.',
    };
  }

  // Success: return normalized (lowercase)
  return {
    valid: true,
    normalizedLetters: input.toLowerCase(),
  };
}
```

**Error Messages (User-Friendly):**

- Missing/wrong type: "Supplied text parameter is required."
- Too short/long: "Supplied text must be 3–10 characters in length."
- Invalid characters: "Supplied text may only include letters (upper or lower case) and question marks."

**CRITICAL Notes:**

- Return object with { valid, error?, normalizedLetters? }
- All error messages are user-facing (clear, friendly, no technical jargon)
- Normalize input to lowercase before returning (case-insensitive search)
- Regex pattern: `/^[a-z?]+$/i` (case-insensitive, letters + question mark only)

### 2. Update packages/server/src/routes/words.ts (Future Story 2.4 will use this)

**This story focuses on validation only. Story 2.4 will create the route that uses it.**

**Preview of how it will be used in 2.4:**

```typescript
import { validateLetters } from '../validators/letters';

router.get('/unscrambler/v1/words', (req: Request, res: Response): void => {
  try {
    const { letters } = req.query;

    // Use validator
    const validation = validateLetters(letters);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    // Dictionary lookup with normalized input
    const words = DictionaryService.findWords(validation.normalizedLetters!);
    res.status(200).json({ words });
  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});
```

---

## Architecture Compliance

From project-context.md:

✅ **Input Validation:**

- [ ] Whitelist allowed characters: letters a-z (case-insensitive) + ? (wildcard)
- [ ] Enforce length: minimum 3, maximum 10 characters
- [ ] Reject anything else with 400 Bad Request
- [ ] No unsafe regex patterns (using safe `/^[a-z?]+$/i`)

✅ **Error Handling:**

- [ ] Sanitize all error messages; never expose stack traces
- [ ] User-friendly messages only
- [ ] Return 400 status code for validation errors

✅ **Validation Placement:**

- [ ] Extracted to reusable utility function (testable)
- [ ] Called early in route handler (before dictionary lookup)
- [ ] Prevents expensive operations on invalid input

---

## Testing Requirements

**Unit Tests:** Create packages/server/src/validators/**tests**/letters.test.ts

**Test Cases (Vitest):**

```typescript
describe('validateLetters', () => {
  describe('missing or invalid type', () => {
    test('returns error for undefined', () => {
      const result = validateLetters(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    test('returns error for null', () => {
      const result = validateLetters(null);
      expect(result.valid).toBe(false);
    });

    test('returns error for non-string types', () => {
      expect(validateLetters(123).valid).toBe(false);
      expect(validateLetters({}).valid).toBe(false);
      expect(validateLetters([]).valid).toBe(false);
    });
  });

  describe('length validation', () => {
    test('returns error for input < 3 characters', () => {
      const result = validateLetters('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('3–10 characters');
    });

    test('returns error for input > 10 characters', () => {
      const result = validateLetters('abcdefghijk');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('3–10 characters');
    });

    test('accepts 3 character input', () => {
      expect(validateLetters('abc').valid).toBe(true);
    });

    test('accepts 10 character input', () => {
      expect(validateLetters('abcdefghij').valid).toBe(true);
    });
  });

  describe('character whitelist', () => {
    test('accepts lowercase letters', () => {
      expect(validateLetters('abc').valid).toBe(true);
    });

    test('accepts uppercase letters', () => {
      expect(validateLetters('ABC').valid).toBe(true);
    });

    test('accepts mixed case', () => {
      expect(validateLetters('AbC').valid).toBe(true);
    });

    test('accepts wildcard (?)', () => {
      expect(validateLetters('a?c').valid).toBe(true);
    });

    test('accepts wildcard only', () => {
      expect(validateLetters('???').valid).toBe(true);
    });

    test('rejects numbers', () => {
      const result = validateLetters('abc123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('letters');
    });

    test('rejects special characters (@, #, etc.)', () => {
      expect(validateLetters('ab@cd').valid).toBe(false);
      expect(validateLetters('ab-cd').valid).toBe(false);
    });

    test('rejects space', () => {
      expect(validateLetters('ab cd').valid).toBe(false);
    });
  });

  describe('normalization', () => {
    test('returns lowercase normalized input', () => {
      const result = validateLetters('ABC');
      expect(result.normalizedLetters).toBe('abc');
    });

    test('returns lowercase with wildcard', () => {
      const result = validateLetters('A?C');
      expect(result.normalizedLetters).toBe('a?c');
    });

    test('returns input as-is for valid lowercase', () => {
      const result = validateLetters('abc');
      expect(result.normalizedLetters).toBe('abc');
    });
  });

  describe('performance', () => {
    test('validates in < 100ms', () => {
      const start = performance.now();
      validateLetters('abcdefghij');
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100);
    });
  });
});
```

**Manual Testing (Before Moving to Story 2.4):**

```bash
# 1. Run unit tests
npm run test -w packages/server -- letters.test.ts

# 2. All tests should pass (10+ test cases covering all scenarios)

# 3. Test error messages are user-friendly
# Run a quick validation test to verify error messages
npm run test:watch -w packages/server
```

---

## Dependencies & Versions

**Already Installed:**

- TypeScript 5.0+ ✅
- Vitest ✅

**No additional npm packages needed** for this story.

---

## Code Quality Standards

From project-context.md:

✅ **TypeScript:**

- [ ] All function parameters typed: `input: unknown`
- [ ] Return types explicit: `: ValidationResult`
- [ ] No implicit `any`
- [ ] Interface definitions for return types

✅ **Naming:**

- [ ] camelCase: validateLetters, normalizedLetters
- [ ] Constants: LETTER_MIN_LENGTH = 3, LETTER_MAX_LENGTH = 10

✅ **Error Handling:**

- [ ] Errors returned in result object (not thrown)
- [ ] User-friendly messages only
- [ ] No technical details exposed

---

## Critical Implementation Notes

**DO:**

- ✅ Extract validation to reusable function (testable)
- ✅ Use regex `/^[a-z?]+$/i` for character whitelist
- ✅ Normalize to lowercase before returning
- ✅ Return object with { valid, error?, normalizedLetters? }
- ✅ Write comprehensive unit tests covering all paths
- ✅ Use user-friendly error messages

**DON'T:**

- ❌ Throw errors (return in result object)
- ❌ Expose regex patterns in error messages
- ❌ Validate inside route handler only (no reusability)
- ❌ Skip tests (validation is security-critical)
- ❌ Use overly technical error messages
- ❌ Modify input in place (return new normalized value)

---

## Related Stories & Dependencies

**Previous Story:** Story 2.2 (Dictionary Service)

**Next Story (2.4):** GET /unscrambler/v1/words Endpoint with Complete Logic

- Will import and use validateLetters function
- Expects validation function to exist and return proper result

**Used By:**

- Story 2.4: GET /unscrambler/v1/words endpoint (calls validateLetters)
- Story 2.5: OpenAPI Specification (documents validation rules)

---

## Git & Commit Guidelines

**Commit Message Format:**

```
feat(api): implement input validation for letters parameter

- Create validateLetters() utility function
- Validate required presence and string type
- Validate length constraint (3-10 characters)
- Validate character whitelist (a-z, A-Z, ?)
- Return normalized (lowercase) input on success
- Add comprehensive unit tests for all validation paths

Closes #2-3
```

**Files to Commit:**

- `packages/server/src/validators/letters.ts`
- `packages/server/src/validators/__tests__/letters.test.ts`

---

## Success Criteria Summary

When Story 2.3 is DONE:

1. ✅ validateLetters() function exists and is reusable
2. ✅ Validates required presence and string type
3. ✅ Validates 3-10 character length constraint
4. ✅ Validates character whitelist (letters + ?)
5. ✅ Returns normalized (lowercase) input
6. ✅ Error messages are user-friendly
7. ✅ All 10+ unit tests pass
8. ✅ TypeScript strict mode passes
9. ✅ Performance: < 100ms per validation
10. ✅ Ready for Story 2.4 (Endpoint implementation)

---

## Story Completion Tracking

**Status:** ready-for-dev  
**Created:** 2026-04-18  
**Dev Agent:** (To be assigned)  
**Review Agent:** (To be assigned)  
**Completed:** (Pending)

---

**Execution Sequence:**

1. Story 2.1 (Express app) → Dev & Code Review
2. Story 2.2 (Dictionary Service) → Dev & Code Review
3. Story 2.3 (Input Validation) → Dev & Code Review (THIS)
4. Story 2.4 (API Endpoint) → Combines 2.2 + 2.3

**Next Action:** After Story 2.2 passes code review, run `/bmad-dev-story` for Story 2.3.
