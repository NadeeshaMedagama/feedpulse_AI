const { GoogleGenerativeAI } = require("@google/generative-ai");
const { config } = require("../config");

function parseJson(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

function normalizeAiPayload(payload) {
  const categoryOptions = ["Bug", "Feature Request", "Improvement", "Other"];
  const sentimentOptions = ["Positive", "Neutral", "Negative"];

  const category = categoryOptions.includes(payload.category) ? payload.category : "Other";
  const sentiment = sentimentOptions.includes(payload.sentiment) ? payload.sentiment : "Neutral";
  const priority = Math.min(10, Math.max(1, Number(payload.priority_score) || 5));
  const summary = typeof payload.summary === "string" ? payload.summary.slice(0, 500) : "Summary unavailable";
  const tags = Array.isArray(payload.tags) ? payload.tags.map((tag) => String(tag).slice(0, 40)).slice(0, 8) : [];

  return {
    category,
    sentiment,
    priority_score: priority,
    summary,
    tags
  };
}

async function analyzeFeedback(title, description) {
  const geminiApiKey = process.env.GEMINI_API_KEY || config.geminiApiKey;
  const modelName = process.env.GEMINI_MODEL || config.model;

  if (!geminiApiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const prompt = `Analyse this product feedback. Return ONLY valid JSON with these fields: category, sentiment, priority_score (1-10), summary, tags.\nFeedback title: ${title}\nFeedback description: ${description}`;

  const client = new GoogleGenerativeAI(geminiApiKey);
  const model = client.getGenerativeModel({ model: modelName });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = parseJson(text);

  return normalizeAiPayload(parsed);
}

module.exports = { analyzeFeedback, normalizeAiPayload };
