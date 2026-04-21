# Acceptance Auditor Review Prompt

**Role:** Spec compliance auditor

**Task:** Review documentation diff against Story 5-3 acceptance criteria and
spec.

**Output:** Markdown findings. Format: AC violated + evidence + impact

---

## Acceptance Criteria to Verify

From Story 5-3:

✅ **AC5.3.1:** Create README.md with project overview, quick start, usage, tech
stack  
✅ **AC5.3.2:** Create DEVELOPMENT.md with local setup, workspace structure,
workflow  
✅ **AC5.3.3:** Create DEPLOYMENT.md with production deployment, environment
config, health checks  
✅ **AC5.3.4:** Create or reference ARCHITECTURE.md explaining technology
choices  
✅ **AC5.3.5:** Create API.md documenting REST API endpoint with examples  
✅ **AC5.3.6:** Verify openapi.yaml exists at packages/server/openapi.yaml  
✅ **AC5.3.7:** All documentation links are correct and files exist  
✅ **AC5.3.8:** Documentation includes setup time estimates and
troubleshooting  
✅ **AC5.3.9:** No dead links or missing references  
✅ **AC5.3.10:** Documentation is clear to developers unfamiliar with project

---

## Spec Requirements from Story

### README.md Requirements

- Project overview and purpose
- Quick start (git clone, npm install, npm run dev)
- Usage examples
- Tech stack

### DEVELOPMENT.md Requirements

- Local setup instructions
- Workspace structure explanation
- Development workflow (npm commands)
- Testing approach (how to run tests)
- Building (npm run build)
- Git workflow

### DEPLOYMENT.md Requirements

- Production deployment steps
- Environment variable configuration
- Dictionary management
- Health checks and monitoring
- Rollback procedures

### ARCHITECTURE.md Requirements

- Technology choices and rationale
- Component structure
- API contract
- Testing strategy

### API.md Requirements

- REST API endpoint documentation
- Request/response examples
- Error handling examples

### openapi.yaml Requirements

- Must exist at packages/server/openapi.yaml
- OpenAPI 3.1 specification
- Complete endpoint specifications

---

## Spec Intent & Constraints

**Core Intent:** Enable new developers and operators to work with project
independently

**Key Constraints:**

- Setup should be learnable in < 5 minutes
- No secrets or hardcoded internal URLs
- Documentation clear to unfamiliar readers
- All examples tested and accurate
- Troubleshooting covers common issues

---

## Violations to Check

For each AC, verify:

1. Does the documentation implement it fully?
2. Is the content accurate and complete?
3. Are there gaps that violate the spec intent?
4. Do examples contradict the actual system?
5. Is tone appropriate for unfamiliar developers?

---

**When done:** Reply with findings as markdown list.
