# Setup Guide

This guide explains complete local setup for all services.

## Tech stack
- Frontend: Next.js 16 (App Router)
- Backend: Node.js + Express (microservices)
- Database: MongoDB + Mongoose
- AI: Google Gemini (`gemini-2.5-flash`)

## Directory layout
```text
frontend/
services/gateway/
services/auth-service/
services/feedback-service/
services/ai-service/
docs/
```

## Environment variables (Atlas as main DB)
Create `.env` at repository root:

```env
JWT_SECRET=change-this-secret
GEMINI_API_KEY=your-gemini-key
ADMIN_EMAIL=admin@feedpulse.dev
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_API_URL=http://localhost:4000
AUTH_SERVICE_URL=http://localhost:4001
FEEDBACK_SERVICE_URL=http://localhost:4002
AI_SERVICE_URL=http://localhost:4003
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/feedpulse?retryWrites=true&w=majority
MONGO_URI_DOCKER=mongodb+srv://<username>:<password>@<cluster-url>/feedpulse?retryWrites=true&w=majority
```

Optional local fallback (only if you intentionally use local MongoDB):

```env
MONGO_URI=mongodb://localhost:27017/feedpulse
MONGO_URI_DOCKER=mongodb://mongo:27017/feedpulse
```

## Install all workspace dependencies
```bash
npm install
```

## Option A: run everything locally (frontend + backend)
```bash
docker compose down
npm run dev
```

Backend services auto-load root `.env` in workspace scripts.

Open:
- Frontend: `http://localhost:3030`
- Admin page: `http://localhost:3030/dashboard`

Admin login:
- Email: `admin@feedpulse.dev`
- Password: `admin123`

## Option B: keep backend in Docker, run frontend locally only
Do not run root `npm run dev` in this mode.

```bash
docker compose up -d
npm run dev --workspace frontend
```

Backend remains in Docker (`4000-4003`), frontend runs locally on `3030`.

## Individual service run commands
```bash
npm run dev --workspace services/auth-service
npm run dev --workspace services/ai-service
npm run dev --workspace services/feedback-service
npm run dev --workspace services/gateway
npm run dev --workspace frontend
```

## Test suites
```bash
npm test
```

## Frontend production build
```bash
npm run build
```

## Common issues
- `Missing GEMINI_API_KEY`: ensure `.env` has a valid key and services restarted.
- MongoDB connection errors: verify `MONGO_URI` and MongoDB availability.
- Unauthorized dashboard requests: ensure valid login token is used via gateway.

