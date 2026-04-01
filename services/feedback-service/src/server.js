const { app } = require("./app");
const { config } = require("./config");
const { connectDatabase } = require("./db");

async function start() {
  await connectDatabase();
  app.listen(config.port, () => {
    console.log(`Feedback service listening on port ${config.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start feedback service", error);
  process.exit(1);
});

