const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const feedbackRoutes = require("./routes/feedback.routes");
const { sendSuccess, sendError } = require("./utils/apiResponse");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_, res) => sendSuccess(res, { status: "ok", service: "feedback-service" }));
app.use("/feedback", feedbackRoutes);

app.use((_, res) => sendError(res, "Route not found", "NOT_FOUND", 404));

module.exports = { app };

