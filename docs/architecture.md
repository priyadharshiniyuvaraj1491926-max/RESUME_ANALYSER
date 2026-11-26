# ResumeIQ AI — System Architecture

## Overview

ResumeIQ AI is a full-stack SaaS platform built with a **React + Vite** frontend and a **Node.js + Express + MongoDB** backend, organized inside a single monorepo-style Git repository (`frontend/`, `backend/`, `docs/`).

```
┌────────────────────────────────────────────────────────────────┐
│                  Frontend (React 18 + Vite)                    │
│  Public Pages │ Auth Pages │ 13 User Dashboard Modules │ Admin │
└───────────────────────────────┬────────────────────────────────┘
                                │ REST / JSON + JWT Bearer
                                ▼
┌────────────────────────────────────────────────────────────────┐
│               Backend API (Node.js + Express)                  │
│  Helmet · CORS · Rate Limiter · Multer · Express-Validator     │
├───────────────┬───────────────────────────────┬────────────────┤
│ Auth & Users  │ Resume Parser & NLP Engine    │ PDF & Reports  │
│ JWT + bcrypt  │ pdf-parse · mammoth · Rubric  │ pdfkit         │
├───────────────┴───────────────────────────────┴────────────────┤
│            Optional LLM Enhancement (OpenAI / Gemini)          │
│         Gracefully falls back to rule-based NLP engine         │
└───────────────────────────────┬────────────────────────────────┘
                                │ Mongoose ODM
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                   MongoDB (Local or Atlas)                     │
│ Users · Resumes · Analyses · JobMatches · Sessions · Reports   │
└────────────────────────────────────────────────────────────────┘
```

## Security Design
- **Authentication**: Stateless JWT signed with `JWT_SECRET` + `tokenVersion` revocation on logout or password change.
- **Password Hashing**: `bcryptjs` (salt rounds: 10).
- **Rate Limiting**: `express-rate-limit` on `/api` (400 req/15 min) and `/api/auth` (40 req/15 min).
- **File Uploads**: `multer` with 5 MB limit, MIME + extension + magic-byte signature validation.
- **Privacy**: Admin monitoring endpoints exclude raw resume text and personal contact details.
- **Zero Fabrication Policy**: AI/rule-based improver only rephrases existing resume content and never invents experience or skills.
