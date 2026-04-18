---
storyId: 1.2
storyKey: 1-2-configure-typescript-strict-mode
epic: 1
status: done
title: Configure TypeScript Strict Mode and Project Conventions
createdDate: 2026-04-17
lastUpdated: 2026-04-18
devAgentRecord: []
fileList: []
---

# Story 1.2: Configure TypeScript Strict Mode and Project Conventions

## Story Overview

As a **developer**, I want to configure TypeScript strict mode across both workspaces and establish naming conventions, so that the codebase enforces type safety and follows consistent patterns.

**Story Value:** Establishes code quality standards from the start. Prevents common TypeScript pitfalls (implicit any, untyped parameters, missing return types). Saves debugging time long-term.

**Dependencies:** Requires Story 1.1 (monorepo setup) to be complete.

---

## Acceptance Criteria

**AC1: TypeScript Strict Mode in Frontend Workspace**
- File: `packages/client/tsconfig.json`
- Must include: `"strict": true` in `"compilerOptions"`
- Extends `tsconfig.base.json` from root
- All strict rules enabled:
  - `"noImplicitAny": true`
  - `"strictNullChecks": true`
  - `"strictFunctionTypes": true`
  - `"strictBindCallApply": true`
  - `"strictPropertyInitialization": true`
  - `"noImplicitThis": true`
  - `"alwaysStrict": true`

**AC2: TypeScript Strict Mode in Backend Workspace**
- File: `packages/server/tsconfig.json`
- Same strict configuration as frontend
- Extends `tsconfig.base.json` from root
- All strict rules enabled (same as AC1)

**AC3: Root TypeScript Base Configuration**
- File: `tsconfig.base.json`
- Shared configuration for both workspaces
- Includes:
  - `"compilerOptions": { "module": "ESNext", "moduleResolution": "bundler" }`
  - `"target": "ES2020"` (supports Node 18+ and modern browsers)
  - `"lib": ["ES2020"]`
  - `"skipLibCheck": true` (to avoid checking library types)
  - `"forceConsistentCasingInFileNames": true`

**AC4: ESLint Configuration**
- File: `.eslintrc.json` at project root
- Extends: `eslint:recommended` + `@typescript-eslint/recommended`
- Core rules enabled:
  - `"no-unused-vars": "off"` (handled by TypeScript)
  - `"@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]` (underscores exempt)
  - `"@typescript-eslint/explicit-function-return-types": ["error", { "allowExpressions": true }]`
  - `"@typescript-eslint/no-explicit-any": "error"` (require justification)
  - `"@typescript-eslint/explicit-module-boundary-types": "error"`

**AC5: Naming Conventions Enforced**
- Variables/Functions: camelCase (e.g., `fetchWords`, `isLoading`)
- React Components: PascalCase (e.g., `WordInput`, `SearchResults`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_WORD_LENGTH`, `API_TIMEOUT`)
- Private/Internal: Leading underscore (e.g., `_internalHelper`)
- ESLint rule: `@typescript-eslint/naming-convention` configured

**AC6: Prettier Configuration**
- File: `.prettierrc.json` at project root
- Settings:
  - `"printWidth": 100`
  - `"tabWidth": 2`
  - `"useTabs": false`
  - `"semi": true`
  - `"singleQuote": true`
  - `"trailingComma": "es5"`
  - `"arrowParens": "always"`

**AC7: No Implicit Any Allowed**
- `noImplicitAny: true` enforced in tsconfig
- Any use of `any` must have `// @ts-expect-error` comment with justification
- Examples:
  - ✅ `const data: any = fetchData(); // @ts-expect-error: third-party API returns untyped JSON`
  - ❌ `const data: any = fetchData();` (no comment, rejected in linting)

**AC8: React Component Type Safety**
- All React components have explicit return types:
  - `const MyComponent: React.FC<Props> = ({ ... }) => { ... }`
  - OR: `function MyComponent({ ... }): JSX.Element { ... }`
- Props interfaces defined for all components
- Example:
  ```typescript
  interface WordInputProps {
    onSubmit: (letters: string) => void;
  }
  const WordInput: React.FC<WordInputProps> = ({ onSubmit }) => {
    return <div>...</div>;
  };
  ```

**AC9: Function Parameter Typing**
- All function parameters must have explicit types (no implicit any)
- Return types explicit (or inferred from TypeScript context)
- Examples:
  - ✅ `function fetchWords(letters: string): Promise<string[]> { ... }`
  - ✅ `const isValid = (input: string): boolean => input.length >= 3;`
  - ❌ `function fetchWords(letters) { ... }` (implicit any)

**AC10: Validation**
- Run `npm run type-check` in root (should pass with zero errors)
- Run `npm run lint` in root (should pass with zero errors, excluding comments)
- Both frontend and backend pass type checking

---

## Technical Context

### TypeScript Strict Mode Benefits

**Strict mode catches:**
- Accidental use of `any` type (implicit in loose mode)
- Null/undefined pointer errors before runtime
- Type mismatches in function calls
- Missing return type annotations
- Incorrect property access on objects

**Example Problem Prevented:**
```typescript
// Without strict mode (BAD - compiles):
const user = fetchUser();
console.log(user.name); // May be undefined, crashes at runtime

// With strict mode (GOOD - won't compile):
// Must check: if (user && user.name) { ... }
```

### ESLint + Prettier Workflow

**ESLint:** Identifies code quality issues (type errors, naming conventions, unused variables)
**Prettier:** Auto-formats code (indentation, semicolons, quotes)

**Development Workflow:**
1. Write code
2. Run `npm run lint --fix` (ESLint auto-fixes what it can)
3. Run `npm run format` (Prettier auto-formats)
4. Run `npm run type-check` (TypeScript strict check)
5. Commit (pre-commit hooks run these automatically in Story 1.5)

### Files to Create/Modify

**Root Level:**
- `tsconfig.base.json` — Shared TypeScript configuration
- `.eslintrc.json` — ESLint rules for both workspaces
- `.prettierrc.json` — Prettier formatting rules

**Frontend Workspace:**
- `packages/client/tsconfig.json` — Extends base, inherits strict mode

**Backend Workspace:**
- `packages/server/tsconfig.json` — Extends base, inherits strict mode

### Dependencies Required

These should already be installed by starter (Story 1.1), but verify:
- `typescript` (5.0+)
- `eslint` (latest)
- `@typescript-eslint/eslint-plugin` (latest)
- `@typescript-eslint/parser` (latest)
- `prettier` (latest)

**Do NOT upgrade or add new packages here.** If missing, add only what's needed for TypeScript/linting.

---

## Implementation Strategy

### Step-by-Step Approach

1. **Create root `tsconfig.base.json`:**
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "ESNext",
       "lib": ["ES2020"],
       "moduleResolution": "bundler",
       "strict": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "declaration": true,
       "sourceMap": true
     },
     "include": ["src"],
     "exclude": ["node_modules", "dist"]
   }
   ```

2. **Update `packages/client/tsconfig.json`:**
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "jsx": "react-jsx",
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "outDir": "./dist"
     },
     "include": ["src"],
     "exclude": ["node_modules", "dist", "**/*.test.tsx"]
   }
   ```

3. **Update `packages/server/tsconfig.json`:**
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": "./src"
     },
     "include": ["src"],
     "exclude": ["node_modules", "dist", "**/*.test.ts"]
   }
   ```

4. **Create `.eslintrc.json`:**
   ```json
   {
     "parser": "@typescript-eslint/parser",
     "extends": [
       "eslint:recommended",
       "plugin:@typescript-eslint/recommended"
     ],
     "parserOptions": {
       "ecmaVersion": 2020,
       "sourceType": "module",
       "ecmaFeatures": { "jsx": true }
     },
     "rules": {
       "@typescript-eslint/explicit-function-return-types": "error",
       "@typescript-eslint/no-explicit-any": "error",
       "@typescript-eslint/explicit-module-boundary-types": "error",
       "@typescript-eslint/no-unused-vars": [
         "error",
         { "argsIgnorePattern": "^_" }
       ],
       "@typescript-eslint/naming-convention": [
         "error",
         {
           "selector": "default",
           "format": ["camelCase"]
         },
         {
           "selector": "variable",
           "format": ["camelCase", "UPPER_SNAKE_CASE"]
         },
         {
           "selector": "typeLike",
           "format": ["PascalCase"]
         }
       ]
     },
     "ignorePatterns": ["dist", "node_modules", "**/*.test.ts", "**/*.test.tsx"]
   }
   ```

5. **Create `.prettierrc.json`:**
   ```json
   {
     "printWidth": 100,
     "tabWidth": 2,
     "useTabs": false,
     "semi": true,
     "singleQuote": true,
     "trailingComma": "es5",
     "arrowParens": "always"
   }
   ```

6. **Add npm scripts to root `package.json`:**
   ```json
   {
     "scripts": {
       "type-check": "tsc --noEmit",
       "lint": "eslint . --ext .ts,.tsx",
       "lint:fix": "eslint . --ext .ts,.tsx --fix",
       "format": "prettier --write .",
       "format:check": "prettier --check ."
     }
   }
   ```

### Validation Checklist

- [ ] `tsconfig.base.json` exists at project root
- [ ] `packages/client/tsconfig.json` extends base and has `"strict": true`
- [ ] `packages/server/tsconfig.json` extends base and has `"strict": true`
- [ ] `.eslintrc.json` configured with TypeScript rules
- [ ] `.prettierrc.json` exists with formatting rules
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run lint` passes (may show warnings, no errors)
- [ ] `npm run format` auto-formats files
- [ ] Test file: Try writing `const x = 5; console.log(x.foo);` → type error caught

---

## Testing Strategy

**Manual Validation:**

1. **Type Safety Test:**
   ```typescript
   // In packages/client/src/test.tsx
   const user: any = {}; // @ts-expect-error: testing any usage
   ```
   - Must show error unless justified with comment

2. **Implicit Any Test:**
   ```typescript
   function example(x) { // Should error: parameter implicitly any
     return x + 1;
   }
   ```
   - Should fail `npm run type-check`

3. **Naming Convention Test:**
   ```typescript
   const MyVariable = 5; // Should warn: camelCase expected
   const MY_VARIABLE = 5; // OK (constant)
   const myVariable = 5; // OK
   ```

4. **React Component Test:**
   ```typescript
   interface Props { name: string; }
   const MyComponent: React.FC<Props> = ({ name }) => {
     return <div>{name}</div>;
   };
   ```
   - Must have explicit return type

**Command Validation:**
```bash
npm run type-check    # Should pass
npm run lint          # Should pass
npm run format        # Should auto-format
```

**Acceptance:** When all validation checks pass and no TypeScript errors exist, story is complete.

---

## Project Context Reference

This story aligns with:
- **Project Requirements:** PR5 (TypeScript strict mode enforced)
- **Architecture Requirements:** AR5 (TypeScript 5.0+ strict mode), AR15 (API response format consistency)
- **Code Quality:** ESLint configuration, naming conventions established for all future code
- **Language Rules:** All language-specific rules (TypeScript, type safety, naming conventions) from project-context.md

---

## Implementation Notes

### Why Strict Mode Now

Enabling strict mode early is critical because:
1. **Future-proofs code:** All new code written will be type-safe by default
2. **Prevents tech debt:** Easier to be strict from start than retrofit later
3. **Improves DX:** IDE autocomplete and error detection work better with types
4. **Catches bugs:** Many production bugs are type-related (null, undefined, wrong type)

### Common Strict Mode Challenges

**Challenge 1: Null Safety**
```typescript
// Strict: Must check for null
const length = user?.name?.length ?? 0;

// Loose: Would fail silently
const length = user.name.length;
```

**Challenge 2: Implicit Any**
```typescript
// Strict: Must type parameters
function process(data: unknown): string {
  if (typeof data === 'string') return data;
  throw new Error('Expected string');
}

// Loose: Would accept anything
function process(data) { ... }
```

**Challenge 3: Return Types**
```typescript
// Strict: Must declare return type
const isValid = (input: string): boolean => input.length >= 3;

// Loose: Type inferred (riskier)
const isValid = (input: string) => input.length >= 3;
```

### Prettier vs ESLint Conflict

Sometimes Prettier and ESLint rules conflict. Solution:
```bash
npm run lint:fix   # ESLint fixes first
npm run format     # Prettier formats last (wins conflicts)
```

---

## Previous Story Learning

**From Story 1.1 (Clone Starter):**
- Monorepo structure is now in place
- Both `tsconfig.json` files exist (may need updating)
- Starter likely has basic ESLint/Prettier (may be minimal)

**Action:** Review existing configs, update to enforce strict mode, don't overwrite entirely.

---

## Success Criteria

✅ **Done when:**
- `tsconfig.base.json` exists at root with `"strict": true`
- Both `packages/client/tsconfig.json` and `packages/server/tsconfig.json` extend base and enable strict
- `.eslintrc.json` configured with TypeScript rules and naming conventions
- `.prettierrc.json` exists with formatting rules
- `npm run type-check` passes with zero errors
- `npm run lint` passes with zero errors (optional warnings OK)
- `npm run format` auto-formats code consistently
- Naming conventions enforced (camelCase, PascalCase, UPPER_SNAKE_CASE)
- No implicit any types allowed without justification
- All React components have explicit return types

---

## Dependencies

- **Blocks:** Story 1.3 (Tailwind/shadcn/ui), Story 1.5 (Git workflow)
- **Blocked By:** Story 1.1 (monorepo setup)
- **Related:** Story 1.4 (testing setup uses same lint/type rules)

---

## Dev Agent Record

### Tasks Completed

- [x] Create `tsconfig.base.json` at project root
- [x] Update `packages/client/tsconfig.json` with strict mode
- [x] Update `packages/server/tsconfig.json` with strict mode
- [x] Create `.eslintrc.json` with TypeScript rules
- [x] Create `.prettierrc.json` with formatting rules
- [x] Add lint/format scripts to root `package.json`
- [x] Run `npm run type-check` and verify zero errors
- [x] Run `npm run lint` and verify passes
- [x] Run `npm run format` and verify auto-formats correctly
- [x] Test strict mode catches implicit any types

### Code Changes

- `tsconfig.base.json` — added `forceConsistentCasingInFileNames: true`
- `packages/client/tsconfig.json` — added `DOM.Iterable` to lib, updated include/exclude per story spec
- `packages/server/tsconfig.json` — added `ES2022.Error` to lib (enables `Error({ cause })` for Node 18+)
- `eslint.config.mjs` — upgraded to strict rules: `no-explicit-any: error`, `no-unused-vars: error`, added `explicit-function-return-type`, `explicit-module-boundary-types`, `naming-convention`; installed ESLint 9 + plugins
- `.prettierrc.json` — added `useTabs: false`
- `package.json` — added `lint:fix` script; ESLint packages added to devDependencies
- `packages/client/src/App.tsx` — added `React.FC` type to App component
- `packages/client/src/components/SideMenu.tsx` — replaced `ReactElement<any>` with `ReactElement`, added return type to `ListItemLink`
- `packages/client/src/components/LazyLoadingExample.tsx` — added `React.FC` to `Spinner`
- `packages/client/src/components/UsersList.tsx` — added `Promise<void>` return type to `fetchUsers`
- `packages/client/src/utils/api-facade.ts` — added `Promise<IUserDTO[]>` return type to `loadUsersAPI`
- `packages/server/src/app.ts` — added `{ cause: error }` to thrown Error (satisfies `preserve-caught-error` rule)
- `packages/client/src/types/shared.ts` — prettier formatting
- `packages/server/src/types/shared.ts` — prettier formatting
- `packages/server/src/config.ts` — prettier formatting

### Tests Created

N/A — configuration story; validated via `npm run type-check`, `npm run lint`, `npm run format:check`.

### Completion Notes

All ACs satisfied:
- AC1/AC2: strict mode enforced in both workspaces via tsconfig.base.json (strict: true inherited)
- AC3: tsconfig.base.json has all required compiler options including forceConsistentCasingInFileNames
- AC4: ESLint configured with TypeScript rules (eslint.config.mjs updated — flat config format used instead of .eslintrc.json per ESLint 9 requirement)
- AC5: naming-convention rule enforces camelCase/PascalCase/UPPER_CASE
- AC6: .prettierrc.json has all required settings
- AC7: noImplicitAny: true via strict mode; no-explicit-any: error in ESLint
- AC8/AC9: explicit-module-boundary-types and explicit-function-return-type rules enforce typed React components and function parameters
- AC10: npm run type-check ✅ zero errors; npm run lint ✅ zero errors; npm run format ✅ clean

Decision: Used `eslint.config.mjs` (flat config) instead of `.eslintrc.json` since ESLint 9 requires flat config format. The story spec predates ESLint 9 adoption.

---

## Review Findings

**Code Review Date:** 2026-04-18

### ✅ Acceptance Criteria Status
- AC1: TypeScript Strict Mode (Frontend) — **PASS** ✓
- AC2: TypeScript Strict Mode (Backend) — **PASS** ✓
- AC3: Root TypeScript Base Configuration — **PASS** ✓
- AC4-AC10: All validation checks — **PASS** ✓

### 🔧 Patches (Fixed)

- [x] [Review][Patch] Type inference mismatch on userId needs explicit type annotation [packages/server/src/routes/api-router.ts:14]
- [x] [Review][Patch] Unsafe type assertion on API response requires validation [packages/client/src/utils/api-facade.ts:5]
- [x] [Review][Patch] CORS_ORIGIN config has redundant trim() call [packages/server/src/config.ts:13]

### ⏸️ Deferred Issues (Pre-existing from Story 1-1)

- [x] [Review][Defer] Missing error handling in axios API call — deferred, pre-existing [packages/client/src/utils/api-facade.ts:8-9]
- [x] [Review][Defer] Hardcoded API proxy target in development config — deferred, pre-existing [packages/client/vite.config.ts:9]
- [x] [Review][Defer] Unused environment variable VITE_API_URL — deferred, pre-existing [packages/client/.env.example]
- [x] [Review][Defer] Hardcoded HTTP scheme breaks HTTPS deployments — deferred, pre-existing [packages/server/src/config.ts:13]
- [x] [Review][Defer] Race condition in UsersList component cleanup — deferred, pre-existing [packages/client/src/components/UsersList.tsx:181-199]
- [x] [Review][Defer] User not found returns mixed response type — deferred, pre-existing [packages/server/src/routes/api-router.ts:15]
- [x] [Review][Defer] Vite react-compiler plugin not installed — deferred, pre-existing [packages/client/vite.config.ts:8]
- [x] [Review][Defer] Users array exposure without defensive copy — deferred, pre-existing [packages/server/src/routes/api-router.ts:10-12]
- [x] [Review][Defer] Silent null returns without logging — deferred, pre-existing [packages/server/src/db.ts]
- [x] [Review][Defer] Server error handler doesn't catch app init errors — deferred, pre-existing [packages/server/src/index.ts]
- [x] [Review][Defer] Missing cache-control headers on GET endpoints — deferred, pre-existing [packages/server/src/routes/api-router.ts]
- [x] [Review][Defer] ESLint flat config uses deprecated globals pattern — deferred, pre-existing [eslint.config.mjs:7]

---

## File List

- `tsconfig.base.json`
- `.prettierrc.json`
- `eslint.config.mjs`
- `package.json`
- `packages/client/tsconfig.json`
- `packages/server/tsconfig.json`
- `packages/client/src/App.tsx`
- `packages/client/src/components/SideMenu.tsx`
- `packages/client/src/components/LazyLoadingExample.tsx`
- `packages/client/src/components/UsersList.tsx`
- `packages/client/src/utils/api-facade.ts`
- `packages/server/src/app.ts`
- `packages/client/src/types/shared.ts`
- `packages/server/src/types/shared.ts`
- `packages/server/src/config.ts`
