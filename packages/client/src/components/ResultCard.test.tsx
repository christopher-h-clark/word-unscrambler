import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { ResultCard } from './ResultCard';

describe('ResultCard', () => {
  test('displays section header with correct length', () => {
    render(<ResultCard length={3} words={['abc']} />);
    expect(screen.getByText('3-Letter Words')).toBeTruthy();
  });

  test('displays section header for 7-letter words', () => {
    render(<ResultCard length={7} words={['example']} />);
    expect(screen.getByText('7-Letter Words')).toBeTruthy();
  });

  test('displays words space-separated inline', () => {
    render(<ResultCard length={3} words={['abc', 'bac', 'cab']} />);
    expect(screen.getByText('abc bac cab')).toBeTruthy();
  });

  test('displays single word without spacing issues', () => {
    render(<ResultCard length={4} words={['test']} />);
    expect(screen.getByText('test')).toBeTruthy();
  });

  test('renders as a section element', () => {
    const { container } = render(<ResultCard length={3} words={['abc']} />);
    expect(container.querySelector('section')).toBeTruthy();
  });

  test('has left border accent class applied', () => {
    const { container } = render(<ResultCard length={3} words={['abc']} />);
    const section = container.querySelector('section');
    expect(section?.className).toContain('border-l-[3px]');
    expect(section?.className).toContain('border-blue-500');
  });

  test('has dark background class applied', () => {
    const { container } = render(<ResultCard length={3} words={['abc']} />);
    const section = container.querySelector('section');
    expect(section?.className).toContain('bg-gray-700');
  });

  test('header uses h3 element', () => {
    render(<ResultCard length={4} words={['test']} />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe('4-Letter Words');
  });

  test('displays many words with all present', () => {
    const words = Array.from({ length: 20 }, (_, i) => `w${String(i).padStart(2, '0')}`);
    render(<ResultCard length={3} words={words} />);
    expect(screen.getByText(words.join(' '))).toBeTruthy();
  });
});
