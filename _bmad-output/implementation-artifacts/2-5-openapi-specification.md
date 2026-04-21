---
storyId: '2.5'
storyKey: '2-5-openapi-specification'
status: 'done'
epic: 2
epicTitle: 'Backend API Implementation'
title: 'Create OpenAPI 3.1 Specification for API Documentation'
created: '2026-04-18'
lastUpdated: '2026-04-20'
completionStatus: 'done'
contextSource: 'Epic 2.5 + API Spec + Project Context'
devReadyDate: '2026-04-18'
---

# Story 2.5: Create OpenAPI 3.1 Specification for API Documentation

## Story Overview

**Epic:** 2 - Backend API Implementation  
**Story ID:** 2.5  
**Depends On:** Story 2.4 (Fully implemented endpoint)

**User Story:**

> As a **backend developer**, I want to document the API in OpenAPI 3.1 format,
> so that the API contract is clear and can be used by tools and clients.

---

## Acceptance Criteria

✅ **AC5.1:** OpenAPI 3.1 specification file created at
packages/server/openapi.yaml

✅ **AC5.2:** Documents endpoint: GET /unscrambler/v1/words

✅ **AC5.3:** Documents parameter: letters (string, query, required, 3-10 chars)

✅ **AC5.4:** Documents success response: 200 with words array schema

✅ **AC5.5:** Documents error responses: 400 and 500 with error schemas

✅ **AC5.6:** Includes examples for all scenarios:

- Success with results
- Success with empty results
- Invalid input (LENGTH error)
- Invalid input (INVALID_CHAR error)
- Server error (500)

✅ **AC5.7:** Specification matches implementation exactly

✅ **AC5.8:** Can be served at GET /api/openapi.json if desired

---

## Developer Context & Critical Guardrails

### Project State

**Epic 2 Completion:**

- ✅ Story 2.1: Express app with middleware, CORS, error handling
- ✅ Story 2.2: Dictionary Service with word lookup
- ✅ Story 2.3: Input Validation for letters parameter
- ✅ Story 2.4: GET /unscrambler/v1/words endpoint (FULLY IMPLEMENTED)
- ⏳ Story 2.5 (THIS): OpenAPI documentation

**What This Story Does:**

- Creates formal API contract documentation
- Enables API clients (frontend, external tools) to understand contract
- Serves as single source of truth for API behavior
- No code changes needed (documentation only)

### File Structure

```
packages/server/
├── openapi.yaml         ← OPENAPI SPECIFICATION (NEW - THIS STORY)
├── src/
│   └── routes/
│       └── words.ts     ← (Implemented in 2.4)
└── tsconfig.json
```

### API Contract Reference

From api-specification.md and project-context.md:

**Endpoint:** `GET /unscrambler/v1/words`

**Parameters:**

- `letters` (string, query, required): 3-10 characters, letters (a-z) + ?
  (wildcard)

**Success Response (200):**

```json
{ "words": ["abc", "bac", "cab"] }
```

**Error Response (400 - LENGTH):**

```json
{ "error": "Supplied text must be 3–10 characters in length." }
```

**Error Response (400 - INVALID_CHAR):**

```json
{
  "error": "Supplied text may only include letters (upper or lower case) and question marks."
}
```

**Error Response (500):**

```json
{ "error": "Server error. Please try again later." }
```

---

## Implementation Guidance

### Create packages/server/openapi.yaml

**Purpose:** Complete OpenAPI 3.1 specification for the Word Unscrambler API

**Structure:**

```yaml
openapi: '3.1.0'
info:
  title: Word Unscrambler API
  description:
    Find all valid English words that can be formed from given letters
  version: '1.0.0'
  contact:
    name: Word Unscrambler Team

servers:
  - url: http://localhost:3000
    description: Local development server
  - url: https://word-unscrambler.example.com
    description: Production server

paths:
  /unscrambler/v1/words:
    get:
      summary: Find words that can be formed from letters
      description:
        Returns all valid English words (3-10 letters) that can be formed from
        the provided letters. Supports wildcard (?) matching any single letter.
      operationId: getWords
      parameters:
        - name: letters
          in: query
          required: true
          schema:
            type: string
            minLength: 3
            maxLength: 10
            pattern: '^[a-zA-Z?]+$'
          examples:
            valid:
              value: 'abc'
              description: Valid input with 3 letters
            wildcard:
              value: 'h?llo'
              description: Input with wildcard character
          description:
            Letters to search for (3-10 characters, a-z plus optional ?
            wildcard)
      responses:
        '200':
          description: Success - returns array of matching words
          content:
            application/json:
              schema:
                type: object
                properties:
                  words:
                    type: array
                    items:
                      type: string
                      minLength: 3
                      maxLength: 10
                    description:
                      Array of valid words that can be formed from input letters
                required:
                  - words
              examples:
                withResults:
                  value:
                    words: ['abc', 'bac', 'cab']
                  description: Results found
                noResults:
                  value:
                    words: []
                  description:
                    No words match the input (still 200, not an error)
        '400':
          description: Bad Request - invalid input
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    description: Error message describing what went wrong
                required:
                  - error
              examples:
                tooShort:
                  value:
                    error: 'Supplied text must be 3–10 characters in length.'
                  description: Input is less than 3 characters
                tooLong:
                  value:
                    error: 'Supplied text must be 3–10 characters in length.'
                  description: Input is more than 10 characters
                invalidChars:
                  value:
                    error:
                      'Supplied text may only include letters (upper or lower
                      case) and question marks.'
                  description:
                    Input contains invalid characters (numbers, special chars,
                    etc.)
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    description: Sanitized error message
                required:
                  - error
              examples:
                serverError:
                  value:
                    error: 'Server error. Please try again later.'
                  description:
                    Unexpected server error (dictionary corruption, etc.)

components:
  schemas:
    WordsResponse:
      type: object
      properties:
        words:
          type: array
          items:
            type: string
          description: Array of valid words

    ErrorResponse:
      type: object
      properties:
        error:
          type: string
          description: Error message

tags:
  - name: Words
    description: Word unscrambling operations
```

### Key Sections Explained

**1. openapi & info:**

- Version: 3.1.0 (latest)
- Title & description
- Version: 1.0.0

**2. servers:**

- Development: http://localhost:3000
- Production: https://word-unscrambler.example.com

**3. paths:**

- `/unscrambler/v1/words` → GET operation
- Parameter: `letters` (query, required, 3-10 chars, pattern: `^[a-zA-Z?]+$`)

**4. responses:**

- 200: Success with words array
- 400: Validation errors (LENGTH, INVALID_CHAR)
- 500: Server error

**5. examples:**

- Show actual request/response pairs
- Cover all scenarios: success, empty, errors

**6. components:**

- Reusable schemas (WordsResponse, ErrorResponse)

---

## Architecture Compliance

From project-context.md:

✅ **API Documentation:**

- [ ] OpenAPI 3.1 format (standard, widely supported)
- [ ] Complete endpoint documentation
- [ ] Request/response schemas
- [ ] All error codes and messages
- [ ] Example requests and responses

✅ **API Contract:**

- [ ] Endpoint path: /unscrambler/v1/words ✓
- [ ] HTTP method: GET ✓
- [ ] Parameter: letters (query, required) ✓
- [ ] Response: { words: [...] } ✓
- [ ] Errors: 400, 500 with messages ✓

---

## Testing & Validation

**Manual Validation:**

```bash
# 1. Check YAML syntax (install swagger-cli if needed)
npx @apidevtools/swagger-cli validate packages/server/openapi.yaml
# Should output: Valid!

# 2. View in Swagger UI (optional, requires swagger-ui-express)
# Endpoint: http://localhost:3000/api-docs
# (Can be set up in future enhancement)

# 3. Compare specification with actual implementation
# - Run endpoint and verify responses match examples
# - Check error messages match spec
# - Verify HTTP status codes match
```

**No Unit Tests Needed:**

- Documentation-only story
- Validation via spec validation tools

---

## Code Quality Standards

✅ **YAML Format:**

- [ ] Valid YAML syntax
- [ ] Proper indentation (2 spaces)
- [ ] No syntax errors

✅ **OpenAPI Compliance:**

- [ ] 3.1.0 specification version
- [ ] All required fields present
- [ ] Schema definitions valid
- [ ] Examples match actual API

---

## Critical Implementation Notes

**DO:**

- ✅ Use OpenAPI 3.1 (latest version)
- ✅ Include all HTTP status codes (200, 400, 500)
- ✅ Document parameter constraints (minLength, maxLength, pattern)
- ✅ Provide realistic examples
- ✅ Use clear descriptions
- ✅ Match specification to actual implementation exactly
- ✅ Include error message examples

**DON'T:**

- ❌ Use older OpenAPI 2.0 format
- ❌ Skip error scenarios
- ❌ Leave fields undefined
- ❌ Specify behavior that doesn't exist
- ❌ Use vague descriptions
- ❌ Include examples that don't match responses

---

## Related Stories & Dependencies

**Previous Story:** Story 2.4 (Fully implemented endpoint)

**Next Epic:** Epic 3 (Frontend UI Implementation)

- Frontend developers will use this spec to call the API
- E2E tests will verify API contract

**Usage:**

- Frontend integration (Story 3.3 - useWordFetcher hook)
- API client generation (future tooling)
- Developer documentation
- Swagger UI (future enhancement)

---

## Git & Commit Guidelines

**Commit Message Format:**

```
docs(api): create openapi 3.1 specification

- Document GET /unscrambler/v1/words endpoint
- Include request/response schemas
- Add examples for success, empty results, and all error cases
- Specify parameter constraints and validation rules
- Match specification to implementation exactly

Closes #2-5
```

**Files to Commit:**

- `packages/server/openapi.yaml`

---

## Success Criteria Summary

When Story 2.5 is DONE:

1. ✅ openapi.yaml file exists at packages/server/
2. ✅ Specification is valid OpenAPI 3.1
3. ✅ Documents GET /unscrambler/v1/words endpoint
4. ✅ Includes all parameters, responses, and examples
5. ✅ Covers success (200), bad request (400), and error (500) cases
6. ✅ Examples match actual API responses
7. ✅ No syntax errors or validation warnings
8. ✅ Specification matches implementation exactly
9. ✅ Epic 2 COMPLETE - Backend API ready for frontend integration

---

## Story Completion Tracking

**Status:** done  
**Created:** 2026-04-18  
**Dev Agent:** Amelia (claude-sonnet-4-6)  
**Review Agent:** (To be assigned)  
**Completed:** 2026-04-19

---

## Dev Agent Record

### Implementation Summary

Created `packages/server/openapi.yaml` — valid OpenAPI 3.1.0 specification.

**Decisions made:**

- Error messages copied verbatim from `src/validators/letters.ts` (em dash
  U+2013 preserved in length error)
- Added `missingParam` example (AC5.7: spec matches implementation exactly —
  validator handles missing param separately)
- Word `items.maxLength` set to 7 (matches API spec: returns 3–7 letter words
  only)
- Used `$ref` to `components/schemas` for DRY response schemas

**Validation:**
`npx @apidevtools/swagger-cli validate packages/server/openapi.yaml` → **Valid**

### Files Changed

- `packages/server/openapi.yaml` (NEW)

### Review Findings

**Patches Applied:**

- [x] [Review][Patch] Input trimming behavior documented — added note to
      `letters` parameter description about leading/trailing whitespace trimming
- [x] [Review][Patch] Added `uniqueItems: true` to response schema —
      `components/schemas/WordsResponse/properties/words` now explicitly
      guarantees no duplicate items

**Acceptance Audit:** ✅ PASS — All 8 acceptance criteria satisfied.
Specification matches implementation exactly.

---

**Epic 2 Completion Summary:**

- ✅ 2.1: Express app with CORS & error handling
- ✅ 2.2: Dictionary Service (file loading & word lookup)
- ✅ 2.3: Input Validation
- ✅ 2.4: GET /unscrambler/v1/words endpoint
- ✅ 2.5: OpenAPI documentation

**Backend API: FULLY FUNCTIONAL & DOCUMENTED**

Next: Epic 3 (Frontend UI) begins!
