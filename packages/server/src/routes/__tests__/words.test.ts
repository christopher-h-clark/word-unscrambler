import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import app from '../../app';
import { DictionaryService } from '../../services/dictionary';
import path from 'path';

const WORDS_FILE = path.resolve(__dirname, '../../../data/words.txt');

beforeEach(() => {
  DictionaryService.reset();
  DictionaryService.initialize(WORDS_FILE);
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
      const res = await request(app).get('/unscrambler/v1/words?letters=xyz');
      expect(res.status).toBe(200);
      expect(res.body.words).toEqual([]);
    });

    test('returns sorted words', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.status).toBe(200);
      const sorted = [...res.body.words].sort();
      expect(res.body.words).toEqual(sorted);
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
    });
  });

  describe('wildcard support', () => {
    test('accepts wildcard (?) in input', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=h?llo');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('wildcard only (???) is valid', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=???');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.words)).toBe(true);
    });
  });

  describe('response format', () => {
    test('success response has "words" property and no "error" property', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      expect(res.body).toHaveProperty('words');
      expect(res.body).not.toHaveProperty('error');
    });

    test('error response has "error" property and no "words" property', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab');
      expect(res.body).toHaveProperty('error');
      expect(res.body).not.toHaveProperty('words');
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
  });

  describe('error messages', () => {
    test('error message is user-friendly, not technical', async () => {
      const res = await request(app).get('/unscrambler/v1/words?letters=ab');
      expect(res.body.error).not.toContain('regex');
      expect(res.body.error).not.toContain('validation');
      expect(res.body.error).toContain('3-10');
    });
  });

  describe('performance', () => {
    test('responds in < 1 second for typical queries', async () => {
      const start = Date.now();
      await request(app).get('/unscrambler/v1/words?letters=abc');
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(1000);
    });
  });
});
