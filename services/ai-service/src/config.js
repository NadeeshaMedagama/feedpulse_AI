const config = {
  port: Number(process.env.PORT || 4003),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash"
};

module.exports = { config };

