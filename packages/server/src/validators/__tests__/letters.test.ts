import { describe, expect, test } from 'vitest';
import { validateLetters } from '../letters';

describe('validateLetters', () => {
  describe('missing or invalid type', () => {
    test('returns error for undefined', () => {
      const result = validateLetters(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    test('returns error for null', () => {
      const result = validateLetters(null);
      expect(result.valid).toBe(false);
    });

    test('returns error for non-string types', () => {
      expect(validateLetters(123).valid).toBe(false);
      expect(validateLetters({}).valid).toBe(false);
      expect(validateLetters([]).valid).toBe(false);
    });
  });

  describe('length validation', () => {
    test('returns error for input < 3 characters', () => {
      const result = validateLetters('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('3-10 characters');
    });

    test('returns error for input > 10 characters', () => {
      const result = validateLetters('abcdefghijk');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('3-10 characters');
    });

    test('returns error for empty string', () => {
      const result = validateLetters('');
      expect(result.valid).toBe(false);
    });

    test('accepts 3 character input', () => {
      expect(validateLetters('abc').valid).toBe(true);
    });

    test('accepts 10 character input', () => {
      expect(validateLetters('abcdefghij').valid).toBe(true);
    });
  });

  describe('character whitelist', () => {
    test('accepts lowercase letters', () => {
      expect(validateLetters('abc').valid).toBe(true);
    });

    test('accepts uppercase letters', () => {
      expect(validateLetters('ABC').valid).toBe(true);
    });

    test('accepts mixed case', () => {
      expect(validateLetters('AbC').valid).toBe(true);
    });

    test('accepts wildcard (?)', () => {
      expect(validateLetters('a?c').valid).toBe(true);
    });

    test('accepts wildcard only', () => {
      expect(validateLetters('???').valid).toBe(true);
    });

    test('rejects numbers', () => {
      const result = validateLetters('abc123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('letters');
    });

    test('rejects special characters (@)', () => {
      expect(validateLetters('ab@cd').valid).toBe(false);
    });

    test('rejects special characters (-)', () => {
      expect(validateLetters('ab-cd').valid).toBe(false);
    });

    test('rejects space', () => {
      expect(validateLetters('ab cd').valid).toBe(false);
    });
  });

  describe('normalization', () => {
    test('returns lowercase normalized input', () => {
      const result = validateLetters('ABC');
      expect(result.normalizedLetters).toBe('abc');
    });

    test('returns lowercase with wildcard', () => {
      const result = validateLetters('A?C');
      expect(result.normalizedLetters).toBe('a?c');
    });

    test('returns input as-is for valid lowercase', () => {
      const result = validateLetters('abc');
      expect(result.normalizedLetters).toBe('abc');
    });

    test('does not include normalizedLetters on invalid input', () => {
      const result = validateLetters('ab');
      expect(result.normalizedLetters).toBeUndefined();
    });
  });

  describe('performance', () => {
    test('validates in < 100ms', () => {
      const start = performance.now();
      validateLetters('abcdefghij');
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100);
    });
  });
});
