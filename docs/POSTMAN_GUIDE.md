# Postman Guide

This guide helps test all FeedPulse gateway endpoints quickly.

## Import strategy
- Option 1: manually create a Postman collection named `FeedPulse`.
- Option 2: create requests from this guide and save them to folders.

## Base variables
Create Postman environment values:
- `baseUrl` = `http://localhost:4000`
- `token` = (empty initially)
- `feedbackId` = (set after creating feedback)

## 1) Login (save token)
- Method: `POST`
- URL: `{{baseUrl}}/api/auth/login`
- Body (JSON):
```json
{
  "email": "admin@feedpulse.dev",
  "password": "admin123"
}
```

In Tests tab, save token:
```javascript
pm.environment.set("token", pm.response.json().data.token);
```

## 2) Create feedback (public)
- Method: `POST`
- URL: `{{baseUrl}}/api/feedback`
- Body (JSON):
```json
{
  "title": "Export feature needed",
  "description": "Please add CSV export in analytics because manual extraction is too slow.",
  "category": "Feature Request",
  "submitterName": "QA User",
  "submitterEmail": "qa@example.com"
}
```

Save id in Tests tab:
```javascript
pm.environment.set("feedbackId", pm.response.json().data._id);
```

## 3) List feedback (admin)
- Method: `GET`
- URL: `{{baseUrl}}/api/feedback?page=1&limit=10&sortBy=date&sortOrder=desc`
- Header: `Authorization: Bearer {{token}}`

## 4) Get one feedback (admin)
- Method: `GET`
- URL: `{{baseUrl}}/api/feedback/{{feedbackId}}`
- Header: `Authorization: Bearer {{token}}`

## 5) Update status (admin)
- Method: `PATCH`
- URL: `{{baseUrl}}/api/feedback/{{feedbackId}}`
- Header: `Authorization: Bearer {{token}}`
- Body:
```json
{
  "status": "In Review"
}
```

## 6) Summary endpoint (admin)
- Method: `GET`
- URL: `{{baseUrl}}/api/feedback/summary`
- Header: `Authorization: Bearer {{token}}`

## 7) Manual reanalysis (admin)
- Method: `POST`
- URL: `{{baseUrl}}/api/feedback/{{feedbackId}}/reanalyze`
- Header: `Authorization: Bearer {{token}}`

## 8) Delete feedback (admin)
- Method: `DELETE`
- URL: `{{baseUrl}}/api/feedback/{{feedbackId}}`
- Header: `Authorization: Bearer {{token}}`

## Troubleshooting
- `401 Unauthorized`: missing or expired token.
- `429 Too Many Requests`: rate limit hit for public submission endpoint.
- `500` from AI path: verify `GEMINI_API_KEY` and AI service logs.

