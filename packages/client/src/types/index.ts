export interface SearchFormProps {
  onSubmit: (letters: string) => void | Promise<void>;
}

export interface ResultsDisplayProps {
  words: string[];
}

export interface ResultCardProps {
  length: number;
  words: string[];
}

export interface SearchState {
  words: string[];
  isLoading: boolean;
  error: string | null;
}

export interface UseWordFetcherReturn {
  state: SearchState;
  fetchWords: (letters: string) => Promise<void>;
}
