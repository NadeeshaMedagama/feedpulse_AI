const config = {
  port: Number(process.env.PORT || 4001),
  adminEmail: process.env.ADMIN_EMAIL || "admin@feedpulse.dev",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "12h"
};

module.exports = { config };

