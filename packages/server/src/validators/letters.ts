const LETTER_MIN_LENGTH = 3;
const LETTER_MAX_LENGTH = 10;
const MAX_WILDCARDS = 3;

interface ValidationResult {
  valid: boolean;
  error?: string;
  normalizedLetters?: string;
}

export function validateLetters(input: unknown): ValidationResult {
  if (input === undefined || input === null || typeof input !== 'string') {
    return {
      valid: false,
      error: 'Supplied text parameter is required.',
    };
  }

  const trimmed = input.trim();

  if (trimmed.length < LETTER_MIN_LENGTH || trimmed.length > LETTER_MAX_LENGTH) {
    return {
      valid: false,
      error: 'Supplied text must be 3-10 characters in length.',
    };
  }

  if (!/^[a-z?]+$/i.test(trimmed)) {
    return {
      valid: false,
      error: 'Supplied text may only include letters (upper or lower case) and question marks.',
    };
  }

  const wildcardCount = (trimmed.match(/\?/g) || []).length;
  if (wildcardCount > MAX_WILDCARDS) {
    return {
      valid: false,
      error: `Supplied text may contain at most ${MAX_WILDCARDS} wildcard characters (?)`,
    };
  }

  return {
    valid: true,
    normalizedLetters: trimmed.toLowerCase(),
  };
}
