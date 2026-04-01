const express = require("express");
const { config } = require("../config");
const { requestJson } = require("../services/httpClient");
const { sendError, sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const result = await requestJson(`${config.authServiceUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify(req.body || {})
    });

    if (!result.ok) {
      return sendError(
        res,
        result.body?.message || "Login failed",
        result.body?.error || null,
        result.status
      );
    }

    return sendSuccess(res, result.body?.data || null, result.body?.message || "Login successful", 200);
  } catch (error) {
    return sendError(res, "Login failed", error.message, 500);
  }
});

module.exports = router;

