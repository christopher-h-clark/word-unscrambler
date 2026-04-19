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
