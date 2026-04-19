---
storyId: '2.2'
storyKey: '2-2-dictionary-service-file-loading-word-lookup'
status: 'review'
epic: 2
epicTitle: 'Backend API Implementation'
title: 'Implement Dictionary Service with File Loading and Word Lookup'
created: '2026-04-18'
lastUpdated: '2026-04-18'
completionStatus: 'Context Analysis Complete'
contextSource: 'Epic 2.2 + Project Context (Dictionary Service Pattern) + Architecture'
devReadyDate: '2026-04-18'
---

# Story 2.2: Implement Dictionary Service with File Loading and Word Lookup

## Story Overview

**Epic:** 2 - Backend API Implementation  
**Story ID:** 2.2  
**Depends On:** Story 2.1 (Express app foundation)

**User Story:**

> As a **backend developer**, I want to implement a DictionaryService class that loads a word list from file and performs word lookups, so that the API can quickly return valid words matching user input.

---

## Acceptance Criteria

✅ **AC2.1:** DictionaryService class with static methods (singleton pattern)

✅ **AC2.2:** Dictionary loads from packages/server/data/words.txt on server startup

✅ **AC2.3:** File missing or corrupted → server exits with error code 1 and clear error message

✅ **AC2.4:** DictionaryService.findWords(letters) returns all valid words formable from input letters

✅ **AC2.5:** Wildcard (?) character matches any single letter during lookup

✅ **AC2.6:** Results are sorted alphabetically

✅ **AC2.7:** Results contain no duplicates

✅ **AC2.8:** Results contain only 3-10 character words

✅ **AC2.9:** Lookup completes in < 1 second for typical inputs

✅ **AC2.10:** Dictionary initialization error prevents server startup (fail-loud pattern)

---

## Developer Context & Critical Guardrails

### Project State

**Epic 2 Progress:**

- ✅ Story 2.1 COMPLETE: Express app with middleware, CORS, error handling
- ⏳ Story 2.2 (THIS): Dictionary Service implementation
- ⏪ Story 2.3: Input Validation (depends on 2.2)
- ⏪ Story 2.4: GET /unscrambler/v1/words endpoint (depends on 2.2 + 2.3)
- ⏪ Story 2.5: OpenAPI Specification (documents 2.4)

**What This Story Enables:**

- Core lookup engine for word matching
- Foundation for validation and endpoint (stories 2.3, 2.4)
- Performance baseline (< 1 second typical)

### File Structure to Create

```
packages/server/src/
├── services/
│   └── dictionary.ts        ← DICTIONARY SERVICE (NEW - THIS STORY)
├── app.ts                   ← (Already created in 2.1)
├── index.ts                 ← Will INITIALIZE DictionaryService here
├── middleware/
│   └── errorHandler.ts      ← (Already created in 2.1)
└── types/
    └── (will be used by future stories)

packages/server/data/
└── words.txt                ← INPUT FILE (must exist with word list)
```

### Critical Pattern from project-context.md

**EXACT CODE PATTERN (provided below for implementation):**

```typescript
// services/dictionary.ts
export class DictionaryService {
  private static words: Set<string>;

  static initialize(filePath: string): void {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const wordList = content.split('\n').filter((w) => w.trim().length > 0);
      this.words = new Set(wordList.map((w) => w.toLowerCase()));
      console.log(`Dictionary loaded: ${wordList.length} words`);
    } catch (error) {
      throw new Error(`Failed to load dictionary from ${filePath}`);
    }
  }

  static findWords(letters: string): string[] {
    if (!this.words) throw new Error('Dictionary not initialized');
    return Array.from(this.words)
      .filter((word) => this.canFormWord(word, letters))
      .sort();
  }

  private static canFormWord(word: string, letters: string): boolean {
    const letterMap = new Map<string, number>();
    for (const letter of letters) {
      letterMap.set(letter, (letterMap.get(letter) || 0) + 1);
    }
    for (const letter of word) {
      if (!letterMap.has(letter) && !letterMap.has('?')) return false;
      letterMap.set(letter, (letterMap.get(letter) || 0) - 1);
    }
    return true;
  }
}
```

---

## Implementation Guidance

### 1. Create packages/server/src/services/dictionary.ts

**Purpose:** Singleton service that loads and queries word dictionary in memory

**Required Imports:**

```typescript
import fs from 'fs';
```

**Key Methods:**

**A. initialize(filePath: string): void**

- Load file synchronously: `fs.readFileSync(filePath, 'utf-8')`
- Split by newlines: `content.split('\n')`
- Filter empty lines: `.filter(w => w.trim().length > 0)`
- Normalize to lowercase: `.map(w => w.toLowerCase())`
- Store in Set for O(1) lookup: `this.words = new Set(...)`
- Log success: `console.log(\`Dictionary loaded: ${wordList.length} words\`)`
- Throw error if file missing/corrupted (will be caught in index.ts)

**B. findWords(letters: string): string[]**

- Check initialization: `if (!this.words) throw new Error(...)`
- Filter words using canFormWord logic
- Sort alphabetically before returning
- Return array (empty array if no matches, NOT an error)

**C. canFormWord(word: string, letters: string): boolean**

- Count available letters in input (including wildcards)
- Check each letter of word against available letters
- Wildcard (?) counts as 1 available "match" for any letter
- Return true only if word can be formed

**Word Formation Logic Example:**

- Input: "abc", Check word: "cab"
  - Available: a:1, b:1, c:1
  - Need: c:1 ✓, a:1 ✓, b:1 ✓ → True (can form)
- Input: "abc", Check word: "cad"
  - Available: a:1, b:1, c:1
  - Need: c:1 ✓, a:1 ✓, d:1 ✗ → False (missing d)
- Input: "a?c", Check word: "abc"
  - Available: a:1, ?:1, c:1
  - Need: a:1 ✓, b:1 (use ?) ✓, c:1 ✓ → True

### 2. Update packages/server/src/index.ts

**Add DictionaryService initialization BEFORE server listen:**

```typescript
import app from './app';
import { DictionaryService } from './services/dictionary';

const PORT = parseInt(process.env.PORT || '3000', 10);

// Initialize dictionary BEFORE starting server
try {
  const dictPath = process.env.WORD_LIST_PATH || './data/words.txt';
  DictionaryService.initialize(dictPath);
} catch (error) {
  console.error('Fatal: Could not initialize dictionary', error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**CRITICAL:** Dictionary must load BEFORE server starts listening

### 3. Create/Verify packages/server/data/words.txt

**Purpose:** Word list source file

**Format:** Newline-delimited text, one word per line

```
abc
bac
cab
bad
dad
...
```

**Requirements:**

- Must contain at least 100-1000+ words for testing
- Only 3-10 letter words (validate on load)
- Lowercase preferred (service normalizes anyway)
- File must exist when server starts

**Where to Get Words:**

- Wiktionary English word list (SCOWL corpus)
- Or create a small test file for development:
  ```
  abc
  bac
  cab
  bad
  dad
  fab
  gab
  lab
  nab
  tab
  ```

---

## Architecture Compliance

From project-context.md:

✅ **Dictionary Service Pattern:**

- [ ] Static methods (singleton): DictionaryService.initialize(), .findWords()
- [ ] In-memory storage: Set<string> for O(1) lookup
- [ ] Startup initialization: Load once, reuse for all requests
- [ ] Error handling: Throw on file missing, caught in index.ts

✅ **File-Based Dictionary:**

- [ ] Path: `packages/server/data/words.txt`
- [ ] Format: Newline-delimited text
- [ ] Normalized: Lowercase on load
- [ ] Filtered: Empty lines removed
- [ ] Environment variable: `WORD_LIST_PATH` override supported

✅ **Wildcard Support:**

- [ ] `?` counts as 1 available character
- [ ] `?` matches any single letter in word
- [ ] Proper accounting in letterMap

✅ **Performance:**

- [ ] Lookup: O(n) where n = dictionary size (acceptable < 1 sec)
- [ ] Dictionary load: < 5 seconds at startup

---

## Testing Requirements

**Unit Tests:** Create packages/server/src/services/**tests**/dictionary.test.ts

**Test Cases (Vitest):**

```typescript
describe('DictionaryService', () => {
  describe('initialize', () => {
    test('loads dictionary from file', () => {
      // Create temp file, initialize, verify words loaded
    });

    test('throws error if file not found', () => {
      // Pass non-existent path, expect error throw
    });

    test('normalizes words to lowercase', () => {
      // Verify ABC→abc, aBc→abc
    });

    test('filters empty lines', () => {
      // File with blank lines, verify ignored
    });
  });

  describe('findWords', () => {
    test('returns words that can be formed', () => {
      expect(findWords('abc')).toContain('abc');
      expect(findWords('abc')).toContain('cab');
    });

    test('returns empty array when no words match', () => {
      expect(findWords('xyz')).toEqual([]);
    });

    test('supports wildcard (?) matching', () => {
      // Input: 'h?llo', should match 'hello', 'hallo', etc.
      const results = findWords('h?llo');
      expect(results.length).toBeGreaterThan(0);
    });

    test('returns only 3-10 character words', () => {
      const results = findWords('abcdefghij');
      results.forEach((word) => {
        expect(word.length).toBeGreaterThanOrEqual(3);
        expect(word.length).toBeLessThanOrEqual(10);
      });
    });

    test('returns sorted results', () => {
      const results = findWords('abc');
      const sorted = [...results].sort();
      expect(results).toEqual(sorted);
    });

    test('returns no duplicates', () => {
      const results = findWords('aaa');
      const unique = new Set(results);
      expect(results.length).toEqual(unique.size);
    });

    test('completes in < 1 second for typical inputs', () => {
      const start = performance.now();
      findWords('abc');
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(1000);
    });

    test('throws error if not initialized', () => {
      // Skip initialization, call findWords, expect error
    });
  });
});
```

**Manual Testing (Before Moving to Story 2.3):**

```bash
# 1. Create test words.txt
mkdir -p packages/server/data
cat > packages/server/data/words.txt << 'WORDS'
abc
bac
cab
bad
dad
fab
gab
lab
nab
tab
WORDS

# 2. Start server
npm run dev:server

# 3. Verify logs
# Should see: "Dictionary loaded: 10 words"

# 4. Run unit tests
npm run test -w packages/server
# All dictionary tests should pass
```

---

## Dependencies & Versions

**Already Installed:**

- Node.js fs module (built-in) ✅
- TypeScript 5.0+ ✅
- Vitest (from Epic 1) ✅

**No additional npm packages needed** for this story.

---

## Code Quality Standards

From project-context.md:

✅ **TypeScript:**

- [ ] All function parameters typed
- [ ] Return types explicit: `: void`, `: string[]`, `: boolean`
- [ ] No implicit `any`
- [ ] Strict mode enforced

✅ **Naming:**

- [ ] camelCase: findWords, canFormWord, letterMap
- [ ] Private methods: \_canFormWord (or private static)
- [ ] Constants: WORD_MIN_LENGTH = 3

✅ **Error Handling:**

- [ ] Throw descriptive errors on file load failure
- [ ] No stack traces exposed
- [ ] Error caught and logged in index.ts, process exits with code 1

---

## Critical Implementation Notes

**DO:**

- ✅ Use Set for O(1) lookup speed
- ✅ Load dictionary synchronously at startup (blocking is fine, happens once)
- ✅ Normalize to lowercase on load
- ✅ Fail loudly if dictionary missing (exit with code 1)
- ✅ Use canFormWord logic exactly as provided (wildcard handling is critical)
- ✅ Return empty array for no matches (not an error)

**DON'T:**

- ❌ Load dictionary on every request
- ❌ Use async file loading at startup (blocks boot, but acceptable for MVP)
- ❌ Include words < 3 or > 10 characters in Set
- ❌ Return duplicates in results
- ❌ Expose file paths in error messages
- ❌ Modify input letters (lowercase normalization happens in validation, not here)

---

## Related Stories & Dependencies

**Previous Story:** Story 2.1 (Express app foundation)

**Depends On:**

- Story 2.1 completed (app.ts, index.ts startup structure)
- Valid words.txt file at packages/server/data/words.txt

**Next Story (2.3):** Input Validation for Letters Parameter

- Will validate input BEFORE calling DictionaryService.findWords()
- Expects DictionaryService to exist and work

**Used By:**

- Story 2.4: GET /unscrambler/v1/words endpoint (calls DictionaryService.findWords)
- Story 2.5: OpenAPI Specification (documents DictionaryService behavior)
- Epic 3 Frontend: All search functionality depends on this

---

## Git & Commit Guidelines

**Commit Message Format:**

```
feat(api): implement dictionary service with word lookup

- Create DictionaryService singleton class
- Load word list from file at startup, fail loudly if missing
- Implement findWords() with wildcard support
- Add canFormWord() logic for letter matching
- Initialize DictionaryService in server startup
- Add unit tests for all dictionary operations

Closes #2-2
```

**Files to Commit:**

- `packages/server/src/services/dictionary.ts`
- `packages/server/src/services/__tests__/dictionary.test.ts`
- `packages/server/src/index.ts` (updated)
- `packages/server/data/words.txt` (new or updated)

---

## Success Criteria Summary

When Story 2.2 is DONE:

1. ✅ DictionaryService loads from file on startup
2. ✅ Server exits with error code 1 if file missing
3. ✅ findWords() returns correct word matches
4. ✅ Wildcard (?) support works correctly
5. ✅ Results are sorted, no duplicates
6. ✅ Results contain only 3-10 character words
7. ✅ Lookup completes in < 1 second
8. ✅ Unit tests cover all scenarios
9. ✅ TypeScript strict mode passes
10. ✅ Ready for Story 2.3 (Input Validation)

---

## Story Completion Tracking

**Status:** done  
**Created:** 2026-04-18  
**Dev Agent:** Amelia (bmad-agent-dev)  
**Review Agent:** Code Review (bmad-code-review)  
**Completed:** 2026-04-18

---

## Review Findings

**Code Review Complete:** 2026-04-18

✅ **All Acceptance Criteria Pass (AC2.1–AC2.10)**

- AC2.1: DictionaryService class with static methods (singleton pattern) ✅
- AC2.2: Dictionary loads from packages/server/data/words.txt on server startup ✅
- AC2.3: File missing or corrupted → server exits with error code 1 ✅
- AC2.4: DictionaryService.findWords(letters) returns all valid words formable ✅
- AC2.5: Wildcard (?) character matches any single letter ✅
- AC2.6: Results are sorted alphabetically ✅
- AC2.7: Results contain no duplicates ✅
- AC2.8: Results contain only 3-10 character words ✅
- AC2.9: Lookup completes in < 1 second for typical inputs ✅
- AC2.10: Dictionary initialization error prevents server startup ✅

**Review Findings:** Zero violations. Implementation fully satisfies specification.

---

**Next Action:** After Story 2.1 is complete, run `/bmad-dev-story` for Story 2.2 implementation.

---

## Tasks / Subtasks

- [x] **Task 1:** Create `packages/server/data/words.txt` with 3-10 letter word list (≥100 words)
- [x] **Task 2:** Create `packages/server/src/services/dictionary.ts` — DictionaryService singleton with `initialize()`, `findWords()`, `canFormWord()`
- [x] **Task 3:** Update `packages/server/src/index.ts` to initialize DictionaryService before server starts
- [x] **Task 4:** Create `packages/server/src/services/__tests__/dictionary.test.ts` with full test coverage

---

## Dev Agent Record

### Implementation Plan

- DictionaryService as static singleton (Set<string> for O(1) membership) with `initialize()`, `findWords()`, `canFormWord()`, and `reset()` (for test isolation)
- Words filtered to 3-10 chars on load (not at query time)
- Correct wildcard (`?`) logic: letter consumed first, wildcard only as fallback; uses actual counts not key presence
- `index.ts` initializes dictionary before `app.listen()`; on failure logs and calls `process.exit(1)`
- `reset()` method added to enable clean test isolation across `afterEach` hooks

### Debug Log

- Reference implementation's `canFormWord` used key-existence checks (`!letterMap.has(letter)`) which would not correctly detect exhausted letter counts; replaced with count-based checks
- Reference implementation decremented the letter count even when a wildcard was used; corrected to decrement wildcard count in that branch
- `catat` test confirmed letter-count accounting works correctly (needs a:2,t:2; blocked by `cat` input a:1,t:1)
- `filters words longer than 10 characters` test initially used input `'abcdefghijkl'` which doesn't contain `t` so `cat` wasn't returnable; corrected to separate `findWords('cat')` call

### Completion Notes

All 4 tasks complete. 32 tests pass (18 new in dictionary.test.ts + 14 pre-existing). Lint and TypeScript strict mode clean. AC2.1–AC2.10 all satisfied.

---

## File List

- `packages/server/data/words.txt` (new — word list, ~650+ words, 3-10 chars)
- `packages/server/src/services/dictionary.ts` (new — DictionaryService class)
- `packages/server/src/services/__tests__/dictionary.test.ts` (new — 18 unit tests)
- `packages/server/src/index.ts` (modified — DictionaryService initialization before server listen)

---

## Change Log

- 2026-04-18: Implemented Story 2.2 — DictionaryService with file loading, word lookup, wildcard support, and full unit test coverage
