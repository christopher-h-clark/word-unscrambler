# Acceptance Auditor Review Prompt

**Role:** Specification Compliance Auditor

**Content Type:** Diff + Story Specs

**Task:** Review the diff against both story acceptance criteria. Check for:

- Violations of AC (Acceptance Criteria)
- Deviations from spec intent
- Missing implementation of specified behavior
- Contradictions between spec constraints and code

---

## STORY 1-4: Set Up Testing Infrastructure

### Key ACs:

- AC1: Vitest installed in packages/client with jsdom environment, coverage config, scripts
- AC2: Vitest installed in packages/server with node environment, coverage config, scripts
- AC3: Supertest installed in packages/server
- AC4: Playwright installed at root with config, e2e/ directory, scripts
- AC6: Root npm scripts: test, test:coverage, test:e2e, test:all
- AC9: Playwright browsers (Chromium, Firefox, WebKit) downloaded on install
- AC10: Dev workflow ready — npm test, npm run test:coverage, npm run test:e2e all work

### Dev Record Claims:

- [x] Vitest + Testing Library installed in packages/client
- [x] vitest.config.ts created in packages/client
- [x] Vitest + Supertest installed in packages/server
- [x] vitest.config.ts created in packages/server
- [x] Playwright installed at root + browsers downloaded
- [x] playwright.config.ts created
- [x] e2e/ directory created
- [x] Test scripts added to all package.json files
- [x] npm run test verified working from root and workspaces
- [x] npm run test:coverage verified generating reports
- [x] npm run test:e2e verified (0 tests is OK)
- [x] Jest removed if present

---

## STORY 1-5: Configure Git Workflow, Pre-commit Hooks, CI/CD

### Key ACs:

- AC1: Git branch naming convention format documented
- AC2: Commit message format documented
- AC3: Husky pre-commit hooks installed and functional
- AC4: lint-staged configured in root package.json
- AC5: GitHub Actions CI/CD pipeline with 6 jobs
- AC6: CI/CD status requirements (all checks must pass)
- AC7: GitHub branch protection rule on main
- AC8: Pull request template created
- AC9: CODEOWNERS file created
- AC10: Workflow tested end-to-end

### Dev Record Claims:

- [x] Install husky and lint-staged
- [x] Initialize husky with npx husky install
- [x] Create .husky/pre-commit hook with lint-staged, type-check, and tests
- [x] Configure lint-staged in root package.json
- [x] Create .github/workflows/ci.yml with all CI jobs
- [x] Create .github/pull_request_template.md
- [x] Create .github/CODEOWNERS file
- [x] Update .gitignore to exclude .husky files
- [x] Add all required npm scripts (test:run added; others pre-existing)
- [x] Test pre-commit hooks with sample commit (simulated locally)
- [ ] Verify CI pipeline runs on feature branch (manual: requires GitHub push)
- [ ] Enable branch protection on main branch (manual: GitHub repo settings)
- [ ] Create test feature branch and validate full workflow (manual)
- [ ] Delete test branch after validation (manual)

### Implementation Files Expected (per AC):

- .husky/pre-commit (created)
- .github/workflows/ci.yml (created)
- .github/pull_request_template.md (created)
- .github/CODEOWNERS (created)
- .gitignore (updated)
- package.json (updated)

---

## DIFF ANALYSIS CHECKLIST

### Story 1-4 Acceptance Criteria Mapping

- [ ] AC1: Vitest config exists for packages/client with jsdom? Check vitest.config.ts
- [ ] AC2: Vitest config exists for packages/server with node? Check vitest.config.ts
- [ ] AC3: Supertest in package-lock.json? Check package-lock.json
- [ ] AC4: Playwright config at root? Not in diff — **MISSING IMPLEMENTATION**
- [ ] AC6: Root scripts for test, test:coverage, test:e2e? Check package.json
- [ ] AC10: Dev workflow claims verified? Check Dev Agent Record

### Story 1-5 Acceptance Criteria Mapping

- [ ] AC3: Husky pre-commit hook created? Not in diff — **MISSING IMPLEMENTATION**
- [ ] AC4: lint-staged config in package.json? Check package.json
- [ ] AC5: .github/workflows/ci.yml created? Not in diff — **MISSING IMPLEMENTATION**
- [ ] AC7: Branch protection rule? Manual step — not in diff (expected)
- [ ] AC8: .github/pull_request_template.md? Not in diff — **MISSING IMPLEMENTATION**
- [ ] AC9: .github/CODEOWNERS? Not in diff — **MISSING IMPLEMENTATION**

---

## OUTPUT FORMAT

List findings as Markdown bullets:

- **AC Violated:** Which acceptance criterion
- **Finding:** What's missing or wrong
- **Evidence:** Quote from diff or story file
- **Severity:** Critical / High / Medium / Low
