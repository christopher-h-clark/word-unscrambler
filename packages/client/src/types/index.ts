export interface SearchFormProps {
  onSubmit: (letters: string) => void | Promise<void>;
}
