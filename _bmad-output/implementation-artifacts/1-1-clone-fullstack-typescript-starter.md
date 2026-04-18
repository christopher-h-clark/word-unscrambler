---
storyId: 1.1
storyKey: 1-1-clone-fullstack-typescript-starter
epic: 1
status: done
title: Clone fullstack-typescript Starter and Initialize Monorepo Structure
createdDate: 2026-04-17
lastUpdated: 2026-04-17
devAgentRecord: []
fileList: []
---

# Story 1.1: Clone fullstack-typescript Starter and Initialize Monorepo Structure

## Story Overview

As a **developer**, I want to clone the fullstack-typescript starter and set up the monorepo with proper workspace configuration, so that the project has a solid foundation with both frontend and backend ready for development.

**Story Value:** Establishes the foundational project structure that all subsequent stories depend on. Enables parallel frontend/backend development with shared configuration.

---

## Acceptance Criteria

**AC1: Starter Repository Cloned**
- Clone the fullstack-typescript starter repository from: https://github.com/gilamran/fullstack-typescript
- Preserve the original directory structure
- Git history is clean (verify with `git log`)

**AC2: Monorepo Workspaces Configured**
- Root `package.json` defines workspaces: `["packages/client", "packages/server"]`
- Both `packages/client/package.json` and `packages/server/package.json` exist
- Root `npm install` installs dependencies for all workspaces (npm 7+ workspace support)

**AC3: TypeScript Base Configuration**
- `tsconfig.base.json` exists at project root with shared configuration
- Each workspace (packages/client, packages/server) has own `tsconfig.json` that extends base
- Base configuration includes:
  - `"compilerOptions": { "module": "ESNext", "moduleResolution": "bundler" }`
  - Path aliases for workspace imports (optional but useful)

**AC4: Development Server Startup**
- Root `npm run dev` command starts BOTH frontend and backend concurrently
- Command uses `concurrently` or similar package to manage multiple processes
- Frontend: Vite dev server on http://localhost:5173
- Backend: Express dev server on http://localhost:3000
- Both servers print startup confirmation with port numbers
- Both servers exit cleanly on Ctrl+C

**AC5: Hot Module Replacement (HMR) Enabled**
- Changes to frontend code trigger HMR in < 1 second (no full refresh)
- Changes to backend code trigger automatic restart (via tsx --watch or similar)
- File watches are properly configured in both packages

**AC6: Project Structure Initialized**
- `packages/client/src/` directory exists (ready for React code)
- `packages/server/src/` directory exists (ready for Express code)
- `.gitignore` at root includes: `node_modules/`, `dist/`, `.env.local`, `*.log`
- `.prettierrc.json` at root for code formatting standards
- `.eslintrc.json` at root for linting (basic, expanded in Story 1.2)
- `README.md` at root with project overview

**AC7: Git Repository Initialized**
- Existing git history from starter is preserved (not reset)
- Initial commit message documents monorepo setup
- Branch naming conventions prepared (documented for Story 1.5)

---

## Technical Context

### Project Architecture
- **Type:** Monorepo (npm workspaces)
- **Frontend:** React 18+, TypeScript 5.0+, Vite 5+
- **Backend:** Express 4.18+, TypeScript 5.0+, Node.js 18+ LTS
- **Testing:** Vitest (both workspaces), Supertest (backend), Playwright (E2E)
- **Bundle Tool:** Vite (frontend only), tsc (backend)

### Starter Repository Details
- **Repo:** https://github.com/gilamran/fullstack-typescript
- **Why This Starter:**
  - Pre-configured monorepo with workspaces
  - TypeScript configured for both frontend and backend
  - Vite setup already done
  - Reduces boilerplate, lets us focus on domain logic
  - Well-maintained, recent updates

### Versions to Use
- **Node.js:** 18 or 20 LTS (verify with `node --version`)
- **npm:** 8+ (for workspace support, verify with `npm --version`)
- **React:** Latest stable in starter (typically 18.x)
- **TypeScript:** 5.0+ (starter should provide)
- **Vite:** 5.x (starter should provide)
- **Express:** 4.18+ (likely in starter, may need to verify)

### Files to Create/Modify

**Files Created (from starter clone):**
- `package.json` (root monorepo config)
- `tsconfig.base.json` (shared TypeScript config)
- `.prettierrc.json` (formatting config)
- `.eslintrc.json` (linting config)
- `packages/client/` (entire directory)
- `packages/server/` (entire directory)
- `packages/client/src/` (frontend source)
- `packages/server/src/` (backend source)
- `.gitignore` (if not present)
- `README.md` (basic readme from starter)

**Files to Review/Verify:**
- `packages/client/package.json` — should have Vite, React, TypeScript
- `packages/server/package.json` — should have Express, TypeScript
- `packages/client/vite.config.ts` — verify HMR settings
- `packages/server/package.json` scripts — ensure `dev` script uses tsx or similar watch tool

### Commands to Use

```bash
# Clone starter
git clone https://github.com/gilamran/fullstack-typescript word-unscrambler
cd word-unscrambler

# Install all dependencies (root + all workspaces)
npm install

# Start both dev servers
npm run dev

# Individual development (if needed)
npm run dev:client    # Frontend only
npm run dev:server    # Backend only

# Build production
npm run build

# Run tests (when added)
npm run test
```

### Validation Checklist

- [ ] Git clone completes without errors
- [ ] `npm install` installs > 500 packages (indicates full install)
- [ ] No peer dependency warnings (or acceptable warnings documented)
- [ ] `npm run dev` starts both servers within 10 seconds
- [ ] Frontend accessible at http://localhost:5173 (shows welcome page or similar)
- [ ] Backend responding at http://localhost:3000 (API available)
- [ ] File changes trigger HMR on frontend (< 1 second)
- [ ] File changes trigger restart on backend
- [ ] `.gitignore` excludes `node_modules/` and `.env.local`
- [ ] `git log` shows clean commit history
- [ ] All workspaces have `node_modules/` directory (dependency install verified)

---

## Project Context Reference

This story aligns with:
- **Project Requirements:** PR1 (Monorepo with npm workspaces), PR2 (npm run dev)
- **Architecture Requirements:** AR1 (Use fullstack-typescript starter), AR4 (Monorepo structure), AR6 (Vite for frontend), AR7 (Express for backend), AR8 (Node.js 18+)
- **Bundle Constraint:** Must leave < 100KB for application code (no external constraints at this stage)

---

## Implementation Notes

### Why Each File Matters

**package.json (Root):** Defines workspaces. Without this, npm treats packages/client and packages/server as independent projects.

**tsconfig.base.json:** Centralized TypeScript configuration. Shared rules across both workspaces ensure consistency.

**vite.config.ts (Client):** Configures bundler, HMR, and build output. Vite's instant HMR is critical for developer experience.

**packages/server/src/:** Backend entry point. Watch mode here enables automatic restart on file changes.

### Potential Gotchas

1. **Node Version Mismatch:** If local Node.js is < 18, installer may fail or use wrong npm workspace syntax. Check with `node --version`.

2. **npm Workspace Detection:** If root `package.json` doesn't have `"workspaces"` field, `npm install` treats packages as separate. Verify the field exists.

3. **HMR Not Working:** If `npm run dev` doesn't show HMR, check `vite.config.ts` for HMR settings. Starter should have it enabled.

4. **Port Conflicts:** If 3000 or 5173 already in use, dev server startup will fail. Check with `lsof -i :3000` and `lsof -i :5173`.

5. **Git History:** Cloning from starter preserves their git history. To start fresh, reset after clone: `git reset --hard --soft HEAD~N` (only if needed).

### Dependencies Added by Starter

The starter should already include:
- React 18+
- TypeScript 5.0+
- Vite 5+
- Express 4.18+
- Essential development tools (ts-node, tsx, etc.)

**Do NOT add or upgrade packages here.** This story focuses on setup only. Dependency management happens in subsequent stories.

---

## Testing Strategy

**Unit/Integration Tests:** Not applicable for this infrastructure story. File structure is validated manually.

**Manual Validation:**
1. Clone completes: `git log --oneline | head -5` shows commits
2. Install succeeds: `npm install --depth=0` shows "added X packages"
3. Both servers start: `npm run dev` outputs port numbers for 5173 and 3000
4. HMR works: Edit `packages/client/src/App.tsx`, browser updates without refresh

**Acceptance:** When all validation checks above pass, story is complete.

---

## Success Criteria

✅ **Done when:**
- Root `package.json` has `"workspaces": ["packages/client", "packages/server"]`
- Both `packages/client` and `packages/server` have their own `package.json`
- `npm install` completes successfully with no critical errors
- `npm run dev` starts both frontend (5173) and backend (3000) within 10 seconds
- Frontend accessible at http://localhost:5173 (renders something, no critical errors)
- Backend responds at http://localhost:3000 (curl test shows response)
- File edits trigger HMR/restart appropriately
- Git repository is clean and ready for feature branches

---

## Dependencies

- **Blocks:** All other stories (this is foundation)
- **Blocked By:** Nothing (this is first story)
- **Related:** Story 1.2 (TypeScript strict mode), Story 1.5 (Git workflow)

---

## Dev Agent Record

### Tasks Completed

- [x] Clone fullstack-typescript starter
- [x] Verify monorepo workspaces configured
- [x] Run npm install and verify all dependencies installed
- [x] Test npm run dev starts both servers
- [x] Verify HMR/watch mode working
- [x] Configure .gitignore for node_modules, dist, .env.local
- [x] Create or update README with quick start guide
- [x] Verify git repository is clean and ready

### Code Changes

Root level:
- package.json — workspaces: ["packages/client", "packages/server"], npm scripts, concurrently dep
- tsconfig.base.json — shared TS config (ESNext module, bundler resolution, strict)
- .prettierrc.json — code formatting (100 char width, single quotes, trailing commas)
- eslint.config.mjs — ESLint 10 flat config (note: story specified .eslintrc.json, but ESLint 10 requires flat config format)
- README.md — updated with project overview and quick start guide
- package-lock.json — generated on npm install

packages/client:
- package.json — React 19, Vite 7, MUI 7, TypeScript 5 dependencies
- tsconfig.json — extends base, client-specific settings (react-jsx, DOM lib)
- vite.config.ts — Vite 7 config with React plugin, port 5173, proxy to :3000, HMR enabled
- index.html — app entry point for Vite
- src/client.tsx — React root entry
- src/App.tsx — app shell with MUI layout and router
- src/types/shared.ts — inlined shared types (IUserDTO, getUserFullName)
- src/components/Header.tsx, SideMenu.tsx, Home.tsx, Usage.tsx
- src/components/UsersList.tsx, User.tsx
- src/components/LazilyLoadedContent.tsx, LazyLoadingExample.tsx
- src/components/RouterExample.tsx, StyledComponentExample.tsx
- src/utils/api-facade.ts — axios API wrapper
- .env.example — environment variable template

packages/server:
- package.json — Express 5, tsx (watch mode), TypeScript 5 dependencies
- tsconfig.json — extends base, server-specific (commonjs module, node resolution, outDir)
- src/index.ts — server entry point (Express listen)
- src/app.ts — Express app setup with CORS middleware
- src/config.ts — environment config (PORT, CORS_ORIGIN, IS_DEV)
- src/db.ts — sample user data
- src/routes/api-router.ts — /api/users, /api/user/:id routes
- src/types/shared.ts — inlined shared types
- .env.example — environment variable template

### Tests Created

N/A — infrastructure story, validated manually per story testing strategy.

### Learnings & Notes

**Adapter decisions:**
1. The gilamran/fullstack-typescript starter uses a single-package structure (src/client/, src/server/) with Yarn. We restructured it into an npm workspaces monorepo (packages/client, packages/server) as specified in the story ACs.

2. ESLint 10 requires flat config format (eslint.config.mjs) — the legacy .eslintrc.json format is not supported. Created eslint.config.mjs instead.

3. The starter's @shared/* path alias was removed. Shared types (IUserDTO, getUserFullName) are inlined in each package's src/types/shared.ts to avoid needing a third workspace.

4. The starter serves HTML via EJS template managed by Express in the single-package approach. In the workspaces model, Vite serves the frontend directly in development. In production, Express would serve the built Vite output.

5. npm workspaces deduplicate dependencies at root node_modules — 247 packages installed (story estimated 500+, which was for the non-deduped single-package install).

6. Bundle size note: current MUI starter bundle is ~145KB gzipped, exceeding the 100KB target. This is acceptable at this stage (story says "no external constraints at this stage"). The app-specific code in subsequent stories will replace/reduce MUI usage.

---

## File List

- package.json
- package-lock.json
- tsconfig.base.json
- .prettierrc.json
- eslint.config.mjs
- README.md
- packages/client/package.json
- packages/client/tsconfig.json
- packages/client/vite.config.ts
- packages/client/index.html
- packages/client/.env.example
- packages/client/src/client.tsx
- packages/client/src/App.tsx
- packages/client/src/types/shared.ts
- packages/client/src/components/Header.tsx
- packages/client/src/components/SideMenu.tsx
- packages/client/src/components/Home.tsx
- packages/client/src/components/Usage.tsx
- packages/client/src/components/UsersList.tsx
- packages/client/src/components/User.tsx
- packages/client/src/components/LazilyLoadedContent.tsx
- packages/client/src/components/LazyLoadingExample.tsx
- packages/client/src/components/RouterExample.tsx
- packages/client/src/components/StyledComponentExample.tsx
- packages/client/src/utils/api-facade.ts
- packages/server/package.json
- packages/server/tsconfig.json
- packages/server/.env.example
- packages/server/src/index.ts
- packages/server/src/app.ts
- packages/server/src/config.ts
- packages/server/src/db.ts
- packages/server/src/types/shared.ts
- packages/server/src/routes/api-router.ts
- _bmad-output/implementation-artifacts/sprint-status.yaml (status updated)
- _bmad-output/implementation-artifacts/1-1-clone-fullstack-typescript-starter.md (this file)

## Change Log

- 2026-04-17: Initial implementation — restructured fullstack-typescript starter into npm workspaces monorepo; both dev servers start and respond; TypeScript strict check passes

---

## Review Findings

**Code Review Complete** — 0 decision-needed, 6 patches (applied), 2 deferred, 2 dismissed

### Patches Applied (Edge Case Hunter)

- [x] [Review][Patch] PORT parsed as integer [packages/server/src/config.ts:11]
- [x] [Review][Patch] CORS_ORIGIN trimmed for empty string [packages/server/src/config.ts:12]
- [x] [Review][Patch] dotenv.config() wrapped in try/catch [packages/server/src/config.ts:6-8]
- [x] [Review][Patch] app.listen() error handler for EADDRINUSE/EACCES [packages/server/src/index.ts:9-11]
- [x] [Review][Patch] apiRouter() initialization wrapped in try/catch [packages/server/src/app.ts:18]
- [x] [Review][Patch] concurrently --kill-others flag added [package.json:14]

### Deferred (Pre-existing design decisions)

- [x] [Review][Defer] AC3: Path aliases omitted (intentional; shared types inlined) — deferred, pre-existing design choice
- [x] [Review][Defer] AC6: Server tsconfig overrides base (necessary for Node.js CommonJS) — deferred, correct implementation

### Dismissed (User-accepted deviations)

- ✅ AC1: Git clone history not in current repo (starter cloned elsewhere, copied into project) — accepted by user
- ✅ AC6: ESLint flat config vs legacy format (ESLint 10 requires flat config) — accepted as correct modern approach
