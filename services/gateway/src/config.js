const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  feedbackServiceUrl: process.env.FEEDBACK_SERVICE_URL || "http://localhost:4002",
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:4001"
};

module.exports = { config };

