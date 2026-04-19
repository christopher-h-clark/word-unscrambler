---
storyId: '3.5'
storyKey: '3-5-errorboundary-component-error-handling'
epic: 3
epicTitle: 'Frontend UI Implementation'
title: 'Implement ErrorBoundary Component for Error Handling'
created: '2026-04-19'
lastUpdated: '2026-04-19'
completionStatus: 'ready-for-dev'
contextSource: 'Epic 3.5 + Project Context + Stories 3.1-3.4 Learnings'
devReadyDate: '2026-04-19'
---

# Story 3.5: Implement ErrorBoundary Component for Error Handling

## Story Overview

**Epic:** 3 - Frontend UI Implementation  
**Story ID:** 3.5  
**Depends On:** Story 1.4 (Testing infrastructure), Story 3.4 (App component -
will wrap it)  
**Blocks:** None - Final story in Epic 3  
**Completion:** Finalizes Epic 3, prepares for Epic 4 (Testing & QA)

**User Story:**

> As a **frontend developer**, I want to create an ErrorBoundary component that
> catches React component errors, so that unexpected component errors don't
> crash the entire application.

---

## Acceptance Criteria

✅ **AC3.5.1:** ErrorBoundary component created at
`packages/client/src/components/ErrorBoundary.tsx`

✅ **AC3.5.2:** Component is a React class component (error boundaries MUST be
class components, not functional)

- Why: React error boundaries only work with class components using
  getDerivedStateFromError() or componentDidCatch()
- Unlike Story 3.1, 3.2, 3.4 which use functional components

✅ **AC3.5.3:** When a child component throws an error, ErrorBoundary catches it

✅ **AC3.5.4:** ErrorBoundary displays fallback UI with message: "An unexpected
error occurred. Please reload the page."

- Message is clearer than "try again" (user knows to reload, not just retry)
- Fallback UI includes:
  - Error message text
  - (Optional) "Reload Page" button that calls `window.location.reload()`
- Styled consistently with app dark theme (same colors as ResultsDisplay)

✅ **AC3.5.5:** Error is logged for debugging with full details

- Log format:
  `console.error('ErrorBoundary caught:', error, errorInfo.componentStack)`
- Include: error message, stack trace, component tree where error occurred
- Logged to browser console (visible in DevTools → Console tab)

✅ **AC3.5.6:** ErrorBoundary prevents full-page white screen crash

- When component inside ErrorBoundary throws: fallback UI displays instead
- Without ErrorBoundary: entire app would be unmounted (white screen)
- With ErrorBoundary: only the failed component is replaced with fallback UI
- App remains interactive (user can still reload page, navigate away, etc.)

✅ **AC3.5.7:** Component wraps the entire App component in `main.tsx`

- In main.tsx: `<ErrorBoundary><App /></ErrorBoundary>`
- This is the top-level wrapper, catches all errors from App and its children
- Only component-level errors are caught (not network errors or async errors)

✅ **AC3.5.8:** ErrorBoundary uses TypeScript with proper error typing

- Type signature: `error: Error`, `errorInfo: React.ErrorInfo`
- errorInfo contains `componentStack` property (shows component tree where error
  occurred)
- Use getDerivedStateFromError() and componentDidCatch() lifecycle methods with
  proper types

✅ **AC3.5.9:** Comprehensive unit tests verify error catching and fallback UI
(coverage ≥ 80%)

---

## Developer Context & Critical Guardrails

### Project State

**All Epic 3 Stories Complete (Ready for Dev):**

- ✅ Story 3.1: SearchForm component
- ✅ Story 3.2: ResultsDisplay + ResultCard
- ✅ Story 3.3: useWordFetcher hook
- ✅ Story 3.4: App component integration
- ⏳ Story 3.5 (THIS): ErrorBoundary wrapper

**Epic 3 Completes** when this story is done.  
**Next Epic:** Epic 4 - Testing & Quality Assurance (comprehensive testing)

### File Structure

```
packages/client/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.tsx              ← NEW (THIS STORY)
│   │   ├── ErrorBoundary.test.tsx         ← NEW unit tests
│   │   ├── SearchForm.tsx                 (Story 3.1)
│   │   ├── ResultsDisplay.tsx             (Story 3.2)
│   │   └── ResultCard.tsx                 (Story 3.2)
│   ├── hooks/
│   │   └── useWordFetcher.ts              (Story 3.3)
│   ├── App.tsx                            (Story 3.4)
│   └── main.tsx                           (UPDATED - wrap App with ErrorBoundary)
├── index.html
├── vite.config.ts
└── tsconfig.json
```

### Why Error Boundaries Matter

**Without Error Boundary:**

- Component throws error → React unmounts entire component tree
- User sees blank page (white screen of death)
- App becomes unusable
- Developer gets no error information

**With Error Boundary:**

- Component throws error → ErrorBoundary catches it
- Fallback UI displays (friendly message)
- Other components still work
- Error logged for debugging
- App stays functional

**In This Project:**

- If SearchForm throws error → ErrorBoundary catches it, user sees message, can
  still retry
- If ResultsDisplay throws error → ErrorBoundary catches it, user sees message,
  can still search
- App never fully crashes

---

## Architecture Compliance

### From project-context.md

✅ **Error Handling Rules:**

- [ ] Frontend: Use Error boundaries for React component errors
- [ ] Never expose stack traces or technical details to user
- [ ] Display user-friendly error messages
- [ ] Log errors for debugging

✅ **Component Pattern:**

- [ ] Class component required (error boundaries must use class syntax)
- [ ] Implements `componentDidCatch` lifecycle method
- [ ] Implements `getDerivedStateFromError` static method
- [ ] Manages error state: `{ hasError, error }`

✅ **TypeScript:**

- [ ] All types explicit
- [ ] Props interface (optional - likely no props)
- [ ] State interface for error tracking

✅ **Styling:**

- [ ] User-friendly fallback UI
- [ ] Dark theme colors (matches rest of app)
- [ ] Clear, supportive message (not technical)

---

## Implementation Details

### Class Component Structure

```typescript
import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // Could also send to error tracking service (Sentry, etc.)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-300 mb-4">
              Please try again.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Integration in main.tsx

**Before (without ErrorBoundary):**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

**After (with ErrorBoundary):**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
```

### Logging & Debugging

**Error Information Logged:**

```typescript
componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
  // Log to console for development
  console.error('Error caught by ErrorBoundary:', {
    error: error.toString(),
    errorInfo: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
  });

  // Could send to error tracking service:
  // logToSentry(error, errorInfo);
  // logToNewRelic(error, errorInfo);
}
```

**Error Info Includes:**

- `error`: The error that was thrown
- `errorInfo.componentStack`: Stack trace showing which component threw the
  error
- Can be used for debugging and monitoring

### User-Facing Message

**Fallback UI Text:**

```
"Something went wrong. Please try again."
```

**Styling:**

- Dark background (matches app theme)
- Large, readable text
- Clear "Try Again" button to reset
- No technical details or stack traces
- Supportive, calm tone

---

## Testing Requirements

### Unit Tests: `ErrorBoundary.test.tsx`

**Test Framework:** Vitest + React Testing Library

**Key Test Cases:**

1. **Renders Children When No Error**
   - Render ErrorBoundary with child component
   - Assert: Child component renders without error
   - Assert: No fallback UI displayed

2. **Catches Component Error**
   - Create a component that throws on render
   - Render it inside ErrorBoundary
   - Assert: Error is caught (no global error)
   - Assert: Fallback UI displays

3. **Displays Fallback Message**
   - Render ErrorBoundary with throwing child
   - Assert: Message "Something went wrong" displays
   - Assert: "Please try again" text displays

4. **Shows Try Again Button**
   - Render ErrorBoundary with throwing child
   - Assert: "Try Again" button is visible
   - Assert: Button is clickable

5. **Try Again Button Resets State**
   - Render ErrorBoundary with throwing child (error shows)
   - Click "Try Again" button
   - Assert: Fallback UI disappears
   - Assert: hasError state resets to false

6. **Try Again Allows Rendering Working Component**
   - First render throws error (fallback shows)
   - Click "Try Again"
   - Render a working child component
   - Assert: Child renders successfully

7. **Logs Error to Console**
   - Mock console.error
   - Render throwing child
   - Assert: console.error called with error details
   - Assert: Error message includes error info

8. **Handles Multiple Sequential Errors**
   - First error → fallback shows → Try Again
   - Second error → fallback shows → Try Again
   - Assert: Each error cycle works independently

9. **Fallback UI Styling**
   - Render error state
   - Assert: Dark background theme applied
   - Assert: Text is readable (light color)
   - Assert: Button is visible and styled

**Coverage Goal:** ≥ 80% (all code paths: no error, with error, reset, logging)

**Testing Challenge - Error Boundaries:**

Error boundaries need special handling in tests because they suppress errors.
Use `vi.spyOn` to suppress console warnings:

```typescript
beforeEach(() => {
  // Suppress expected console.error calls in tests
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

**Test Helper Component:**

```typescript
// Component that throws on render
const ThrowingComponent: React.FC = () => {
  throw new Error('Test error from component');
};

// Component that renders conditionally
const ConditionalThrow: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Conditional error');
  }
  return <div>Working component</div>;
};
```

---

## Previous Story Learnings (Stories 3.1-3.4)

### Component Testing Pattern (Stories 3.1-3.2)

Stories 3.1-3.2 established:

- Test behavior, not implementation
- Use semantic queries (getByRole, getByText)
- Mock only what's needed

**For Story 3.5:**

- Test error catching behavior
- Mock console.error to verify logging
- Test fallback UI rendering

### Class vs Functional Components

**Note:** All previous stories used functional components (SearchForm,
ResultsDisplay, App).

**Story 3.5 is ONLY class component in this project** because error boundaries
are a React class feature.

**Why?** Error boundaries require:

- `getDerivedStateFromError` static method (class-only)
- `componentDidCatch` lifecycle method (class-only)
- No functional component equivalent yet in React

---

## Architecture Patterns & Standards

### Class Component Pattern (React Class Syntax)

```typescript
import React, { ErrorInfo, ReactNode } from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

interface Props {
  children: ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

**Key Points:**

- `getDerivedStateFromError`: Called after error thrown, updates state for
  render
- `componentDidCatch`: Called after error caught, use for logging/monitoring
- `render`: Returns fallback UI or children

### Error Logging Pattern

**Development:** Console errors for debugging  
**Production:** Could send to error tracking service (Sentry, LogRocket, etc.)

**Current Implementation:** Console only (sufficient for MVP)

```typescript
componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
  // Log with timestamp and component stack for debugging
  console.error('[ErrorBoundary]', {
    message: error.message,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
  });
}
```

### Fallback UI Pattern

**User-Friendly, Not Technical:**

```typescript
// ✅ Good: Clear, supportive message
<div>
  <h2>Something went wrong</h2>
  <p>Please try again.</p>
  <button onClick={() => this.setState({ hasError: false })}>
    Try Again
  </button>
</div>

// ❌ Bad: Technical details
<div>
  <h2>Error!</h2>
  <pre>{error.stack}</pre>
  <p>ReferenceError: undefined variable at line 42</p>
</div>
```

---

## Styling & Layout

### Fallback UI Styling

**Dark Theme (matching app):**

```typescript
<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
  {/* Full height, centered, gradient background */}
</div>

<div className="text-center px-4">
  {/* Centered text, responsive padding */}
</div>

<h2 className="text-2xl font-bold text-white mb-4">
  {/* 28px, bold, white, margin */}
</h2>

<p className="text-gray-300 mb-4">
  {/* Light gray, readable contrast */}
</p>

<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  {/* Styled button matching app theme */}
</button>
```

**Tailwind Classes:**

- `flex items-center justify-center` — Center content
- `min-h-screen` — Full viewport height
- `bg-gradient-to-b` — Gradient background
- `text-center` — Center text
- `text-white` — Light text
- `text-gray-300` — Secondary text color
- `bg-blue-500 hover:bg-blue-600` — Button styling
- `rounded` — Border radius
- `px-4 py-2` — Button padding

---

## Code Quality Standards

### TypeScript Requirements

✅ **Strict Mode:**

- [ ] All types explicit (Props, State interfaces)
- [ ] No implicit `any`
- [ ] Error parameter typed as `Error`
- [ ] ErrorInfo from React module

✅ **Naming:**

- [ ] Component: PascalCase (`ErrorBoundary`)
- [ ] State interface: `ErrorBoundaryState`
- [ ] Props interface: `ErrorBoundaryProps`
- [ ] Methods: camelCase (`componentDidCatch`)

✅ **No Wildcard Imports:**

- [ ] ✅ `import React, { ErrorInfo, ReactNode } from 'react'`
- [ ] ❌ ~~`import * as React from 'react'`~~

### ESLint & Prettier

Pre-commit checks:

- [ ] No unused variables
- [ ] No console.log in production (console.error is OK)
- [ ] No implicit `any`
- [ ] Proper indentation (2 spaces)
- [ ] Single quotes
- [ ] Semicolons required

### Testing Standards

✅ **Coverage:**

- [ ] ≥ 80% for ErrorBoundary component
- [ ] All code paths tested (no error, with error, reset)

✅ **Test Quality:**

- [ ] Semantic queries
- [ ] Mock console.error to suppress test warnings
- [ ] Test both error and non-error paths

---

## Critical Implementation Notes

### DO:

✅ **DO** use class component (error boundaries require class)

✅ **DO** implement `getDerivedStateFromError` static method

✅ **DO** implement `componentDidCatch` for logging

✅ **DO** display supportive, non-technical error message

✅ **DO** log error details for debugging

✅ **DO** provide "Try Again" button to reset

✅ **DO** wrap App component in ErrorBoundary

✅ **DO** use dark theme styling matching app

✅ **DO** include comprehensive tests

✅ **DO** type Props and State interfaces

### DON'T:

❌ **DON'T** expose error stack traces to user

❌ **DON'T** use functional component (must be class)

❌ **DON'T** suppress error logging (log for debugging)

❌ **DON'T** forget to reset error state on "Try Again"

❌ **DON'T** crash the boundary itself (use try/catch if needed)

❌ **DON'T** use overly technical error messages

❌ **DON'T** forget to import React for class syntax

❌ **DON'T** skip tests (required)

---

## Dependencies & External Libraries

### Required

- **React 18+** (Error boundaries)
- **TypeScript 5.0+**
- **@testing-library/react** (tests)
- **Vitest** (test runner)

### No New Dependencies

✅ All required libraries already installed and configured.

---

## Related Stories & Dependencies

**Completes:**

- Epic 3: Frontend UI Implementation (all 5 stories done)

**Prepares for:**

- Epic 4: Testing & Quality Assurance (comprehensive testing suite)

**Depends On:**

- Story 3.4 (App component to wrap with ErrorBoundary)
- All infrastructure from Stories 1-2

---

## Git & Commit Guidelines

### Commit Message Format

```
feat(ui): implement ErrorBoundary component for error handling

- Create ErrorBoundary class component for React error catching
- Implement getDerivedStateFromError and componentDidCatch
- Display supportive fallback UI with "Try Again" button
- Log errors to console for debugging
- Wrap App component in ErrorBoundary in main.tsx
- Use dark theme styling matching application
- Add comprehensive unit tests for error catching and reset (80%+ coverage)

Closes #3-5
```

### Files to Commit

- `packages/client/src/components/ErrorBoundary.tsx` (NEW)
- `packages/client/src/components/ErrorBoundary.test.tsx` (NEW)
- `packages/client/src/main.tsx` (UPDATED - import and wrap with ErrorBoundary)
- `packages/client/package.json` (UNCHANGED)

### Branch Name

```
feature/3-5-errorboundary-component
```

---

## Success Criteria Summary

When Story 3.5 is DONE:

1. ✅ ErrorBoundary.tsx component created as class component
2. ✅ getDerivedStateFromError implemented
3. ✅ componentDidCatch implemented with logging
4. ✅ State management: { hasError, error }
5. ✅ Props interface: { children }
6. ✅ Fallback UI displays when error caught
7. ✅ Fallback message: "Something went wrong. Please try again."
8. ✅ "Try Again" button resets error state
9. ✅ Error logged to console for debugging
10. ✅ Fallback UI uses dark theme styling
11. ✅ App component wrapped in ErrorBoundary in main.tsx
12. ✅ All components still work after error (error isolated)
13. ✅ User can retry after error
14. ✅ No technical details exposed in fallback UI
15. ✅ Comprehensive unit tests (≥ 80% coverage)
16. ✅ All tests pass locally
17. ✅ Code passes linting and formatting
18. ✅ TypeScript strict mode: no errors
19. ✅ No new dependencies added
20. ✅ Epic 3 complete: All frontend UI stories done

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

This story file provides complete error handling context:

- ✅ Class component pattern for error boundaries
- ✅ getDerivedStateFromError and componentDidCatch lifecycle
- ✅ Error logging and debugging strategy
- ✅ User-friendly fallback UI
- ✅ Integration with main.tsx
- ✅ Testing strategy for error catching
- ✅ Dark theme styling consistency
- ✅ Complete implementation example

### Files to Create

- [ ] `packages/client/src/components/ErrorBoundary.tsx`
- [ ] `packages/client/src/components/ErrorBoundary.test.tsx`

### Files to Update

- [ ] `packages/client/src/main.tsx` — Import and wrap App with ErrorBoundary

### Next Steps for Dev Agent

1. Implement ErrorBoundary.tsx as class component
2. Implement getDerivedStateFromError static method
3. Implement componentDidCatch for error logging
4. Create fallback UI with "Try Again" button
5. Update main.tsx to wrap App with ErrorBoundary
6. Write comprehensive unit tests (≥ 80% coverage)
7. Verify all tests pass: `npm run test -w packages/client`
8. Verify no TypeScript errors: `npm run type-check -w packages/client`
9. Verify ESLint passes: `npm run lint -w packages/client`
10. Commit changes with proper message
11. Mark story as `in-progress` in sprint-status.yaml
12. Upon completion, mark Epic 3 as done

---

**Development Complete When:** All acceptance criteria met, tests pass 100%,
code reviewed, Epic 3 finished.

---

## 🎉 Epic 3 Completion Note

**After Story 3.5 is complete:**

✅ **Epic 3: Frontend UI Implementation** is FINISHED

**All 5 Stories Complete:**

1. ✅ SearchForm component (input + submission)
2. ✅ ResultsDisplay + ResultCard (results display)
3. ✅ useWordFetcher hook (API communication)
4. ✅ App component (integration + orchestration)
5. ✅ ErrorBoundary (error safety)

**Ready for:**

- Epic 4: Testing & Quality Assurance (comprehensive test coverage)
- Epic 5: Deployment & Documentation (containerization + docs)

**User-Facing Features Ready:** ✅ Complete word unscrambler MVP!

---
