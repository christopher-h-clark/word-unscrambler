# API Specification: Word Unscrambler

**Version:** 1.0  
**Date:** 2026-04-16  
**Status:** Final

---

## Overview

The Word Unscrambler API provides a single endpoint to find valid English words that can be formed from a given set of letters.

---

## Endpoint

### GET /unscrambler/v1/words

Retrieve all valid English words (3-7 letters) that can be formed from the provided letters.

#### Request

**URL Format:**
```
GET /unscrambler/v1/words?letters={letters}
```

**Query Parameters:**

| Parameter | Type | Required | Constraints | Example |
|-----------|------|----------|-------------|---------|
| `letters` | string | Yes | 3-10 characters; alphanumeric (a-z, A-Z) plus `?` (wildcard); case-insensitive | `abc`, `H?LLO`, `ABC` |

**Validation Rules:**
- Minimum 3 characters, maximum 10 characters
- Allowed characters: letters (a-z, A-Z) and question mark (`?`)
- Question mark (`?`) represents a wildcard (matches any single letter)
- All input is treated case-insensitively
- Non-alphabetic characters (except `?`) and out-of-range lengths → 400 Bad Request

#### Success Response

**Status Code:** `200 OK`

**Response Body:**
```json
{
  "words": [
    "abc",
    "bac",
    "cab"
  ]
}
```

**Notes:**
- `words` array is **always present** (may be empty)
- Words are sorted alphabetically
- All returned words are 3-7 characters in length
- All returned words contain only characters from the input set (or match wildcard criteria)
- No duplicates in array

#### Empty Results Response

**Status Code:** `200 OK`

**Response Body:**
```json
{
  "words": []
}
```

**Note:** No words found is NOT an error. The frontend displays: "No words match your letters. Try different letters!"

#### Error Responses

**Status Code:** `400 Bad Request` — Invalid Input

**Trigger:** Malformed query (non-alphabetic chars except `?`, outside length range, missing `letters` param)

**Response Body:**
```json
{
  "error": "Invalid input: letters must be 3-10 characters, alphanumeric plus '?' only"
}
```

**Status Code:** `500 Internal Server Error` — Server Error

**Trigger:** Dictionary load failed, unexpected server error, dictionary corrupted

**Response Body:**
```json
{
  "error": "Server error. Please try again later."
}
```

**Note:** Error message is **sanitized** — does NOT reveal stack traces, file paths, or system details.

**Status Code:** `503 Service Unavailable` — Dictionary Not Ready

**Trigger:** Server started but dictionary initialization incomplete or failed

**Response Body:**
```json
{
  "error": "Service temporarily unavailable. Please try again."
}
```

---

## CORS Configuration

### Development
**Allowed Origin:** `http://localhost:3000` (or Vite dev server port)  
**Allowed Methods:** `GET`  
**Allowed Headers:** `Content-Type`  
**Credentials:** `false`

### Production
**Allowed Origin:** *(specify deployment domain, e.g., `https://word-unscrambler.example.com`)*  
**Allowed Methods:** `GET`  
**Allowed Headers:** `Content-Type`  
**Credentials:** `false`

### Implementation
Use Express CORS middleware:
```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET'],
  credentials: false
}));
```

---

## Security Considerations (OWASP Top 10)

### 1. Injection Prevention
- **Input validation:** Whitelist allowed characters (letters + `?`); reject anything else with 400
- **No dynamic SQL/code execution:** Dictionary is pre-loaded, no database queries
- **Regex safety:** If regex is used for matching, ensure no ReDoS (Regular Expression Denial of Service) patterns

### 2. Authentication & Authorization
- **Public API:** No authentication required for this endpoint
- **Rate limiting (future):** Consider adding rate limiting per IP if usage grows (e.g., 100 requests/minute/IP)

### 3. Sensitive Data Exposure
- **Error messages:** Sanitize all errors; never expose stack traces, file paths, or system details
- **Logging:** Log errors for debugging, but don't expose to client
- **HTTPS (production):** All production deployments must use HTTPS

### 4. XML/XXE Attacks
- **Not applicable:** API uses JSON, not XML

### 5. Broken Access Control
- **Not applicable:** No user accounts or resource ownership

### 6. Security Misconfiguration
- **CORS:** Configure per environment (see CORS Configuration above)
- **HTTP headers:** Set security headers (future detail):
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`

### 7. Cross-Site Scripting (XSS)
- **Backend responsibility:** Return sanitized error messages only
- **Frontend responsibility:** Sanitize any error text before rendering (handled in React component)

### 8. Insecure Deserialization
- **Not applicable:** No deserialization of untrusted data

### 9. Using Components with Known Vulnerabilities
- **Dependency audits:** Run `npm audit` before deployment
- **Updates:** Keep Express, Node.js, and all dependencies current

### 10. Insufficient Logging & Monitoring
- **Backend logging:** Log all 400/500 errors with timestamp and input (sanitized)
- **Monitoring (future):** Track error rates and response times

---

## Deployment Scenarios

### Scenario 1: Same Server (Development & Initial Deployment)
- Frontend: Served from Express static middleware (`express.static()`)
- Backend API: Express at `/api/words`
- Deployment: Single Node.js process on port 3000

**CORS:** Not strictly necessary (same origin), but configure to `http://localhost:3000` during dev.

### Scenario 2: Separate Servers (Future Scaling)
- Frontend: Deployed to CDN or separate static server (e.g., S3 + CloudFront)
- Backend: Dedicated Node.js server (different domain)

**CORS:** **Required.** Configure `CORS_ORIGIN` env var to frontend domain:
```bash
CORS_ORIGIN=https://frontend.example.com npm start
```

**API Base URL:** Frontend must know backend URL:
```typescript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';
```

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Response Time | < 10 seconds | From request to response body (includes dictionary lookup) |
| P99 Response Time | < 5 seconds | 99th percentile acceptable, not outlier |
| Uptime | 99% (during service hours) | Dictionary must load successfully; no silent failures |
| Bundle Size | < 100KB gzipped (frontend) | Does not include Wiktionary dictionary file |

---

## Dictionary Source & Format

### Source
- **Wiktionary English 3-7 letter words** (https://en.wiktionary.org/)
- **Initial corpus:** ~1,000 words (3-7 letters)
- **Format:** Newline-delimited plain text file or JSON array

### File Location
- **Development:** `./src/data/words.txt` (or `./server/data/words.json`)
- **Environment variable:** `WORD_LIST_PATH` (production override)

### Loading
- Loaded once at server startup (synchronous or async)
- Stored in memory as Set or Trie data structure
- If file missing or corrupted → server fails to start with clear error message

---

## Example Requests & Responses

### Example 1: Valid Input, Words Found
**Request:**
```
GET /unscrambler/v1/words?letters=abc HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "words": ["abc", "bac", "cab"]
}
```

---

### Example 2: Valid Input, No Words Found
**Request:**
```
GET /unscrambler/v1/words?letters=xyz HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "words": []
}
```

---

### Example 3: Invalid Input — Too Short
**Request:**
```
GET /unscrambler/v1/words?letters=ab HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid input: letters must be 3-10 characters"
}
```

---

### Example 4: Invalid Input — Non-Alphabetic (Except ?)
**Request:**
```
GET /unscrambler/v1/words?letters=ab@cd HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid input: letters must be alphanumeric and '?' only"
}
```

---

### Example 5: Wildcard Input
**Request:**
```
GET /unscrambler/v1/words?letters=h?llo HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "words": ["hello", "hallo"]
}
```

---

### Example 6: Server Error
**Request:**
```
GET /unscrambler/v1/words?letters=abc HTTP/1.1
Host: localhost:3000
```

**Response (if dictionary failed to load):**
```json
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Server error. Please try again later."
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-16 | Initial specification |

