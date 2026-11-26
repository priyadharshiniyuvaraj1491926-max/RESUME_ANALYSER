# ResumeIQ AI

**Analyze. Improve. Get Hired.**

ResumeIQ AI is a full-stack AI-powered Resume Analysis & Career Intelligence SaaS platform built with **React, Vite, Node.js, Express, and MongoDB**.

## Key Features
- **Resume Upload & Parsing**: PDF & DOCX extraction with file validation (`pdf-parse`, `mammoth`).
- **ATS Score Estimate**: 7-category 100-point rubric (Formatting, Keywords, Skills, Experience, Education, Structure, Readability).
- **Skill Gap & Career Guidance**: Role benchmarks, missing skill detection, and curated learning paths.
- **Job Description Matcher**: Match percentage, keyword coverage, and tailoring tips.
- **Resume Improver**: Side-by-side rewrite suggestions with a strict zero-fabrication policy.
- **Interview Prep**: Role-specific questions and mock answer feedback.
- **Resume Builder & PDF Export**: 3 templates with live preview and `pdfkit` PDF export.
- **Admin Dashboard**: User management, usage metrics, privacy-safe analysis monitoring, and platform analytics.

## Repository Structure
```
RESUME_ANALYSER/
├── frontend/     # React + Vite application (port 5173)
├── backend/      # Express + MongoDB REST API (port 8001)
└── docs/         # Architecture, API documentation, and feature checklist
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173` in your browser.

## Documentation
- [System Architecture](docs/architecture.md)
- [API Documentation](docs/api-documentation.md)
- [Feature Checklist](docs/feature-checklist.md)
