import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SearchFormProps } from '@/types';

export { type SearchFormProps };

export const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const trimmedInput = input.trim();
  const isValid = trimmedInput.length >= 3 && trimmedInput.length <= 10;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.currentTarget.value.replace(/[^a-zA-Z?]/g, ''));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedInput);
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
    if (!isSubmitting) {
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
    <div className="flex flex-col gap-4">
      <Input
        id="search-input"
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
        3-10 letters accepted
      </div>
      <Button onClick={handleSubmit} disabled={!isValid || isSubmitting} className="w-full">
        {isSubmitting ? 'Unscrambling...' : 'Unscramble!'}
      </Button>
    </div>
  );
};

export default SearchForm;
