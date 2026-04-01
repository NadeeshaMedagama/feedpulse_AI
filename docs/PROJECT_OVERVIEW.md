# FeedPulse Project Overview

FeedPulse is an AI-powered product feedback platform for collecting user feedback and helping product teams prioritize work using automated Gemini analysis.

## Goals
- Capture structured feedback from users with a public form.
- Analyze feedback with AI for category, sentiment, priority, summary, and tags.
- Provide a protected admin dashboard for triage and workflow management.
- Keep architecture modular and maintainable using microservices and SOLID principles.

## High-level architecture

```text
Frontend (Next.js)
    |
    v
Gateway Service (Express, JWT auth, rate limiting)
    |---------------------> Auth Service (admin login + JWT issue)
    |---------------------> Feedback Service (MongoDB CRUD, filters, stats)
    |---------------------> AI Service (Gemini analysis)
                                |
                                v
                       Google Gemini API
```

## Services and responsibilities
- `frontend`: public submission form and admin dashboard UI.
- `services/gateway`: single API entry point (`/api/*`), route protection, and request proxying.
- `services/auth-service`: validates admin credentials and returns JWT.
- `services/feedback-service`: owns feedback data model and persistence logic.
- `services/ai-service`: owns Gemini request/response parsing and normalization.

## SOLID usage snapshot
- Single Responsibility: routes/controllers/services split in backend services.
- Open/Closed: query/sort behavior is extensible through service logic.
- Liskov Substitution: handlers consume consistent service-level contracts.
- Interface Segregation: each service exposes only relevant endpoints.
- Dependency Inversion: controllers depend on service methods, not DB internals.

## Core capabilities implemented
- Public feedback submission with validation and optional identity fields.
- AI enrichment on create with graceful fallback if AI fails.
- Admin login and JWT-protected data operations.
- Dashboard filtering by category/status, search, sort, and pagination.
- Status transitions (`New`, `In Review`, `Resolved`), weekly summary, and re-analysis.
- Standardized API response envelope: `{ success, data, error, message }`.

## Documentation map
- `docs/QUICK_START.md`
- `docs/SETUP_GUIDE.md`
- `docs/BACKEND_CONNECTION_GUIDE.md`
- `docs/API_REFERENCE.md`
- `docs/POSTMAN_GUIDE.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/DEPLOYMENT.md`
- `docs/MINIKUBE_TESTING_GUIDE.md`
- `docs/MIGRATION_SUMMARY.md`

