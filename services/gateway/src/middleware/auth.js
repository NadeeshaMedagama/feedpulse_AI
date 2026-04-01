const jwt = require("jsonwebtoken");
const { config } = require("../config");
const { sendError } = require("../utils/apiResponse");

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Unauthorized", "Missing token", 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    return next();
  } catch (error) {
    return sendError(res, "Unauthorized", "Invalid token", 401);
  }
}

module.exports = { requireAdminAuth };

