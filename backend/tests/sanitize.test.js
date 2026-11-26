import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { sanitizeInput, sanitizeString, sanitizeObject } from '../middleware/sanitize.js';

describe('Input Sanitization Middleware & Helper Tests', () => {
  it('strips script tags and raw HTML markup from strings', () => {
    const malicious = '<script>alert("XSS")</script>Hello <b>world</b>';
    const clean = sanitizeString(malicious);
    expect(clean).toBe('Hello world');
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('<b>');
  });

  it('preserves clean text, numbers, and standard characters', () => {
    const safe = 'Senior Full-Stack Engineer with 5+ years of React & Node.js experience.';
    expect(sanitizeString(safe)).toBe(safe);
  });

  it('recursively sanitizes nested objects and arrays', () => {
    const input = {
      name: 'John <script>hack()</script>Doe',
      skills: ['React <img src=x onerror=alert(1)>', 'Node.js', { note: '<b>clean me</b>' }],
      age: 28,
    };
    const cleaned = sanitizeObject(input);
    expect(cleaned.name).toBe('John Doe');
    expect(cleaned.skills[0]).toBe('React');
    expect(cleaned.skills[1]).toBe('Node.js');
    expect(cleaned.skills[2].note).toBe('clean me');
    expect(cleaned.age).toBe(28);
  });

  it('sanitizes body payloads on incoming HTTP requests', async () => {
    const testApp = express();
    testApp.use(express.json());
    testApp.use(sanitizeInput);
    testApp.post('/test', (req, res) => res.json(req.body));

    const res = await request(testApp)
      .post('/test')
      .send({ comment: '<script>steal()</script>Great resume!' });

    expect(res.status).toBe(200);
    expect(res.body.comment).toBe('Great resume!');
  });
});
