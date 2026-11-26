# ResumeIQ AI — Backend

Node.js + Express + MongoDB REST API for ResumeIQ AI.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Configure `MONGODB_URI`, `JWT_SECRET`, `PORT=8001`, and `FRONTEND_URL=http://localhost:5173`.
3. Start server:
   ```bash
   npm start
   ```
   API runs at `http://localhost:8001/api` (`GET /api/health`).
4. Run tests:
   ```bash
   npm test
   ```
5. Bootstrap an admin account:
   ```bash
   npm run bootstrap-admin
   ```
