const axios = require("axios");
require("dotenv").config();
const env_name = process.env.ENV_NAME.trim();
const servicesManager = require("./service");

module.exports.startApi = async (app, service) => {
  app.get("/ping", async (req, res) => {
    res.sendStatus(200);
  });

  app.get("/gitPull", async (req, res) => {
    res.sendStatus(200);

    const newCode = await servicesManager.gitPull();
    if (!newCode) return;
    service = await servicesManager.restartService(service);
  });

  app.post("/env", async (req, res) => {
    console.log(req.query);
    res.sendStatus(200);
  });

  app.get("/restart", async (req, res) => {
    res.sendStatus(200);

    process.exit(1);
  });
};
