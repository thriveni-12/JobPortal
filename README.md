# Job Portal (MERN + Vite) — Colorful UI

A full-stack job portal with:
- JWT Auth (Register/Login)
- 15 seeded jobs + background job fetch from a cloud job feed
- Apply to jobs with resume upload + full details
- React (Vite) frontend with colorful interface
- Tests: backend (Jest + Supertest), frontend (Vitest + RTL), e2e (Playwright)
- Load test (Artillery)

## Quick Start

### 1) Backend
```bash
cd backend
cp .env.example .env   # fill values
npm install
npm run dev            # runs on http://localhost:4000
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:5173
```

Login and visit Jobs page to apply. Resumes are stored locally under `backend/uploads/` by default.

### Cloud Job Fetch
The backend has a cron job that periodically fetches new openings from a feed (`JOB_FEED_URL`), deduplicates by `externalId`, and inserts them into the DB.
Use `.env` to set:
- `JOB_FEED_URL=https://remotive.com/api/remote-jobs?search=software` (example)
- `CRON_SCHEDULE=*/30 * * * *` (every 30 minutes)
```
