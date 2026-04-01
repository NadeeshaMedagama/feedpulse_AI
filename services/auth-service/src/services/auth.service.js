const jwt = require("jsonwebtoken");
const { config } = require("../config");

function login(email, password) {
  if (email !== config.adminEmail || password !== config.adminPassword) {
    return null;
  }

  const token = jwt.sign({ email, role: "admin" }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });

  return { token, email, role: "admin" };
}

module.exports = { login };

