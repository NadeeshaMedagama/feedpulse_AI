# Quick Start

Use this guide if you want to run FeedPulse quickly with minimum setup.

## Prerequisites
- Node.js 20+
- npm 10+
- MongoDB Atlas connection URI
- Gemini API key (`GEMINI_API_KEY`)

## 1) Install dependencies
```bash
npm install
```

## 2) Configure environment
```bash
cp .env.example .env
```

Update values in `.env` (especially `GEMINI_API_KEY`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).

## 3) Start locally (Option A: frontend + backend locally)
```bash
docker compose down
npm run dev
```

## 4) Open application
- Frontend: `http://localhost:3030`
- API Gateway: `http://localhost:4000`

## 5) Admin login
- Dashboard URL: `http://localhost:3030/dashboard`
- Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

## Optional: run with Docker Compose
```bash
docker compose up --build -d
```

## Option B: backend in Docker, frontend locally only
```bash
docker compose up -d
npm run dev --workspace frontend
```

Do not run root `npm run dev` in this mode.

## Validate setup quickly
- Submit feedback from `/`.
- Login to dashboard.
- Confirm sentiment badge, priority, and summary appear on feedback rows.

