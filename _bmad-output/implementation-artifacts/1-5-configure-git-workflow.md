---
storyId: 1.5
storyKey: 1-5-configure-git-workflow
epic: 1
status: done
title: Configure Git Workflow, Pre-commit Hooks, and CI/CD Pipeline
createdDate: 2026-04-17
lastUpdated: 2026-04-17
devAgentRecord: []
fileList: []
---

# Story 1.5: Configure Git Workflow, Pre-commit Hooks, and CI/CD Pipeline

## Story Overview

As a **developer**, I want to set up git branch naming conventions, commit message format, pre-commit hooks, and CI/CD pipeline, so that the codebase maintains quality standards and prevents bad code from being committed.

**Story Value:** Automates code quality enforcement. Prevents low-quality code from being merged. Provides fast feedback loop (pre-commit hooks catch issues before CI). Establishes clear development workflow.

**Dependencies:** Requires all previous Epic 1 stories (1.1-1.4) to be complete.

---

## Acceptance Criteria

**AC1: Git Branch Naming Convention**

- Format: `{type}/{short-description}` (all lowercase, hyphens for spaces)
- Types allowed:
  - `feature/` — New feature (e.g., `feature/search-form`)
  - `fix/` — Bug fix (e.g., `fix/input-validation`)
  - `refactor/` — Code refactoring (e.g., `refactor/dictionary-service`)
  - `test/` — Test additions (e.g., `test/e2e-coverage`)
  - `docs/` — Documentation (e.g., `docs/api-spec`)
  - `chore/` — Maintenance (e.g., `chore/update-deps`)
- Examples:
  - ✅ `feature/word-lookup-api`
  - ✅ `fix/timeout-handling`
  - ❌ `Feature/Word Lookup` (wrong format)
  - ❌ `my-branch` (no type prefix)

**AC2: Commit Message Format**

- Format: `{type}({scope}): {subject}` with optional body and footer
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Scope: Component/system affected (e.g., `api`, `ui`, `input`, `results`)
- Subject: Imperative mood, lowercase, no period, max 50 chars
- Optional body: Explain what and why (not how), wrap at 72 chars
- Optional footer: `Closes #123` for issue references
- Example:

  ```
  feat(api): add wildcard support for letters parameter

  Users can now use ? as a wildcard to match any single letter.
  Improves search flexibility without changing API contract.

  Closes #123
  ```

- Anti-examples:
  - ❌ `add feature` (no type/scope)
  - ❌ `fix(): fixed the bug` (empty scope)
  - ❌ `FEAT(API): Added Wildcard Support` (capitalized)

**AC3: Husky Pre-commit Hooks Installed**

- Install `husky` and `lint-staged` in root `package.json`
- Run `npx husky install` to initialize git hooks
- Create `.husky/pre-commit` hook that runs:
  1. `npx lint-staged` (linting and formatting)
  2. `npm run type-check` (TypeScript strict check)
  3. `npm run test -- --run` (run tests once, no watch mode)
- Pre-commit hook blocks commit if any check fails
- Developer can override with `git commit --no-verify` (discouraged, logged)

**AC4: Lint-staged Configuration**

- Create `lint-staged` config in root `package.json`:
  ```json
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
  ```
- Only checks/fixes staged files (not entire codebase)
- Runs linting before commit, auto-fixes what it can
- Prevents formatting/lint issues from entering repository

**AC5: GitHub Actions CI/CD Pipeline**

- Create `.github/workflows/ci.yml` with following jobs (run in parallel):

  **Job 1: Type Check**
  - Run: `npm run type-check`
  - Timeout: 30 seconds
  - Fail on error (no warnings)

  **Job 2: Lint**
  - Run: `npm run lint` (all workspaces)
  - Run: `npm run format:check` (verify Prettier formatting)
  - Timeout: 30 seconds
  - Fail on error

  **Job 3: Build**
  - Run: `npm run build` (all workspaces)
  - Verify bundle size < 100KB gzipped (client only)
  - Timeout: 60 seconds
  - Fail on error

  **Job 4: Unit & Integration Tests**
  - Run: `npm run test` (all workspaces)
  - Coverage threshold: 70% minimum
  - Timeout: 120 seconds per workspace
  - Fail if coverage < 70%
  - Fail if any test fails
  - Continue on failure (don't block other jobs)

  **Job 5: Security Audit**
  - Run: `npm audit --audit-level=moderate`
  - Fail if moderate or higher vulnerabilities found
  - Timeout: 30 seconds

  **Job 6: E2E Tests**
  - Run: `npm run test:e2e`
  - Timeout: 180 seconds
  - Retry flaky tests (2x automatic retry)
  - Continue on failure (don't block other jobs)
  - Report test results

**AC6: CI/CD Status Requirements**

- All checks must pass before merge to main
- GitHub branch protection rule: "Require status checks to pass before merging"
- At least 1 peer review approval required before merge
- Force push to main is disabled (use `--no-force` option)
- Squash commits before merge (keeps history clean)

**AC7: GitHub Branch Protection**

- Create or update branch protection rule for `main`:
  - "Require pull request reviews before merging" (1 approval minimum)
  - "Require status checks to pass before merging" (all CI jobs)
  - "Require branches to be up to date before merging"
  - "Require signed commits" (optional, recommended)
  - "Dismiss stale pull request approvals when new commits are pushed"
  - "Restrict who can push to matching branches" (optional)

**AC8: Pull Request Template**

- Create `.github/pull_request_template.md` with template:

  ```markdown
  ## What changed?

  Brief summary of changes (1-2 sentences).

  ## Why?

  Context: which feature or bug this addresses.

  ## How to test?

  Step-by-step instructions for testing.

  ## Checklist

  - [ ] Tests pass locally (npm run test)
  - [ ] No linting errors
  - [ ] TypeScript strict mode passes
  - [ ] Bundle size < 100KB (if client changes)
  - [ ] Commits are squashed with proper messages
  ```

- Template auto-populates new PRs

**AC9: CODEOWNERS File**

- Create `.github/CODEOWNERS` to auto-assign reviewers
- Example:

  ```
  # All changes require review
  * @christopher-h-clark

  # API changes require extra review
  packages/server/ @christopher-h-clark
  ```

- Auto-requests review when PR touches specified paths

**AC10: Workflow Tested End-to-End**

- Create test branch: `feature/test-workflow`
- Make a change that passes all checks
- Push and create PR, verify CI passes
- Verify pre-commit hooks prevent:
  - Unformatted code (Prettier catches it)
  - Lint violations (ESLint catches it)
  - Type errors (TypeScript catch it)
  - Test failures (Vitest catches it)
- Delete test branch after validation

---

## Technical Context

### Git Workflow Overview

```
1. Create feature branch
   git checkout -b feature/my-feature

2. Make changes, commit frequently
   git commit -m "feat(component): add feature"
   # Pre-commit hooks run automatically
   # If hooks fail, commit is blocked

3. Push to remote
   git push -u origin feature/my-feature

4. Create Pull Request on GitHub
   # GitHub Actions CI runs automatically
   # Must pass all checks before merge

5. Request review
   # Reviewer checks code quality, logic, tests

6. Merge when approved
   # Squash commits before merge (keep history clean)
   # CI must pass, 1+ approval required
   # Feature branch auto-deletes

7. Pull latest main
   git pull origin main
```

### Pre-commit Hook Execution

```
Developer runs: git commit -m "feat(api): add endpoint"

Hook 1: lint-staged
  ├─ ESLint checks staged files
  ├─ Auto-fixes what it can (--fix)
  └─ Prettier formats code

Hook 2: Type Check
  └─ TypeScript strict check (no implicit any)

Hook 3: Run Tests
  └─ Vitest runs all unit + integration tests

If all hooks pass:
  → Commit is created, push to remote

If any hook fails:
  → Commit is blocked, developer fixes issues
  → Retry: git commit -m "..."
```

### CI/CD Pipeline Execution

```
Developer pushes to feature branch

GitHub Actions triggered:
├─ Type Check (parallel)
├─ Lint (parallel)
├─ Build (parallel)
├─ Unit/Integration Tests (parallel)
├─ Security Audit (parallel)
└─ E2E Tests (parallel)

If all jobs pass:
  → Green checkmark on PR
  → Merge button becomes available

If any job fails:
  → Red X on PR
  → Merge is blocked
  → Developer must fix and re-push
```

### File Structure

```
word-unscrambler/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                    (new: GitHub Actions CI/CD)
│   ├── pull_request_template.md      (new)
│   └── CODEOWNERS                    (new)
├── .husky/
│   └── pre-commit                    (new: pre-commit hook)
├── .eslintrc.json                    (existing from 1.2)
├── .prettierrc.json                  (existing from 1.2)
├── package.json                      (updated: husky, lint-staged scripts)
├── .gitignore                        (updated: husky dir)
└── src/                              (existing)
```

### GitHub Actions CI/CD Workflow Template

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, 'feature/**', 'fix/**', 'refactor/**']
  pull_request:
    branches: [main]

jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci --frozen-lockfile
      - run: npm run type-check

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci --frozen-lockfile
      - run: npm run lint
      - run: npm run format:check

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci --frozen-lockfile
      - run: npm run build
      - name: Check bundle size
        run: |
          SIZE=$(du -h packages/client/dist/index.*.js | awk '{print $1}')
          echo "Bundle size: $SIZE"
          if [ $(du -b packages/client/dist/index.*.js | awk '{print $1}') -gt 104857600 ]; then
            echo "ERROR: Bundle exceeds 100KB"
            exit 1
          fi

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci --frozen-lockfile
      - run: npm run test -- --run
      - run: npm run test:coverage

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci --frozen-lockfile
      - run: npm audit --audit-level=moderate

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci --frozen-lockfile
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  merge-check:
    needs: [type-check, lint, build, test, security, e2e]
    runs-on: ubuntu-latest
    steps:
      - run: echo "All checks passed!"
```

### Pull Request Template

```markdown
# .github/pull_request_template.md

## What changed?

<!-- Brief summary of changes (1-2 sentences) -->

## Why?

<!-- Context: which feature or bug this addresses -->

## How to test?

<!-- Step-by-step instructions for testing -->

## Test coverage

- [ ] Unit tests added
- [ ] Integration tests added
- [ ] E2E scenarios verified

## Checklist

- [ ] Tests pass locally (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript strict mode passes (`npm run type-check`)
- [ ] Bundle size < 100KB gzipped (if client changes)
- [ ] Commits squashed with proper messages
- [ ] No console errors or debug code

## Related issues

<!-- Closes #123 -->
```

---

## Implementation Strategy

### Step 1: Initialize Husky

```bash
cd <root>
npm install -D husky lint-staged
npx husky install
```

### Step 2: Create Pre-commit Hook

```bash
npx husky add .husky/pre-commit "npx lint-staged && npm run type-check && npm run test -- --run"
chmod +x .husky/pre-commit
```

### Step 3: Configure Lint-staged

Update root `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### Step 4: Create GitHub Actions Workflow

Create `.github/workflows/ci.yml` with all jobs defined above.

### Step 5: Create Pull Request Template

Create `.github/pull_request_template.md` with template content.

### Step 6: Create CODEOWNERS

Create `.github/CODEOWNERS` with reviewer assignments.

### Step 7: Update .gitignore

Add to `.gitignore`:

```
.husky/_
.env.local
dist/
coverage/
```

### Step 8: Add Root npm Scripts

Ensure root `package.json` has all required scripts:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "build": "npm run build -w packages/client && npm run build -w packages/server",
    "test": "npm run test -w packages/client && npm run test -w packages/server",
    "test:coverage": "npm run test:coverage -w packages/client && npm run test:coverage -w packages/server",
    "test:e2e": "playwright test",
    "test:all": "npm run test && npm run test:e2e",
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "npm run dev -w packages/client",
    "dev:server": "npm run dev -w packages/server"
  }
}
```

### Step 9: Test End-to-End

```bash
# Create test branch
git checkout -b feature/test-workflow

# Make a change (e.g., edit a TypeScript file)
echo "// test" >> packages/client/src/App.tsx

# Commit (pre-commit hooks should run)
git commit -m "test(app): verify workflow"
# Should see lint-staged, type-check, and tests running

# If all pass, commit succeeds
# Push to remote
git push -u origin feature/test-workflow

# Create PR on GitHub, verify CI passes
# Delete branch when done
git checkout main
git branch -D feature/test-workflow
git push origin --delete feature/test-workflow
```

### Step 10: Enable Branch Protection

1. Go to GitHub repo settings
2. Select "Branches" → "Add rule"
3. Pattern: `main`
4. Enable:
   - "Require pull request reviews before merging" (1)
   - "Require status checks to pass before merging"
   - "Require branches to be up to date"
   - "Restrict who can push to matching branches"

---

## Testing Strategy

**Manual Validation:**

1. **Pre-commit Hook Enforcement:**

   ```bash
   # Create file with unformatted code
   echo "const   x   =   5;" > test.ts
   git add test.ts

   # Try to commit (should fail)
   git commit -m "test: bad formatting"
   # Output: lint-staged should auto-fix and ask to re-add

   # Re-stage and retry
   git add test.ts
   git commit -m "test: bad formatting"
   # Should succeed after fix
   ```

2. **Type Check Hook:**

   ```bash
   # Create file with type error
   echo "const x: string = 5;" > test.ts
   git add test.ts

   # Try to commit (should fail)
   git commit -m "test: type error"
   # Output: TypeScript error shown, commit blocked
   ```

3. **Test Hook:**

   ```bash
   # If any test fails, commit should be blocked
   # Create a failing test first to verify
   ```

4. **GitHub Actions Workflow:**

   ```bash
   # Push to feature branch
   git push origin feature/test-workflow

   # Go to GitHub, check "Actions" tab
   # Should see CI workflow running
   # All jobs should pass
   ```

5. **Branch Protection:**
   ```bash
   # Try to push directly to main (should fail)
   git checkout main
   git push origin main --force
   # Should be rejected by GitHub
   ```

**Acceptance:** All pre-commit hooks work, CI/CD pipeline passes, branch protection active.

---

## Project Context Reference

This story aligns with:

- **Project Requirements:** PR14-18 (Git workflow, commits, PRs, CI/CD)
- **Development Workflow:** Git branch naming, commit message format, pre-commit enforcement
- **Quality Gates:** Type check, lint, tests, security audit, bundle size all automated
- **Code Quality:** All stories 1.1-1.4 have setup for this workflow
- **Team Collaboration:** Code review required, clear commit history, CI/CD feedback

---

## Previous Story Learning

**From Story 1.1 (Clone Starter):**

- Git repository already initialized
- May have some GitHub workflows (verify and update as needed)

**From Story 1.2 (TypeScript Config):**

- ESLint and Prettier already configured
- Lint-staged will use these configs

**From Story 1.3 (Tailwind + shadcn/ui):**

- CSS imports won't break linting (already verified)

**From Story 1.4 (Testing Infrastructure):**

- All test commands available for pre-commit hooks
- Coverage thresholds enforced in CI

**Action:** Integrate all previous tools into git hooks and CI pipeline.

---

## Potential Gotchas

**Gotcha 1: Husky Not Running Pre-commit Hooks**

- **Problem:** `git commit` doesn't run hooks
- **Cause:** `npx husky install` not run, or hooks not executable
- **Solution:**
  ```bash
  npx husky install
  chmod +x .husky/pre-commit
  ```

**Gotcha 2: Pre-commit Hook Too Slow**

- **Problem:** Commit takes 30+ seconds
- **Cause:** Running full test suite on every commit
- **Solution:** Consider separate CI stages (pre-commit is fast, CI is thorough)
- **Trade-off:** Running full tests in CI is OK (slower), running subset in pre-commit is better (faster feedback)

**Gotcha 3: Lint-staged Modifies Files**

- **Problem:** ESLint `--fix` modifies files, but not re-staged
- **Solution:** Lint-staged automatically re-stages fixed files
- **Verify:** After commit, check `git diff` shows nothing

**Gotcha 4: CI Pipeline Parallelization**

- **Problem:** Jobs run in parallel but take different times
- **Solution:** Use `needs: [type-check, lint, build, test, security]` to wait for dependencies
- **Merge check job:** Waits for all others, always succeeds if deps pass

**Gotcha 5: Bundle Size Checking**

- **Problem:** CI reports bundle size but script is fragile
- **Solution:** Use Vite's built-in size reporting
- **Alternative:** Use `size-limit` package for more robust checking

**Gotcha 6: GitHub Actions Caching**

- **Problem:** First run is slow (npm ci installs all packages)
- **Solution:** Use `actions/setup-node` with `cache: 'npm'` option
- **Result:** Subsequent runs much faster (uses cached node_modules)

---

## Success Criteria

✅ **Done when:**

- Husky installed and pre-commit hooks working
- `git commit` triggers lint-staged, type-check, and tests
- Commit blocked if any check fails
- `.github/workflows/ci.yml` created with all 6+ jobs
- CI pipeline passes on sample feature branch
- Pull request template created and auto-fills PRs
- CODEOWNERS file created
- Branch protection enabled on `main`
- Test feature branch created, tested end-to-end, and deleted
- All pre-commit hooks properly formatted/typed/tested
- Root npm scripts all working (`npm run build`, `npm run test`, etc.)

---

## Dependencies

- **Blocks:** Nothing in Epic 1 (this is last story), but all future stories depend on this workflow
- **Blocked By:** Stories 1.1-1.4 (all infrastructure must be in place first)
- **Related:** All future stories will use this git workflow and CI/CD pipeline

---

## Dev Agent Record

_Filled in by implementing developer_

### Tasks Completed

- [x] Install husky and lint-staged
- [x] Initialize husky with npx husky install
- [x] Create .husky/pre-commit hook with lint-staged, type-check, and tests
- [x] Configure lint-staged in root package.json
- [x] Create .github/workflows/ci.yml with all CI jobs
- [x] Create .github/pull_request_template.md
- [x] Create .github/CODEOWNERS file
- [x] Update .gitignore to exclude .husky files
- [x] Add all required npm scripts to root package.json (test:run added; all others pre-existing)
- [x] Test pre-commit hooks with sample commit (simulated locally: type-check + test:run all pass)
- [ ] Verify CI pipeline runs on feature branch (manual: requires GitHub push)
- [ ] Enable branch protection on main branch (manual: GitHub repo settings)
- [ ] Create test feature branch and validate full workflow (manual: requires GitHub push)
- [ ] Delete test branch after validation (manual: follows above)

### Code Changes

Files created/modified:

- `package.json` — Added `prepare: husky`, `test:run` script, `lint-staged` config, husky+lint-staged devDeps
- `.husky/pre-commit` — Runs lint-staged → type-check → test:run on every commit
- `.github/workflows/ci.yml` — 6-job parallel CI: type-check, lint, build, test, security, e2e + merge-check gate
- `.github/pull_request_template.md` — PR checklist template
- `.github/CODEOWNERS` — Auto-assigns @christopher-h-clark to all changes
- `.gitignore` — Added `.husky/_` exclusion
- `packages/client/vitest.config.ts` — Auto-formatted by prettier
- `packages/server/vitest.config.ts` — Auto-formatted by prettier

### Tests Created

N/A — infrastructure story; validated via manual pre-commit simulation and CI workflow yaml review.

### Learnings & Notes

- Husky v9 deprecated `husky install`; `prepare: husky` is the modern approach.
- Root `test` script chains workspace calls, so `npm run test -- --run` doesn't propagate `--run` to vitest. Added `test:run` script that calls each workspace directly with `--run`.
- Used `--legacy-peer-deps` due to peer dep conflict between `@eslint/js@10` and `eslint@9`.
- AC7 (branch protection) and AC10 (test branch push to GitHub) require manual GitHub steps.

---

## File List

- package.json (updated: prepare script, test:run script, lint-staged config, husky+lint-staged deps)
- .husky/pre-commit (created)
- .github/workflows/ci.yml (created)
- .github/pull_request_template.md (created)
- .github/CODEOWNERS (created)
- .gitignore (updated: added .husky/\_ exclusion)
- packages/client/vitest.config.ts (auto-formatted)
- packages/server/vitest.config.ts (auto-formatted)

## Review Findings

- [x] [Review][Patch] Bundle size check hardcoded 100MB instead of 100KB [.github/workflows/ci.yml:54] — FIXED
- [x] [Review][Patch] E2E tests don't block merge (continue-on-error + not in merge-check needs) [.github/workflows/ci.yml:103,107] — FIXED
- [x] [Review][Patch] Pre-commit hook doesn't fail-fast on first failure [.husky/pre-commit:2-4] — FIXED
- [x] [Review][Patch] Bundle size check race condition (ls then du) [.github/workflows/ci.yml:51-52] — FIXED
- [x] [Review][Patch] Playwright webServer has no startup timeout [playwright.config.ts:14-17] — FIXED
- [x] [Review][Defer] --legacy-peer-deps everywhere indicates unresolved peer conflicts — pre-existing, requires root cause fix

---

## Change Log

- 2026-04-17: Installed husky v9 + lint-staged; created pre-commit hook; created GitHub Actions CI workflow with 6 parallel jobs + merge-check gate; created PR template and CODEOWNERS; updated .gitignore; added test:run and prepare scripts; fixed pre-existing prettier formatting issues.
