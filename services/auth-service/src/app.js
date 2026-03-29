const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { login } = require("./services/auth.service");
const { sendSuccess, sendError } = require("./utils/apiResponse");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_, res) => sendSuccess(res, { status: "ok", service: "auth-service" }));

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return sendError(res, "Email and password are required", "VALIDATION_ERROR", 400);
  }

  const session = login(email, password);
  if (!session) {
    return sendError(res, "Invalid credentials", "UNAUTHORIZED", 401);
  }

  return sendSuccess(res, session, "Login successful", 200);
});

app.use((_, res) => sendError(res, "Route not found", "NOT_FOUND", 404));

module.exports = { app };

