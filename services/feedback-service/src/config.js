const config = {
  port: Number(process.env.PORT || 4002),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/feedpulse",
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:4003"
};

module.exports = { config };

