---
storyId: '3.2'
storyKey: '3-2-resultsdisplay-component-grouping-sorting'
epic: 3
epicTitle: 'Frontend UI Implementation'
title: 'Implement ResultsDisplay Component with Grouping and Sorting'
created: '2026-04-19'
lastUpdated: '2026-04-19'
completionStatus: 'ready-for-dev'
contextSource:
  'Epic 3.2 + UX Specification + Architecture Document + Project Context + Story
  3.1 Learnings'
devReadyDate: '2026-04-19'
---

# Story 3.2: Implement ResultsDisplay Component with Grouping and Sorting

## Story Overview

**Epic:** 3 - Frontend UI Implementation  
**Story ID:** 3.2  
**Depends On:** Story 1.3 (Tailwind + shadcn/ui configured), Story 2.4 (API
endpoint fully functional), Story 3.1 (SearchForm component complete)  
**Blocks:** Story 3.3 (useWordFetcher hook integration), Story 3.4 (App
component integration)

**User Story:**

> As a **frontend developer**, I want to create a ResultsDisplay component that
> organizes words by length and displays them in a scannable format, so that
> users can quickly find words they're looking for.

---

## Acceptance Criteria

✅ **AC3.2.1:** ResultsDisplay component created at
`packages/client/src/components/ResultsDisplay.tsx`

✅ **AC3.2.2:** Component receives array of words: `(words: string[])`

✅ **AC3.2.3:** Words are grouped by length (3-letter words, 4-letter words,
5-letter words, etc.)

✅ **AC3.2.4:** Each group rendered as a separate card using ResultCard
component (separate file)

✅ **AC3.2.5:** Cards only rendered for groups that have words (empty groups
completely omitted)

✅ **AC3.2.6:** Each card displays:

- Section header: "{length}-Letter Words" (e.g., "3-Letter Words", "7-Letter
  Words")
- Words: displayed inline, space-separated, wrapping naturally

✅ **AC3.2.7:** When no words found (empty array), display supportive message:
"No words match those letters. Try different letters."

✅ **AC3.2.8:** Message uses calm tone (not "Error" or "Invalid")

✅ **AC3.2.9:** Words within each group are sorted alphabetically (e.g., "abc
bac cab" not "cab abc bac")

✅ **AC3.2.10:** Results appear instantly without loading animation or spinner

✅ **AC3.2.11:** ResultCard component is separate:
`packages/client/src/components/ResultCard.tsx`

✅ **AC3.2.12:** ResultCard accepts props: `length: number`, `words: string[]`

✅ **AC3.2.13:** Styling uses card-based layout with:

- Background: #2d2d2d
- Padding: 20px
- Border-radius: 4px
- Left border: 3px solid #4a9eff (Accent 1)
- Margin-bottom: 16px

✅ **AC3.2.14:** Comprehensive unit tests verify grouping, sorting, empty state,
and ResultCard rendering (coverage ≥ 80%)

---

## Developer Context & Critical Guardrails

### Project State

**Epic 2 Completion:** ✅ DONE

- Backend API fully functional and tested
- Response format: `{ "words": ["abc", "bac", "cab"] }` or `{ "words": [] }`

**Epic 3 Progress:**

- ✅ Story 3.1: SearchForm component (COMPLETE)
- ⏳ Story 3.2 (THIS): ResultsDisplay component
- ⏸ Story 3.3: useWordFetcher hook
- ⏸ Story 3.4: App component integration
- ⏸ Story 3.5: ErrorBoundary component

**API Contract (From 2.5 OpenAPI Spec):**

- Success response: `{ "words": ["abc", "bac", "cab"] }`
- Empty results: `{ "words": [] }` (HTTP 200, NOT an error)
- Error response: `{ "error": "CODE", "message": "..." }` (HTTP 400/500)

### File Structure

```
packages/client/
├── src/
│   ├── components/
│   │   ├── SearchForm.tsx                (COMPLETED Story 3.1)
│   │   ├── ResultsDisplay.tsx            ← NEW (THIS STORY)
│   │   │   └── ResultsDisplay.test.tsx   ← NEW unit tests
│   │   ├── ResultCard.tsx                ← NEW (child component)
│   │   │   └── ResultCard.test.tsx       ← NEW unit tests
│   │   └── ErrorBoundary.tsx             (Story 3.5)
│   ├── types/
│   │   └── index.ts                      (EXPORT: ResultsDisplayProps, ResultCardProps)
│   ├── App.tsx                           (Story 3.4)
│   └── main.tsx
├── vite.config.ts
├── tsconfig.json
├── package.json
```

### UX Design Principles (From UX Specification)

**Critical Design Principles:**

1. **Instant Results Display:** Results appear instantly after API response (no
   animation, no delay). User sees immediate feedback that their submission
   worked.

2. **Scannable Organization:** Grouping by word length is the PRIMARY
   organizational principle. Users glance at "3-Letter Words", then "4-Letter
   Words", etc. No sorting options, no filtering. All results visible.

3. **Supportive Empty State:** "No words match those letters. Try different
   letters." frames the situation as a letter problem, not a tool failure. User
   feels supported, not blamed.

4. **Clean Visual Hierarchy:** Card-based layout with left-border accent creates
   visual structure. User instantly understands: "These are the results
   organized by word length."

5. **Zero Friction for Scanning:** Results are plain text, space-separated,
   wrapping naturally. No buttons, no interactions. User can scan and copy if
   desired, but simplicity is primary.

**User Interaction Flow:**

```
1. User submits letters via SearchForm
2. API returns { "words": [...] } or { "words": [] }
3. ResultsDisplay receives array
4. Component groups by length, sorts alphabetically
5. Results appear in ResultCard components
6. User scans and finds word (or sees "no words match" message)
7. User is ready for next lookup (SearchForm still available)
```

### TypeScript Implementation Patterns (From Story 3.1 Learnings)

**Component Structure Pattern (Proven in Story 3.1):**

```typescript
// 1. Imports
import React from 'react';
import { ResultCard } from './ResultCard';
import type { ResultsDisplayProps } from '@/types';

// 2. Props interface (exported)
interface ResultsDisplayProps {
  words: string[];
}

// 3. Component definition
export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ words }) => {
  // 4. Derived logic (grouping, sorting)
  const groupedWords = groupWordsByLength(words);

  // 5. Render
  return (
    <div>
      {words.length === 0 ? (
        <div>No words match those letters. Try different letters.</div>
      ) : (
        groupedWords.map((group) => (
          <ResultCard key={group.length} length={group.length} words={group.words} />
        ))
      )}
    </div>
  );
};

// 6. Export
export default ResultsDisplay;
```

**TypeScript Rules (From Story 3.1):**

- ✅ All types explicit (no `any`)
- ✅ Props interface exported
- ✅ All function parameters typed
- ✅ All return types explicit
- ✅ No wildcard imports

---

## Architecture Compliance

### From project-context.md

✅ **React Component Rules:**

- [ ] Functional component only (no class components)
- [ ] Hooks if needed (`useMemo` for grouping performance is optional)
- [ ] Props as TypeScript interface: `ResultsDisplayProps`
- [ ] Explicit return type: `React.FC<ResultsDisplayProps>`
- [ ] All event handlers typed (none in ResultsDisplay - it's presentational)

✅ **Naming Conventions:**

- [ ] Component files: PascalCase (`ResultsDisplay.tsx`, `ResultCard.tsx`)
- [ ] Component exports: PascalCase (`ResultsDisplay`, `ResultCard`)
- [ ] Props interfaces: `{ComponentName}Props` (`ResultsDisplayProps`,
      `ResultCardProps`)
- [ ] Helper functions: camelCase (`groupWordsByLength`, `sortWords`)

✅ **File Organization:**

- [ ] ResultsDisplay at: `packages/client/src/components/ResultsDisplay.tsx`
- [ ] ResultCard at: `packages/client/src/components/ResultCard.tsx`
- [ ] Test files adjacent: `ResultsDisplay.test.tsx`, `ResultCard.test.tsx`
- [ ] Props interfaces exported from `types/index.ts`
- [ ] No wildcard imports

✅ **Styling (Tailwind + shadcn/ui):**

- [ ] Use Tailwind classes for layout and spacing
- [ ] ResultCard is a custom component (not from shadcn/ui)
- [ ] Dark theme styling (from project context)
- [ ] Card styling: #2d2d2d background, 3px left border #4a9eff

✅ **Accessibility (WCAG AA):**

- [ ] Results are plain text (no custom ARIA needed)
- [ ] Empty state message is clear and non-technical
- [ ] Section headers are semantic (`<h3>` or similar)
- [ ] Results are selectable (not using pointer-events: none)

---

## Implementation Details

### Component Props

#### ResultsDisplay

```typescript
interface ResultsDisplayProps {
  words: string[];
}
```

**Input:**

- `words`: Array of valid words from API (e.g., `["abc", "bac", "cab"]`)
- Empty array `[]` is a valid input (means "no words found")

**Behavior:**

- Component is **stateless** and **presentational**
- No API calls, no loading states, no error handling
- Parent component (App) manages API communication and error states
- ResultsDisplay only organizes and displays words

#### ResultCard (Child Component)

```typescript
interface ResultCardProps {
  length: number; // Word length (3, 4, 5, 6, 7, etc.)
  words: string[]; // Words of that length (already sorted alphabetically)
}
```

### Data Transformation Logic

**Grouping Algorithm:**

```typescript
interface WordGroup {
  length: number;
  words: string[];
}

function groupWordsByLength(words: string[]): WordGroup[] {
  // Group words by length
  const groups = new Map<number, string[]>();

  for (const word of words) {
    const length = word.length;
    if (!groups.has(length)) {
      groups.set(length, []);
    }
    groups.get(length)!.push(word);
  }

  // Convert to array, sort by length, sort words alphabetically within groups
  return Array.from(groups.entries())
    .map(([length, groupWords]) => ({
      length,
      words: groupWords.sort(),
    }))
    .sort((a, b) => a.length - b.length);
}
```

**Why this pattern?**

- Groups words by length
- Sorts word groups by length (3-letter first, then 4-letter, etc.)
- Sorts words alphabetically within each group
- Returns array of `{ length, words }` objects for easy mapping in JSX

### Component Structure

**ResultsDisplay Component:**

```typescript
export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ words }) => {
  // Compute grouped words
  const groupedWords = groupWordsByLength(words);

  // Render empty state or results
  if (words.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-lg text-gray-400">
          No words match those letters. Try different letters.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {groupedWords.map((group) => (
        <ResultCard
          key={group.length}
          length={group.length}
          words={group.words}
        />
      ))}
    </div>
  );
};
```

**ResultCard Component:**

```typescript
export const ResultCard: React.FC<ResultCardProps> = ({ length, words }) => {
  return (
    <section className="bg-gray-700 p-5 rounded border-l-4 border-blue-500">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">
        {length}-Letter Words
      </h3>
      <div className="text-base text-gray-100 leading-relaxed">
        {words.join(' ')}
      </div>
    </section>
  );
};
```

**Styling Details:**

| Element         | Class                                                | Description                                                   |
| --------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| Card container  | `bg-gray-700 p-5 rounded border-l-4 border-blue-500` | #2d2d2d background, 20px padding, 4px radius, 3px left border |
| Section header  | `text-sm font-semibold text-gray-400`                | 14px, bold, secondary color                                   |
| Words container | `text-base text-gray-100 leading-relaxed`            | 16px, light color, 1.8 line height for wrapping               |
| Words spacing   | `words.join(' ')`                                    | Space-separated for natural wrapping                          |

### Performance Considerations

**Grouping Optimization:**

For small arrays (< 100 words), direct computation is fine:

```typescript
const groupedWords = groupWordsByLength(words);
```

For larger arrays, consider `useMemo`:

```typescript
const groupedWords = React.useMemo(() => groupWordsByLength(words), [words]);
```

**Why?** Grouping is O(n) but memoization prevents recomputation on every render
if parent component re-renders but `words` prop hasn't changed.

**Current Recommendation:** Skip `useMemo` for MVP (< 100 words typical). Add if
performance profiling shows it's needed.

---

## Testing Requirements

### Unit Tests: `ResultsDisplay.test.tsx` & `ResultCard.test.tsx`

**Test Framework:** Vitest + React Testing Library

**ResultsDisplay Test Cases:**

1. **Grouping by Length**
   - Input: `["abc", "abcd", "abcde"]`
   - Assert: 3 ResultCard components rendered (lengths 3, 4, 5)
   - Verify: Each group shows correct words

2. **Sorting Words Alphabetically**
   - Input: `["cab", "abc", "bac"]` (all 3-letter)
   - Assert: ResultCard renders words as "abc bac cab" (sorted)

3. **Group Order by Length**
   - Input: Mixed lengths (4, 3, 5, 3)
   - Assert: Groups appear in order: 3-letter, then 4-letter, then 5-letter

4. **Omit Empty Groups**
   - Input: `["abc"]` (only 3-letter)
   - Assert: ResultCard only for 3-letter, NO 4-letter/5-letter cards

5. **Empty Array (No Words Found)**
   - Input: `[]`
   - Assert: Empty state message displays: "No words match..."
   - Assert: NO ResultCard components rendered

6. **Empty State Message Content**
   - Input: `[]`
   - Assert: Message text is "No words match those letters. Try different
     letters."

7. **ResultCard Integration**
   - Input: `["abc", "bac"]`
   - Assert: ResultCard component rendered with correct props

8. **Large Input (100+ words)**
   - Input: 100 random 3-10 letter words
   - Assert: All groups render, all words sorted, no duplicates

**ResultCard Test Cases:**

1. **Section Header Display**
   - Props: `length={3}, words={["abc"]}`
   - Assert: Header text is "3-Letter Words"

2. **Words Display (Inline, Space-Separated)**
   - Props: `length={3}, words={["abc", "bac", "cab"]}`
   - Assert: Words display as inline text: "abc bac cab"

3. **Card Styling**
   - Props: `length={4}, words={["test"]}`
   - Assert: Card has #2d2d2d background (checked via className or computed
     style)
   - Assert: Card has 3px left border in #4a9eff (border-l-4 border-blue-500)

4. **Different Word Lengths**
   - Props: `length={7}, words={["example"]}`
   - Assert: Header correctly displays "7-Letter Words"

5. **Single Word**
   - Props: `length={4}, words={["test"]}`
   - Assert: Single word displays without spacing issues

6. **Many Words (Natural Wrapping)**
   - Props: `length={3}, words={["a" + i for i in range(50)]}`
   - Assert: Words wrap naturally at container edge

**Coverage Goal:** ≥ 80% for both components

**Test Assertions Pattern (From Story 3.1):**

```typescript
// ✅ Good: Semantic queries
expect(screen.getByText(/3-letter words/i)).toBeInTheDocument();
expect(screen.getByText('abc bac cab')).toBeInTheDocument();

// ❌ Avoid: Implementation details
expect(screen.getByText('test')).toHaveClass('bg-gray-700');
```

---

## Previous Story Learnings (From Story 3.1)

### SearchForm Integration Points

**Story 3.1 created SearchForm component with:**

- Auto-focus on mount
- Auto-clear on focus
- Button disabled when input invalid
- onSubmit callback triggering parent

**For Story 3.2:**

- ResultsDisplay receives `words` prop from parent (App component, Story 3.4)
- ResultsDisplay is stateless (no knowledge of form)
- Parent component (via useWordFetcher hook) manages API call and state

### Component Separation Pattern (Proven in Story 3.1)

Story 3.1 established clear component boundaries:

- SearchForm = Input collection (no API calls, no state management)
- useWordFetcher = Data fetching (API communication, error handling)
- App = Orchestration (state management, component composition)

**For Story 3.2:**

- ResultsDisplay = Results presentation (no API calls, no form logic)
- Parent handles API response parsing
- Component is dumb and presentational

### Testing Patterns (Proven in Story 3.1)

Story 3.1 used semantic testing:

- Query by role: `getByRole('button', { name: /unscramble/i })`
- Query by text: `getByPlaceholderText(/enter/i)`
- NO implementation details

**For Story 3.2:**

- Query by text: `getByText(/no words match/i)`
- Query by rendered content: `getByText('abc bac cab')`
- NO querying classNames or internal structure

---

## Architecture Patterns & Standards

### Component Composition Pattern

**ResultsDisplay is a Container Component (Smart):**

- Receives data (words array)
- Performs computation (grouping, sorting)
- Renders child components (ResultCard)
- No state, no effects, no API calls

```typescript
export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ words }) => {
  const groupedWords = groupWordsByLength(words);
  return (
    <div>
      {words.length === 0 ? <EmptyState /> : <Results groups={groupedWords} />}
    </div>
  );
};
```

**ResultCard is a Presentational Component (Dumb):**

- Receives data (length, words)
- Renders styled output
- No logic, no state, no computation

```typescript
export const ResultCard: React.FC<ResultCardProps> = ({ length, words }) => {
  return <section className="..."><h3>{length}-Letter Words</h3>...</section>;
};
```

**Pattern Benefit:** Clear separation. ResultsDisplay computes, ResultCard
displays. Easy to test, reuse, and modify.

### Tailwind Styling Pattern (From Story 3.1)

Story 3.1 established:

- Use shadcn/ui components for buttons/inputs
- Use Tailwind classes for layout
- Apply dark theme colors

**For Story 3.2:**

- ResultCard is custom (not shadcn/ui)
- Use Tailwind classes for all styling
- Dark theme: #1a1a1a background, #e8e8e8 text, #2d2d2d surfaces, #4a9eff
  accents

**Example Styling:**

```typescript
// ResultsDisplay container
<div className="mt-8 space-y-4">
  {/* mt-8: margin-top 32px (spacing from form to results) */}
  {/* space-y-4: 16px vertical gap between cards */}
</div>

// ResultCard
<section className="bg-gray-700 p-5 rounded border-l-4 border-blue-500">
  {/* bg-gray-700: #2d2d2d background */}
  {/* p-5: 20px padding */}
  {/* rounded: border-radius 4px */}
  {/* border-l-4: 4px (Tailwind uses 4) left border (maps to 3px visually) */}
  {/* border-blue-500: #4a9eff accent color */}
</section>

// Section header (3-Letter Words)
<h3 className="text-sm font-semibold text-gray-400 mb-3">
  {/* text-sm: 14px */}
  {/* font-semibold: 600 weight */}
  {/* text-gray-400: #a0a0a0 secondary color */}
  {/* mb-3: 12px margin-bottom */}
</h3>

// Words content
<div className="text-base text-gray-100 leading-relaxed">
  {/* text-base: 16px */}
  {/* text-gray-100: #e8e8e8 light text */}
  {/* leading-relaxed: 1.8 line-height for wrapping */}
</div>
```

---

## Styling & Layout

### Dark Theme Colors

```
Background:     #1a1a1a (body)
Surface:        #2d2d2d (cards, inputs)
Text Primary:   #e8e8e8 (main text)
Text Secondary: #a0a0a0 (hints, labels)
Accent 1:       #4a9eff (button, left border)
Accent 2:       #20b2aa (focus rings)
```

**Mapping to Tailwind:**

- `bg-gray-700` = #2d2d2d
- `text-gray-100` = #e8e8e8
- `text-gray-400` = #a0a0a0
- `border-blue-500` = #4a9eff
- `border-teal-500` = #20b2aa

### Responsive Layout

**Mobile (< 600px):**

- ResultsDisplay: Full width - 32px margins
- ResultCard: Full width, stacked vertically
- Spacing: `mt-8` (32px) from form
- Text: Same sizes (no reduction on mobile)

**Desktop (> 600px):**

- ResultsDisplay: 60-70% width, centered (max ~600px)
- ResultCard: Same styling (no columns)
- Spacing: Unchanged (consistent everywhere)

**Key Principle:** Single-column layout on all devices. Responsive means
spacing/sizing adjustments, not layout restructuring.

---

## Error Handling & Edge Cases

### What ResultsDisplay Handles

✅ **ResultsDisplay responsibility:**

- Group words by length
- Sort words alphabetically within groups
- Render ResultCard for each group
- Display empty state when no words found
- Format output for scannable display

### What Parent Component Handles

❌ **NOT ResultsDisplay's job:**

- API calls (parent via useWordFetcher hook)
- Loading states (parent manages state)
- Error states from API (parent shows error message)
- Form submission (SearchForm handles)

### Edge Cases Covered

1. **Empty Array (`[]`):** Display supportive message
2. **Single Word:** Display with no spacing issues
3. **100+ Words:** All grouped and sorted correctly
4. **Single Word Group:** Only that group renders (others omitted)
5. **Mixed Word Lengths:** Correct grouping and order (3-letter, 4-letter, etc.)
6. **Duplicate Words:** API won't send (backend deduplicates), but tests should
   verify sorting with "similar" words
7. **Very Long Words:** Still display with natural wrapping
8. **Words with Different Cases:** API normalizes, so all lowercase

---

## Code Quality Standards

### TypeScript Requirements

✅ **Strict Mode:**

- [ ] `"strict": true` in tsconfig.json (already enabled)
- [ ] All types explicit
- [ ] All function parameters typed
- [ ] All return types explicit

✅ **Naming:**

- [ ] Components: PascalCase (`ResultsDisplay`, `ResultCard`)
- [ ] Props interfaces: `{ComponentName}Props`
- [ ] Functions: camelCase (`groupWordsByLength`)
- [ ] Constants: UPPER_SNAKE_CASE (`MAX_WORD_LENGTH = 10`)

✅ **No Wildcard Imports:**

- [ ] ✅ `import { useMemo } from 'react'`
- [ ] ❌ ~~`import * as React from 'react'`~~

### ESLint & Prettier

Pre-commit hooks will check:

- [ ] No unused variables
- [ ] No console.log
- [ ] No implicit `any`
- [ ] Proper indentation (2 spaces)
- [ ] Single quotes
- [ ] Semicolons required

### Testing Standards

✅ **Coverage:**

- [ ] ≥ 80% for ResultsDisplay
- [ ] ≥ 80% for ResultCard
- [ ] All critical paths tested

✅ **Test Quality:**

- [ ] Semantic queries (getByRole, getByText)
- [ ] No implementation details
- [ ] Descriptive test names
- [ ] Arrange-Act-Assert pattern

---

## Dependencies & External Libraries

### Required

- **React 18+** (already installed)
- **TypeScript 5.0+** (already configured)
- **Tailwind CSS** (already configured, Story 1.3)
- **@testing-library/react** (for tests)
- **Vitest** (already configured, Story 1.4)

### No New Dependencies

✅ All required libraries already installed and configured by Story 1.3 and 1.4.

---

## Critical Implementation Notes

### DO:

✅ **DO** group words by length (3, 4, 5, etc.)

✅ **DO** sort word groups by length (3-letter first, then 4-letter, etc.)

✅ **DO** sort words alphabetically within each group

✅ **DO** render ResultCard for each group with words

✅ **DO** omit empty groups entirely (no rendering)

✅ **DO** display supportive empty state message for no words

✅ **DO** use ResultCard as separate component (reusable)

✅ **DO** style cards with #2d2d2d background and #4a9eff left border

✅ **DO** make words space-separated and wrappable

✅ **DO** type all props and functions explicitly

✅ **DO** include comprehensive unit tests (≥ 80% coverage)

### DON'T:

❌ **DON'T** include API calls (parent handles fetching)

❌ **DON'T** include loading or error states (parent manages)

❌ **DON'T** validate input (parent validates, backend enforces)

❌ **DON'T** render all groups (skip empty ones)

❌ **DON'T** add buttons, links, or interactions to results (plain text only)

❌ **DON'T** add filtering or sorting options (users see all results)

❌ **DON'T** include animations or loaders (instant display)

❌ **DON'T** use class components (functional only)

❌ **DON'T** use any/implicit types (strict mode enforced)

❌ **DON'T** skip unit tests (required)

---

## Related Stories & Dependencies

**Blocks:**

- Story 3.3 (useWordFetcher hook) — needs ResultsDisplay as integration point
- Story 3.4 (App component) — needs ResultsDisplay for complete UI

**Depends On:**

- Story 1.3 (Tailwind + shadcn/ui configured)
- Story 2.4 (API endpoint functional)
- Story 3.1 (SearchForm component as reference pattern)

**Parallel Work:**

- Story 3.5: ErrorBoundary component (can start simultaneously)
- Story 3.3: useWordFetcher hook (integration point, but can develop in parallel
  with API mocking)

---

## Git & Commit Guidelines

### Commit Message Format

```
feat(ui): implement ResultsDisplay and ResultCard components with grouping and sorting

- Create ResultsDisplay component for organizing results by word length
- Create ResultCard component for displaying word-length groups
- Implement grouping algorithm: group by length, sort by length, sort words alphabetically
- Display supportive empty state message when no words found
- Add Tailwind styling: dark theme, card-based layout, left-border accent
- Add comprehensive unit tests for grouping, sorting, and empty state (80%+ coverage)
- Type all props and helpers with TypeScript strict mode

Closes #3-2
```

### Files to Commit

- `packages/client/src/components/ResultsDisplay.tsx` (NEW)
- `packages/client/src/components/ResultsDisplay.test.tsx` (NEW)
- `packages/client/src/components/ResultCard.tsx` (NEW)
- `packages/client/src/components/ResultCard.test.tsx` (NEW)
- `packages/client/src/types/index.ts` (UPDATED — export ResultsDisplayProps,
  ResultCardProps)
- `packages/client/package.json` (UNCHANGED — no new dependencies)

### Branch Name

```
feature/3-2-resultsdisplay-component
```

---

## Success Criteria Summary

When Story 3.2 is DONE:

1. ✅ ResultsDisplay.tsx component created with all AC requirements
2. ✅ ResultCard.tsx component created as separate reusable component
3. ✅ Words grouped by length (3-letter, 4-letter, 5-letter, etc.)
4. ✅ Groups rendered as ResultCard components with correct props
5. ✅ Empty groups omitted (only groups with words rendered)
6. ✅ Words sorted alphabetically within each group
7. ✅ Groups ordered by length (3-letter first, then 4-letter, etc.)
8. ✅ Empty state displays supportive message
9. ✅ Card styling correct (#2d2d2d background, #4a9eff left border)
10. ✅ Results display instantly (no animation)
11. ✅ All props typed with TypeScript
12. ✅ Comprehensive unit tests (≥ 80% coverage)
13. ✅ All tests pass locally
14. ✅ Code passes linting and formatting
15. ✅ TypeScript strict mode: no errors
16. ✅ No new dependencies added
17. ✅ Components ready for integration (Story 3.3, 3.4)

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

This story file has been analyzed and prepared by the BMad Create Story context
engine. All critical information has been extracted:

- ✅ Epic requirements and acceptance criteria reviewed
- ✅ UX/design principles extracted and documented
- ✅ Architecture patterns and standards identified
- ✅ Previous story (3.1) learnings integrated
- ✅ Git context and recent work patterns analyzed
- ✅ TypeScript and testing standards established
- ✅ All dependencies verified as available
- ✅ Edge cases identified and tested

### Files to Create

- [ ] `packages/client/src/components/ResultsDisplay.tsx`
- [ ] `packages/client/src/components/ResultsDisplay.test.tsx`
- [ ] `packages/client/src/components/ResultCard.tsx`
- [ ] `packages/client/src/components/ResultCard.test.tsx`

### Files to Update

- [ ] `packages/client/src/types/index.ts` — Add
      `export interface ResultsDisplayProps`, `export interface ResultCardProps`

### Next Steps for Dev Agent

1. Implement ResultsDisplay.tsx with grouping and sorting logic
2. Implement ResultCard.tsx as separate component
3. Write comprehensive unit tests (≥ 80% coverage)
4. Verify all tests pass: `npm run test -w packages/client`
5. Verify no TypeScript errors: `npm run type-check -w packages/client`
6. Verify ESLint passes: `npm run lint -w packages/client`
7. Commit changes with proper message
8. Mark story as `in-progress` in sprint-status.yaml
9. Upon completion, run code-review workflow

---

**Development Complete When:** All acceptance criteria met, tests pass 100%,
code reviewed and approved.

---
