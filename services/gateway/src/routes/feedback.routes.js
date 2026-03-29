const express = require("express");
const rateLimit = require("express-rate-limit");
const { config } = require("../config");
const { requestJson } = require("../services/httpClient");
const { sendError, sendSuccess } = require("../utils/apiResponse");
const { requireAdminAuth } = require("../middleware/auth");

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, error: "RATE_LIMIT", message: "Too many submissions from this IP" }
});

function pickQuery(query) {
  const allowed = ["category", "status", "search", "sortBy", "sortOrder", "page", "limit"];
  const params = new URLSearchParams();
  for (const key of allowed) {
    if (query[key] !== undefined) {
      params.set(key, String(query[key]));
    }
  }
  return params.toString();
}

router.post("/", submitLimiter, async (req, res) => {
  try {
    const result = await requestJson(`${config.feedbackServiceUrl}/feedback`, {
      method: "POST",
      body: JSON.stringify(req.body || {})
    });

    if (!result.ok) {
      return sendError(res, result.body?.message || "Failed to submit feedback", result.body?.error || null, result.status);
    }

    return sendSuccess(res, result.body?.data || null, result.body?.message || "Feedback submitted", 201);
  } catch (error) {
    return sendError(res, "Failed to submit feedback", error.message, 500);
  }
});

router.get("/summary", requireAdminAuth, async (req, res) => {
  try {
    const result = await requestJson(`${config.feedbackServiceUrl}/feedback/summary`);
    if (!result.ok) {
      return sendError(res, result.body?.message || "Failed to load summary", result.body?.error || null, result.status);
    }
    return sendSuccess(res, result.body?.data || null, "Summary loaded", 200);
  } catch (error) {
    return sendError(res, "Failed to load summary", error.message, 500);
  }
});

router.post("/:id/reanalyze", requireAdminAuth, async (req, res) => {
  try {
    const result = await requestJson(`${config.feedbackServiceUrl}/feedback/${req.params.id}/reanalyze`, {
      method: "POST"
    });
    if (!result.ok) {
      return sendError(res, result.body?.message || "Reanalysis failed", result.body?.error || null, result.status);
    }
    return sendSuccess(res, result.body?.data || null, "Reanalysis completed", 200);
  } catch (error) {
    return sendError(res, "Reanalysis failed", error.message, 500);
  }
});

router.get("/", requireAdminAuth, async (req, res) => {
  try {
    const query = pickQuery(req.query);
    const result = await requestJson(`${config.feedbackServiceUrl}/feedback?${query}`);
    if (!result.ok) {
      return sendError(res, result.body?.message || "Failed to load feedback", result.body?.error || null, result.status);
    }
    return sendSuccess(res, result.body?.data || null, "Feedback loaded", 200);
  } catch (error) {
    return sendError(res, "Failed to load feedback", error.message, 500);
  }
});

router.get("/:id", requireAdminAuth, async (req, res) => {
  try {
    const result = await requestJson(`${config.feedbackServiceUrl}/feedback/${req.params.id}`);
    if (!result.ok) {
      return sendError(res, result.body?.message || "Not found", result.body?.error || null, result.status);
    }
    return sendSuccess(res, result.body?.data || null, "Feedback loaded", 200);
  } catch (error) {
    return sendError(res, "Failed to load feedback", error.message, 500);
  }
});

router.patch("/:id", requireAdminAuth, async (req, res) => {
  try {
    const result = await requestJson(`${config.feedbackServiceUrl}/feedback/${req.params.id}`, {
      method: "PATCH",
      body: JSON.stringify(req.body || {})
    });
    if (!result.ok) {
      return sendError(res, result.body?.message || "Update failed", result.body?.error || null, result.status);
    }
    return sendSuccess(res, result.body?.data || null, "Feedback updated", 200);
  } catch (error) {
    return sendError(res, "Update failed", error.message, 500);
  }
});

router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const result = await requestJson(`${config.feedbackServiceUrl}/feedback/${req.params.id}`, {
      method: "DELETE"
    });
    if (!result.ok) {
      return sendError(res, result.body?.message || "Delete failed", result.body?.error || null, result.status);
    }
    return sendSuccess(res, result.body?.data || null, "Feedback deleted", 200);
  } catch (error) {
    return sendError(res, "Delete failed", error.message, 500);
  }
});

module.exports = router;

