const request = require("supertest");
const nock = require("nock");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { app } = require("../src/app");
const { connectDatabase, disconnectDatabase } = require("../src/db");
const { Feedback } = require("../src/models/Feedback");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  process.env.AI_SERVICE_URL = "http://localhost:4103";
  await connectDatabase();
});

afterEach(async () => {
  nock.cleanAll();
  await Feedback.deleteMany({});
});

afterAll(async () => {
  await disconnectDatabase();
  await mongoServer.stop();
});

test("POST /feedback saves valid feedback and AI fields", async () => {
  nock("http://localhost:4103").post("/analyze").reply(200, {
    success: true,
    data: {
      category: "Feature Request",
      sentiment: "Positive",
      priority_score: 8,
      summary: "Needs dark mode",
      tags: ["UI", "Accessibility"]
    }
  });

  const response = await request(app).post("/feedback").send({
    title: "Please add dark mode",
    description: "A dark mode setting would make dashboard easier to use at night.",
    category: "Feature Request"
  });

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.data.ai_processed).toBe(true);
  expect(response.body.data.ai_priority).toBe(8);
});

test("POST /feedback rejects empty title", async () => {
  const response = await request(app).post("/feedback").send({
    title: "",
    description: "This description has enough length to pass the min validation.",
    category: "Bug"
  });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});

test("PATCH /feedback/:id updates status", async () => {
  const feedback = await Feedback.create({
    title: "API latency spikes",
    description: "The API takes over 3 seconds during peak times in production.",
    category: "Improvement"
  });

  const response = await request(app).patch(`/feedback/${feedback._id}`).send({ status: "In Review" });

  expect(response.status).toBe(200);
  expect(response.body.data.status).toBe("In Review");
});

test("POST /feedback saves even when AI fails", async () => {
  nock("http://localhost:4103").post("/analyze").reply(500, {
    success: false,
    error: "AI_DOWN",
    message: "Service unavailable"
  });

  const response = await request(app).post("/feedback").send({
    title: "Notifications are noisy",
    description: "Notification settings are too limited and users receive too many pings.",
    category: "Improvement"
  });

  expect(response.status).toBe(201);
  expect(response.body.data.ai_processed).toBe(false);
});

test("GET /feedback/summary returns top themes", async () => {
  await Feedback.create([
    {
      title: "Need export",
      description: "Please add CSV export for reports and analytics views soon.",
      category: "Feature Request",
      ai_tags: ["Reporting", "Export"],
      ai_processed: true
    },
    {
      title: "Export bug",
      description: "Export fails for large files and returns timeout errors often.",
      category: "Bug",
      ai_tags: ["Export"],
      ai_processed: true
    }
  ]);

  const response = await request(app).get("/feedback/summary");

  expect(response.status).toBe(200);
  expect(response.body.data.topThemes.length).toBeGreaterThan(0);
});

