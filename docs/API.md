# API Documentation

REST API endpoint for word lookup.

## Overview

Single endpoint for querying word combinations from input letters.

## Endpoint

### GET /unscrambler/v1/words

Find all valid English words that can be formed from input letters.

### Request

```
GET /unscrambler/v1/words?letters={letters}
```

**Parameters:**

| Name    | Type   | Required | Description                                               |
| ------- | ------ | -------- | --------------------------------------------------------- |
| letters | string | Yes      | 3-10 letters (a-z, case-insensitive), supports ? wildcard |

### Response

#### Success (200 OK)

```json
{
  "words": ["abc", "bac", "cab"]
}
```

**Schema:**

```typescript
{
  words: string[]  // Array of matching words, sorted alphabetically
}
```

#### Error (400 Bad Request)

```json
{
  "error": "LENGTH",
  "message": "Supplied text must be 3–10 characters in length."
}
```

or

```json
{
  "error": "INVALID_CHAR",
  "message": "Supplied text may only include letters (upper or lower case) and question marks."
}
```

### Examples

#### Example 1: Simple Lookup

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words?letters=abc"
```

**Response (200):**

```json
{
  "words": ["abc", "bac", "cab"]
}
```

#### Example 2: Wildcard Lookup

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words?letters=h?llo"
```

**Response (200):**

```json
{
  "words": ["hello", "hullo"]
}
```

#### Example 3: No Results

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words?letters=xyz"
```

**Response (200):**

```json
{
  "words": []
}
```

#### Example 4: Invalid Length

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words?letters=ab"
```

**Response (400):**

```json
{
  "error": "LENGTH",
  "message": "Supplied text must be 3–10 characters in length."
}
```

#### Example 5: Invalid Characters

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words?letters=abc@123"
```

**Response (400):**

```json
{
  "error": "INVALID_CHAR",
  "message": "Supplied text may only include letters (upper or lower case) and question marks."
}
```

#### Example 6: Missing Required Parameter

**Request:**

```bash
curl "http://localhost:3000/unscrambler/v1/words"
```

**Response (400):**

```json
{
  "error": "LENGTH",
  "message": "Supplied text must be 3–10 characters in length."
}
```

## Performance

- **Typical Response Time:** < 1 second
- **Maximum Response Time:** < 10 seconds
- **P99 Response Time:** < 5 seconds

## Rate Limiting

No rate limiting (MVP version). For production, consider implementing:

```typescript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/unscrambler/', limiter);
```

## CORS

CORS is configured per environment:

**Development:**

```
CORS_ORIGIN: http://localhost:5173
```

**Production:**

```
CORS_ORIGIN: https://yourdomain.com
```

## Error Codes

| Error        | Status | Meaning                                  |
| ------------ | ------ | ---------------------------------------- |
| LENGTH       | 400    | Input not 3–10 characters                |
| INVALID_CHAR | 400    | Contains characters other than a-z and ? |
| SERVER_ERROR | 500    | Internal server error                    |

---

See [openapi.yaml](../packages/server/openapi.yaml) for OpenAPI 3.1
specification.
