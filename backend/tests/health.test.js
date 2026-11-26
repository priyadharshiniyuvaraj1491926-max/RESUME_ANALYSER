import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Health & Telemetry API Tests', () => {
  it('GET /api/health returns 200 with service status and telemetry', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('ResumeIQ AI Backend');
    expect(typeof res.body.databaseConnected).toBe('boolean');
    expect(typeof res.body.llmConfigured).toBe('boolean');
    expect(res.body.telemetry).toBeDefined();
    expect(typeof res.body.telemetry.uptimeSeconds).toBe('number');
    expect(typeof res.body.telemetry.memoryMb.heapUsed).toBe('number');
    expect(res.body.telemetry.nodeVersion).toBe(process.version);
  });

  it('sets X-Request-Id header on all API responses', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.headers['x-request-id'].length).toBeGreaterThan(10);
  });

  it('forwards incoming client X-Request-Id header', async () => {
    const customId = 'client-trace-id-12345';
    const res = await request(app).get('/api/health').set('X-Request-Id', customId);
    expect(res.headers['x-request-id']).toBe(customId);
  });
});
