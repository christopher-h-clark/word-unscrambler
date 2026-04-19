import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { App } from '../../App';

vi.mock('../../hooks/useWordFetcher', () => ({
  useWordFetcher: vi.fn(),
}));

/* eslint-disable @typescript-eslint/naming-convention */
vi.mock('../../components/SearchForm', () => ({
  SearchForm: ({ onSubmit }: { onSubmit: (letters: string) => void | Promise<void> }) => (
    <form
      data-testid="search-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit('abc');
      }}
    >
      <button type="submit">Unscramble!</button>
    </form>
  ),
}));

vi.mock('../../components/ResultsDisplay', () => ({
  ResultsDisplay: ({ words }: { words: string[] }) => (
    <div data-testid="results-display">
      {words.length === 0 ? (
        <p>No words match those letters. Try different letters.</p>
      ) : (
        words.map((w) => <span key={w}>{w}</span>)
      )}
    </div>
  ),
}));
/* eslint-enable @typescript-eslint/naming-convention */

import { useWordFetcher } from '../../hooks/useWordFetcher';

const mockUseWordFetcher = vi.mocked(useWordFetcher);

describe('App integration', () => {
  const mockFetchWords = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWordFetcher.mockReturnValue({
      state: { words: [], isLoading: false, error: null },
      fetchWords: mockFetchWords,
    });
  });

  test('renders hero title "Word Unscrambler"', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /word unscrambler/i })).toBeTruthy();
  });

  test('renders hero subtitle "Simple, fast, and easy"', () => {
    render(<App />);
    expect(screen.getByText(/simple, fast, and easy/i)).toBeTruthy();
  });

  test('renders SearchForm component', () => {
    render(<App />);
    expect(screen.getByTestId('search-form')).toBeTruthy();
  });

  test('does not render ResultsDisplay before first search', () => {
    render(<App />);
    expect(screen.queryByTestId('results-display')).toBeNull();
  });

  test('calls fetchWords when SearchForm onSubmit fires', async () => {
    render(<App />);
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(mockFetchWords).toHaveBeenCalledOnce();
    });
  });

  test('renders ResultsDisplay with words after successful search', () => {
    mockUseWordFetcher.mockReturnValue({
      state: { words: ['abc', 'bac', 'cab'], isLoading: false, error: null },
      fetchWords: mockFetchWords,
    });
    render(<App />);
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    expect(screen.getByTestId('results-display')).toBeTruthy();
    expect(screen.getByText('abc')).toBeTruthy();
    expect(screen.getByText('bac')).toBeTruthy();
  });

  test('shows loading message when isLoading is true', () => {
    mockUseWordFetcher.mockReturnValue({
      state: { words: [], isLoading: true, error: null },
      fetchWords: mockFetchWords,
    });
    render(<App />);
    expect(screen.getByText(/searching/i)).toBeTruthy();
  });

  test('does not render ResultsDisplay while loading', () => {
    mockUseWordFetcher.mockReturnValue({
      state: { words: [], isLoading: true, error: null },
      fetchWords: mockFetchWords,
    });
    render(<App />);
    expect(screen.queryByTestId('results-display')).toBeNull();
  });

  test('displays error message when state has error', () => {
    mockUseWordFetcher.mockReturnValue({
      state: { words: [], isLoading: false, error: 'Server error. Please try again later.' },
      fetchWords: mockFetchWords,
    });
    render(<App />);
    expect(screen.getByText('Server error. Please try again later.')).toBeTruthy();
  });

  test('does not render ResultsDisplay when error is set', () => {
    mockUseWordFetcher.mockReturnValue({
      state: { words: [], isLoading: false, error: 'Request failed' },
      fetchWords: mockFetchWords,
    });
    render(<App />);
    expect(screen.queryByTestId('results-display')).toBeNull();
  });

  test('renders ResultsDisplay with empty words for no-match state after search', () => {
    mockUseWordFetcher.mockReturnValue({
      state: { words: [], isLoading: false, error: null },
      fetchWords: mockFetchWords,
    });
    render(<App />);
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    expect(screen.getByTestId('results-display')).toBeTruthy();
    expect(screen.getByText(/no words match/i)).toBeTruthy();
  });

  test('calls fetchWords with letters from SearchForm', async () => {
    render(<App />);
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(mockFetchWords).toHaveBeenCalledWith('abc');
    });
  });

  test('error message renders in alert role for accessibility', () => {
    mockUseWordFetcher.mockReturnValue({
      state: { words: [], isLoading: false, error: 'Validation error message' },
      fetchWords: mockFetchWords,
    });
    render(<App />);
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  test('multiple sequential searches update results correctly', async () => {
    const { rerender } = render(<App />);

    mockUseWordFetcher.mockReturnValue({
      state: { words: ['abc'], isLoading: false, error: null },
      fetchWords: mockFetchWords,
    });
    rerender(<App />);

    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    expect(screen.getByText('abc')).toBeTruthy();

    mockUseWordFetcher.mockReturnValue({
      state: { words: ['def', 'fed'], isLoading: false, error: null },
      fetchWords: mockFetchWords,
    });
    rerender(<App />);
    expect(screen.getByText('def')).toBeTruthy();
    expect(screen.getByText('fed')).toBeTruthy();
  });

  test('validation error from hook displays correctly', () => {
    mockUseWordFetcher.mockReturnValue({
      state: {
        words: [],
        isLoading: false,
        error: 'Supplied text must be 3-10 characters in length.',
      },
      fetchWords: mockFetchWords,
    });
    render(<App />);
    expect(screen.getByText('Supplied text must be 3-10 characters in length.')).toBeTruthy();
  });

  test('timeout error from hook displays correctly', () => {
    mockUseWordFetcher.mockReturnValue({
      state: { words: [], isLoading: false, error: 'Request timed out. Please try again.' },
      fetchWords: mockFetchWords,
    });
    render(<App />);
    expect(screen.getByText('Request timed out. Please try again.')).toBeTruthy();
  });

  test('loading state hides both error and results areas', () => {
    mockUseWordFetcher.mockReturnValue({
      state: { words: ['abc'], isLoading: true, error: null },
      fetchWords: mockFetchWords,
    });
    render(<App />);
    expect(screen.queryByTestId('results-display')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText(/searching/i)).toBeTruthy();
  });
});
