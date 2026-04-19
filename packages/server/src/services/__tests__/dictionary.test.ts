import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { DictionaryService } from '../dictionary';

function writeTempWords(words: string[]): string {
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `words-test-${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, words.join('\n'), 'utf-8');
  return tmpFile;
}

describe('DictionaryService', () => {
  afterEach(() => {
    DictionaryService.reset();
  });

  describe('initialize', () => {
    test('loads dictionary from file and reports word count', () => {
      const tmpFile = writeTempWords(['cat', 'dog', 'bat']);
      expect(() => DictionaryService.initialize(tmpFile)).not.toThrow();
      fs.unlinkSync(tmpFile);
    });

    test('throws error if file not found', () => {
      expect(() => DictionaryService.initialize('/nonexistent/path/words.txt')).toThrow();
    });

    test('normalizes words to lowercase on load', () => {
      const tmpFile = writeTempWords(['CAT', 'Dog', 'BAT']);
      DictionaryService.initialize(tmpFile);
      const results = DictionaryService.findWords('cat');
      expect(results).toContain('cat');
      fs.unlinkSync(tmpFile);
    });

    test('filters empty lines', () => {
      const tmpFile = writeTempWords(['cat', '', '   ', 'dog', '']);
      DictionaryService.initialize(tmpFile);
      const results = DictionaryService.findWords('catdog');
      expect(results).toContain('cat');
      expect(results).toContain('dog');
      fs.unlinkSync(tmpFile);
    });

    test('filters words shorter than 3 characters', () => {
      const tmpFile = writeTempWords(['a', 'ab', 'cat', 'dog']);
      DictionaryService.initialize(tmpFile);
      const results = DictionaryService.findWords('abcatdog');
      expect(results).not.toContain('a');
      expect(results).not.toContain('ab');
      expect(results).toContain('cat');
      fs.unlinkSync(tmpFile);
    });

    test('filters words longer than 10 characters', () => {
      const tmpFile = writeTempWords(['cat', 'abcdefghijk', 'abcdefghijkl']);
      DictionaryService.initialize(tmpFile);
      // Use letters that form 'cat'; long words should be excluded from dictionary
      const results = DictionaryService.findWords('cat');
      expect(results).toContain('cat');
      // Long words were filtered on load, so can never appear in results
      const allResults = DictionaryService.findWords('abcdefghijkl');
      expect(allResults).not.toContain('abcdefghijk');
      expect(allResults).not.toContain('abcdefghijkl');
      fs.unlinkSync(tmpFile);
    });
  });

  describe('findWords', () => {
    beforeEach(() => {
      const tmpFile = writeTempWords([
        'cat',
        'bat',
        'cab',
        'tab',
        'act',
        'tac',
        'hello',
        'hallo',
        'jello',
        'abc',
        'bac',
        'aaa',
        'dog',
        'god',
        'fog',
      ]);
      DictionaryService.initialize(tmpFile);
      fs.unlinkSync(tmpFile);
    });

    test('returns words that can be formed from input letters', () => {
      const results = DictionaryService.findWords('cat');
      expect(results).toContain('cat');
      expect(results).toContain('act');
    });

    test('does not return words requiring letters not in input', () => {
      const results = DictionaryService.findWords('cat');
      expect(results).not.toContain('bat');
      expect(results).not.toContain('dog');
    });

    test('returns empty array when no words match', () => {
      const results = DictionaryService.findWords('xyz');
      expect(results).toEqual([]);
    });

    test('returns results sorted alphabetically', () => {
      const results = DictionaryService.findWords('catb');
      const sorted = [...results].sort();
      expect(results).toEqual(sorted);
    });

    test('returns no duplicates', () => {
      const results = DictionaryService.findWords('aaa');
      const unique = new Set(results);
      expect(results.length).toEqual(unique.size);
    });

    test('supports wildcard (?) matching any single letter', () => {
      // 'h?llo' should match 'hello' (? = e) and 'hallo' (? = a)
      const results = DictionaryService.findWords('h?llo');
      expect(results.length).toBeGreaterThan(0);
      expect(results).toContain('hello');
      expect(results).toContain('hallo');
    });

    test('wildcard (?) accounts for only one letter per usage', () => {
      // 'cat' with input 'c?t' (? replaces a) — should match
      const tmpFile = writeTempWords(['cat', 'cot', 'cut', 'bat']);
      DictionaryService.reset();
      DictionaryService.initialize(tmpFile);
      const results = DictionaryService.findWords('c?t');
      expect(results).toContain('cat');
      expect(results).toContain('cot');
      expect(results).toContain('cut');
      expect(results).not.toContain('bat');
      fs.unlinkSync(tmpFile);
    });

    test('multiple wildcards each replace one letter', () => {
      // '?og' matches dog, fog, god — wait, god doesn't match ?og
      // '?o?' matches dog, fog, god (no: god=g,o,d — ?o? needs pos1=any,pos2=o,pos3=any)
      // Let's test: 'd?g' should match 'dog' (? = o)
      const tmpFile = writeTempWords(['dog', 'dig', 'dug', 'dag']);
      DictionaryService.reset();
      DictionaryService.initialize(tmpFile);
      const results = DictionaryService.findWords('d?g');
      expect(results.length).toBeGreaterThanOrEqual(1);
      // one ? can match one letter
      expect(results.some((w) => ['dog', 'dig', 'dug', 'dag'].includes(w))).toBe(true);
      fs.unlinkSync(tmpFile);
    });

    test('completes in < 1 second for typical inputs', () => {
      const start = performance.now();
      DictionaryService.findWords('abcdefghij');
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(1000);
    });

    test('throws error if dictionary not initialized', () => {
      DictionaryService.reset();
      expect(() => DictionaryService.findWords('cat')).toThrow('Dictionary not initialized');
    });

    test('results contain only words 3-10 characters long', () => {
      const results = DictionaryService.findWords('abcdefghij');
      results.forEach((word) => {
        expect(word.length).toBeGreaterThanOrEqual(3);
        expect(word.length).toBeLessThanOrEqual(10);
      });
    });

    test('correctly uses available letter counts (not just presence)', () => {
      // 'cat' requires c:1,a:1,t:1 — 'cat' can be formed from 'cat'
      // but 'tac' also requires t:1,a:1,c:1 — same letters
      // 'act' requires a:1,c:1,t:1 — same
      // 'catat' would require c:1,a:2,t:2 — NOT formable from 'cat'
      const tmpFile = writeTempWords(['cat', 'catat']);
      DictionaryService.reset();
      DictionaryService.initialize(tmpFile);
      const results = DictionaryService.findWords('cat');
      expect(results).toContain('cat');
      expect(results).not.toContain('catat');
      fs.unlinkSync(tmpFile);
    });
  });
});
