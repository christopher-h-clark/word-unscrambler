---
storyId: '3.4'
storyKey: '3-4-app-component-integrate-search-results'
epic: 3
epicTitle: 'Frontend UI Implementation'
title: 'Build App Component and Integrate Search Form with Results Display'
created: '2026-04-19'
lastUpdated: '2026-04-19'
completionStatus: 'ready-for-dev'
contextSource:
  'Epic 3.4 + UX Specification + Architecture Document + Stories 3.1-3.3
  Learnings'
devReadyDate: '2026-04-19'
---

# Story 3.4: Build App Component and Integrate Search Form with Results Display

## Story Overview

**Epic:** 3 - Frontend UI Implementation  
**Story ID:** 3.4  
**Depends On:** Story 1.3 (Tailwind configured), Story 3.1 (SearchForm), Story
3.2 (ResultsDisplay), Story 3.3 (useWordFetcher hook)  
**Blocks:** Story 3.5 (ErrorBoundary wraps App)

**User Story:**

> As a **frontend developer**, I want to assemble the App component that brings
> together SearchForm and ResultsDisplay, so that the user can perform complete
> word lookups end-to-end.

---

## Acceptance Criteria

✅ **AC3.4.1:** App component created at `packages/client/src/App.tsx`

✅ **AC3.4.2:** App includes hero section with:

- Title: "Word Unscrambler"
- Subtitle: "Simple, fast, and easy"

✅ **AC3.4.3:** SearchForm component rendered with:

- Input field for letters
- Hint text: "3-10 letters accepted"
- "Unscramble!" button

✅ **AC3.4.4:** ResultsDisplay component rendered with:

- Words grouped by length
- Words sorted alphabetically
- Empty state message when no results

✅ **AC3.4.5:** Single state object managing: `{ words, isLoading, error }`

✅ **AC3.4.6:** SearchForm receives `onSubmit` callback that triggers
useWordFetcher hook

✅ **AC3.4.7:** ResultsDisplay receives `words` array to display results

✅ **AC3.4.8:** Loading state displays during API request (optional: spinner or
message)

✅ **AC3.4.9:** Error state displays error message when API fails

✅ **AC3.4.10:** Layout is single-column, centered, responsive to mobile/desktop

✅ **AC3.4.11:** Styling uses dark theme with gradient hero background

✅ **AC3.4.12:** Environment variable `REACT_APP_API_URL` used for API base URL

✅ **AC3.4.13:** Complete integration tests verify entire flow: form → hook →
results (coverage ≥ 80%)

---

## Developer Context & Critical Guardrails

### Project State

**All Foundation Stories Complete:** ✅

- ✅ Story 3.1: SearchForm component (input collection, no API logic)
- ✅ Story 3.2: ResultsDisplay + ResultCard (results display, no API logic)
- ✅ Story 3.3: useWordFetcher hook (API communication, state management)

**Data Flow Ready:**

```
User Types → SearchForm
    ↓
User Submits → onSubmit callback
    ↓
App calls → useWordFetcher(letters)
    ↓
Hook manages → { words, isLoading, error }
    ↓
App passes state → ResultsDisplay receives words
    ↓
User sees → Results grouped by length
```

### File Structure

```
packages/client/
├── src/
│   ├── App.tsx                           ← MAIN ORCHESTRATOR (THIS STORY)
│   ├── main.tsx                          (entry point - unchanged)
│   ├── App.css                           (styling - Tailwind imports)
│   ├── components/
│   │   ├── SearchForm.tsx                (Story 3.1)
│   │   ├── ResultsDisplay.tsx            (Story 3.2)
│   │   └── ResultCard.tsx                (Story 3.2)
│   ├── hooks/
│   │   └── useWordFetcher.ts             (Story 3.3)
│   ├── types/
│   │   └── index.ts                      (types for all components)
│   └── __tests__/
│       └── integration/
│           └── App.integration.test.tsx  (end-to-end flow tests)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### UX Flow (From Stories 3.1-3.2)

**The Complete User Journey:**

1. **Page Load:**
   - Hero section displays (title, subtitle)
   - SearchForm displays (input auto-focused, ready for typing)
   - ResultsDisplay empty (no previous results)

2. **User Interaction:**
   - User types letters into SearchForm
   - Characters appear instantly
   - Button enables/disables based on length validation

3. **User Submits:**
   - User presses Enter or clicks "Unscramble!"
   - SearchForm's `onSubmit` callback triggers
   - App calls `fetchWords(letters)` via useWordFetcher hook

4. **Loading State (Optional):**
   - isLoading: true
   - Display spinner or message (optional: can skip if response is fast)

5. **Results Display:**
   - API returns { "words": [...] }
   - hook updates state with words
   - ResultsDisplay receives words, groups by length, displays cards

6. **Empty State (Alternative):**
   - API returns { "words": [] }
   - ResultsDisplay shows: "No words match those letters. Try different
     letters."

7. **Error State (Alternative):**
   - API returns 400/500 with error message
   - App displays error message
   - User can retry

8. **Next Lookup:**
   - User clicks SearchForm input → field auto-clears
   - User types new letters → ready for next lookup
   - Cycle repeats

---

## Architecture Compliance

### From project-context.md

✅ **React Application Patterns:**

- [ ] Functional component only (no class)
- [ ] Hooks for state: `useState`, custom hook `useWordFetcher`
- [ ] Explicit return type: `React.FC` or infer from JSX
- [ ] Props optional (no props needed - root component)

✅ **State Management:**

- [ ] Single state object: `{ words, isLoading, error }`
- [ ] Never both `isLoading` and `error` true
- [ ] Hook manages state internally
- [ ] App passes state to components as props

✅ **Styling (Tailwind + Dark Theme):**

- [ ] Hero section: Full width with gradient background
- [ ] Content section: Centered, responsive (60-70% width on desktop)
- [ ] Dark theme: #1a1a1a background, #e8e8e8 text
- [ ] Responsive: Mobile-first, stacked on small screens

✅ **TypeScript:**

- [ ] All types explicit (no `any`)
- [ ] Component return type explicit
- [ ] No wildcard imports

---

## Implementation Details

### App Component Structure

```typescript
import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useWordFetcher } from './hooks/useWordFetcher';
import type { SearchState } from './types';

export const App: React.FC = () => {
  // 1. Use the custom hook for API communication
  const { state, fetchWords } = useWordFetcher();

  // 2. Handler for SearchForm submission
  const handleSearchSubmit = async (letters: string): Promise<void> => {
    await fetchWords(letters);
  };

  // 3. Render
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <header className="text-center py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
          Word Unscrambler
        </h1>
        <p className="text-xl text-blue-400 mb-8">
          Simple, fast, and easy
        </p>

        {/* SearchForm Component */}
        <SearchForm onSubmit={handleSearchSubmit} />
      </header>

      {/* Results Section */}
      <main className="flex justify-center px-4 pb-16">
        <div className="w-full max-w-2xl">
          {/* Loading State (optional) */}
          {state.isLoading && (
            <div className="text-center text-blue-400">
              <p>Loading...</p>
            </div>
          )}

          {/* Error State */}
          {state.error && (
            <div className="text-center text-red-500">
              <p>{state.error}</p>
            </div>
          )}

          {/* Results Display */}
          {!state.isLoading && !state.error && (
            <ResultsDisplay words={state.words} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
```

### State Management

```typescript
// From useWordFetcher hook (Story 3.3)
const { state, fetchWords } = useWordFetcher();

// state structure:
// {
//   words: string[],      // Array of valid words from API
//   isLoading: boolean,   // true during API request
//   error: string | null  // Error message, or null if no error
// }
```

### Data Flow

```
┌─────────────────────────────────────────────────────┐
│                    App Component                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  useWordFetcher Hook                         │  │
│  │  { state, fetchWords }                       │  │
│  └──────────────────────────────────────────────┘  │
│         ↓                              ↑            │
│   onSubmit(letters)            handleSearchSubmit   │
│         ↓                              ↑            │
│  ┌──────────────────────────────────────────────┐  │
│  │  SearchForm Component                        │  │
│  │  Input field, Button                         │  │
│  └──────────────────────────────────────────────┘  │
│         ↓              ↑                            │
│      state props   onSubmit callback               │
│         ↓              ↑                            │
│  ┌──────────────────────────────────────────────┐  │
│  │  ResultsDisplay Component                    │  │
│  │  words array → ResultCard → Display          │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Styling & Layout

**Hero Section (Gradient Background):**

```typescript
<div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
  {/* Full-height, gradient background */}
</div>

<header className="text-center py-16 px-4">
  {/* Title and subtitle centered, centered content */}
</header>
```

**Results Section (Responsive Container):**

```typescript
<main className="flex justify-center px-4 pb-16">
  <div className="w-full max-w-2xl">
    {/* Centered, responsive, max-width 640px */}
  </div>
</main>
```

**Tailwind Classes:**

- `min-h-screen` — Full viewport height
- `bg-gradient-to-b` — Vertical gradient
- `from-gray-900 via-blue-900 to-gray-900` — Gradient colors
- `text-center` — Center text
- `py-16` — Vertical padding
- `px-4` — Horizontal padding (responsive)
- `flex justify-center` — Center horizontally
- `w-full max-w-2xl` — Full width, capped at 640px
- `md:text-6xl` — Responsive title sizing

### Environment Variable Configuration

**Development (.env.local):**

```
REACT_APP_API_URL=http://localhost:3000
```

**Production (CI/CD environment):**

```
REACT_APP_API_URL=https://api.example.com
```

**In App Component:**

```typescript
// Hook uses environment variable internally
const { state, fetchWords } = useWordFetcher();
// useWordFetcher hook handles: process.env.REACT_APP_API_URL || 'http://localhost:3000'
```

---

## Testing Requirements

### Integration Tests: `App.integration.test.tsx`

**Test Framework:** Vitest + React Testing Library

**Test Scope:** End-to-end user flow from form submission to results display

**Key Test Cases:**

1. **App Renders**
   - Assert: Hero section displays with title and subtitle
   - Assert: SearchForm component rendered
   - Assert: ResultsDisplay component rendered (empty initially)

2. **Happy Path: User Submits and Sees Results**
   - Mock `useWordFetcher` to return success state
   - User types letters and submits
   - Assert: Results display with correct words

3. **Loading State Display**
   - Mock `useWordFetcher` to return
     `{ words: [], isLoading: true, error: null }`
   - Assert: Loading message displays
   - Assert: Results NOT displayed during loading

4. **Empty Results (No Words Found)**
   - Mock `useWordFetcher` to return
     `{ words: [], isLoading: false, error: null }`
   - User types "xyz" and submits
   - Assert: Empty state message displays ("No words match...")

5. **Error State Display**
   - Mock `useWordFetcher` to return
     `{ words: [], isLoading: false, error: "Request failed" }`
   - Assert: Error message displays
   - Assert: Results NOT displayed

6. **Multiple Lookups**
   - First lookup: Returns words
   - Second lookup: Returns different words
   - Assert: Results updated correctly

7. **SearchForm Integration**
   - Assert: SearchForm receives `onSubmit` callback
   - User interaction triggers callback with correct letters

8. **ResultsDisplay Integration**
   - Assert: ResultsDisplay receives `words` array
   - Words are grouped and sorted correctly

9. **Responsive Layout**
   - Render on mobile viewport (< 600px)
   - Assert: Layout is responsive (single column, full width)
   - Render on desktop viewport (> 1024px)
   - Assert: Layout is centered with max-width

**Coverage Goal:** ≥ 80% of App component code paths

**Mock Strategy:**

```typescript
// Mock the custom hook
vi.mock('../hooks/useWordFetcher', () => ({
  useWordFetcher: vi.fn(() => ({
    state: { words: [], isLoading: false, error: null },
    fetchWords: vi.fn(),
  })),
}));

// Mock SearchForm and ResultsDisplay components (optional)
vi.mock('../components/SearchForm', () => ({
  SearchForm: ({ onSubmit }: any) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit('abc'); }}>
      <button>Test Submit</button>
    </form>
  ),
}));
```

---

## Previous Story Learnings (Stories 3.1-3.3)

### Component Patterns (Story 3.1 - SearchForm)

**Established Pattern:**

- Form component is stateless (no loading/error states)
- Form receives `onSubmit` callback from parent
- Form calls callback on submission
- Parent orchestrates state

**For Story 3.4:**

- App is the orchestrator (like Story 3.1's parent)
- App provides `onSubmit` callback to SearchForm
- App calls hook to fetch data

### Display Patterns (Story 3.2 - ResultsDisplay)

**Established Pattern:**

- Display component receives data as props
- Display has no loading or error states
- Parent manages state and conditional rendering

**For Story 3.4:**

- App conditionally renders ResultsDisplay
- App manages loading/error states
- App passes words array to ResultsDisplay

### Hook Patterns (Story 3.3 - useWordFetcher)

**Established Pattern:**

- Hook manages all API logic and state
- Hook returns { state, async function }
- Parent component uses hook directly

**For Story 3.4:**

- App uses hook at top level
- App extracts state and trigger function
- App passes state to conditional rendering and components

### Testing Patterns (Stories 3.1-3.3)

**Established Pattern:**

- Test behavior, not implementation
- Mock dependencies appropriately
- Use semantic queries (getByRole, getByText)

**For Story 3.4:**

- Test complete flow (form → hook → results)
- Mock hook to control state
- Test conditional rendering logic

---

## Architecture Patterns & Standards

### Root Component Pattern

**App component is the root orchestrator:**

- Manages single state (via hook)
- Handles event callbacks from children
- Controls conditional rendering
- Sets up global layout and styling

**Pattern:**

```typescript
export const App: React.FC = () => {
  // 1. Use hooks for state
  const { state, fetchWords } = useWordFetcher();

  // 2. Create handlers that call hook/update state
  const handleSearchSubmit = async (letters: string) => {
    await fetchWords(letters);
  };

  // 3. Render with conditional sections
  return (
    <div>
      <SearchForm onSubmit={handleSearchSubmit} />
      {state.isLoading && <LoadingState />}
      {state.error && <ErrorState error={state.error} />}
      {!state.isLoading && !state.error && <ResultsDisplay words={state.words} />}
    </div>
  );
};
```

### Conditional Rendering Pattern

**From project-context.md:**

```typescript
// ✅ Good: Clear, readable conditionals
{state.isLoading && <LoadingIndicator />}
{state.error && <ErrorMessage error={state.error} />}
{!state.isLoading && !state.error && <Results words={state.words} />}

// ❌ Avoid: Ternary chains
{state.isLoading ? <Loading /> : state.error ? <Error /> : <Results />}
```

### Responsive Design Pattern (Tailwind)

**Mobile-First Approach:**

```typescript
<div className="px-4">
  {/* base: full width - 8px margins */}
  {/* md/lg: can add responsive sizing */}
</div>

<div className="w-full max-w-2xl">
  {/* base: full width */}
  {/* max-w-2xl caps at 640px */}
</div>

<h1 className="text-5xl md:text-6xl">
  {/* base: 48px, md and up: 56px */}
</h1>
```

---

## Styling & Layout Details

### Dark Theme Colors (From project-context.md)

```
Background:     #1a1a1a (gray-900)
Surface:        #2d2d2d (gray-700)
Text Primary:   #e8e8e8 (gray-100)
Text Secondary: #a0a0a0 (gray-400)
Accent 1:       #4a9eff (blue-500)
Accent 2:       #20b2aa (teal-500)
Gradient:       linear-gradient(135deg, #111827 0%, #1e3a5f 50%, #4a1a1a 100%)
```

### Hero Section Layout

```
┌─────────────────────────────────┐
│   Full Viewport Height           │
│   Dark Gradient Background       │
│                                 │
│   (Vertical Spacing: 64px)       │
│                                 │
│  Word Unscrambler (Title)        │
│                                 │
│  Simple, fast, and easy (Subtitle) │
│                                 │
│  (Vertical Spacing: 32px)        │
│                                 │
│  [Input Field]                  │
│  3-10 letters accepted (Hint)    │
│  [Unscramble! Button]            │
│                                 │
└─────────────────────────────────┘
```

### Results Section Layout

```
┌────────────────────────────────────┐
│         Main Content Area          │
│                                   │
│         [Results Cards]            │
│                                   │
│  Max-Width: 640px, Centered        │
│  Responsive: 100% on mobile        │
│                                   │
│         OR                         │
│                                   │
│  [Loading Message]                 │
│         OR                         │
│  [Error Message]                   │
│                                   │
│         OR                         │
│  [Empty State: No words match]     │
│                                   │
└────────────────────────────────────┘
```

---

## Code Quality Standards

### TypeScript Requirements

✅ **Strict Mode:**

- [ ] All types explicit
- [ ] No implicit `any`
- [ ] Return type explicit (React.FC or inferred)

✅ **Naming:**

- [ ] Component: PascalCase (`App`)
- [ ] Props: None (root component)
- [ ] Handlers: camelCase (`handleSearchSubmit`)
- [ ] Constants: UPPER_SNAKE_CASE

✅ **No Wildcard Imports:**

- [ ] ✅ `import { useState } from 'react'`
- [ ] ❌ ~~`import * as React from 'react'`~~

### ESLint & Prettier

Pre-commit checks:

- [ ] No unused variables
- [ ] No console.log
- [ ] No implicit `any`
- [ ] Proper indentation (2 spaces)
- [ ] Single quotes
- [ ] Semicolons required

### Testing Standards

✅ **Coverage:**

- [ ] ≥ 80% for App component
- [ ] All conditional paths tested

✅ **Test Quality:**

- [ ] Semantic queries
- [ ] Mock dependencies appropriately
- [ ] Test complete flow

---

## Critical Implementation Notes

### DO:

✅ **DO** use `useWordFetcher` hook at top level

✅ **DO** manage single state object: `{ words, isLoading, error }`

✅ **DO** pass `onSubmit` callback to SearchForm

✅ **DO** pass `words` array to ResultsDisplay

✅ **DO** conditionally render based on state

✅ **DO** use dark theme colors and gradient background

✅ **DO** make layout responsive (mobile-first)

✅ **DO** use environment variable for API URL

✅ **DO** include comprehensive integration tests

✅ **DO** type all handlers and functions

### DON'T:

❌ **DON'T** make API calls directly (use hook)

❌ **DON'T** include API URL in App component (hook handles it)

❌ **DON'T** pass multiple state variables to children (use single object via
hook)

❌ **DON'T** render SearchForm and ResultsDisplay without App orchestration

❌ **DON'T** skip loading/error state handling

❌ **DON'T** hardcode colors (use Tailwind classes)

❌ **DON'T** use class components

❌ **DON'T** use implicit `any` types

❌ **DON'T** skip integration tests

---

## Dependencies & External Libraries

### Required

- **React 18+** (hooks)
- **TypeScript 5.0+**
- **Tailwind CSS** (styling)
- **@testing-library/react** (tests)
- **Vitest** (test runner)

### No New Dependencies

✅ All required libraries already installed and configured.

---

## Related Stories & Dependencies

**Blocks:**

- Story 3.5 (ErrorBoundary) — wraps App component

**Depends On:**

- Story 1.3 (Tailwind configured)
- Story 3.1 (SearchForm component)
- Story 3.2 (ResultsDisplay component)
- Story 3.3 (useWordFetcher hook)

**Completes:**

- Epic 3: Frontend UI Implementation (all core features done)
- Next: Story 3.5 (ErrorBoundary - final frontend story)

---

## Git & Commit Guidelines

### Commit Message Format

```
feat(ui): build App component with complete integration

- Create App root component orchestrating all frontend features
- Integrate SearchForm, ResultsDisplay, ResultCard, useWordFetcher hook
- Manage single state object: { words, isLoading, error }
- Implement hero section with gradient background and dark theme
- Add responsive layout (mobile-first, centered on desktop)
- Display loading and error states appropriately
- Add comprehensive integration tests for end-to-end flow (80%+ coverage)

Closes #3-4
```

### Files to Commit

- `packages/client/src/App.tsx` (NEW)
- `packages/client/src/__tests__/integration/App.integration.test.tsx` (NEW)
- `packages/client/src/main.tsx` (UPDATED if needed - import App)
- `packages/client/src/App.css` (UPDATED - Tailwind imports)

### Branch Name

```
feature/3-4-app-component-integration
```

---

## Success Criteria Summary

When Story 3.4 is DONE:

1. ✅ App.tsx component created with all AC requirements
2. ✅ Hero section displays title and subtitle
3. ✅ SearchForm component rendered with callback integration
4. ✅ ResultsDisplay component rendered with words prop
5. ✅ useWordFetcher hook integrated (state and function)
6. ✅ Single state object: `{ words, isLoading, error }`
7. ✅ onSubmit callback triggers hook correctly
8. ✅ Loading state displays during API request
9. ✅ Error state displays error messages
10. ✅ Results display when API succeeds
11. ✅ Empty state displays when no words found
12. ✅ Layout responsive (mobile and desktop)
13. ✅ Dark theme with gradient hero background
14. ✅ Environment variable used for API URL
15. ✅ Comprehensive integration tests (≥ 80%)
16. ✅ All tests pass locally
17. ✅ Code passes linting and formatting
18. ✅ TypeScript strict mode: no errors
19. ✅ No new dependencies added
20. ✅ Complete end-to-end user flow works

---

## Story Completion Tracking

**Status:** ready-for-dev  
**Created:** 2026-04-19  
**Dev Agent:** Amelia (claude-haiku-4-5-20251001)  
**Context Engine:** BMad Create Story  
**Validation:** Story file meets all critical guardrails

---

## Dev Agent Record

### Ready for Implementation

This story file provides complete integration context:

- ✅ All component dependencies documented (3.1, 3.2, 3.3)
- ✅ Data flow and state management patterns established
- ✅ Hero section and responsive layout specifications
- ✅ Conditional rendering patterns for all states
- ✅ Integration test strategy covering end-to-end flow
- ✅ Previous story patterns incorporated
- ✅ Environment variable configuration
- ✅ All styling with dark theme and Tailwind

### Files to Create

- [ ] `packages/client/src/App.tsx`
- [ ] `packages/client/src/__tests__/integration/App.integration.test.tsx`

### Files to Update

- [ ] `packages/client/src/main.tsx` — Import and use App component if needed
- [ ] `packages/client/src/App.css` — Add Tailwind imports if not present

### Next Steps for Dev Agent

1. Implement App.tsx with all integration points
2. Create hero section with gradient background
3. Render SearchForm with onSubmit callback
4. Render ResultsDisplay with conditional logic
5. Manage state from useWordFetcher hook
6. Write comprehensive integration tests (≥ 80% coverage)
7. Verify all tests pass: `npm run test -w packages/client`
8. Verify no TypeScript errors: `npm run type-check -w packages/client`
9. Verify ESLint passes: `npm run lint -w packages/client`
10. Commit changes with proper message
11. Mark story as `in-progress` in sprint-status.yaml
12. Upon completion, run code-review workflow

---

**Development Complete When:** All acceptance criteria met, integration tests
pass 100%, code reviewed and approved.

---
