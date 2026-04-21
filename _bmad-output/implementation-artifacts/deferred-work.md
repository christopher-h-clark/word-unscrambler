# Deferred Work Tracking

Issues identified during code reviews that are real but pre-existing — not
caused by the current change.

(None currently deferred from Story 4.1 code review — character range spec
deviation was corrected.)

## Deferred from: Code Review of Story 5-1 (2026-04-20)

- **Dictionary path uses relative paths** [Dockerfile:37] — Pre-existing pattern
  throughout project; works in current structure but fragile if directory layout
  changes. Path resolution depends on \_\_dirname at runtime.
- **--ignore-scripts skips postinstall scripts** [Dockerfile:27] — Intentional
  design choice to minimize Docker image size and prevent husky/other
  postinstall hooks. Safe if backend code doesn't depend on postinstall setup.
- **Environment variable documentation missing** [README/docs] — CORS_ORIGIN and
  WORD_LIST_PATH documented in code but not in deployment docs. Not a code
  issue; documentation task for Story 5-3.
- **Node.js version mismatch** [package.json vs Dockerfile] — package.json
  specifies `engines: {"node": ">=18"}` but Dockerfile uses `node:22-alpine`.
  Pre-existing; no runtime issues yet but Node 22 vs 18 behavior differences
  could surface (e.g., Error.cause, module resolution).
- **Express 5.x compatibility with --legacy-peer-deps** [Dockerfile:7] — Build
  uses `--legacy-peer-deps` suggesting peer dependency conflicts with Express
  5.2.1. Pre-existing; runtime compatibility not explicitly verified but implied
  by dev agent record passing tests.

## Deferred from: Code Review of Story 5-2 (2026-04-21)

- **--legacy-peer-deps used unconditionally** [Dockerfile:7,27] — Suppresses
  peer dependency warnings in both build and runtime stages. Pre-existing
  pattern from Story 5-1; unclear if temporary npm workaround or permanent
  design choice for this project.

## Deferred from: Code Review of Story 5-3 (2026-04-21)

- **GitHub Secrets env var names unvalidated** [DEPLOYMENT.md:160-166] —
  Documentation references GitHub Secrets (`BACKEND_NODE_ENV`,
  `BACKEND_CORS_ORIGIN`, `FRONTEND_API_URL`) but doesn't verify these match
  actual CI/CD config in `.github/workflows/`. Pre-existing issue: CI/CD
  pipeline setup is separate from documentation story. Should be validated when
  CI/CD configuration is created.

---
