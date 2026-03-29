const express = require("express");
const {
  createFeedbackHandler,
  listFeedbackHandler,
  getFeedbackHandler,
  updateFeedbackStatusHandler,
  deleteFeedbackHandler,
  summaryHandler,
  reanalyzeHandler
} = require("../controllers/feedback.controller");

const router = express.Router();

router.post("/", createFeedbackHandler);
router.get("/summary", summaryHandler);
router.post("/:id/reanalyze", reanalyzeHandler);
router.get("/", listFeedbackHandler);
router.get("/:id", getFeedbackHandler);
router.patch("/:id", updateFeedbackStatusHandler);
router.delete("/:id", deleteFeedbackHandler);

module.exports = router;

