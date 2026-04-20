import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import app from '../../app';
import { DictionaryService } from '../../services/dictionary';
import path from 'path';

const WORDS_FILE = path.resolve(__dirname, '../../../data/words.txt');

beforeEach(() => {
  DictionaryService.reset();
  DictionaryService.initialize(WORDS_FILE);
});

describe('API Performance', () => {
  test('typical query (abc) completes in < 1 second', async () => {
    const start = Date.now();
    const res = await request(app).get('/unscrambler/v1/words?letters=abc');
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(1000);
  });

  test('no results query (xyz) completes in < 1 second', async () => {
    const start = Date.now();
    const res = await request(app).get('/unscrambler/v1/words?letters=xyz');
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(1000);
  });

  test('wildcard query completes in < 1 second', async () => {
    const start = Date.now();
    const res = await request(app).get('/unscrambler/v1/words?letters=h?llo');
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(1000);
  });

  test('max length query (abcdefghij) completes in < 1 second', async () => {
    const start = Date.now();
    const res = await request(app).get('/unscrambler/v1/words?letters=abcdefghij');
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(1000);
  });

  test('complex wildcard query (?????????) completes in < 10 seconds', async () => {
    const start = Date.now();
    const res = await request(app).get('/unscrambler/v1/words?letters=?????????');
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(10000);
  });

  test('P99 response time is < 5 seconds (100 queries)', async () => {
    const times: number[] = [];

    // Run 100 queries and collect response times
    for (let i = 0; i < 100; i++) {
      const start = Date.now();
      const res = await request(app).get('/unscrambler/v1/words?letters=abc');
      const elapsed = Date.now() - start;
      times.push(elapsed);

      expect(res.status).toBe(200);
    }

    // Calculate P99 (99th percentile)
    times.sort((a, b) => a - b);
    const p99Index = Math.ceil(times.length * 0.99) - 1;
    const p99 = times[p99Index];

    expect(p99).toBeLessThan(5000);

    // Log statistics for documentation
    console.log(`
      Performance Statistics (100 queries):
      - Min: ${times[0]}ms
      - P50 (median): ${times[Math.floor(times.length / 2)]}ms
      - P95: ${times[Math.ceil(times.length * 0.95) - 1]}ms
      - P99: ${p99}ms
      - Max: ${times[times.length - 1]}ms
    `);
  });
});
