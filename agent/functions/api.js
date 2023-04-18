const axios = require("axios");
require("dotenv").config();
const env_name = process.env.ENV_NAME.trim();
const servicesManager = require("./service");
const frontLocation = "front/";

module.exports.startApi = async (app, service) => {
  app.get("/gitPull", async (req, res) => {
    res.sendStatus(200);

    if (env_name === "back")
      axios.get(frontLocation + "gitPull").catch(() => {});
    const newCode = await servicesManager.gitPull();
    //if (!newCode) return;
    service = await servicesManager.restartService(service);
  });
};
