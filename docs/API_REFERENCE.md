# API Reference

Base URL (via gateway): `http://localhost:4000`

## Response format
All endpoints return:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "message": "OK"
}
```

## Auth
### POST `/api/auth/login`
Authenticate admin and return JWT.

Request:
```json
{
  "email": "admin@feedpulse.dev",
  "password": "admin123"
}
```

Success: `200`

## Feedback
### POST `/api/feedback`
Create new feedback (public).

Request:
```json
{
  "title": "Need dark mode",
  "description": "Please add dark mode for dashboard accessibility and comfort.",
  "category": "Feature Request",
  "submitterName": "Jane",
  "submitterEmail": "jane@example.com"
}
```

Success: `201`
Validation errors: `400`
Rate-limited: `429`

### GET `/api/feedback`
List feedback (admin token required).

Query params:
- `category`: `Bug | Feature Request | Improvement | Other`
- `status`: `New | In Review | Resolved`
- `search`: keyword against title + ai summary
- `sortBy`: `date | priority | sentiment`
- `sortOrder`: `asc | desc`
- `page`: number (default 1)
- `limit`: number (default 10)

Success: `200`

### GET `/api/feedback/:id`
Get one feedback item (admin token required).

Success: `200`
Not found: `404`

### PATCH `/api/feedback/:id`
Update workflow status (admin token required).

Request:
```json
{
  "status": "In Review"
}
```

Success: `200`
Validation errors: `400`

### DELETE `/api/feedback/:id`
Delete feedback (admin token required).

Success: `200`
Not found: `404`

### GET `/api/feedback/summary`
Weekly top-theme summary (admin token required).

Success: `200`

### POST `/api/feedback/:id/reanalyze`
Manually trigger AI analysis for a feedback item (admin token required).

Success: `200`
Not found: `404`

## HTTP status codes used
- `200` OK
- `201` Created
- `400` Validation failure
- `401` Unauthorized
- `404` Not found
- `429` Too many requests
- `500` Internal server error

