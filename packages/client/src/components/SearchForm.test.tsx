import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from './SearchForm';

describe('SearchForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders input with placeholder "Enter 3-10 letters"', () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    expect(screen.getByPlaceholderText('Enter 3-10 letters')).toBeTruthy();
  });

  test('renders hint text "3-10 letters accepted"', () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText('3-10 letters accepted')).toBeTruthy();
  });

  test('renders button labeled "Unscramble!"', () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /unscramble!/i })).toBeTruthy();
  });

  test('input receives focus on mount (autoFocus)', () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    expect(document.activeElement).toBe(input);
  });

  test('button is disabled when input is empty', () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const button = screen.getByRole('button', { name: /unscramble!/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  test('button is disabled when input has fewer than 3 characters', async () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: 'ab' } });
    const button = screen.getByRole('button', { name: /unscramble!/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  test('button is enabled when input has 3-10 characters', async () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: 'abc' } });
    const button = screen.getByRole('button', { name: /unscramble!/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  test('button is disabled when input exceeds 10 characters', async () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: 'abcdefghijk' } });
    const button = screen.getByRole('button', { name: /unscramble!/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  test('calls onSubmit with trimmed input when button is clicked', async () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: '  abc  ' } });
    await userEvent.click(screen.getByRole('button', { name: /unscramble!/i }));
    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockOnSubmit).toHaveBeenCalledWith('abc');
  });

  test('calls onSubmit with trimmed input when Enter key is pressed', async () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: '  abc  ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockOnSubmit).toHaveBeenCalledWith('abc');
  });

  test('does not call onSubmit when Enter is pressed with invalid input', () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('does not clear input on focus while submission is pending', async () => {
    const slowOnSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<SearchForm onSubmit={slowOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /unscramble!/i }));

    fireEvent.blur(input);
    fireEvent.focus(input);
    expect(input.value).toBe('abc');
  });

  test('auto-clears input value when input gains focus (not submitting)', async () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('abc');
    fireEvent.blur(input);
    fireEvent.focus(input);
    expect(input.value).toBe('');
  });

  test('does not call onSubmit when a non-Enter key is pressed', () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.keyDown(input, { key: 'Space', code: 'Space' });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('does not call onSubmit when button is clicked with invalid input length', async () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: 'ab' } });
    const button = screen.getByRole('button', { name: /unscramble!/i });
    await userEvent.click(button);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('prevents multiple submissions while Promise is pending', async () => {
    const slowOnSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<SearchForm onSubmit={slowOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: 'abc' } });
    const button = screen.getByRole('button', { name: /unscramble!/i }) as HTMLButtonElement;

    await userEvent.click(button);
    expect(button.disabled).toBe(true);
    await userEvent.click(button);
    expect(slowOnSubmit).toHaveBeenCalledOnce();
  });

  test('disables input while submission is pending', async () => {
    const slowOnSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 50)));
    render(<SearchForm onSubmit={slowOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /unscramble!/i }));

    expect(input.disabled).toBe(true);
  });

  test('shows loading state while submission is pending', async () => {
    const slowOnSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 50)));
    render(<SearchForm onSubmit={slowOnSubmit} />);
    fireEvent.change(screen.getByPlaceholderText('Enter 3-10 letters'), {
      target: { value: 'abc' },
    });
    fireEvent.click(screen.getByRole('button', { name: /unscramble!/i }));

    const button = screen.getByRole('button');
    expect(button.textContent).toMatch(/unscrambling/i);
  });

  test('handles Promise rejection gracefully', async () => {
    const failingOnSubmit = vi.fn(() => Promise.reject(new Error('API error')));
    render(<SearchForm onSubmit={failingOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: 'abc' } });

    await userEvent.click(screen.getByRole('button', { name: /unscramble!/i }));
    expect(failingOnSubmit).toHaveBeenCalledOnce();
  });

  test('skips submission during IME composition', () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters');
    fireEvent.change(input, { target: { value: 'abc' } });

    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockOnSubmit).not.toHaveBeenCalled();

    fireEvent.compositionEnd(input);
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockOnSubmit).toHaveBeenCalledOnce();
  });

  test('has aria-label for accessibility', () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Enter letters to unscramble');
  });

  test('hint text is associated via aria-describedby', () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Enter 3-10 letters') as HTMLInputElement;
    const hint = screen.getByText('3-10 letters accepted') as HTMLDivElement;
    expect(input.getAttribute('aria-describedby')).toBe('search-hint');
    expect(hint.getAttribute('id')).toBe('search-hint');
  });
});
