---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
  - api-specification.md
  - project-context.md
epicsApproved: true
epicCount: 5
storyCount: 24
frCoverage: 14/14
allStoriesApproved: true
validationStatus: complete
workflowStatus: complete
completedDate: 2026-04-17
---

# word-unscrambler - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for word-unscrambler, decomposing the requirements from the PRD, UX Design Specification, Architecture, API Specification, and Project Context into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Accept user input for 3-10 character letter combinations (a-z, case-insensitive, plus ? wildcard)
FR2: Validate input and reject non-alphabetic characters (except ?)
FR3: Perform dictionary-based word lookup returning all valid matches that can be formed from input letters
FR4: Group results by word length (3-letter, 4-letter, 5-letter, 6-letter, 7-letter, 8-letter, 9-letter, 10-letter)
FR5: Sort results alphabetically within each length group
FR6: Support wildcard character (?) matching any single letter
FR7: Display results showing all valid word combinations user can make
FR8: Handle "no words found" case with supportive message ("No words match those letters. Try different letters.")
FR9: Auto-focus input field on page load
FR10: Auto-clear input field when user clicks to start new lookup
FR11: Support both Enter key and button click for submission
FR12: Display results within 10 seconds of user submission
FR13: Return words only 3-10 characters in length (no shorter, no longer)
FR14: Prevent duplicate words in results

### Non-Functional Requirements

NFR1: Performance: All queries complete within 10 seconds (typical < 1 second)
NFR2: P99 Response Time: < 5 seconds
NFR3: Uptime: 99% acceptable (non-critical service)
NFR4: Zero false positives (only return dictionary-validated words)
NFR5: Bundle size: Frontend < 100KB gzipped (strict constraint, excluding dictionary)
NFR6: WCAG AA accessibility compliance (target WCAG AAA where practical)
NFR7: Responsive design: mobile-first, all devices (phone, tablet, desktop)
NFR8: Touch-friendly interface: minimum 44px × 44px touch targets
NFR9: Dark theme with neutral gray base and gradient hero background
NFR10: Dictionary load time: < 5 seconds at server startup
NFR11: Server fails loudly if dictionary cannot load (clear error message, exit code 1)
NFR12: API response time: typical < 1 second, maximum < 10 seconds
NFR13: All error messages sanitized (no stack traces, file paths, or system details exposed)
NFR14: Support case-insensitive input (uppercase/lowercase accepted and normalized)

### Additional Requirements from Architecture

AR1: Use fullstack-typescript starter as project foundation (GitHub: gilamran/fullstack-typescript)
AR2: Replace Material UI with Tailwind CSS + shadcn/ui for styling
AR3: Configure Vitest 1.0+ (unit/component tests) + Supertest (API integration tests) + Playwright 1.40+ (E2E tests)
AR4: Monorepo structure with npm workspaces: packages/client (frontend) and packages/server (backend)
AR5: TypeScript 5.0+ strict mode enforced in both frontend and backend
AR6: Vite 5+ for frontend bundling with hot module replacement (HMR)
AR7: Express 4.18+ for backend REST API server
AR8: Node.js 18+ LTS for backend runtime
AR9: File-based dictionary loaded at startup (no database), stored in memory as Set or Trie
AR10: Single REST API endpoint: GET /unscrambler/v1/words?letters={letters}
AR11: Implement DictionaryService as class with static methods (singleton pattern)
AR12: Use single state object pattern for React UI state: { words, isLoading, error }
AR13: Form input auto-clear pattern via onFocus handler (not onChange)
AR14: API response format consistency: Success { words: string[] }, Error { error: "CODE", message: "..." }
AR15: Error codes: LENGTH (invalid length), INVALID_CHAR (non-alphabetic), SERVER_ERROR (500 errors)
AR16: Docker + Docker Compose for containerized deployment
AR17: Environment configuration via .env.local per workspace (git-ignored)
AR18: OpenAPI 3.1 specification for API documentation (packages/server/openapi.yaml)
AR19: Test file organization: unit tests co-located with source, integration tests in __tests__/, E2E in e2e/
AR20: CORS configuration per environment (development: localhost:3000, production: env var)
AR21: Implement ErrorBoundary component for React error handling
AR22: API validation: reject if < 3 or > 10 characters, return 400 status with clear message
AR23: Dictionary words must be 3-10 characters (filter at load time or lookup time)
AR24: Results sorted alphabetically (single sort pass, no user-selectable sorting)
AR25: Test strategy: 60% unit tests, 30% integration tests, 10% E2E tests; minimum 70% coverage

### UX Design Requirements

UX-DR1: Input field auto-focuses on page load, ready for immediate typing
UX-DR2: Input placeholder text: "Enter 3-10 letters"
UX-DR3: Validation hint displayed below input: "3-10 letters accepted"
UX-DR4: Submit button text: "Unscramble!" with obvious visual prominence
UX-DR5: Submit via Enter key AND button click (both equally responsive)
UX-DR6: Results grouped by word length with clear section headers (e.g., "3-Letter Words")
UX-DR7: Words within each group sorted alphabetically and displayed inline, space-separated
UX-DR8: Results appear instantly without loading spinner or delay messaging
UX-DR9: "No words match those letters. Try different letters." message for empty results (supportive tone)
UX-DR10: Input field remains focused after results display (ready for next lookup)
UX-DR11: Input field auto-clears when user clicks to start new lookup (onFocus behavior)
UX-DR12: Submit button disabled visual state when input < 3 or > 7 characters
UX-DR13: Dark theme: background #1a1a1a, text #e8e8e8, surfaces #2d2d2d
UX-DR14: Soft blue accent color #4a9eff for button and visual highlights
UX-DR15: Soft teal accent color #20b2aa for focus rings
UX-DR16: Results displayed in card-based layout with left-border accent (#4a9eff)
UX-DR17: Gradient hero background (135deg, charcoal → cool blue → warm charcoal)
UX-DR18: Hero title 56px on desktop, 48px on mobile (responsive scaling)
UX-DR19: Subtitle 18px in soft blue accent color
UX-DR20: Body text 16px, secondary text 12px, all with high contrast (7:1+)
UX-DR21: Responsive design: full width on mobile, centered max-width 600px on desktop
UX-DR22: Touch targets minimum 44px × 44px (input and button exceed this)
UX-DR23: Visible focus state with colored ring (2-3px) on all interactive elements
UX-DR24: No error beeping or aggressive notifications (supportive, calm tone)
UX-DR25: No secondary navigation, options, settings buttons, or features beyond core lookup
UX-DR26: Results scannable in under 1 second (via word length grouping and alphabetical sorting)
UX-DR27: All text contrast ratio 7:1+ (WCAG AAA standard for accessibility)
UX-DR28: Input field accepts a-z, A-Z, ? characters; silently rejects others (no validation popup)
UX-DR29: System font stack for typography (no web font overhead)
UX-DR30: Input and button show subtle hover/focus state changes (color shift, not animation)

### Project/Development Requirements

PR1: Monorepo with npm workspaces: packages/client and packages/server
PR2: Root npm run dev starts both frontend and backend concurrently (via concurrently package)
PR3: Frontend dev: npm run dev:client (Vite on port 5173)
PR4: Backend dev: npm run dev:server (tsx --watch on port 3000)
PR5: TypeScript strict mode enforced in both workspaces (tsconfig.json strict: true)
PR6: ESLint + Prettier configuration for code quality and formatting
PR7: Unit tests co-located with source files (.test.tsx for components, .test.ts for utilities)
PR8: Integration tests in __tests__/ directory (organized by feature/module)
PR9: E2E tests in e2e/ directory at project root (Playwright framework)
PR10: Minimum test coverage: 70% overall, 80% for modified files
PR11: Pre-commit hooks with husky + lint-staged for auto-format and lint on commit
PR12: CI/CD pipeline checks: type-check, lint, tests, build, security audit, bundle size
PR13: Bundle size validation: fail build if > 100KB gzipped
PR14: Git branch naming: {type}/{description} (feature/, fix/, refactor/, test/, docs/, chore/)
PR15: Commit message format: {type}({scope}): {subject} with body and footer as needed
PR16: PR requires at least one peer review approval before merge
PR17: No force-push to main; use squash workflow on feature branches
PR18: Squash commits before merge to keep history clean
PR19: All tests pass locally (npm run test) before PR creation
PR20: Dictionary file: packages/server/data/words.txt (newline-delimited, one word per line)
PR21: Environment variables: REACT_APP_API_URL (client), NODE_ENV/PORT/WORD_LIST_PATH/CORS_ORIGIN (server)
PR22: Linting and formatting checked before merge (ESLint + Prettier)
PR23: Security audit via npm audit (fail on moderate or higher vulnerabilities)
PR24: No console.log statements in production code (allowed during development with linting)
PR25: Secrets scanning in CI/CD (fail merge if hardcoded credentials detected)

## Requirements Coverage Map

### Functional Requirements Mapping

**FR1:** Accept user input for 3-10 character combinations → **Epic 3** (SearchForm component)
**FR2:** Validate input and reject non-alphabetic characters → **Epic 2** (Input validation endpoint)
**FR3:** Perform dictionary-based word lookup → **Epic 2** (DictionaryService)
**FR4:** Group results by word length → **Epic 3** (ResultsDisplay component)
**FR5:** Sort results alphabetically within groups → **Epic 3** (ResultCard component)
**FR6:** Support wildcard character (?) matching → **Epic 2** (DictionaryService.canFormWord)
**FR7:** Display results showing all valid word combinations → **Epic 3** (ResultsDisplay)
**FR8:** Handle "no words found" with supportive message → **Epic 3** (ResultsDisplay empty state)
**FR9:** Auto-focus input field on page load → **Epic 3** (SearchForm component)
**FR10:** Auto-clear input field on new lookup → **Epic 3** (SearchForm component)
**FR11:** Support Enter key and button submission → **Epic 3** (SearchForm component)
**FR12:** Display results within 10 seconds → **Epic 2** (API performance)
**FR13:** Return only 3-10 character words → **Epic 2** (DictionaryService filtering)
**FR14:** Prevent duplicate words in results → **Epic 2** (DictionaryService deduplication)

**Coverage Summary:**
- Epic 1 (Foundation): Enables all others through tooling/patterns
- Epic 2 (Backend API): Covers FR2, FR3, FR6, FR12, FR13, FR14 (6 FRs)
- Epic 3 (Frontend UI): Covers FR1, FR4, FR5, FR7, FR8, FR9, FR10, FR11 (8 FRs)
- Epic 4 (Testing & QA): Validates all FRs through comprehensive testing
- Epic 5 (Deployment): Enables production access and maintenance

**Total FRs: 14/14 covered ✅**

### Non-Functional Requirements & Epic Alignment

**NFR1-5** (Performance, uptime, accuracy, bundle, accessibility) → **Epic 2 & 3** (implementation) + **Epic 4** (validation)
**NFR6-14** (Responsive design, dark theme, load time, errors, case-insensitivity) → **Epic 3** (UX) + **Epic 2** (API) + **Epic 4** (validation)

## Epic List

### Epic 1: Project Foundation & Setup
Users benefit from a stable development environment and clear patterns that speed up feature delivery.
**FRs covered:** Foundational (enables all other epics)
**User Value:** Clean dev workflow, fast iteration, code quality standards

### Epic 2: Backend API Implementation
Users can enter letters and get accurate word matches from a reliable API.
**FRs covered:** FR2, FR3, FR6, FR12, FR13, FR14
**User Value:** Core lookup engine works; users get accurate, fast answers

### Epic 3: Frontend UI Implementation
Users can interact with a beautiful, responsive interface to search for words and see organized results instantly.
**FRs covered:** FR1, FR4, FR5, FR7, FR8, FR9, FR10, FR11
**User Value:** Intuitive interface, zero friction, clear feedback, fast results

### Epic 4: Testing & Quality Assurance
Users experience a reliable, accessible app that works across devices and handles edge cases gracefully.
**FRs covered:** All FRs verified through comprehensive testing
**User Value:** App is stable, accessible, performant; minimal bugs

### Epic 5: Deployment & Documentation
Users can access the app in production; developers can maintain and deploy it.
**FRs covered:** N/A (enablement)
**User Value:** App is available and supported long-term

---

## Epic 1: Project Foundation & Setup

Initialize the monorepo structure, configure build tools, establish development workflow, and prepare the codebase for implementation.

### Story 1.1: Clone fullstack-typescript Starter and Initialize Monorepo Structure

As a **developer**,
I want to clone the fullstack-typescript starter and set up the monorepo with proper workspace configuration,
So that the project has a solid foundation with both frontend and backend ready for development.

**Acceptance Criteria:**

**Given** I start with an empty word-unscrambler directory
**When** I clone the fullstack-typescript starter repository
**Then** the project structure includes packages/client (React frontend) and packages/server (Express backend)

**And** the root package.json defines workspaces: ["packages/client", "packages/server"]

**And** npm install installs dependencies for all workspaces

**And** npm run dev starts both Vite (frontend on 5173) and Express (backend on 3000) concurrently

**And** both servers restart automatically on file save (HMR enabled)

**And** tsconfig.base.json provides shared TypeScript configuration for both workspaces

---

### Story 1.2: Configure TypeScript Strict Mode and Project Conventions

As a **developer**,
I want to configure TypeScript strict mode across both workspaces and establish naming conventions,
So that the codebase enforces type safety and follows consistent patterns.

**Acceptance Criteria:**

**Given** I have both packages/client and packages/server workspaces
**When** I configure tsconfig.json in each workspace with strict: true
**Then** both frontend and backend enforce TypeScript strict mode

**And** no implicit any types are allowed

**And** all function parameters must be explicitly typed

**And** all React components have explicit return types or React.FC<Props>

**And** eslintrc.json enforces naming conventions: camelCase for functions/variables, PascalCase for components, UPPER_SNAKE_CASE for constants

---

### Story 1.3: Install and Configure Tailwind CSS + shadcn/ui for Styling

As a **developer**,
I want to install Tailwind CSS and shadcn/ui components for the frontend,
So that styling is lightweight, customizable, and doesn't exceed the 100KB bundle constraint.

**Acceptance Criteria:**

**Given** I have the packages/client Vite project set up
**When** I install Tailwind CSS via Vite plugin
**Then** Tailwind CSS is integrated into the build pipeline

**And** shadcn/ui is initialized with a neutral color palette (grays and soft blue)

**And** core components are copied into the project: Button, Input

**And** Tailwind configuration uses dark theme defaults (#1a1a1a background, #e8e8e8 text)

**And** shadcn/ui buttons and inputs are styled with system font stack and Tailwind utilities

**And** the frontend bundle size is < 100KB gzipped (verified with build output)

---

### Story 1.4: Set Up Testing Infrastructure (Vitest, Supertest, Playwright)

As a **developer**,
I want to configure Vitest for unit tests, Supertest for API tests, and Playwright for E2E tests,
So that the project has a complete testing pyramid (60% unit, 30% integration, 10% E2E).

**Acceptance Criteria:**

**Given** I have both packages/client and packages/server workspaces
**When** I install Vitest 1.0+ in both workspaces
**Then** Vitest is configured and npm run test runs all unit tests

**And** I install Supertest in packages/server for API route testing

**And** I install Playwright 1.40+ at project root for E2E tests

**And** test directories are properly organized:
- Unit tests co-located with source files (.test.tsx, .test.ts)
- Integration tests in __tests__/ directories
- E2E tests in e2e/ directory at project root

**And** npm run test runs all tests across all workspaces

**And** test coverage threshold is set to 85% minimum

---

### Story 1.5: Configure Git Workflow, Pre-commit Hooks, and CI/CD Pipeline

As a **developer**,
I want to set up git branch naming conventions, commit message format, pre-commit hooks, and CI/CD pipeline,
So that the codebase maintains quality standards and prevents bad code from being committed.

**Acceptance Criteria:**

**Given** I have a git repository initialized
**When** I configure husky for pre-commit hooks
**Then** pre-commit hooks run ESLint + Prettier on staged files before commit

**And** lint-staged configuration ensures only changed files are checked

**And** commit messages are validated against the format: {type}({scope}): {subject}

**And** GitHub Actions CI/CD pipeline is configured to:
1. Run type-check (TypeScript strict mode)
2. Run lint (ESLint + Prettier)
3. Run tests (Vitest + Supertest + Playwright)
4. Build both frontend and backend
5. Validate bundle size < 100KB
6. Run security audit (npm audit)
7. Fail merge if any check fails

**And** Git branch naming enforces {type}/{description} format (feature/, fix/, refactor/, test/, docs/, chore/)

---

## Epic 2: Backend API Implementation

Build the Express API server, implement dictionary service, input validation, and word lookup logic.

### Story 2.1: Set Up Express App with Middleware, CORS, and Error Handling

As a **backend developer**,
I want to initialize Express with CORS, error handling middleware, and static file serving,
So that the backend can handle requests from the frontend and serve static assets in production.

**Acceptance Criteria:**

**Given** I have packages/server set up with Express 4.18+
**When** I create src/app.ts with Express configuration
**Then** the app includes CORS middleware configured for localhost:3000 (dev) or env var (production)

**And** CORS allows GET requests with Content-Type header

**And** a centralized error handler middleware catches all errors and returns sanitized responses

**And** no stack traces or file paths are exposed in error messages

**And** Express serves static frontend assets from ../client/dist in production

**And** src/index.ts starts the server on configurable PORT (default 3000)

---

### Story 2.2: Implement Dictionary Service with File Loading and Word Lookup

As a **backend developer**,
I want to implement a DictionaryService class that loads a word list from file and performs word lookups,
So that the API can quickly return valid words matching user input.

**Acceptance Criteria:**

**Given** I have packages/server/data/words.txt containing newline-delimited 3-10 letter English words
**When** the server starts, it initializes DictionaryService
**Then** DictionaryService loads the entire word list into memory (Set or Trie)

**And** if the dictionary file is missing or corrupted, the server exits with error code 1 and clear error message

**And** DictionaryService.findWords(letters) performs word lookup using the provided letters

**And** the lookup returns all valid words that can be formed from the input letters

**And** the lookup supports wildcard (?) matching any single letter

**And** results are sorted alphabetically

**And** results contain no duplicates

**And** results contain only 3-10 character words

**And** lookup completes in < 1 second for typical inputs

---

### Story 2.3: Implement Input Validation for Letters Parameter

As a **backend developer**,
I want to validate the letters query parameter before dictionary lookup,
So that invalid input is rejected with clear error messages (no server errors).

**Acceptance Criteria:**

**Given** I have the Express API route for /unscrambler/v1/words
**When** I receive a GET request with a letters query parameter
**Then** I validate that letters is present and is a string

**And** I validate that letters is 3-10 characters in length (or return 400 with "LENGTH" error code)

**And** I validate that letters contains only a-z, A-Z, and ? characters (or return 400 with "INVALID_CHAR" error code)

**And** I reject any other characters silently (no error popup, silent rejection in frontend)

**And** I normalize all uppercase letters to lowercase for internal processing

**And** error messages are user-friendly:
- LENGTH error: "Supplied text must be 3–7 characters in length."
- INVALID_CHAR error: "Supplied text may only include letters (upper or lower case) and question marks."

**And** error responses use { "error": "CODE", "message": "..." } format with 400 status code

---

### Story 2.4: Implement GET /unscrambler/v1/words Endpoint with Complete Logic

As a **backend developer**,
I want to create the GET /unscrambler/v1/words endpoint that validates input and returns word results,
So that the frontend can fetch words by making a single API call.

**Acceptance Criteria:**

**Given** I have input validation (Story 2.3) and DictionaryService (Story 2.2) implemented
**When** a valid request arrives: GET /unscrambler/v1/words?letters=abc
**Then** the endpoint validates the letters parameter

**And** it calls DictionaryService.findWords(letters) to perform lookup

**And** it returns 200 OK with response body: { "words": ["abc", "bac", "cab"] }

**And** words are sorted alphabetically

**And** empty results return { "words": [] } with 200 OK (not an error)

**And** the response time is < 10 seconds (typical < 1 second)

**And** when invalid input is received, it returns 400 with appropriate error message

**And** when a server error occurs (dictionary corrupted, etc.), it returns 500 with sanitized message

---

### Story 2.5: Create OpenAPI 3.1 Specification for API Documentation

As a **backend developer**,
I want to document the API in OpenAPI 3.1 format,
So that the API contract is clear and can be used by tools and clients.

**Acceptance Criteria:**

**Given** I have the /unscrambler/v1/words endpoint fully implemented
**When** I create packages/server/openapi.yaml
**Then** the file documents the complete API:
- Endpoint: GET /unscrambler/v1/words
- Parameters: letters (string, query, required)
- Success response: 200 with words array schema
- Error responses: 400, 500 with error schema
- Examples for each scenario (success, no results, invalid input, server error)

**And** the specification matches the implementation exactly

**And** the specification can be served at /api/openapi.json if desired

---

## Epic 3: Frontend UI Implementation

Build React components for search form, results display, and integrate with the backend API.

### Story 3.1: Implement SearchForm Component with Auto-Focus and Auto-Clear

As a **frontend developer**,
I want to create a SearchForm component with input field, hint text, and submit button,
So that users can enter letters and submit searches with the correct interactions.

**Acceptance Criteria:**

**Given** I'm building the SearchForm component in packages/client/src/components/SearchForm.tsx
**When** the component renders
**Then** the input field auto-focuses on first load (autoFocus attribute)

**And** the input has placeholder text: "Enter 3-10 letters"

**And** hint text below the input reads: "3-10 letters accepted"

**And** the submit button is labeled "Unscramble!"

**And** the button is disabled (grayed out) unless input contains 3-10 characters

**And** pressing Enter key submits the form

**And** clicking the button submits the form

**And** onFocus handler auto-clears the input field (enabling rapid retries without manual clearing)

**And** the component has TypeScript props interface defining onSubmit callback

**And** the component handles both text input and form submission

**And** unit tests verify auto-focus, auto-clear, button disable state, and submission behavior

---

### Story 3.2: Implement ResultsDisplay Component with Grouping and Sorting

As a **frontend developer**,
I want to create a ResultsDisplay component that organizes words by length and displays them in a scannable format,
So that users can quickly find words they're looking for.

**Acceptance Criteria:**

**Given** I'm building the ResultsDisplay component in packages/client/src/components/ResultsDisplay.tsx
**When** the component receives an array of words from the API
**Then** the component groups words by length (3-letter, 4-letter, 5-letter, etc.)

**And** each group is rendered as a separate card (ResultCard component)

**And** cards are only rendered for groups that have words (empty groups omitted)

**And** each card displays:
- Section header: "{length}-Letter Words" (e.g., "3-Letter Words")
- Words: displayed inline, space-separated, wrapping naturally

**And** when no words are found (empty array), display supportive message:
"No words match those letters. Try different letters."

**And** the message uses calm tone (not "Error" or "Invalid")

**And** words within each group are sorted alphabetically

**And** results appear instantly without loading animation or spinner

**And** ResultCard component is separate and accepts length and words array as props

**And** styling uses card-based layout with left-border accent in soft blue (#4a9eff)

**And** unit tests verify grouping, sorting, empty state handling, and ResultCard rendering

---

### Story 3.3: Implement useWordFetcher Custom Hook for API Communication

As a **frontend developer**,
I want to create a useWordFetcher custom hook that handles API calls with timeout and error handling,
So that the search form can fetch words from the backend cleanly and manage loading/error states.

**Acceptance Criteria:**

**Given** I'm building the useWordFetcher hook in packages/client/src/hooks/useWordFetcher.ts
**When** the hook is called with letters parameter
**Then** it makes a fetch request to GET /unscrambler/v1/words?letters={letters}

**And** the fetch includes a 10-second timeout using AbortController

**And** if the API returns success (200), it returns the words array

**And** if the API returns an error (400, 500), it returns the error message

**And** if the request times out, it returns timeout error message

**And** the hook manages state: { words, isLoading, error }

**And** it returns this state and a callable function to trigger new searches

**And** the hook handles all error cases gracefully (no unhandled rejections)

**And** unit tests verify fetch calls, timeout handling, error parsing, and state updates

---

### Story 3.4: Build App Component and Integrate Search Form with Results Display

As a **frontend developer**,
I want to assemble the App component that brings together SearchForm and ResultsDisplay,
So that the user can perform complete word lookups end-to-end.

**Acceptance Criteria:**

**Given** I have SearchForm, ResultsDisplay, and useWordFetcher implemented
**When** I build the App component in packages/client/src/App.tsx
**Then** the App includes:
- Hero section with title "Word Unscrambler", subtitle "Simple, fast, and easy"
- SearchForm component
- ResultsDisplay component
- Single state object managing { words, isLoading, error }

**And** SearchForm receives onSubmit callback that calls the word fetcher

**And** ResultsDisplay receives words array to display results

**And** the layout is single-column, centered, responsive to mobile/desktop

**And** styling uses dark theme with gradient hero background

**And** the app integrates API_BASE_URL from environment variable (process.env.REACT_APP_API_URL)

**And** the entire interaction loop works: type letters → submit → see results → ready for next lookup

**And** integration tests verify the complete flow

---

### Story 3.5: Implement ErrorBoundary Component for Error Handling

As a **frontend developer**,
I want to create an ErrorBoundary component that catches React component errors,
So that unexpected component errors don't crash the entire application.

**Acceptance Criteria:**

**Given** I'm building the ErrorBoundary component in packages/client/src/components/ErrorBoundary.tsx
**When** a child component throws an error
**Then** the ErrorBoundary catches it and displays a fallback UI

**And** the fallback message is: "Something went wrong. Please try again."

**And** the error is logged for debugging (console or error tracking)

**And** the user can still interact with the page (error is isolated)

**And** the component wraps the entire App component

**And** unit tests verify error catching and fallback UI display

---

## Epic 4: Testing & Quality Assurance

Implement comprehensive testing, accessibility audits, and performance validation.

### Story 4.1: Write Unit Tests for React Components (SearchForm, ResultsDisplay, ResultCard)

As a **test engineer**,
I want to create unit tests for all React components using Vitest + React Testing Library,
So that component behavior is verified and regressions are caught early.

**Acceptance Criteria:**

**Given** I have SearchForm, ResultsDisplay, and ResultCard components
**When** I write unit tests in co-located .test.tsx files
**Then** SearchForm tests verify:
- Input auto-focuses on mount
- Input accepts user typing
- Button is disabled when input < 3 or > 7 characters
- onSubmit callback is called when Enter key or button clicked
- Input auto-clears on focus

**And** ResultsDisplay tests verify:
- Words are grouped by length
- Empty groups are not rendered
- Empty state message displays when no words found
- Correct ResultCard components are rendered for each group

**And** ResultCard tests verify:
- Section header displays correct word length
- Words are displayed inline
- Styling (card, left border, spacing) is correct

**And** coverage for these components is >= 80%

**And** tests use semantic queries (getByRole, getByText) not implementation details

---

### Story 4.2: Write Integration Tests for API Routes (Supertest)

As a **test engineer**,
I want to create integration tests for the backend API using Supertest,
So that API behavior is verified end-to-end (validation, dictionary lookup, error handling).

**Acceptance Criteria:**

**Given** I have the Express API with /unscrambler/v1/words endpoint
**When** I write integration tests in packages/server/__tests__/routes/words.test.ts
**Then** tests verify:
- Valid input (abc) returns 200 with words array
- Input too short (ab) returns 400 with LENGTH error
- Input too long (abcdefghij) returns 400 with LENGTH error
- Non-alphabetic input (ab@cd) returns 400 with INVALID_CHAR error
- Wildcard input (h?llo) returns 200 with matching words
- Empty results (xyz) return 200 with empty array (not error)
- Sorting: words returned are alphabetically sorted
- Filtering: only 3-10 letter words returned

**And** tests use Supertest to make actual HTTP requests

**And** tests verify response format: { "words": [...] } or { "error": "CODE", "message": "..." }

**And** coverage for the routes is >= 80%

---

### Story 4.3: Write E2E Tests with Playwright (Happy Path and Error Paths)

As a **test engineer**,
I want to create end-to-end tests using Playwright that verify the complete user flow,
So that the application works correctly across browsers and devices.

**Acceptance Criteria:**

**Given** I have the complete app deployed locally (frontend + backend)
**When** I write E2E tests in e2e/ directory
**Then** tests verify:

**Happy Path (e2e/word-lookup.spec.ts):**
- User loads the app
- Input field is auto-focused
- User types valid letters (abc)
- User presses Enter or clicks button
- Results display with words grouped by length
- Words are alphabetically sorted

**Error Paths (e2e/error-handling.spec.ts):**
- User enters no words match (xyz)
- Supportive message displays: "No words match..."
- User can immediately retry

**Multiple Lookups (e2e/multiple-lookups.spec.ts):**
- User does first lookup
- User clicks input (field auto-clears)
- User does second lookup with different letters
- Both lookups return correct results

**Cross-Browser (e2e/cross-browser.spec.ts):**
- Tests run on Chrome, Firefox, Safari
- All lookups work on all browsers
- Responsive layout works on mobile

**And** tests use Playwright selectors to interact with the UI

**And** timeout is set to 30s per test with 2x retry for flakiness

---

### Story 4.4: Perform Accessibility Audit and Remediation

As a **test engineer**,
I want to audit the application for WCAG AA accessibility compliance and fix any issues,
So that the app is usable by all users including those with disabilities.

**Acceptance Criteria:**

**Given** I have the complete app built
**When** I audit using axe DevTools, Lighthouse, and WAVE
**Then** accessibility checks verify:
- Color contrast >= 7:1 (WCAG AAA)
- All interactive elements are keyboard accessible
- Tab order is logical (input → button)
- Focus states are clearly visible
- Form labels are properly associated with inputs
- Semantic HTML is used (button, input, section, h3 for headings)
- No hidden content that shouldn't be hidden
- Touch targets are >= 44px × 44px
- No flashing or rapid animations

**And** manual testing with screen readers (VoiceOver, NVDA) confirms:
- All text is announced correctly
- Form purpose is clear
- Results are scannable

**And** testing on actual devices (iPhone, Android, desktop) confirms:
- Touch interactions work smoothly
- Responsive layout adapts to screen size
- All words are readable

**And** any issues found are fixed before MVP release

---

### Story 4.5: Validate Bundle Size and Performance Targets

As a **test engineer**,
I want to verify that bundle size stays under 100KB and API response times stay under 10 seconds,
So that performance requirements are met.

**Acceptance Criteria:**

**Given** I have built the frontend
**When** I run npm run build in packages/client
**Then** the build output shows bundle size

**And** I verify bundle size < 100KB gzipped (confirmed in CI output)

**And** I test API performance with 1000+ word dictionary:
- Typical query (3-5 letters) completes in < 1 second
- Complex query (wildcard, longer letters) completes in < 10 seconds
- P99 response time is < 5 seconds

**And** I measure dictionary load time:
- Dictionary loads in < 5 seconds at server startup
- Server exits with error if dictionary fails to load

---

## Epic 5: Deployment & Documentation

Prepare Docker deployment, write documentation, and prepare for production release.

### Story 5.1: Create Dockerfile and Docker Compose for Full-Stack Deployment

As a **devops engineer**,
I want to create a Dockerfile and docker-compose.yml for containerized deployment,
So that the application can be deployed consistently across environments.

**Acceptance Criteria:**

**Given** I have the complete app (frontend + backend)
**When** I create Dockerfile at project root
**Then** the Dockerfile includes:
- Multi-stage build: build frontend (Vite), compile backend (TypeScript)
- Frontend build: npm run build -w packages/client
- Backend build: npm run build -w packages/server
- Runtime: Node.js image, starts Express server
- Entry point: node packages/server/dist/index.js
- Serves frontend static files from packages/client/dist

**And** I create docker-compose.yml at project root with:
- Service: word-unscrambler (single service)
- Port: 3000 (host:container)
- Environment variables: NODE_ENV, PORT, WORD_LIST_PATH, CORS_ORIGIN
- Build: Docker build from Dockerfile

**And** docker-compose up starts the app on port 3000

**And** the container includes the dictionary file (data/words.txt)

**And** the container can be deployed to Docker registry or Kubernetes

---

### Story 5.2: Set Up Environment Configuration for Development and Production

As a **devops engineer**,
I want to configure environment variables for both development and production deployment,
So that the app can be configured differently per environment.

**Acceptance Criteria:**

**Given** I have packages/client and packages/server
**When** I set up environment configuration
**Then** each workspace has .env.example (committed) and .env.local (git-ignored):

**packages/client/.env.example:**
```
REACT_APP_API_URL=http://localhost:3000
```

**packages/server/.env.example:**
```
NODE_ENV=development
PORT=3000
WORD_LIST_PATH=./data/words.txt
CORS_ORIGIN=http://localhost:5173
```

**And** developers copy examples to .env.local for local development

**And** production uses GitHub Secrets or CI/CD environment variables

**And** .env.local files are in .gitignore (never committed)

---

### Story 5.3: Write Deployment Documentation (README, DEVELOPMENT, DEPLOYMENT Guides)

As a **technical writer**,
I want to create comprehensive documentation for setup, development, and deployment,
So that new developers and operators can work with the project independently.

**Acceptance Criteria:**

**Given** I have the complete app and Docker setup
**When** I create documentation
**Then** README.md includes:
- Project overview and purpose
- Quick start (git clone, npm install, npm run dev)
- Usage (how to enter letters, understand results)
- Tech stack (React, Express, Docker, etc.)

**And** DEVELOPMENT.md includes:
- Local setup instructions
- Workspace structure explanation
- Development workflow (npm run dev, npm run dev:client, npm run dev:server)
- Testing (npm run test, how to run specific tests)
- Building (npm run build)
- Git workflow (branch naming, commits, PRs)

**And** DEPLOYMENT.md includes:
- Production deployment steps (Docker, docker-compose)
- Environment variable configuration
- Dictionary management
- Health checks and monitoring
- Rollback procedure

**And** ARCHITECTURE.md (or reference existing) explains:
- Technology choices and rationale
- Component structure and boundaries
- API contract and specification
- Testing strategy and coverage

**And** API.md documents the REST API endpoint with examples

**And** openapi.yaml documents the API in OpenAPI 3.1 (YAML format) with complete endpoint specifications, parameters, responses, and examples

---

### Story 5.4: Prepare for MVP Release and Production Deployment

As a **product manager**,
I want to validate that the MVP meets all requirements and is ready for production release,
So that the app can be deployed with confidence.

**Acceptance Criteria:**

**Given** I have completed all stories in Epics 1-4
**When** I perform final validation
**Then** I verify:
- All functional requirements (FR1-14) are implemented and tested
- All non-functional requirements (NFR1-14) are met (performance, bundle size, accessibility, etc.)
- All user flows are tested (happy path, error handling, multiple lookups)
- All accessibility requirements are met (WCAG AA, contrast, keyboard nav, screen reader)
- Bundle size < 100KB gzipped (verified in build output)
- API response time < 10 seconds typical (verified with load tests)
- Dictionary loads in < 5 seconds (verified in tests)
- No console errors or warnings
- All pre-commit checks pass (lint, type-check, tests, bundle size)
- CI/CD pipeline is green
- Documentation is complete and accurate

**And** when all checks pass, the app is ready for production deployment

**And** release notes document what was built and what's in scope

**And** post-MVP features (if any) are documented as future enhancements
