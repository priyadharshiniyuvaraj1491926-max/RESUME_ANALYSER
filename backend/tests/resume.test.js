import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import PDFDocument from 'pdfkit';
import app from '../app.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';

let mongoServer;
let authToken;

function createSamplePdfBuffer(text) {
  const safeText = text.replace(/[()\\]/g, '\\$&').replace(/\n/g, ' ');
  const stream = `BT\n/F1 12 Tf\n72 720 Td\n(${safeText}) Tj\nET\n`;
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += obj;
  }
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Promise.resolve(Buffer.from(pdf, 'utf8'));
}

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
  await Resume.deleteMany({});
  const res = await request(app).post('/api/auth/register').send({
    fullName: 'Resume Tester',
    email: 'tester@example.com',
    password: 'Password123',
    confirmPassword: 'Password123',
    acceptedTerms: true,
  });
  authToken = res.body.token;
});

describe('Resume Upload & Management Tests', () => {
  it('uploads and parses a valid PDF resume', async () => {
    const pdfBuf = await createSamplePdfBuffer(
      'John Doe\njohn@example.com\nSummary\nFull Stack Developer skilled in React, Node.js, MongoDB, and Docker.\nExperience\nBuilt REST APIs and improved performance by 30%.'
    );

    const res = await request(app)
      .post('/api/resumes/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('resume', pdfBuf, { filename: 'sample-resume.pdf', contentType: 'application/pdf' });

    expect(res.status, JSON.stringify(res.body)).toBe(201);
    expect(res.body.resume).toBeTruthy();
    expect(res.body.resume.originalName).toBe('sample-resume.pdf');
    expect(res.body.resume.wordCount).toBeGreaterThan(5);
  });

  it('rejects unsupported file formats', async () => {
    const res = await request(app)
      .post('/api/resumes/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('resume', Buffer.from('plain text resume'), { filename: 'resume.txt', contentType: 'text/plain' });

    expect(res.status).toBe(400);
  });

  it('lists and deletes uploaded resumes', async () => {
    const pdfBuf = await createSamplePdfBuffer('Jane Doe\njane@example.com\nSkills\nPython, SQL, React');
    const upload = await request(app)
      .post('/api/resumes/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('resume', pdfBuf, { filename: 'my-cv.pdf', contentType: 'application/pdf' });

    const resumeId = upload.body.resume._id;

    const listRes = await request(app)
      .get('/api/resumes')
      .set('Authorization', `Bearer ${authToken}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.resumes.length).toBe(1);

    const delRes = await request(app)
      .delete(`/api/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(delRes.status).toBe(200);
  });
});
