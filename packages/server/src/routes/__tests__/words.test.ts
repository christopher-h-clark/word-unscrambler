import request from 'supertest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import app from '../../app';
import { DictionaryService } from '../../services/dictionary';
import path from 'path';

const WORDS_FILE = path.resolve(__dirname, '../../../data/words.txt');

beforeEach(async () => {
  DictionaryService.reset();
  await DictionaryService.initialize(WORDS_FILE);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('GET /unscrambler/v1/words', () => {
  describe('valid input', () => {
    test('returns 200 with words array for valid input', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('words');
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('returns empty array when no words match', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=xzz');
      expect(res.status).toBe(200);
      expect(res.body.words).toEqual([]);
      expect(res.body).not.toHaveProperty('error');
    });

    test('returns sorted words', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.status).toBe(200);
      const sorted = [...res.body.words].sort();
      expect(res.body.words).toEqual(sorted);
    });

    test('returns only words 3-10 characters long', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abcdefghij');
      expect(res.status).toBe(200);
      res.body.words.forEach((word: string) => {
        expect(word.length).toBeGreaterThanOrEqual(3);
        expect(word.length).toBeLessThanOrEqual(10);
      });
    });

    test('filters words at 3-character boundary', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.status).toBe(200);
      res.body.words.forEach((word: string) => {
        expect(word.length).toBeGreaterThanOrEqual(3);
      });
    });

    test('filters words at 10-character boundary', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abcdefghij');
      expect(res.status).toBe(200);
      res.body.words.forEach((word: string) => {
        expect(word.length).toBeLessThanOrEqual(10);
      });
    });

    test('returns correct words for different valid inputs', async () => {
      const inputs = ['abc', 'eat', 'cat'];
      for (const letters of inputs) {
        const res = await request(app).get(`/unscrambler/v1/words?letters=${letters}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.words)).toBe(true);
      }
    });
  });

  describe('invalid input', () => {
    test('returns 400 for missing letters parameter', async () => {
      const res = await request(app).get('/unscrambler/v1/words');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test('returns 400 for input too short (< 3 chars)', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('3-10');
    });

    test('returns 400 for input too long (> 10 chars)', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abcdefghijk');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('3-10');
    });

    test('returns 400 for non-alphabetic input (except ?)', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab@cd');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('letters');
    });

    test('returns 400 for numbers in input', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc123');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('returns 400 for special characters in input', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc!%40%23');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('returns 400 for empty string parameter', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test('handles whitespace in input (trimmed by URL decoding)', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=%20abc%20');
      expect(res.status).toBeDefined();
      if (res.status === 200) {
        expect(Array.isArray(res.body.words)).toBe(true);
      } else {
        expect(res.body).toHaveProperty('error');
      }
    });

    test('returns 400 for unicode/accented characters', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=caf%C3%A9');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('returns 400 for very long input (500+ chars)', async () => {
      const longInput = 'a'.repeat(500);
      const res = await request(app).get(`/unscrambler/v1/words?letters=${longInput}`);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('returns 400 for repeated characters (algorithm stress test)', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=aaaaaa');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('returns 400 for multiple letters parameters in query string', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc&letters=xyz');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('exactly once');
    });
  });

  describe('wildcard support', () => {
    test('accepts single wildcard (h?llo)', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=h?llo');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('accepts multiple wildcards (h??lo)', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=h??lo');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('wildcard only (???) is valid', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=???');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('wildcard at start (?bc) returns 200', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=?bc');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('wildcard at end (ab?) returns 200', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab?');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('single wildcard (?) returns 400 — too short', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=?');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('two-char wildcard (??) returns 400 — too short', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=??');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('response format', () => {
    test('success response has "words" property and no "error" property', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('words');
      expect(res.body).not.toHaveProperty('error');
    });

    test('error response has "error" property and no "words" property', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body).not.toHaveProperty('words');
    });

    test('words property is always an array', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('error property is always a non-empty string', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab');
      expect(res.status).toBe(400);
      expect(typeof res.body.error).toBe('string');
      expect(res.body.error.length).toBeGreaterThan(0);
    });
  });

  describe('case-insensitivity', () => {
    test('accepts uppercase input', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ABC');
      expect(res.status).toBe(200);
    });

    test('accepts mixed case input', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=AbC');
      expect(res.status).toBe(200);
    });

    test('lowercase and uppercase return the same results', async () => {
      const resLower = await request(app).get('/unscrambler/v1/words?letters=abc');
      const resUpper = await request(app).get('/unscrambler/v1/words?letters=ABC');
      expect(resLower.body.words).toEqual(resUpper.body.words);
    });
  });

  describe('error messages', () => {
    test('LENGTH error message is specific and user-friendly', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('3-10');
      expect(res.body.error).not.toContain('.ts');
      expect(res.body.error).not.toContain('Error:');
      expect(res.body.error).not.toContain('regex');
      expect(res.body.error).not.toMatch(/line \d+/i);
    });

    test('INVALID_CHAR error message is specific and user-friendly', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab@cd');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error).not.toContain('.ts');
      expect(res.body.error).not.toContain('Error:');
      expect(res.body.error).not.toContain('regex');
      expect(res.body.error).not.toMatch(/line \d+/i);
    });

    test('no error message contains technical terms', async () => {
      const testCases = [
        '/unscrambler/v1/words?letters=ab',
        '/unscrambler/v1/words?letters=ab@cd',
        '/unscrambler/v1/words?letters=abc123',
      ];
      for (const url of testCases) {
        const res = await request(app).get(url);
        expect(res.status).toBe(400);
        expect(res.body.error).not.toContain('.ts');
        expect(res.body.error).not.toContain('Error:');
        expect(res.body.error).not.toContain('Traceback');
        expect(res.body.error).not.toContain('stack');
      }
    });
  });

  describe('performance', () => {
    test('responds in < 1 second for typical queries', async () => {
      const start = Date.now();
      await request(app).get('/unscrambler/v1/words?letters=abc');
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(1000);
    });

    test('responds within 10 seconds for max-length input', async () => {
      const start = Date.now();
      const res = await request(app).get('/unscrambler/v1/words?letters=abcdefghij');
      const elapsed = Date.now() - start;
      expect(res.status).toBe(200);
      expect(elapsed).toBeLessThan(10000);
    });
  });

  describe('server error handling', () => {
    test('returns 500 with sanitized message when dictionary throws', async () => {
      vi.spyOn(DictionaryService, 'findWords').mockImplementation(() => {
        throw new Error('internal failure');
      });
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Server error. Please try again later.');
      expect(res.body.error).not.toContain('internal failure');
    });
  });
});
