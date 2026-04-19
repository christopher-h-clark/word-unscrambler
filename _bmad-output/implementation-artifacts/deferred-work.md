# Deferred Work Tracking

## Deferred from: Code Review of Story 2.1 (2026-04-18)

- **No API routes defined**: Story 2-1 is foundation (middleware, CORS, error
  handling); API routes (`GET /unscrambler/v1/words`) come in story 2-4.

- **Environment variable loading only in dev mode**: Pre-existing in
  `config.ts`; dotenv loads only when `IS_DEV=true`, but production still uses
  `CORS_ORIGIN` default if env var missing. Not caused by story 2-1 changes.
  Consider for config refactor in future story.

## Deferred from: Code Review of Story 2.4 (2026-04-19)

- **Dictionary may be uninitialized on concurrent request during startup**
  [HIGH]: If request arrives before `DictionaryService.initialize()` completes,
  endpoint returns generic 500 error. Requires health check endpoint and
  initialization locking mechanism. Pre-existing architectural issue, not caused
  by this story.

- **DictionaryService tightly coupled as static dependency**: No dependency
  injection pattern makes unit testing difficult and limits flexibility.
  Refactor to accept service instance or use factory pattern. Pre-existing
  architectural issue.

- **Dictionary search O(n) unbounded on large datasets**: Full array scan on
  every request. Performance acceptable with current 1,000-word dictionary;
  scales poorly with 1M+ words. Implement in-memory LRU cache or pagination.
  Pre-existing, not caused by this story.

- **No rate limiting or request throttling**: Endpoint unprotected against
  resource exhaustion attacks. Requires `express-rate-limit` middleware or
  reverse proxy rate limiting. Pre-existing, not caused by this story.

- **Dictionary file load path dependency**: Deployment must include
  `packages/server/data/words.txt`; no graceful fallback. Add to deployment
  checklist and verify in startup tests. Pre-existing.

- **Production static asset fallback swallows sendFile errors**: `sendFile()`
  error handling in app.ts catch block is too broad. Consider more specific
  error handling. Pre-existing, not in endpoint code but app-level architectural
  issue.

- **Concurrent state sharing via static DictionaryService**: Tests call
  `DictionaryService.reset()` in `beforeEach`. Production safe but fragile
  architecture. Refactor to instance-based or immutable state management.
  Pre-existing architectural issue.

## Deferred from: Code Review of Story 3.3 (2026-04-19)

- **No Cleanup on Component Unmount**: If component unmounts while `fetchWords`
  is executing, `setState` will fire on unmounted component. Acceptable React
  pattern with proper AbortController implementation; low severity with
  concurrent error handling in place. Can be addressed in future refactor if
  React strict mode warnings become problematic.
