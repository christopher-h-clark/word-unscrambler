import { useState, useCallback } from 'react';
import type { SearchState, UseWordFetcherReturn } from '@/types';

export type { SearchState, UseWordFetcherReturn };

const TIMEOUT_MS = 10000;

const initialState: SearchState = {
  words: [],
  isLoading: false,
  error: null,
};

function getApiBase(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (import.meta as any).env;
  const base = env && env.REACT_APP_API_URL ? env.REACT_APP_API_URL : 'http://localhost:3000';

  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    base.startsWith('http://')
  ) {
    console.warn(
      '[WARN] Mixed content detected: frontend is served over HTTPS but API URL is HTTP. ' +
        'This will be blocked by the browser. Configure REACT_APP_API_URL to use HTTPS.'
    );
  }

  return base;
}

export function useWordFetcher(): UseWordFetcherReturn {
  const [state, setState] = useState<SearchState>(initialState);

  const fetchWords = useCallback(async (letters: string): Promise<void> => {
    setState({ words: [], isLoading: true, error: null });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const base = getApiBase();
      const url = `${base}/unscrambler/v1/words?letters=${encodeURIComponent(letters)}`;
      const response = await fetch(url, { signal: controller.signal });

      clearTimeout(timeoutId);

      let data: unknown;
      try {
        data = await response.json();
      } catch {
        setState({ words: [], isLoading: false, error: 'Failed to parse response' });
        return;
      }

      if (response.ok) {
        const body = data as { words?: unknown };
        const words =
          Array.isArray(body.words) && body.words.every((w) => typeof w === 'string')
            ? body.words
            : [];
        setState({ words, isLoading: false, error: null });
        return;
      }

      const errorBody = data as { error?: string };
      const errorMessage = errorBody.error ?? 'An error occurred. Please try again.';
      setState({ words: [], isLoading: false, error: errorMessage });
    } catch (err) {
      clearTimeout(timeoutId);

      if ((err as { name?: string }).name === 'AbortError') {
        setState({ words: [], isLoading: false, error: 'Request timed out. Please try again.' });
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setState({ words: [], isLoading: false, error: errorMessage });
    }
  }, []);

  return { state, fetchWords };
}
