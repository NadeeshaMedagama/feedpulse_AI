# FeedPulse AI - Microservices Product Feedback Platform

FeedPulse is an AI-powered internal product feedback system built for the Software Engineer Intern assignment. Users submit feedback publicly, and Gemini enriches each submission with category, sentiment, priority, summary, and tags for product decision-making.

## Implemented stack
- Frontend: `frontend` (`Next.js 16.2.1`, App Router)
- Gateway: `services/gateway` (single public API, JWT checks, rate limiting)
- Auth Service: `services/auth-service` (hardcoded admin login via env)
- Feedback Service: `services/feedback-service` (MongoDB CRUD, filters, stats, summary)
- AI Service: `services/ai-service` (Gemini integration + payload normalization)
- Database: MongoDB Atlas (main), local MongoDB optional fallback

## MongoDB Atlas configuration

1) Create Atlas cluster + database user.
2) In Atlas Network Access, allow your client IP (or trusted CIDR).
3) Get the connection string and URL-encode password special characters.
4) Put Atlas URI into `.env`.

```bash
cp .env.example .env
```

Use Atlas URI for both local and Docker runs:

```dotenv
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/feedpulse?retryWrites=true&w=majority
MONGO_URI_DOCKER=mongodb+srv://<username>:<password>@<cluster-url>/feedpulse?retryWrites=true&w=majority
```

Notes:
- `services/feedback-service/src/db.js` supports retry-based DB connection (`MONGO_CONNECT_RETRIES`).
- `docker-compose.yml` uses `MONGO_URI_DOCKER` so Compose can target Atlas directly.

## Local run (Option A: frontend + backend locally)

```bash
npm install
cp .env.example .env
docker compose down
npm run dev
```

`npm run dev` auto-loads root `.env` for backend services.

Default URLs:
- Frontend: `http://localhost:3030`
- Gateway API: `http://localhost:4000`
- Auth Service: `http://localhost:4001`
- Feedback Service: `http://localhost:4002`
- AI Service: `http://localhost:4003`

## Backend run mode (local vs Docker)

- Local backend (recommended while developing): use `npm run dev` at project root.
- Docker backend: use `docker compose up --build -d`.
- You can run all backend services in Docker and frontend locally if needed.

### Local all-in-one run (frontend + backend)

```bash
cd /Users/nadeesha_medagama/WebstormProjects/feedpulse-ai
npm install
npm run dev
```

### Docker all-in-one run (frontend + backend)

```bash
cd /Users/nadeesha_medagama/WebstormProjects/feedpulse-ai
docker compose up --build -d
docker compose ps
```

Frontend opens on `http://localhost:3030` in both modes.

### Option B: backend in Docker, frontend locally only

Do not run root `npm run dev` in this mode.

```bash
cd /Users/nadeesha_medagama/WebstormProjects/feedpulse-ai
docker compose up -d
npm run dev --workspace frontend
```

Backend remains in Docker on ports `4000-4003`, frontend runs locally on `3030`.

## Docker Compose run

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
```

To stop:

```bash
docker compose down
```

If Docker stack was already running before frontend port was changed to `3030`, recreate containers:

```bash
docker compose down
docker compose up --build -d
docker compose ps
```

## Admin login and dashboard page

Yes, admin login is on a separate page.

- Admin page URL: `http://localhost:3030/dashboard`
- Email: `admin@feedpulse.dev`
- Password: `admin123`

Login endpoint used by dashboard: `POST /api/auth/login`.

## API endpoints (gateway)
- `POST /api/auth/login`
- `POST /api/feedback`
- `GET /api/feedback`
- `GET /api/feedback/:id`
- `PATCH /api/feedback/:id`
- `DELETE /api/feedback/:id`
- `GET /api/feedback/summary`
- `POST /api/feedback/:id/reanalyze`

Response envelope:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "message": "OK"
}
```

## Verification status

Verified in this workspace:
- `npm test` passes across workspaces (`gateway`, `feedback-service`, `ai-service`).
- `npm run build` passes with `Next.js 16.2.1`.
- `docker compose build frontend gateway auth-service feedback-service ai-service` completed.
- `docker compose up -d` started all services; `docker compose ps` shows healthy backend containers.
- Gateway health verified: `GET /health` -> `200` success.
- Admin login verified: `POST /api/auth/login` -> token returned.

For repeatable end-to-end smoke checks, use:

```bash
python3 scripts/smoke_test.py
```

## Security update

Frontend dependencies were upgraded:
- `next` -> `^16.2.1`
- `react` -> `^19.2.0`
- `react-dom` -> `^19.2.0`

After upgrade, tests and production build pass.

## Requirement-to-file trace matrix

| Req ID | Requirement | Implementation references |
| --- | --- | --- |
| 1.1 | Public submit page, no sign-in | `frontend/app/page.js` |
| 1.2 | Title/Description/Category/Name/Email fields | `frontend/app/page.js`, `services/feedback-service/src/utils/validation.js` |
| 1.3 | Client validation (title + min description length) | `frontend/app/page.js` |
| 1.4 | POST to backend + persist MongoDB | `services/gateway/src/routes/feedback.routes.js`, `services/feedback-service/src/controllers/feedback.controller.js`, `services/feedback-service/src/models/Feedback.js` |
| 1.5 | Success/error states on submit | `frontend/app/page.js` |
| 1.6 | Character counter | `frontend/app/page.js` |
| 1.7 | Rate limit 5/hour/IP | `services/gateway/src/routes/feedback.routes.js` |
| 2.1 | Call Gemini on new feedback | `services/feedback-service/src/services/feedback.service.js`, `services/feedback-service/src/services/aiClient.service.js`, `services/ai-service/src/services/gemini.service.js` |
| 2.2 | Store AI fields on document | `services/feedback-service/src/services/feedback.service.js`, `services/feedback-service/src/models/Feedback.js` |
| 2.3 | Graceful Gemini failure | `services/feedback-service/src/services/feedback.service.js` |
| 2.4 | Sentiment badge in UI | `frontend/app/dashboard/page.js` |
| 2.5 | Weekly/on-demand top themes summary | `services/feedback-service/src/services/feedback.service.js`, `services/feedback-service/src/controllers/feedback.controller.js` |
| 2.6 | Manual re-trigger analysis | `services/gateway/src/routes/feedback.routes.js`, `services/feedback-service/src/routes/feedback.routes.js`, `frontend/app/dashboard/page.js` |
| 3.1 | Protected admin dashboard with hardcoded login | `frontend/app/dashboard/page.js`, `services/auth-service/src/services/auth.service.js`, `services/gateway/src/middleware/auth.js` |
| 3.2 | Admin list/cards includes required fields | `frontend/app/dashboard/page.js` |
| 3.3 | Filter by category | `frontend/app/dashboard/page.js`, `services/feedback-service/src/services/feedback.service.js` |
| 3.4 | Filter by status | `frontend/app/dashboard/page.js`, `services/feedback-service/src/services/feedback.service.js` |
| 3.5 | Update status workflow | `frontend/app/dashboard/page.js`, `services/feedback-service/src/controllers/feedback.controller.js` |
| 3.6 | Sort by date/priority/sentiment | `frontend/app/dashboard/page.js`, `services/feedback-service/src/services/feedback.service.js` |
| 3.7 | Search title + summary | `frontend/app/dashboard/page.js`, `services/feedback-service/src/services/feedback.service.js` |
| 3.8 | Stats bar | `frontend/app/dashboard/page.js`, `services/feedback-service/src/services/feedback.service.js` |
| 3.9 | Pagination (10 default) | `frontend/app/dashboard/page.js`, `services/feedback-service/src/services/feedback.service.js` |
| 4.0 | Required endpoints implemented | `services/gateway/src/routes/auth.routes.js`, `services/gateway/src/routes/feedback.routes.js` |
| 4.1 | Consistent JSON response format | `services/gateway/src/utils/apiResponse.js`, `services/feedback-service/src/utils/apiResponse.js`, `services/auth-service/src/utils/apiResponse.js`, `services/ai-service/src/utils/apiResponse.js` |
| 4.2 | Mongoose schema + validations | `services/feedback-service/src/models/Feedback.js`, `services/feedback-service/src/utils/validation.js` |
| 4.3 | Admin route protection via JWT | `services/gateway/src/middleware/auth.js`, `services/auth-service/src/services/auth.service.js` |
| 4.4 | Env vars for Mongo/Gemini/JWT | `.env.example`, `services/*/src/config.js` |
| 4.5 | Input sanitization | `services/feedback-service/src/utils/validation.js` |
| 4.6 | Proper HTTP status codes | `services/*/src/controllers/*.js`, `services/gateway/src/routes/*.js` |
| 4.7 | Separation of routes/controllers/models/services | `services/feedback-service/src/routes`, `services/feedback-service/src/controllers`, `services/feedback-service/src/models`, `services/feedback-service/src/services` |
| 5.1 | Feedback schema per spec | `services/feedback-service/src/models/Feedback.js` |
| 5.2 | Indexes on status/category/ai_priority/createdAt | `services/feedback-service/src/models/Feedback.js` |
| 5.3 | Timestamps enabled | `services/feedback-service/src/models/Feedback.js` |
| 5.4 | Separate user collection (optional) | Not implemented (hardcoded assignment auth mode used) |
| 6.1 | Public GitHub repo | Repository publishing step (outside codebase) |
| 6.2 | README with setup/env/screenshots guidance | `README.md` |
| 6.3 | `.gitignore` excludes env/node/build | `.gitignore` |
| 6.4 | Meaningful commit messages | Git workflow step (outside codebase) |
| 6.5 | 5+ commits over timeline | Git workflow step (outside codebase) |
| 6.6 | “What next” section in README | `README.md` |
| 6.7 | Branch workflow | Git workflow step (outside codebase) |
| Bonus 1 | Dockerize complete app | `docker-compose.yml`, `frontend/Dockerfile`, `services/*/Dockerfile` |
| Bonus 2 | Backend unit tests (>=5) | `services/feedback-service/tests/feedback.test.js`, `services/gateway/tests/auth-middleware.test.js`, `services/ai-service/tests/gemini.service.test.js` |

## Testing

```bash
npm test
npm run build
python3 scripts/smoke_test.py
```

## Submission screenshots

Include at least:
1. Public feedback page with success message.
2. Admin dashboard with filters, sentiment badges, stats, and pagination.

## What I would build next
- Queue-based async AI processing (BullMQ + Redis)
- Role-based auth with persistent users + audit logs
- Trend analytics and drill-down dashboards
- E2E tests (Playwright) and CI pipeline

