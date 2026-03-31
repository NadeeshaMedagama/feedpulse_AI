# Database Schema

FeedPulse uses MongoDB with Mongoose models in the Feedback Service.

## Collection: `feedbacks`

```js
Feedback {
  title: String (required, max 120)
  description: String (required, min 20)
  category: Enum("Bug", "Feature Request", "Improvement", "Other")
  status: Enum("New", "In Review", "Resolved") default "New"
  submitterName: String (optional)
  submitterEmail: String (optional)

  ai_category: String
  ai_sentiment: Enum("Positive", "Neutral", "Negative")
  ai_priority: Number (1..10)
  ai_summary: String
  ai_tags: [String]
  ai_processed: Boolean default false

  createdAt: Date
  updatedAt: Date
}
```

## Indexes
Defined in `services/feedback-service/src/models/Feedback.js`:
- `{ status: 1 }`
- `{ category: 1 }`
- `{ ai_priority: -1 }`
- `{ createdAt: -1 }`
- text index on `title` + `ai_summary`

## Notes on data behavior
- Feedback can exist without AI fields if AI call fails.
- `ai_processed` indicates whether enrichment completed.
- Status changes are tracked via `updatedAt` timestamp.

## Validation highlights
- Title is required and trimmed.
- Description requires minimum length of 20.
- Email is optional but format-validated when present.
- Category and status are restricted to explicit enum values.

