# AI Service

Gemini integration service (default model: `gemini-2.5-flash`).

## Endpoint
- `POST /analyze`

Request body:
```json
{
  "title": "string",
  "description": "string"
}
```

Response data shape:
```json
{
  "category": "Feature Request",
  "sentiment": "Positive",
  "priority_score": 8,
  "summary": "...",
  "tags": ["UI", "Settings"]
}
```

