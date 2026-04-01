const mongoose = require("mongoose");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is required. Set MongoDB Atlas URI in your environment.");
  }
  const maxRetries = Number(process.env.MONGO_CONNECT_RETRIES || 10);

  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await mongoose.connect(mongoUri);
      return;
    } catch (error) {
      lastError = error;
      await sleep(1000 * attempt);
    }
  }

  throw lastError;
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };
