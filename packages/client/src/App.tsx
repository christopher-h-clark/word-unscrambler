import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useWordFetcher } from './hooks/useWordFetcher';

export const App: React.FC = () => {
  const { state, fetchWords } = useWordFetcher();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchSubmit = async (letters: string): Promise<void> => {
    setHasSearched(true);
    await fetchWords(letters);
  };

  const isTimeout = state.error?.includes('timed out') ?? false;

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 overflow-y-auto">
      <header className="text-center py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">Word Unscrambler</h1>
        <p className="text-xl text-blue-400 mb-8">Simple, fast, and easy</p>
        <SearchForm onSubmit={handleSearchSubmit} />
      </header>

      <main className="flex justify-center px-4 pb-16">
        <div className="w-full max-w-2xl">
          {state.isLoading && (
            <div className="text-center text-blue-400">
              <p>Searching...</p>
            </div>
          )}

          {state.error && !state.isLoading && (
            <div
              className={`text-center ${isTimeout ? 'text-yellow-400' : 'text-red-400'}`}
              role="alert"
            >
              <p>{state.error}</p>
            </div>
          )}

          {!state.isLoading && !state.error && hasSearched && Array.isArray(state.words) && (
            <ResultsDisplay words={state.words} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
