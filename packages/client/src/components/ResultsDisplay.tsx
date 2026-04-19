import React from 'react';
import { ResultCard } from './ResultCard';
import type { ResultsDisplayProps } from '../types';

interface WordGroup {
  length: number;
  words: string[];
}

function groupWordsByLength(words: string[]): WordGroup[] {
  const groups = new Map<number, string[]>();

  for (const word of words) {
    const len = word.length;
    if (!groups.has(len)) {
      groups.set(len, []);
    }
    groups.get(len)!.push(word);
  }

  return Array.from(groups.entries())
    .map(([len, groupWords]) => ({
      length: len,
      words: groupWords.sort(),
    }))
    .sort((a, b) => a.length - b.length);
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ words }) => {
  // Wrapped by ErrorBoundary in parent component (Story 3.5)
  if (words.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-lg text-gray-400">
          No words match those letters. Try different letters.
        </p>
      </div>
    );
  }

  const groupedWords = groupWordsByLength(words);

  return (
    <div className="mt-8 space-y-4">
      {groupedWords.map((group) => (
        <ResultCard key={String(group.length)} length={group.length} words={group.words} />
      ))}
    </div>
  );
};

export default ResultsDisplay;
