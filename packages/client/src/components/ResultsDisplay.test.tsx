import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { ResultsDisplay } from './ResultsDisplay';

describe('ResultsDisplay', () => {
  test('displays empty state message for empty array', () => {
    render(<ResultsDisplay words={[]} />);
    expect(screen.getByText('No words match those letters. Try different letters.')).toBeTruthy();
  });

  test('empty state message content is correct and supportive', () => {
    const { container } = render(<ResultsDisplay words={[]} />);
    expect(container.textContent).toContain('No words match those letters. Try different letters.');
  });

  test('renders no ResultCard components for empty array', () => {
    const { container } = render(<ResultsDisplay words={[]} />);
    expect(container.querySelectorAll('section').length).toBe(0);
  });

  test('groups words by length into separate cards', () => {
    render(<ResultsDisplay words={['abc', 'abcd', 'abcde']} />);
    expect(screen.getByText('3-Letter Words')).toBeTruthy();
    expect(screen.getByText('4-Letter Words')).toBeTruthy();
    expect(screen.getByText('5-Letter Words')).toBeTruthy();
  });

  test('renders only groups that have words (omits empty groups)', () => {
    const { container } = render(<ResultsDisplay words={['abc']} />);
    expect(container.querySelectorAll('section').length).toBe(1);
    expect(screen.getByText('3-Letter Words')).toBeTruthy();
  });

  test('sorts words alphabetically within each group', () => {
    render(<ResultsDisplay words={['cab', 'abc', 'bac']} />);
    expect(screen.getByText('abc bac cab')).toBeTruthy();
  });

  test('orders groups by length ascending', () => {
    const { container } = render(<ResultsDisplay words={['abcde', 'abc', 'abcd']} />);
    const headings = container.querySelectorAll('h3');
    expect(headings[0].textContent).toBe('3-Letter Words');
    expect(headings[1].textContent).toBe('4-Letter Words');
    expect(headings[2].textContent).toBe('5-Letter Words');
  });

  test('renders correct number of cards for mixed lengths', () => {
    const { container } = render(
      <ResultsDisplay words={['abc', 'bac', 'abcd', 'efgh', 'abcde']} />
    );
    expect(container.querySelectorAll('section').length).toBe(3);
  });

  test('words in each group are passed correctly to ResultCard', () => {
    render(<ResultsDisplay words={['abc', 'bac']} />);
    expect(screen.getByText('abc bac')).toBeTruthy();
  });

  test('handles 100+ words correctly', () => {
    const words3 = Array.from({ length: 50 }, (_, i) => `a${String.fromCharCode(97 + (i % 25))}c`);
    const words4 = Array.from({ length: 50 }, (_, i) => `ab${String.fromCharCode(97 + (i % 25))}d`);
    const { container } = render(<ResultsDisplay words={[...words3, ...words4]} />);
    expect(container.querySelectorAll('section').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('3-Letter Words')).toBeTruthy();
    expect(screen.getByText('4-Letter Words')).toBeTruthy();
  });

  test('single word displays in correct group', () => {
    render(<ResultsDisplay words={['hello']} />);
    expect(screen.getByText('5-Letter Words')).toBeTruthy();
    expect(screen.getByText('hello')).toBeTruthy();
  });

  test('does not render empty state when words exist', () => {
    const { container } = render(<ResultsDisplay words={['abc']} />);
    expect(container.textContent).not.toContain('No words match');
  });
});
