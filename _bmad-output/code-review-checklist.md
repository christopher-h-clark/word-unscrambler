# Code Review Issues Checklist

**Review Date:** 2026-04-20  
**Branch:** 4-4-accessibility-audit-remediation  
**Total Issues:** 54 adversarial + 47 edge cases = **101 total findings**

---

## 🔴 CRITICAL (Blocks Merge / Security Risk)

### API & Integration

- [x] **Backend: Rate limiting missing on `/unscrambler/v1/words`**
  - Issue: Wildcard queries (e.g., `?????????`) cause high CPU; no throttling
  - File: `packages/server/src/routes/words.ts`
  - Impact: DoS vulnerability; production risk
  - Fix: Add rate limiter or query complexity check

- [x] **Frontend: API response field mismatch**
  - Issue: Backend returns `error`, hook expects `message` (line 54
    useWordFetcher.ts)
  - File: `packages/client/src/hooks/useWordFetcher.ts:54`
  - Impact: Error messages never display; fallback used instead
  - Fix: Change line 54:
    `const errorMessage = (data as { error?: string }).error ?? '...'`

- [x] **Backend: Bundle size check ignores CSS**
  - Issue: Only .js files scanned; CSS bundle not included in size limit
  - File: `scripts/check-bundle-size.js:25`
  - Impact: Could ship 60KB JS + 50KB CSS = 110KB, exceed limit undetected
  - Fix: Include .css files in size calculation

- [x] **Documentation: API error format contradictions**
  - Issue: Two different formats documented (CODE+message vs abbreviated)
  - Files: `architecture.md:299` vs `architecture.md:671`
  - Impact: Frontend/backend implementation inconsistency
  - Fix: Standardize to one format: `{ error: "CODE", message: "..." }`

---

## 🟠 HIGH (Impacts Reliability / Code Quality)

### Backend Issues

- [x] **Dictionary initialization blocks on large files**
  - Issue: Synchronous fs.readFileSync() with no timeout; blocks startup
    indefinitely
  - File: `packages/server/src/services/dictionary.ts:12`
  - Impact: Server fails to start if dictionary file > 5 seconds to load
  - Fix: Add timeout or async initialization with error handling

- [x] **Port conflict has no recovery**
  - Issue: If port 3000 in use, server exits; no retry or port increment
  - File: `packages/server/src/index.ts:27-36`
  - Impact: Fails on first attempt; developer must kill other process manually
  - Fix: Add port retry logic or use configurable port

- [x] **Query parameter coercion**
  - Issue: Multiple `letters` params in query string could be coerced
  - File: `packages/server/src/routes/words.ts:10`
  - Impact: `?letters=abc&letters=xyz` behavior undefined
  - Fix: Validate: `if (Array.isArray(letters)) { reject with 400 }`

- [x] **Defensive check is redundant**
  - Issue: Line 19 checks `normalizedLetters || ''` but validateLetters()
    guarantees it's set
  - File: `packages/server/src/routes/words.ts:19`
  - Impact: Masks broken contract; poor code clarity
  - Fix: Remove defensive check or add proper type narrowing

### Frontend Issues

- [x] **Input clears on focus (UX friction)**
  - Issue: User clicks field while editing → input clears automatically
  - File: `packages/client/src/components/SearchForm.tsx:47`
  - Impact: User loses typed text mid-edit; frustrating UX
  - Fix: Only clear on fresh focus after successful submit:
    `if (state.isLoading === false && hasSearched)`

- [x] **Mixed content warning (HTTPS)**
  - Issue: If frontend is https:// but API_URL is http://, browser blocks
    request
  - File: `packages/client/src/hooks/useWordFetcher.ts:31`
  - Impact: Request blocked; feature broken in production
  - Fix: Add check:
    `if (location.protocol === 'https:' && base.startsWith('http://')) warn()`

- [x] **ErrorBoundary doesn't log stack**
  - Issue: `console.error?.()` with optional chaining suggests uncertainty;
    never logs
  - File: `packages/client/src/components/ErrorBoundary.tsx:25`
  - Impact: Errors invisible during debugging; hard to diagnose
  - Fix: Use
    `console.error('ErrorBoundary caught:', error, errorInfo.componentStack)`

- [x] **Unbounded DOM rendering**
  - Issue: No pagination; renders all words in DOM at once
  - File: `packages/client/src/components/ResultsDisplay.tsx:45`
  - Impact: Browser freezes rendering 1000+ words
  - Fix: Add pagination or virtualization for large result sets

### CI/CD Issues

- [x] **CI uses `--legacy-peer-deps` (masks real issues)**
  - Issue: npm ci --legacy-peer-deps suppresses peer dependency warnings
  - File: `.github/workflows/ci.yml:25, 40, 56, 73, 98, 113`
  - Impact: Real incompatibilities hidden; silent failures in production
  - Fix: Identify and fix actual peer dependency conflicts, remove flag

- [x] **Coverage calculation may be incorrect**
  - Issue: Branch parsing on line 50-63 of check-coverage.js has complex nested
    logic
  - File: `scripts/check-coverage.js:50-63`
  - Impact: Coverage % miscalculated; thresholds passed/failed incorrectly
  - Fix: Test coverage script with known input; validate branch parsing logic

- [x] **Type checking not in pre-commit hook**
  - Issue: Pre-commit runs lint + tests but not `npm run type-check`
  - File: `.husky/pre-commit`
  - Impact: Type errors slip to CI instead of failing locally (slower feedback)
  - Fix: Add `npm run type-check` to pre-commit hook before commit

### Documentation Issues

- [x] **Story status conflicts**
  - Issue: Story 4-4 frontmatter says "ready-for-dev" but sprint-status.yaml
    says "done"
  - Files: `4-4-accessibility-audit-remediation.md:9` vs `sprint-status.yaml:75`
  - Impact: Conflicting source of truth; unclear if story is ready or finished
  - Fix: Update frontmatter completionStatus to "done"

- [x] **Epic 4 status mismatches stories**
  - Issue: epic-4 status is "in-progress" but all child stories (4-1, 4-2, 4-3,
    4-4) are "done"
  - File: `sprint-status.yaml:71`
  - Impact: Misleading epic status; stakeholders think epic still in progress
  - Fix: Update epic-4 status to "done"

---

## 🟡 MEDIUM (Technical Debt / Code Quality)

### Backend

- [x] **Dictionary path hardcoded fallback**
  - Issue: `path.join(__dirname, '..', 'data', 'words.txt')` assumes dist layout
  - File: `packages/server/src/index.ts:13`
  - Impact: Fragile in production builds; may fail in different deploy scenarios
  - Fix: Validate file exists before use; fail loudly with clear error

- [x] **CORS validation missing**
  - Issue: CORS_ORIGIN env var accepted without URL validation
  - File: `packages/server/src/config.ts:21`
  - Impact: Invalid URL accepted; CORS silently fails
  - Fix: Validate URL format before using as CORS origin

- [x] **No content-length limit on requests**
  - Issue: express.json() and express.urlencoded() have no size limits
  - File: `packages/server/src/app.ts:22-23`
  - Impact: Malicious client can send large payloads; no protection
  - Fix: Add `limit: '10kb'` to middleware options

### Frontend

- [x] **Hardcoded localhost in E2E tests**
  - Issue: Playwright config falls back to localhost:5173; CI may run on
    different host
  - File: `playwright.config.ts:4`
  - Impact: E2E tests can't reach server; tests hang or timeout
  - Fix: Use IP address or hostname validation in CI

- [x] **No debounce on input changes**
  - Issue: Every keystroke updates state; 10+ chars typed = 10 re-renders
  - File: `packages/client/src/components/SearchForm.tsx`
  - Impact: Minor performance issue; should implement 300ms debounce per project
    context
  - Fix: Add debounce to input onChange handler

- [ ] **Timeout detection uses string matching**
  - Issue: `state.error?.includes('timed out')` is fragile
  - File: `packages/client/src/App.tsx:15`
  - Impact: Timeout detection breaks if error message changes
  - Fix: Use error type/code instead of string matching

- [x] **ResultCard key uses word length (non-unique)**
  - Issue: `key={String(group.length)}` if multiple groups have same length
  - File: `packages/client/src/components/ResultsDisplay.tsx:46`
  - Impact: React won't differentiate groups; may cause rendering issues
    (unlikely but anti-pattern)
  - Fix: Use unique identifier: `key={String(group.length)}-${words.join(',')}`

### CI/CD

- [x] **E2E test retry delay is excessive**
  - Issue: 2 retries × 8min timeout = 24min total wait if all fail
  - File: `.github/workflows/ci.yml:106`
  - Impact: Flaky tests block pipeline for extended time
  - Fix: Reduce timeout or retry count; investigate flakiness root cause

- [x] **Pre-commit hook runs full test suite (blocking)**
  - Issue: Every commit runs npm run test:run (may take 1-2 minutes)
  - File: `.husky/pre-commit:10`
  - Impact: Developer friction; slow feedback loop
  - Fix: Run only changed-file tests locally; full suite in CI

---

## 🔵 LOW (Polish / Minor Issues)

### Frontend

- [ ] **Error boundary try-again doesn't prevent loop**
  - Issue: User clicks "Try Again" but error persists; user stuck in loop
  - File: `packages/client/src/components/ErrorBoundary.tsx:36`
  - Impact: Poor UX if error is persistent; user can't recover
  - Fix: Add recovery mechanism or clear guidance

### Configuration

- [ ] **Prettier JSON override width conflicts**
  - Issue: Print width 100 main config vs 120 for JSON files (inconsistent)
  - File: `.prettierrc.json:12-14`
  - Impact: JSON files format differently than code; minor inconsistency
  - Fix: Align widths or document rationale

### Documentation

- [ ] **Deferred work file has no content**
  - Issue: `deferred-work.md` exists but says "None currently deferred"
  - File: `_bmad-output/implementation-artifacts/deferred-work.md`
  - Impact: Confusing artifact; unclear purpose
  - Fix: Either delete file or use it to track deferred items as they arise

- [ ] **Word list version not documented in code**
  - Issue: "SCOWL 2024.11.24" mentioned in architecture but not in
    data/words.txt
  - File: `architecture.md:60` vs actual code
  - Impact: Word list reproducibility unclear; version drift possible
  - Fix: Add version header to data/words.txt or document in README

---

## 📊 Summary by Category

| Category          | Critical | High   | Medium | Low   | Total  |
| ----------------- | -------- | ------ | ------ | ----- | ------ |
| **Backend**       | 4        | 4      | 3      | 0     | **11** |
| **Frontend**      | 1        | 3      | 4      | 1     | **9**  |
| **CI/CD**         | 1        | 3      | 1      | 0     | **5**  |
| **Configuration** | 0        | 0      | 0      | 1     | **1**  |
| **Documentation** | 1        | 2      | 0      | 2     | **5**  |
| **TOTAL**         | **7**    | **12** | **8**  | **4** | **31** |

---

## ✅ Recommended Action Plan

### Phase 1: Critical (Must Fix Before Merge)

**Estimated Time:** 2-3 hours

1. Fix API response field mismatch (Frontend)
2. Fix API error format documentation (Docs)
3. Fix epic/story status conflicts (Docs)
4. Add rate limiting on wildcard queries (Backend)
5. Fix bundle size check to include CSS (CI/CD)

### Phase 2: High Priority (Fix in Next PR)

**Estimated Time:** 3-4 hours

1. Add dictionary load timeout (Backend)
2. Fix input clearing on focus (Frontend)
3. Fix HTTPS mixed content warning (Frontend)
4. Remove `--legacy-peer-deps` from CI (CI/CD)
5. Add type-check to pre-commit hook (CI/CD)

### Phase 3: Medium Priority (Future Work)

**Estimated Time:** 4-5 hours

- Add pagination/virtualization for results
- Add debounce to input changes
- Improve CI retry logic for E2E tests
- Add proper error boundary logging
- Validate CORS origin

### Phase 4: Low Priority (Polish)

**Estimated Time:** 1-2 hours

- Document word list version
- Remove deferred-work.md or populate it
- Fix ErrorBoundary try-again UX

---

## 🎯 By Severity & Effort

### Quick Wins (< 30 min, High Impact)

- [ ] Fix API response field mismatch (1 line change)
- [ ] Standardize API error format docs (docs update)
- [ ] Fix story/epic status in YAML (status updates)
- [ ] Add coverage threshold documentation (docs)

### Medium Effort (30 min - 2 hours, High Impact)

- [ ] Add rate limiting to API
- [ ] Fix pre-commit hook (add type-check)
- [ ] Fix bundle size script (add CSS)
- [ ] Remove --legacy-peer-deps from CI

### High Effort (2+ hours)

- [ ] Add E2E retry/timeout investigation
- [ ] Refactor input clearing logic (UX)
- [ ] Add pagination for results
- [ ] Dictionary load timeout & error handling
