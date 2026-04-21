# Architecture Guide

Technical architecture and design decisions for the Word Unscrambler
application.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (User)                           │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP/WebSocket
┌─────────────────▼───────────────────────────────────────────────┐
│              Frontend (React 18 + Vite)                         │
│            localhost:5173                                       │
├─────────────────────────────────────────────────────────────────┤
│  SearchForm → useWordFetcher → ResultsDisplay                   │
│  (Input)     (API Client)     (Display grouped by length)       │
│                       ↓                                         │
│              ErrorBoundary (Error handling)                     │
└─────────────────┬───────────────────────────────────────────────┘
                  │ GET /unscrambler/v1/words?letters=xyz
┌─────────────────▼───────────────────────────────────────────────┐
│              Backend (Express 5)                                │
│            localhost:3000                                       │
├─────────────────────────────────────────────────────────────────┤
│  CORS Middleware → Route Handler → Validation → Service         │
│                    validateLetters()  DictionaryService         │
│                                       ↓                         │
│                                 In-Memory Set/Trie              │
│                                 (10K+ words)                    │
└─────────────────────────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│              File System (Words Dictionary)                     │
│            data/words.txt (3-10 letter words)                   │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Choices & Rationale

### Frontend: React 18 + Vite

**Why React?**

- Component-based UI naturally maps to word lookup workflow
- Rich ecosystem (React Router, state management, testing)
- Strong TypeScript support
- Excellent developer experience

**Why Vite?**

- Fast development server with Hot Module Replacement (HMR)
- Rapid builds (< 1 second)
- Excellent TypeScript support
- Small bundle size (< 100KB gzipped)

**Why Tailwind CSS?**

- Utility-first approach for rapid UI development
- Responsive design out of the box
- Dark mode support with minimal configuration
- Excellent accessibility defaults

### Backend: Express + Node.js 18+

**Why Express?**

- Lightweight and flexible
- Large ecosystem of middleware
- Perfect for simple REST APIs
- Strong TypeScript support

**Why Node.js?**

- JavaScript/TypeScript isomorphic codebase
- Fast I/O for file-based dictionary
- Built-in modules for HTTP, file system, etc.

**Why File-Based Dictionary?**

- No database required (simpler deployment)
- Lightning-fast in-memory lookups (Set/Trie)
- Easy to version control and deploy
- No network latency to database

### Monorepo: npm Workspaces

**Why Monorepo?**

- Single git repository for full stack
- Shared TypeScript configuration
- Shared dev tools (ESLint, Prettier)
- Unified CI/CD pipeline
- Simplified deployment

## Component Architecture

### Frontend Components

```
App
├── SearchForm
│   └── Input field + Submit button
├── ResultsDisplay
│   ├── GroupedResults (sorted by length)
│   ├── ErrorMessage
│   └── EmptyState
└── ErrorBoundary
    └── Fallback UI for crashes
```

**Data Flow:**

1. User enters letters in SearchForm
2. SearchForm calls useWordFetcher hook
3. useWordFetcher fetches from API
4. ResultsDisplay renders grouped results
5. ErrorBoundary catches component errors

### Backend Routes

```
/unscrambler/v1/words (GET)
├── Middleware: CORS
├── Middleware: Body Parser
├── Handler: validateLetters()
├── Service: DictionaryService.findWords()
└── Response: { words: string[] } | { error: string }
```

## Data Models

### API Request

```typescript
interface WordsRequest {
  letters: string; // 3-10 chars, a-z and ?
}
```

### API Response (Success)

```typescript
interface WordsResponse {
  words: string[]; // Sorted alphabetically, grouped by length
}
```

### API Response (Error)

```typescript
interface ErrorResponse {
  error: 'LENGTH' | 'INVALID_CHAR';
  message: string;
}
```

### Dictionary Service

```typescript
interface DictionaryService {
  initialize(filePath: string): void;
  findWords(letters: string): string[];
  canFormWord(word: string, letters: string): boolean;
}
```

## Performance Design

### Dictionary Lookup

**Algorithm:** Set-based character matching

```
For each word in dictionary:
  Create letter frequency map from input
  For each letter in word:
    Check if available in frequency map
    Decrement count if ? wildcard available
  Return word if all letters available
```

**Time Complexity:** O(n \* m) where n = dictionary size, m = word length
**Space Complexity:** O(n) for Set storage

### Memory Usage

- Dictionary: ~1000 words × 10 bytes ≈ 10KB in memory
- Per-request overhead: ~1KB for temporary maps
- Total: ~50MB typical (includes Node.js runtime)

### Response Time Targets

| Scenario        | Target  | Notes          |
| --------------- | ------- | -------------- |
| API Response    | < 1s    | Typical case   |
| Dictionary Load | < 5s    | Server startup |
| Frontend Bundle | < 100KB | Gzipped        |

## Security Architecture

### Input Validation

**Frontend:**

- Length check (3-10 chars)
- Regex whitelist (a-z and ?)
- User feedback on invalid input

**Backend (Defense in Depth):**

- Type checking (TypeScript)
- Length validation (400 if out of range)
- Regex validation (400 if invalid chars)
- No SQL injection (no database)
- No command injection (no shell commands)

### Error Handling

**Frontend:**

- Error boundaries catch component errors
- User-friendly error messages
- No stack traces exposed

**Backend:**

- Try/catch in all routes
- Sanitized error messages
- No file paths or system info exposed
- Proper HTTP status codes

### CORS

- Development: Restrict to `http://localhost:5173`
- Production: Restrict to `https://yourdomain.com`
- Prevents unauthorized origin access

## Testing Strategy

### Test Pyramid

```
     /\           E2E Tests (10%)
    /  \          - User workflows
   /────\         - Cross-browser
  /      \
 /────────\        Integration Tests (30%)
/          \       - API routes
/──────────\       - Service methods

███████████████   Unit Tests (60%)
                  - Components
                  - Utilities
                  - Business logic
```

### Test Coverage

- **Unit Tests:** 60% (components, services, utilities)
- **Integration Tests:** 30% (API routes, service interactions)
- **E2E Tests:** 10% (full user workflows)
- **Minimum Coverage:** 70%

## Deployment Architecture

### Local Development

```
Docker Compose (optional)
├── Frontend (Vite dev server on :5173)
├── Backend (Express dev server on :3000)
└── Network: Bridge network for local communication
```

### Production

```
Docker Container (Multi-stage Build)
├── Build Stage: Node 18 + npm
├── Runtime Stage: Node 18 (lightweight)
├── Files:
│   ├── Frontend dist/ (static HTML/CSS/JS)
│   ├── Backend dist/ (compiled JavaScript)
│   └── Dictionary (words.txt)
└── Port: 3000
```

### Deployment Options

1. **Docker Registry + Kubernetes**
   - Image pushed to registry
   - Deployed via kubectl
   - Auto-scaling, rolling updates
   - _Note: Requires Kubernetes cluster setup and knowledge of kubectl,
     deployments, services, and persistent volumes_

2. **Cloud Platform (Heroku, Vercel, etc.)**
   - Git-based deployment
   - Automatic builds and deployments
   - Environment variables via UI

3. **Traditional VPS**
   - Docker Compose deployment
   - Manual or scripted deployment
   - SSH-based management

## Scaling Considerations

### Horizontal Scaling

For high traffic:

- Multiple container instances
- Load balancer (Nginx, HAProxy)
- Shared state not required (stateless)
- Dictionary loaded once per instance
- **No synchronization issues:** Each instance loads the dictionary
  independently; no shared mutable state

### Vertical Scaling

For resource bottlenecks:

- Increase container memory (currently ~100MB)
- Increase CPU allocation
- No database to scale separately

### Caching & Dictionary Updates

- No client-side caching (dictionary changes rarely)
- No server-side caching (API stateless)
- Browser caches static assets

**Important:** The dictionary is loaded into memory once at server startup. If
the `words.txt` file is modified while the server is running, those changes will
NOT be reflected in API responses until the server is restarted.

## Current Capabilities

- ✅ **Wildcard search** — The `?` character is supported as a wildcard to match
  any single letter (e.g., `h?llo` matches `hello`, `hullo`)

## Future Enhancements

### Features

- [ ] Enhanced wildcard patterns (regex, multi-character wildcards)
- [ ] Advanced filters (word length, pattern)
- [ ] Search history
- [ ] Favorite words
- [ ] Multiple languages

### Performance

- [ ] Response caching (Redis)
- [ ] CDN for static assets
- [ ] API rate limiting
- [ ] Analytics and monitoring

### Infrastructure

- [ ] Database for user data
- [ ] Authentication system
- [ ] Admin dashboard
- [ ] A/B testing framework

## References

- [OpenAPI Specification](../packages/server/openapi.yaml)
- [API Documentation](API.md)
- [Development Guide](../DEVELOPMENT.md)
- [Deployment Guide](../DEPLOYMENT.md)
