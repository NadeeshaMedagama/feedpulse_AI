const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { analyzeFeedback } = require("./services/gemini.service");
const { sendSuccess, sendError } = require("./utils/apiResponse");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_, res) => sendSuccess(res, { status: "ok", service: "ai-service" }));

app.post("/analyze", async (req, res) => {
  const { title, description } = req.body || {};
  if (!title || !description) {
    return sendError(res, "Title and description are required", "VALIDATION_ERROR", 400);
  }

  try {
    const data = await analyzeFeedback(title, description);
    return sendSuccess(res, data, "AI analysis completed", 200);
  } catch (error) {
    return sendError(res, "AI analysis failed", error.message, 500);
  }
});

app.use((_, res) => sendError(res, "Route not found", "NOT_FOUND", 404));

module.exports = { app };

