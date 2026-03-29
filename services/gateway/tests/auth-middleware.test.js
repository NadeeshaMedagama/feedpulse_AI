const request = require("supertest");
const jwt = require("jsonwebtoken");
const express = require("express");
const { requireAdminAuth } = require("../src/middleware/auth");

function createProtectedApp() {
  const app = express();
  app.get("/protected", requireAdminAuth, (_, res) => {
    res.status(200).json({ success: true, data: { ok: true }, error: null, message: "OK" });
  });
  return app;
}

test("auth middleware rejects unauthenticated request", async () => {
  const app = createProtectedApp();
  const response = await request(app).get("/protected");

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
});

test("auth middleware allows valid JWT", async () => {
  const app = createProtectedApp();
  const token = jwt.sign({ email: "admin@feedpulse.dev", role: "admin" }, process.env.JWT_SECRET || "dev-secret");

  const response = await request(app)
    .get("/protected")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
});

