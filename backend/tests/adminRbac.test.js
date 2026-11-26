import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

let mongoServer;
let userToken;
let adminToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});

  const standardUser = await User.create({
    fullName: 'Standard User',
    email: 'user@example.com',
    password: 'Password123!',
    role: 'user',
    status: 'active',
    acceptedTerms: true,
  });

  const adminUser = await User.create({
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'AdminPassword123!',
    role: 'admin',
    status: 'active',
    acceptedTerms: true,
  });

  userToken = signToken(standardUser);
  adminToken = signToken(adminUser);
});

describe('Admin RBAC Negative & Positive Authorization Tests', () => {
  it('blocks unauthenticated requests to /api/admin/overview with 401', async () => {
    const res = await request(app).get('/api/admin/overview');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Authentication required/i);
  });

  it('rejects standard users from accessing /api/admin/overview with 403', async () => {
    const res = await request(app)
      .get('/api/admin/overview')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/insufficient permissions/i);
  });

  it('rejects standard users from accessing /api/admin/users with 403', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/insufficient permissions/i);
  });

  it('rejects standard users from accessing /api/admin/analytics with 403', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('allows verified admin users to access /api/admin/overview with 200', async () => {
    const res = await request(app)
      .get('/api/admin/overview')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.registeredUsers).toBe(2);
  });

  it('allows verified admin users to access /api/admin/users with 200', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.users).toBeDefined();
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBe(2);
  });
});
