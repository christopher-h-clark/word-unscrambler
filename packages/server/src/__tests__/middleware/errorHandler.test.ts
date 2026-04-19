import type { Request, Response } from 'express';
import express from 'express';
import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { errorHandler } from '../../middleware/errorHandler';

function buildTestApp(throwError: () => unknown): express.Express {
  const testApp = express();
  testApp.get('/error-route', (_req: Request, _res: Response) => {
    throw throwError();
  });
  testApp.use(errorHandler);
  return testApp;
}

describe('errorHandler middleware', () => {
  test('returns 500 with generic message for thrown Error', async () => {
    const app = buildTestApp(() => new Error('internal details'));
    const res = await request(app).get('/error-route');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Server error. Please try again later.' });
  });

  test('does not expose error message in response', async () => {
    const app = buildTestApp(() => new Error('secret file path /etc/passwd'));
    const res = await request(app).get('/error-route');
    expect(res.body.error).not.toContain('/etc/passwd');
    expect(res.body.error).not.toContain('secret');
  });

  test('does not expose stack trace in response', async () => {
    const app = buildTestApp(() => new Error('boom'));
    const res = await request(app).get('/error-route');
    expect(res.body).not.toHaveProperty('stack');
  });

  test('handles non-Error thrown values', async () => {
    const app = buildTestApp(() => 'string error');
    const res = await request(app).get('/error-route');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Server error. Please try again later.' });
  });

  test('catches errors from body-parser middleware (malformed JSON)', async () => {
    const testApp = express();
    testApp.use(express.json());
    testApp.post('/json-route', (_req: Request, res: Response): void => {
      res.status(200).json({ ok: true });
    });
    testApp.use(errorHandler);

    const res = await request(testApp)
      .post('/json-route')
      .set('Content-Type', 'application/json')
      .send('{invalid json}');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Server error. Please try again later.' });
    expect(res.body).not.toHaveProperty('stack');
  });
});
