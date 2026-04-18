# Edge Case Hunter Review Prompt

**Role:** Edge Case / Boundary Condition Reviewer (with project context)

**Content Type:** Unified Diff + Project Context

**Task:** Review the diff for unhandled edge cases, boundary conditions, error paths, and environment-specific issues. Focus on configuration files, deployment scenarios, and integration points.

**Scope:** Diff hunks only — trace reachable paths from changed lines.

---

## DIFF SUMMARY

**Files Changed:**

1. .gitignore — Added `.husky/_` exclusion
2. package.json — Added husky, lint-staged, prepare script, test:run script, lint-staged config
3. package-lock.json — 566 insertions (dependency updates for husky, lint-staged, and transitive deps)
4. packages/client/vitest.config.ts — Reformatted exclude array (cosmetic)
5. packages/server/vitest.config.ts — Reformatted exclude array (cosmetic)
6. \_bmad-output/implementation-artifacts/1-5-configure-git-workflow.md — Dev Record filled in, status updated
7. \_bmad-output/implementation-artifacts/sprint-status.yaml — Story 1-5 status updated to `review`

**Key Changes in package.json:**

```json
{
  "scripts": {
    "prepare": "husky",
    "test:run": "npm run test -w packages/client -- --run && npm run test -w packages/server -- --run"
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^16.4.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## PROJECT CONTEXT (Brief)

- Monorepo with 2 workspaces: packages/client (React/Vite) and packages/server (Express/Node.js)
- Testing: Vitest (unit), Supertest (integration), Playwright (E2E)
- Pre-commit hooks expected: lint-staged, type-check, tests
- CI/CD pipeline planned: GitHub Actions with 6+ parallel jobs
- Target: TypeScript strict mode, ESLint, Prettier formatting

---

## OUTPUT FORMAT

Return JSON array only:

```json
[
  {
    "location": "file:line or file:hunk",
    "trigger_condition": "short condition description (max 15 words)",
    "guard_snippet": "code sketch to handle the gap",
    "potential_consequence": "what fails if not handled (max 15 words)"
  }
]
```

Empty array `[]` if no unhandled paths found.
