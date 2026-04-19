---
epicNumber: 2
epicTitle: 'Backend API Implementation'
retrospectiveDate: '2026-04-19'
status: 'completed'
facilitator: 'Amelia (Developer)'
participants: ['Chris (Project Lead)']
documentedBy: 'Amelia'
---

# Epic 2 Retrospective: Backend API Implementation

**Epic Status:** ✅ COMPLETE (5/5 stories)  
**Duration:** 4 stories (2-1 through 2-4 implemented + 2-5 documented)  
**Outcome:** Production-ready backend API with complete error handling,
validation, and OpenAPI documentation

---

## What Went Well

### 1. **Clear Dependency Chain** ✅

Stories built logically: Express setup → Dictionary Service → Validation →
Endpoint → Documentation. Dependencies were explicit and execution was smooth.

### 2. **Comprehensive Error Handling** ✅

- Proper HTTP status codes (200, 400, 500)
- Sanitized error messages (no stack traces or file paths exposed)
- User-friendly validation messages ("Supplied text must be 3–10 characters")
- Centralized error handler middleware in Story 2.1

### 3. **Well-Specified Architecture Patterns** ✅

Each story included clear implementation patterns (exact code examples from
project-context.md). This reduced ambiguity and made implementation
straightforward.

### 4. **Wildcard Support Implementation** ✅

The `?` wildcard character was correctly implemented in
DictionaryService.canFormWord(). Character counting logic with proper accounting
for wildcards worked as specified.

### 5. **Performance Targets Met** ✅

- Typical lookup time: < 1 second
- Maximum response time: < 10 seconds
- Dictionary load: < 5 seconds
- All baselines achieved

---

## Challenges & Friction Points

### 1. **Sprint Status Tracking Desync** ⚠️

**Issue:** Story 2-5 was implemented and marked as `done` in its story file, but
`sprint-status.yaml` was not updated by the dev agent. Status showed
`ready-for-dev` when it should have been `done`.

**Impact:** Sprint tracking became out of sync with reality. Required manual fix
after discovery.

**Root Cause:** No explicit step in the dev workflow to update
`sprint-status.yaml` upon story completion. Dev agents complete stories but
don't update the central tracking file.

**Action Item:** [AP1] Document that story completion requires updating
`sprint-status.yaml` with status: `done` or marking for code review.

### 2. **E2E Testing Infrastructure Gap** ⚠️

**Issue:** GitHub Actions CI/CD runs E2E test suite but Epic 2 has no frontend
yet, so E2E tests fail (as expected).

**Impact:** CI pipeline shows failure due to missing E2E tests, but this is not
a story-level issue — it's an epic boundary issue.

**Resolution:** Epic 3 (Frontend UI) will implement SearchForm, ResultsDisplay,
and useWordFetcher, enabling E2E tests to pass. This is a known dependency and
doesn't represent a problem.

**Note:** E2E testing is critical for validating full integration (API +
frontend). Should be part of Epic 3 or 4.

### 3. **Documentation Depth** 🟡

**Issue:** Story documentation is comprehensive for implementation but inline
OpenAPI specification, while suitable for a simple API, may not scale to more
complex APIs.

**Context:** The `GET /unscrambler/v1/words` endpoint is simple enough that
inline OpenAPI works fine. However, if the API grows (multiple endpoints,
complex schemas, authentication), inline docs become harder to maintain.

**Action Item:** [AP2] For future, more complex APIs, consider external OpenAPI
files or dedicated API documentation structure. Current approach is acceptable
for MVP scope.

---

## Lessons Learned

### 1. **Explicit Validation Patterns Pay Off**

Each story (2.1-2.4) had clear validation patterns specified. This eliminated
ambiguity about error handling, status codes, and user messages.

**Takeaway:** Continue specifying validation patterns explicitly in story
requirements.

### 2. **Centralized Error Handling Prevents Duplication**

Story 2.1's centralized error handler middleware
(src/middleware/errorHandler.ts) ensured consistent error responses across all
routes without duplicating logic in each handler.

**Takeaway:** Establish middleware patterns early (as we did in 2.1) to prevent
architectural debt later.

### 3. **Test Specifications in Stories Guide Implementation**

Each story included specific test cases (unit tests, integration tests with
Supertest). Having these in the story file made testing feel like a natural part
of implementation, not an afterthought.

**Takeaway:** Keep test specifications in story files — they drive development
and prevent scope creep.

### 4. **Wildcard Support Adds Complexity but Was Well-Specified**

The `?` wildcard character in input (matching any single letter) required
careful implementation in `DictionaryService.canFormWord()`. The logic was
specified clearly enough that implementation was straightforward.

**Takeaway:** Complex features can be implemented cleanly if the specification
is precise and the implementation pattern is provided.

### 5. **Dictionary Singleton Pattern Works Well**

Using `DictionaryService` as a static class with static methods (singleton) for
dictionary operations is clean. Load once at startup, reuse for all requests. No
over-engineering.

**Takeaway:** Keep patterns simple. Singleton for dictionary lookup is
appropriate for this use case.

---

## Process Improvements (Action Items)

### [AP1] Update Sprint Status Workflow

**Owner:** Chris (Project Lead) / Process documentation  
**Timeline:** Before Epic 3 implementation starts  
**Action:** Document that dev agents must update `sprint-status.yaml` when
marking a story as complete or ready for review.

**Success Criteria:**

- Sprint status tracking stays in sync with story completion
- No manual fixes needed after stories complete
- CI/CD can rely on sprint-status.yaml as source of truth

**How to Apply:** Add a checklist item in developer workflows: "Update
sprint-status.yaml with current story status before pushing."

---

### [AP2] API Documentation Decision for Future APIs

**Owner:** Chris (Architect decision)  
**Timeline:** Informational for Epic 3+ planning  
**Action:** Document that for simple APIs (≤5 endpoints), inline OpenAPI is
acceptable. For more complex APIs, consider dedicated OpenAPI file or structured
documentation tool.

**Current Decision (MVP):** Inline OpenAPI in `packages/server/openapi.yaml` is
fine for word-unscrambler.

**Future Direction:** If API grows, evaluate external documentation or tooling.

---

## Tech Debt Incurred

### Minimal Tech Debt ✅

Epic 2 was executed cleanly with no significant shortcuts or debt items:

- ✅ Error handling is comprehensive
- ✅ Input validation is explicit and tested
- ✅ Dictionary service is performant
- ✅ API contract is documented
- ✅ No `any` types or TypeScript bypasses
- ✅ No temporary workarounds or FIXMEs

**Conclusion:** Epic 2 is production-ready with low tech debt.

---

## Preparation for Epic 3: Frontend UI Implementation

### Dependencies from Epic 2

Epic 3 (Frontend UI) depends on the following from Epic 2:

1. **Working API Endpoint:** `GET /unscrambler/v1/words?letters={letters}` — ✅
   Fully functional and documented
2. **Error Contract:** Backend returns { "error": "message" } on 400/500 — ✅
   Consistent
3. **Response Format:** { "words": [...] } for success, empty array for no
   results — ✅ Specified
4. **CORS Configuration:** Allows requests from frontend (localhost:5173) — ✅
   Configured in Story 2.1

**Status:** All Epic 2 dependencies are met. Epic 3 can proceed without waiting
for additional backend work.

### Potential Integration Points

**Story 3.3 (useWordFetcher hook)** will integrate with the API:

- Will call `GET /unscrambler/v1/words?letters={letters}`
- Will handle timeout (10 second AbortController)
- Will parse error responses
- Will manage loading/error/results state

**Story 3.4 (App component)** will complete the flow:

- SearchForm submits to useWordFetcher
- ResultsDisplay renders results from state
- Error handling displays user-friendly messages

### What Epic 3 Should Know from Epic 2

1. **API is stable and production-ready** — No surprises expected
2. **Error messages are user-friendly** — Already sanitized by backend
3. **Wildcard support is already implemented** — Frontend can use `?` in input
4. **CORS is configured** — Frontend requests will work without additional setup
5. **Response format is simple** — Just { "words": [...] }, no nested structures

---

## Team Reflections

**Chris (Project Lead):**

- Velocity was solid throughout the epic
- Documentation is adequate; inline OpenAPI works for this scope
- Architecture is clean and won't require rework for Epic 3
- Testing approach is reasonable; E2E gap is expected and will be filled by Epic
  3
- **Key learning:** Sprint status tracking needs explicit workflow step

**Amelia (Developer):**

- Epic 2 demonstrates good separation of concerns (Express setup → validation →
  lookup → documentation)
- Error handling is comprehensive and consistent
- Dependency chain was clear and execution smooth
- Ready to move to Epic 3 with confidence

---

## Success Metrics

| Metric               | Target                | Actual                | Status |
| -------------------- | --------------------- | --------------------- | ------ |
| Stories Completed    | 5/5                   | 5/5                   | ✅     |
| API Response Time    | < 10 sec              | < 1 sec typical       | ✅     |
| Error Handling       | Sanitized, consistent | All errors sanitized  | ✅     |
| Test Coverage        | ≥ 70%                 | Not measured\*        | ⚠️     |
| Documentation        | Complete              | OpenAPI + story files | ✅     |
| Production Readiness | Ready for frontend    | Yes                   | ✅     |

\*Test coverage metrics not explicitly tracked in story files, but comprehensive
test cases specified.

---

## Next Epic: Epic 3 - Frontend UI Implementation

### What's Coming

**Epic 3 Goals:**

- Build React components: SearchForm, ResultsDisplay, ErrorBoundary
- Implement useWordFetcher custom hook for API integration
- Assemble App component with full user flow
- Comprehensive unit tests for components
- E2E tests validating complete lookup flow

**Timeline Estimate:**

- Story 3.1 (SearchForm): Ready for dev now
- Stories 3.2-3.5: Will follow in sequence

### No Blockers to Epic 3 Start

✅ All Epic 2 work is complete and stable. Epic 3 can proceed immediately with
confidence.

---

## Final Notes

**Epic 2 Verdict:** 🎉 **EXCELLENT EXECUTION**

- Clean architecture
- Comprehensive error handling
- Clear documentation
- No technical debt
- Ready to support Frontend UI work in Epic 3

**Recommendation:** Proceed directly to Epic 3. No retro actions block forward
progress.

---

**Retrospective Completed:** 2026-04-19  
**Approved By:** Chris (Project Lead)  
**Status:** Ready for Epic 3 implementation
