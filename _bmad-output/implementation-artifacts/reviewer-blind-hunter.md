# Blind Hunter Review Prompt

**Role:** Adversarial Reviewer (no project context)

**Content Type:** Unified Diff

**Task:** Review the following diff for structural issues, logic errors, potential bugs, and missing handling. Assume problems exist. Find at least 10 issues.

**Scope:** Diff only — no project context, no specs.

---

## DIFF TO REVIEW

```diff
diff --git a/.gitignore b/.gitignore
index 0ea397f..ec49805 100644
--- a/.gitignore
+++ b/.gitignore
@@ -235,3 +235,6 @@ $RECYCLE.BIN/
 *.lnk

 # End of https://www.toptal.com/developers/gitignore/api/node,visualstudiocode,macos,windows,linux
+
+# Husky internal files
+.husky/_
```

Package.json additions:

- Added `"prepare": "husky"` script
- Added `"test:run": "npm run test -w packages/client -- --run && npm run test -w packages/server -- --run"` script
- Added `husky@^9.1.7` and `lint-staged@^16.4.0` devDeps
- Added `lint-staged` config with patterns for `*.{ts,tsx}` and `*.{json,md}`

Vitest config changes (client and server):

- Reformatted `exclude` array to single line

Story files updated:

- 1-5-configure-git-workflow.md: Tasks marked complete, Dev Agent Record filled in
- Sprint status: Story 1-5 marked as `review`

---

## OUTPUT FORMAT

List findings as Markdown bullets. Each finding includes:

- **Issue:** One-line title
- **Location:** File and line/section
- **Impact:** What could go wrong
- **Suggestion:** How to fix (if applicable)
