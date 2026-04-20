import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useWordFetcher } from './useWordFetcher';

const mockFetch = vi.fn();
(globalThis as typeof globalThis & { fetch: typeof vi.fn }).fetch = mockFetch;

function makeResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('useWordFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns initial state', () => {
    const { result } = renderHook(() => useWordFetcher());
    expect(result.current.state).toEqual({
      words: [],
      isLoading: false,
      error: null,
    });
    expect(typeof result.current.fetchWords).toBe('function');
  });

  test('sets isLoading true during request then false after', async () => {
    let resolvePromise!: (r: Response) => void;
    mockFetch.mockReturnValueOnce(
      new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      })
    );

    const { result } = renderHook(() => useWordFetcher());

    act(() => {
      result.current.fetchWords('abc');
    });

    expect(result.current.state.isLoading).toBe(true);
    expect(result.current.state.error).toBeNull();

    await act(async () => {
      resolvePromise(makeResponse({ words: ['abc'] }, 200));
    });

    expect(result.current.state.isLoading).toBe(false);
  });

  test('returns words on successful fetch (200)', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ words: ['abc', 'bac', 'cab'] }, 200));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('abc');
    });

    expect(result.current.state).toEqual({
      words: ['abc', 'bac', 'cab'],
      isLoading: false,
      error: null,
    });
  });

  test('returns empty words array on 200 with no matches — not an error', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ words: [] }, 200));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('xyz');
    });

    expect(result.current.state).toEqual({
      words: [],
      isLoading: false,
      error: null,
    });
  });

  test('captures error message on 400 validation error', async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse({ error: 'Supplied text must be 3–7 characters.' }, 400)
    );

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('ab');
    });

    expect(result.current.state).toEqual({
      words: [],
      isLoading: false,
      error: 'Supplied text must be 3–7 characters.',
    });
  });

  test('captures error message on 500 server error', async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse({ error: 'Server error. Please try again later.' }, 500)
    );

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('abc');
    });

    expect(result.current.state).toEqual({
      words: [],
      isLoading: false,
      error: 'Server error. Please try again later.',
    });
  });

  test('returns timeout error message on AbortError', async () => {
    mockFetch.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('abc');
    });

    expect(result.current.state).toEqual({
      words: [],
      isLoading: false,
      error: 'Request timed out. Please try again.',
    });
  });

  test('passes AbortSignal to fetch (timeout mechanism is wired up)', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ words: [] }, 200));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('abc');
    });

    const fetchOptions = mockFetch.mock.calls[0][1] as RequestInit;
    expect(fetchOptions.signal).toBeDefined();
    expect(fetchOptions.signal instanceof AbortSignal).toBe(true);
  });

  test('handles network error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('abc');
    });

    expect(result.current.state).toEqual({
      words: [],
      isLoading: false,
      error: 'Network failure',
    });
  });

  test('clears previous error on new successful request', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ error: 'Too short.' }, 400));
    mockFetch.mockResolvedValueOnce(makeResponse({ words: ['abc'] }, 200));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('ab');
    });
    expect(result.current.state.error).toBe('Too short.');

    await act(async () => {
      await result.current.fetchWords('abc');
    });
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.words).toEqual(['abc']);
  });

  test('clears previous words when new request starts', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ words: ['abc', 'bac'] }, 200));

    let resolveSecond!: (r: Response) => void;
    mockFetch.mockReturnValueOnce(
      new Promise<Response>((resolve) => {
        resolveSecond = resolve;
      })
    );

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('abc');
    });
    expect(result.current.state.words).toEqual(['abc', 'bac']);

    act(() => {
      result.current.fetchWords('def');
    });
    expect(result.current.state.words).toEqual([]);

    await act(async () => {
      resolveSecond(makeResponse({ words: ['def'] }, 200));
    });
    expect(result.current.state.words).toEqual(['def']);
  });

  test('encodes letters in URL', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ words: [] }, 200));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('a b');
    });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain(encodeURIComponent('a b'));
  });

  test('URL contains correct endpoint path and letters param', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ words: ['abc'] }, 200));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('abc');
    });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/unscrambler/v1/words');
    expect(calledUrl).toContain('letters=abc');
  });

  test('handles multiple sequential requests correctly', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ words: ['abc'] }, 200));
    mockFetch.mockResolvedValueOnce(makeResponse({ words: ['def', 'fed'] }, 200));
    mockFetch.mockResolvedValueOnce(makeResponse({ words: ['ghi'] }, 200));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('abc');
    });
    expect(result.current.state.words).toEqual(['abc']);

    await act(async () => {
      await result.current.fetchWords('def');
    });
    expect(result.current.state.words).toEqual(['def', 'fed']);

    await act(async () => {
      await result.current.fetchWords('ghi');
    });
    expect(result.current.state.words).toEqual(['ghi']);
  });

  test('handles malformed JSON response gracefully', async () => {
    mockFetch.mockResolvedValueOnce(new Response('not-json', { status: 200 }));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('abc');
    });

    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.error).toBeTruthy();
    expect(result.current.state.words).toEqual([]);
  });

  test('uses fallback error message when response has no message field', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ error: 'UNKNOWN' }, 500));

    const { result } = renderHook(() => useWordFetcher());

    await act(async () => {
      await result.current.fetchWords('abc');
    });

    expect(result.current.state.error).toBeTruthy();
    expect(result.current.state.isLoading).toBe(false);
  });
});
