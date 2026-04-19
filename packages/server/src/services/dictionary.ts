import fs from 'fs';

const WORD_MIN_LENGTH = 3;
const WORD_MAX_LENGTH = 10;

export class DictionaryService {
  private static words: Set<string> | undefined;
  private static sortedWords: string[] | undefined;

  static initialize(filePath: string): void {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const wordList = content
        .split('\n')
        .map((w) => w.trim().toLowerCase())
        .filter((w) => w.length >= WORD_MIN_LENGTH && w.length <= WORD_MAX_LENGTH);
      DictionaryService.words = new Set(wordList);
      DictionaryService.sortedWords = Array.from(DictionaryService.words).sort();
      console.log(`[INFO] Dictionary loaded: ${DictionaryService.words.size} words`);
    } catch (error) {
      throw new Error('Failed to load dictionary', { cause: error });
    }
  }

  static findWords(letters: string): string[] {
    if (!DictionaryService.sortedWords) throw new Error('Dictionary not initialized');
    return DictionaryService.sortedWords.filter((word) =>
      DictionaryService.canFormWord(word, letters)
    );
  }

  private static canFormWord(word: string, letters: string): boolean {
    const letterMap = new Map<string, number>();
    for (const letter of letters) {
      letterMap.set(letter, (letterMap.get(letter) ?? 0) + 1);
    }
    for (const letter of word) {
      const letterCount = letterMap.get(letter) ?? 0;
      if (letterCount > 0) {
        letterMap.set(letter, letterCount - 1);
      } else {
        const wildcardCount = letterMap.get('?') ?? 0;
        if (wildcardCount > 0) {
          letterMap.set('?', wildcardCount - 1);
        } else {
          return false;
        }
      }
    }
    return true;
  }

  static reset(): void {
    DictionaryService.words = undefined;
    DictionaryService.sortedWords = undefined;
  }
}
