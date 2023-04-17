const express = require("express");
const app = express();
const axios = require("axios");
const servicesManager = require("./functions/service");
require("dotenv").config();
const env_name = process.env.ENV_NAME.trim();
const frontLocation = "https://github.com/"; //Changer l'url
if (!env_name) {
  console.error("env_name is not defined");
  process.exit(1);
}
console.log("Agent '" + env_name + "' is starting");

let actionIsRunning = false;
async function start() {
  await servicesManager.stopService();
  let service = await servicesManager.startService(env_name);

  app.get("/gitPull", async (req, res) => {
    if (actionIsRunning) return;
    if (env_name === "back") axios.get(frontLocation + "gitPull");
    const newCode = await servicesManager.gitPull();
    res.sendStatus(200);
    if (!newCode) return;
    actionIsRunning = true;

    await servicesManager.stopService(service);
    setTimeout(async () => {
      service = await servicesManager.startService(env_name);
      actionIsRunning = false;
    }, 5000);
  });

  app.listen(2224);
  console.log("Listen port : 2224");
}

start();
