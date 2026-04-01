const CATEGORY_VALUES = ["Bug", "Feature Request", "Improvement", "Other"];
const STATUS_VALUES = ["New", "In Review", "Resolved"];

function sanitizeText(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCreateFeedback(body) {
  const title = sanitizeText(body.title).slice(0, 120);
  const description = sanitizeText(body.description);
  const category = CATEGORY_VALUES.includes(body.category) ? body.category : "Other";
  const submitterName = sanitizeText(body.submitterName || "").slice(0, 80);
  const submitterEmail = sanitizeText(body.submitterEmail || "").slice(0, 120);

  if (!title) {
    return { error: "Title is required" };
  }
  if (!description || description.length < 20) {
    return { error: "Description must be at least 20 characters" };
  }
  if (submitterEmail && !isValidEmail(submitterEmail)) {
    return { error: "Email format is invalid" };
  }

  return {
    value: {
      title,
      description,
      category,
      submitterName: submitterName || undefined,
      submitterEmail: submitterEmail || undefined
    }
  };
}

function validateStatusUpdate(body) {
  const status = sanitizeText(body.status);
  if (!STATUS_VALUES.includes(status)) {
    return { error: "Status must be New, In Review, or Resolved" };
  }
  return { value: { status } };
}

module.exports = {
  CATEGORY_VALUES,
  STATUS_VALUES,
  validateCreateFeedback,
  validateStatusUpdate
};

