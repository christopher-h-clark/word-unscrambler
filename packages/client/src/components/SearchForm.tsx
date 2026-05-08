import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SearchFormProps } from '@/types';

export { type SearchFormProps };

const MAX_WILDCARDS = 3;

export const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const trimmedInput = input.trim();
  const wildcardCount = (trimmedInput.match(/\?/g) || []).length;
  const isValid =
    trimmedInput.length >= 3 && trimmedInput.length <= 10 && wildcardCount <= MAX_WILDCARDS;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let newValue = e.currentTarget.value.replace(/[^a-zA-Z?]/g, '');
    let wildcardCount = 0;
    newValue = newValue
      .split('')
      .filter((char) => {
        if (char === '?') {
          if (wildcardCount < MAX_WILDCARDS) {
            wildcardCount++;
            return true;
          }
          return false;
        }
        return true;
      })
      .join('');
    setInput(newValue);
    setHasSearched(false);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedInput);
      setHasSearched(true);
    } catch (error) {
      console.error(
        'Form submission failed:',
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFocus = (): void => {
    if (hasSearched && !isSubmitting) {
      setInput('');
    }
  };

  const handleCompositionStart = (): void => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (): void => {
    setIsComposing(false);
  };

  return (
    <div className="flex flex-col gap-4 md:max-w-lg md:mx-auto">
      <Input
        id="search-input"
        type="text"
        autoFocus
        placeholder="Enter 3-10 letters"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        aria-label="Enter letters to unscramble"
        aria-describedby="search-hint"
        disabled={isSubmitting}
      />
      <div id="search-hint" className="text-sm text-gray-400">
        3-10 letters accepted, max 3 wildcards (?)
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        className="w-full md:w-auto md:max-w-md md:min-w-[25vw] h-10 md:h-16 md:self-center"
      >
        {isSubmitting ? 'Unscrambling...' : 'Unscramble!'}
      </Button>
    </div>
  );
};

export default SearchForm;
