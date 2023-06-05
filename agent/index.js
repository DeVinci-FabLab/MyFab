const express = require("express");
const app = express();
const servicesManager = require("./functions/service");
require("dotenv").config();
const env_name = process.env.ENV_NAME?.trim();
if (!env_name) {
  console.error("env_name is not defined");
  process.exit(1);
}
console.log("Agent '" + env_name + "' is starting");

async function start() {
  await require("./functions/api").envFileSynchronization();
  await servicesManager.stopService();
  let service = await servicesManager.startService(env_name);

  require("./functions/api").startApi(app, service);
  require("./functions/cron").startCron(service);

  app.listen(2224);
  console.log("Listen port : 2224");
}

start();
