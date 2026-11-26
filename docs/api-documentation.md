# ResumeIQ AI — API Documentation

Base URL: `http://localhost:8001/api`

All protected routes require `Authorization: Bearer <token>`.

## Health
- `GET /health` — Returns API status and MongoDB connection state.

## Authentication (`/api/auth`)
- `POST /auth/register` — Register user (`fullName`, `email`, `password`, `confirmPassword`, `acceptedTerms`)
- `POST /auth/login` — Authenticate user (`email`, `password`)
- `POST /auth/logout` — Increment `tokenVersion` to invalidate current JWT (protected)
- `GET /auth/me` — Get current user profile (protected)
- `POST /auth/forgot-password` — Generate password reset token (dev display; email not configured)
- `POST /auth/reset-password` — Reset password using token (`token`, `password`, `confirmPassword`)

## Users (`/api/users`)
- `GET /users/dashboard-overview` — KPIs, ATS trend, skill distribution, recent analyses
- `GET /users/notifications` — User notifications
- `PUT /users/profile` — Update `fullName`, `targetRole`
- `PUT /users/preferences` — Update user preferences
- `PUT /users/change-password` — Change password (`currentPassword`, `newPassword`)
- `DELETE /users/account` — Permanently delete account and associated data

## Resumes (`/api/resumes`)
- `POST /resumes/upload` — Multipart form-data (`resume` PDF/DOCX, max 5 MB)
- `GET /resumes` — List user's uploaded resumes
- `GET /resumes/:id` — Get single resume
- `DELETE /resumes/:id` — Delete resume and related records

## Analysis & Improver (`/api/analysis`)
- `POST /analysis/run/:resumeId` — Run NLP + ATS analysis for a resume
- `GET /analysis` — List user's analyses
- `GET /analysis/:id` — Get single analysis
- `DELETE /analysis/:id` — Delete analysis
- `POST /analysis/improver/generate/:analysisId` — Generate side-by-side improvement suggestions
- `PATCH /analysis/improver/:analysisId/decision` — Accept or reject suggestion (`accept` | `reject`)

## ATS, Jobs, Reports & Career Tools
- `GET /ats/:analysisId` — Get ATS score breakdown
- `POST /jobs/match` — Match resume against job description (`resumeId`, `jobTitle`, `jobDescription`)
- `GET /jobs` — List job matches
- `POST /skills/skill-gap` — Compute skill gap (`analysisId`, `targetRole`)
- `POST /careers/recommendations` — Get role recommendations (`analysisId`)
- `POST /interview/generate` — Generate role-specific interview questions (`analysisId`, `targetRole`)
- `GET /interview/sessions` — List interview sessions
- `POST /interview/sessions/:id/answer` — Submit mock answer & get feedback
- `GET /builder/draft` / `PUT /builder/draft` — Load/save resume builder draft
- `POST /builder/export-pdf` — Export built resume as PDF
- `GET /reports/:analysisId/download` — Download analysis PDF report
- `POST /contact` — Submit contact message (saved to MongoDB)

## Admin (`/api/admin`, requires `role: admin`)
- `GET /admin/overview` — Platform KPIs
- `GET /admin/users` — List all users
- `PUT /admin/users/:id` — Update user role or status (`active` | `suspended`)
- `GET /admin/usage` — Feature usage counts
- `GET /admin/analyses` — Privacy-safe analysis monitoring
- `GET /admin/analytics` — Aggregated analytics & top skills
