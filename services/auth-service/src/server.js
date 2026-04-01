const { app } = require("./app");
const { config } = require("./config");

app.listen(config.port, () => {
  console.log(`Auth service listening on port ${config.port}`);
});

