---
title: 'Build word list from SCOWL 50 (3-7 letter words)'
type: 'feature'
created: '2026-05-08'
status: 'done'
baseline_commit: '677dafbeea227eba07b8d2e898d1b11c57bbbabd'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Current word list in `data/words.txt` contains only 201 words
starting with the letter A, making the app non-functional for most word
unscrambling tasks. A comprehensive word list is needed to support the word
lookup and unscrambling features.

**Approach:** Fetch SCOWL 50 (a publicly available, curated English word list),
filter for words with 3-7 letters, and replace `data/words.txt` with the
filtered results. The DictionaryService already supports words from 3-10
letters, so filtering for 3-7 provides a balanced set.

## Boundaries & Constraints

**Always:**

- Write one word per line to `data/words.txt`
- Normalize all words to lowercase
- Filter for word length between 3 and 7 characters (inclusive)
- Remove duplicates
- Do not modify DictionaryService or word loading logic

**Ask First:**

- None — this is straightforward data population

**Never:**

- Change the location of `data/words.txt`
- Modify word filtering or processing logic in the service
- Alter how the service loads or uses the dictionary

## I/O & Edge-Case Matrix

| Scenario           | Input / State                    | Expected Output / Behavior                                                   | Error Handling                                   |
| ------------------ | -------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------ |
| Successful load    | SCOWL 50 list from public source | data/words.txt with 3-7 letter words, one per line, lowercase, no duplicates | Network or download failure → report error       |
| Duplicate handling | SCOWL list with duplicate words  | Each unique word appears exactly once in output                              | Deduplicate during processing                    |
| Case normalization | Mixed-case words in SCOWL        | All words normalized to lowercase                                            | Apply `.toLowerCase()` during processing         |
| Length filtering   | SCOWL words of all lengths       | Only 3-7 letter words in output                                              | Filter by `word.length >= 3 && word.length <= 7` |

</frozen-after-approval>

## Code Map

- `data/words.txt` -- Word list file; will be replaced with SCOWL 50 filtered
  results
- `packages/server/src/services/dictionary.ts` -- DictionaryService that loads
  words; expects one word per line, lowercase; filters for lengths 3-10 (our
  data provides 3-7, which is subset)

## Tasks & Acceptance

**Execution:**

- [x] `data/words.txt` -- Fetch SCOWL 50 from public source, filter for 3-7
      letter words, deduplicate, normalize to lowercase, write one per line --
      Replaces the minimal A-only test list with a comprehensive word set

**Acceptance Criteria:**

- Given the app starts with an empty or test word list, when data/words.txt is
  populated with SCOWL 50 (3-7 letter words), then the word unscrambler should
  find valid words for most letter combinations
- Given SCOWL 50 is fetched and processed, when words are written to
  data/words.txt, then each word appears exactly once (no duplicates)
- Given words are written to data/words.txt, when the dictionary service loads
  the file, then it reports a significantly larger word count than before (from
  ~200 to thousands)
- Given the word list is updated, when the build runs and tests execute, then no
  errors are reported and word lookup functionality works correctly

## Verification

**Commands:**

- `npm run build` -- expected: no build errors, TypeScript checks pass
- `npm test` -- expected: all tests pass, dictionary loads successfully
- `wc -l data/words.txt` -- expected: word count in thousands (SCOWL 50 will
  have many 3-7 letter words)
- `head -20 data/words.txt && tail -20 data/words.txt` -- expected: all words
  are lowercase, no duplicates, reasonable word list content

## Suggested Review Order

**Word List Data File**

- Comprehensive English word list with 55,538 words (3-7 letters)
  [`data/words.txt`](../../../data/words.txt)
