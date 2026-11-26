# ResumeIQ AI — Feature Checklist

## Core Architecture & Repository
- [x] Single Git repository (`frontend/`, `backend/`, `docs/`)
- [x] Independent `package.json` and `.env.example` for frontend and backend
- [x] `.gitignore` excluding `node_modules`, `.env`, `dist`, logs

## Backend (Node.js + Express + MongoDB)
- [x] 9 Mongoose schemas (`User`, `Resume`, `ResumeAnalysis`, `JobMatch`, `UserSkill`, `InterviewSession`, `Report`, `BuiltResume`, `ContactMessage`)
- [x] JWT authentication with `tokenVersion` logout revocation & `bcryptjs` hashing
- [x] Rate limiting (`apiLimiter` & `authLimiter`), `helmet`, `cors`, `express-validator`
- [x] PDF (`pdf-parse`) and DOCX (`mammoth`) text extraction with signature verification
- [x] 7-category 100-point ATS scoring rubric (explicitly labeled as estimate)
- [x] Skill gap analysis, job description matcher, career recommendations, interview prep
- [x] Side-by-side resume improver with zero-fabrication policy
- [x] PDF report & resume builder PDF export via `pdfkit`
- [x] Optional LLM provider (`OpenAI` / `Gemini`) with automatic rule-based fallback
- [x] Admin routes & CLI admin bootstrap utility

## Frontend (React + Vite)
- [x] Custom CSS design system (`tokens.css`, `global.css`, `components.css`) with Light/Dark mode
- [x] Public pages: Landing, Features, How It Works, About, Contact, FAQ, Pricing
- [x] Auth pages: Sign In, Sign Up (password strength), Forgot Password, Reset Password
- [x] 13 User Dashboard Modules: Overview, Upload, Analysis, ATS Score, Skill Gap, Job Matcher, Resume Improver, Career Advice, Interview Prep, Resume Builder, History, Profile, Settings
- [x] 5 Admin Modules: Overview, Users, Usage, Analyses, Analytics

## Testing & Documentation
- [x] Vitest + Supertest + `mongodb-memory-server` test suite
- [x] Architecture, API, and README documentation
