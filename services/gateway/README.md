# Gateway Service

API gateway that exposes assignment-required endpoints and delegates to internal microservices.

## Public Endpoints
- `POST /api/auth/login`
- `POST /api/feedback`
- `GET /api/feedback`
- `GET /api/feedback/:id`
- `PATCH /api/feedback/:id`
- `DELETE /api/feedback/:id`
- `GET /api/feedback/summary`
- `POST /api/feedback/:id/reanalyze`

## Notes
- Uses JWT middleware for admin routes.
- Adds rate limiting (`5 requests/hour/IP`) for feedback submission.

