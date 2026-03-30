# Backend Connection Guide

This guide explains how frontend requests travel across backend services.

## Request flow

1. Frontend calls Gateway (`http://localhost:4000/api/*`).
2. Gateway validates auth/rate limits where needed.
3. Gateway forwards request to target microservice:
   - Auth operations -> Auth Service
   - Feedback operations -> Feedback Service
4. Feedback Service calls AI Service for analysis when required.
5. AI Service calls Gemini API and returns normalized JSON.

## Service endpoints (internal)
- Gateway: `http://localhost:4000`
- Auth Service: `http://localhost:4001`
- Feedback Service: `http://localhost:4002`
- AI Service: `http://localhost:4003`

## Auth token propagation
- Login endpoint returns JWT from Auth Service via Gateway.
- Frontend sends header:
  - `Authorization: Bearer <token>`
- Gateway middleware validates token before forwarding admin routes.

## Rate limiting
- Public `POST /api/feedback` is rate-limited in Gateway:
  - 5 submissions per IP per hour.

## AI failure behavior
- Feedback is saved even if AI analysis fails.
- In this case, `ai_processed` remains `false`.
- Admin can trigger manual re-analysis via reanalyze endpoint.

## Consistent response contract
All Gateway responses use:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "message": "OK"
}
```

