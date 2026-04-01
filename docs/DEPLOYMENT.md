# Deployment Guide

This document covers Docker Compose deployment and production-oriented considerations.

## Local container deployment

### Prerequisites
- Docker Engine + Docker Compose plugin
- `.env` file present at repository root

### Start stack
```bash
docker compose up --build -d
docker compose ps
```

### Services exposed
- Frontend: `http://localhost:3030`
- Gateway: `http://localhost:4000`
- Auth Service: `http://localhost:4001`
- Feedback Service: `http://localhost:4002`
- AI Service: `http://localhost:4003`
- MongoDB: `localhost:27017`

If `MONGO_URI_DOCKER` is set to MongoDB Atlas in `.env`, `feedback-service` connects to Atlas and the local `mongo` container is not required for data persistence.

### Stop stack
```bash
docker compose down
```

### Remove volumes (danger: deletes DB data)
```bash
docker compose down -v
```

## Environment and secret recommendations
- Keep `JWT_SECRET` strong and unique per environment.
- Inject `GEMINI_API_KEY` through secret management, not committed files.
- Use different admin credentials for non-local environments.

## Production notes
- Run frontend with `next start` and a built output (`next build`) for production.
- Terminate TLS at load balancer/ingress.
- Add service health probes and restart policies.
- Add centralized logging and request tracing.
- Restrict direct access to internal services; expose only gateway externally.

## Deployment validation checklist
- Login works and token validates through gateway.
- Public feedback submission persists to MongoDB.
- AI analysis populates enrichment fields.
- Dashboard listing, filters, status updates, and summary endpoints work.

Run the automated smoke test:

```bash
python3 scripts/smoke_test.py
```

