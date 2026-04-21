# Blind Hunter Review Prompt

**Role:** Cynical adversarial reviewer (zero context, diff only)

**Task:** Analyze this diff for structural issues, clarity, consistency,
completeness, accuracy, and potential user confusion.

**Output:** Markdown list of findings. Format: one-line title + category +
evidence

---

## Diff to Review

See attached diff: Story 5-3 creates README.md, DEVELOPMENT.md, DEPLOYMENT.md,
API.md, ARCHITECTURE.md

**File Summary:**

- README.md: 347 added, 216 deleted (heavy rewrite)
- DEVELOPMENT.md: 463 added (new)
- DEPLOYMENT.md: 345 added (new)
- docs/API.md: 194 added (new)
- docs/ARCHITECTURE.md: 346 added (new)
- Story metadata + sprint status updates: +109, +8

**Task:** Find at least 10 issues. Assume problems exist. Be skeptical.

---

## Areas to Scrutinize

1. **Clarity & Tone** - Is writing clear to unfamiliar developers?
2. **Completeness** - Are all steps, examples, and sections covered?
3. **Consistency** - Do all docs use same terminology, formatting, style?
4. **Accuracy** - Are technical details correct? Are URLs/paths right?
5. **Usability** - Are examples copy-pasteable? Are commands tested?
6. **Ambiguity** - Are there vague sections that could confuse?
7. **Organization** - Is information logically structured?
8. **Gaps** - What's missing that should be documented?
9. **Contradictions** - Do docs contradict each other or project reality?
10. **Setup Time** - Is the "5-minute setup" realistic?

---

**When done:** Reply with findings as markdown list.
