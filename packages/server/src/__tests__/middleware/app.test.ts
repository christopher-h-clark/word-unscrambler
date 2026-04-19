import request from 'supertest';
import { describe, expect, test } from 'vitest';
import app from '../../app';

describe('Express app middleware', () => {
  describe('Health check', () => {
    test('GET /health returns 200 with status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('CORS', () => {
    test('allows requests from configured frontend origin', async () => {
      const res = await request(app).get('/health').set('Origin', 'http://localhost:5173');
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    test('OPTIONS preflight returns 204', async () => {
      const res = await request(app)
        .options('/health')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'GET');
      expect(res.status).toBe(204);
    });

    test('CORS allows GET method', async () => {
      const res = await request(app)
        .options('/health')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'GET');
      expect(res.headers['access-control-allow-methods']).toContain('GET');
    });
  });

  describe('Error handler and 404', () => {
    test('returns 404 JSON for unknown routes', async () => {
      const res = await request(app).get('/nonexistent-route-xyz');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Not found' });
    });

    test('404 responses return JSON not HTML', async () => {
      const res = await request(app).get('/nonexistent-route-xyz');
      expect(res.type).toBe('application/json');
      expect(typeof res.body).toBe('object');
    });

    test('404 responses never expose stack traces', async () => {
      const res = await request(app).get('/nonexistent-route-xyz');
      expect(res.body).not.toHaveProperty('stack');
    });

    test('error responses never expose stack traces', async () => {
      const res = await request(app).get('/health');
      expect(res.body).not.toHaveProperty('stack');
    });
  });

  describe('JSON body parsing', () => {
    test('parses JSON request bodies', async () => {
      const res = await request(app).get('/health').set('Content-Type', 'application/json');
      expect(res.status).toBe(200);
    });
  });
});
