# Acceptance Auditor Review Prompt

**Story:** 4-1-unit-tests-react-components  
**Spec File:**
`_bmad-output/implementation-artifacts/4-1-unit-tests-react-components.md`

## Your Task

Review the staged diff against the story spec and context docs. Check for:

1. Violations of acceptance criteria (ACs)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

## Story Acceptance Criteria (from spec)

✅ **AC4.1.1:** SearchForm component unit tests in
`packages/client/src/components/SearchForm.test.tsx`

✅ **AC4.1.2:** SearchForm tests verify:

- Input auto-focuses on mount
- Input accepts user typing
- Button is disabled when input < 3 or > 7 characters
- onSubmit callback is called when Enter key or button clicked
- Input auto-clears on focus

✅ **AC4.1.3:** ResultsDisplay component unit tests in
`packages/client/src/components/ResultsDisplay.test.tsx`

✅ **AC4.1.4:** ResultsDisplay tests verify:

- Words are grouped by length
- Empty groups are not rendered
- Empty state message displays when no words found
- Correct ResultCard components are rendered for each group

✅ **AC4.1.5:** ResultCard component unit tests in
`packages/client/src/components/ResultCard.test.tsx`

✅ **AC4.1.6:** ResultCard tests verify:

- Section header displays correct word length
- Words are displayed inline
- Styling (card, left border, spacing) is correct

✅ **AC4.1.7:** Coverage for these components is ≥ 80%

✅ **AC4.1.8:** Tests use semantic queries (getByRole, getByText) not
implementation details

✅ **AC4.1.9:** All tests pass: `npm run test -w packages/client` returns exit
code 0

## Diff Changes

**Files modified:**

1. `CLAUDE.md` (NEW) — behavioral guidelines
2. `4-1-unit-tests-react-components.md` — test checklist marked ✅, File List
   and Change Log added
3. `sprint-status.yaml` — story status updated to `review`
4. `docs/bmad-opinions.md` — project observations added

## Key Implementation Notes from Spec

- SearchForm.test.tsx: 19 tests (not 8 as originally planned)
- ResultsDisplay.test.tsx: 12 tests (not 5)
- ResultCard.test.tsx: 9 tests (not 7)
- Overall coverage: 99.05% statements, 100% lines (components)
- AC note: spec says 3-7 char max; actual component allows 3-10 (tests reflect
  actual implementation)
- All 90 tests pass; type-check and lint both exit 0

## Output Format

For each finding:

- **Title:** One-line summary
- **AC/Constraint:** Which AC or spec constraint is affected
- **Evidence:** Quote or reference from the diff showing the issue
- **Severity:** Critical / High / Medium / Low

List all findings as Markdown bullet points.

---

**NOTE:** The actual test files (SearchForm.test.tsx, ResultsDisplay.test.tsx,
ResultCard.test.tsx) are NOT in the staged diff. Only the story documentation
and sprint status are staged. This is unusual for a story marked "review"
status.

This is a critical observation: **The diff does not contain the actual test
files, only documentation updates.**
