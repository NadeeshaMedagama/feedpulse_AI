const mongoose = require("mongoose");
const {
  createFeedback,
  getFeedbackList,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  getWeeklySummary,
  triggerReanalysis,
  getStats
} = require("../services/feedback.service");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { validateCreateFeedback, validateStatusUpdate } = require("../utils/validation");

async function createFeedbackHandler(req, res) {
  const { value, error } = validateCreateFeedback(req.body || {});
  if (error) {
    return sendError(res, error, "VALIDATION_ERROR", 400);
  }

  try {
    const feedback = await createFeedback(value);
    return sendSuccess(res, feedback, "Feedback created", 201);
  } catch (err) {
    return sendError(res, "Failed to create feedback", err.message, 500);
  }
}

async function listFeedbackHandler(req, res) {
  try {
    const data = await getFeedbackList(req.query || {});
    const stats = await getStats();
    return sendSuccess(res, { ...data, stats }, "Feedback list", 200);
  } catch (err) {
    return sendError(res, "Failed to list feedback", err.message, 500);
  }
}

async function getFeedbackHandler(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return sendError(res, "Invalid feedback id", "VALIDATION_ERROR", 400);
  }

  try {
    const feedback = await getFeedbackById(req.params.id);
    if (!feedback) {
      return sendError(res, "Feedback not found", "NOT_FOUND", 404);
    }
    return sendSuccess(res, feedback, "Feedback found", 200);
  } catch (err) {
    return sendError(res, "Failed to get feedback", err.message, 500);
  }
}

async function updateFeedbackStatusHandler(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return sendError(res, "Invalid feedback id", "VALIDATION_ERROR", 400);
  }

  const { value, error } = validateStatusUpdate(req.body || {});
  if (error) {
    return sendError(res, error, "VALIDATION_ERROR", 400);
  }

  try {
    const feedback = await updateFeedbackStatus(req.params.id, value.status);
    if (!feedback) {
      return sendError(res, "Feedback not found", "NOT_FOUND", 404);
    }
    return sendSuccess(res, feedback, "Feedback status updated", 200);
  } catch (err) {
    return sendError(res, "Failed to update feedback", err.message, 500);
  }
}

async function deleteFeedbackHandler(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return sendError(res, "Invalid feedback id", "VALIDATION_ERROR", 400);
  }

  try {
    const feedback = await deleteFeedback(req.params.id);
    if (!feedback) {
      return sendError(res, "Feedback not found", "NOT_FOUND", 404);
    }
    return sendSuccess(res, feedback, "Feedback deleted", 200);
  } catch (err) {
    return sendError(res, "Failed to delete feedback", err.message, 500);
  }
}

async function summaryHandler(_, res) {
  try {
    const summary = await getWeeklySummary();
    return sendSuccess(res, summary, "Summary generated", 200);
  } catch (err) {
    return sendError(res, "Failed to generate summary", err.message, 500);
  }
}

async function reanalyzeHandler(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return sendError(res, "Invalid feedback id", "VALIDATION_ERROR", 400);
  }

  try {
    const result = await triggerReanalysis(req.params.id);
    if (!result) {
      return sendError(res, "Feedback not found", "NOT_FOUND", 404);
    }
    return sendSuccess(res, result, "Reanalysis complete", 200);
  } catch (err) {
    return sendError(res, "Reanalysis failed", err.message, 500);
  }
}

module.exports = {
  createFeedbackHandler,
  listFeedbackHandler,
  getFeedbackHandler,
  updateFeedbackStatusHandler,
  deleteFeedbackHandler,
  summaryHandler,
  reanalyzeHandler
};

