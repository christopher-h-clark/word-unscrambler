# Deferred Work Tracking

## Deferred from: Code Review of Story 2.1 (2026-04-18)

- **No API routes defined**: Story 2-1 is foundation (middleware, CORS, error handling); API routes (`GET /unscrambler/v1/words`) come in story 2-4.

- **Environment variable loading only in dev mode**: Pre-existing in `config.ts`; dotenv loads only when `IS_DEV=true`, but production still uses `CORS_ORIGIN` default if env var missing. Not caused by story 2-1 changes. Consider for config refactor in future story.
