# Edge Case Hunter Review Prompt

**Role:** Path tracer with project read access

**Task:** Analyze documentation against actual project state. Verify:

- Links point to real files
- Commands work as written
- Paths exist in repository
- Examples are accurate
- Environment variable references are correct
- Troubleshooting advice is valid

**Output:** JSON array of findings. Each finding: location, trigger, guard,
consequence

---

## Content to Verify

Story 5-3 documentation files:

- README.md (rewritten)
- DEVELOPMENT.md (new, 463 lines)
- DEPLOYMENT.md (new, 345 lines)
- docs/API.md (new, 194 lines)
- docs/ARCHITECTURE.md (new, 346 lines)

---

## Verification Checklist

### File Paths & Links

- [ ] All relative links in markdown (`[text](path)`) point to existing files
- [ ] Path separators correct (Unix style: `/`, not `\`)
- [ ] Internal cross-references (README → DEVELOPMENT → DEPLOYMENT) are
      bidirectional
- [ ] Doc file paths like `docs/ARCHITECTURE.md`, `docs/API.md` exist
- [ ] Package file references exist: `packages/client/`, `packages/server/`

### Commands & Scripts

- [ ] `npm run dev` command defined and works
- [ ] `npm run build` produces output directories mentioned
- [ ] `npm run test`, `npm run test:client`, `npm run test:server` are valid
- [ ] Docker commands: `docker build`, `docker-compose up/down` work
- [ ] File operations: `cp .env.example .env.local` — files exist
- [ ] Bash utilities: `lsof`, `kill`, `curl`, `git` are standard and portable

### Environment Variables

- [ ] Frontend env vars (`REACT_APP_API_URL`) documented correctly
- [ ] Backend env vars (`NODE_ENV`, `PORT`, `WORD_LIST_PATH`, `CORS_ORIGIN`)
      documented
- [ ] `.env.example` files exist and are referenced correctly
- [ ] Environment variable defaults match actual defaults in code

### Paths & File Locations

- [ ] `packages/client/dist/` produced by build ✓
- [ ] `packages/server/dist/` produced by build ✓
- [ ] `packages/server/data/words.txt` exists ✓
- [ ] `packages/server/openapi.yaml` exists ✓
- [ ] `.github/workflows/ci.yml` exists (if referenced)

### Examples & Code Snippets

- [ ] API examples:
      `curl http://localhost:3000/unscrambler/v1/words?letters=abc`
- [ ] Response examples match actual API response schema
- [ ] Docker Compose setup in DEPLOYMENT.md is accurate
- [ ] Dockerfile path and commands correct

### Setup Time Estimate

- [ ] "5-minute setup" claim is realistic
- [ ] Step-by-step commands are copy-pasteable
- [ ] No implicit prerequisites missed

---

**When done:** Reply with JSON findings array.
