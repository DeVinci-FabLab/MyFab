const envSavedPath = __dirname + "/../../back/data/.env";
const envBackPath = __dirname + "/../../back/.env";
const envFrontPath = __dirname + "/../../front/.env";
const serviceLogsPath = __dirname + "/../logsService.txt";
const agentLogsPath = __dirname + "/../logsAgent.txt";
require("dotenv").config();
const env_name = process.env.ENV_NAME.trim();
const servicesManager = require("./service");
const fs = require("fs");
const is_test_mode = process.env.IS_TEST_MODE;

let env_modified = false;

//Waiting screen : Only for front
module.exports.createAppWaitingScreen = async () => {
  return await new Promise((resolve) => {
    if (env_name !== "front") return resolve(null);
    const express = require("express");
    const appWaitingScreen = express();
    const waitingScreen = fs.readFileSync(__dirname + "/waitingScreen.html", {
      encoding: "utf8",
      flag: "r",
    });
    appWaitingScreen.get("*", async (req, res) => {
      res.send(waitingScreen);
    });

    return resolve(appWaitingScreen);
  });
};

module.exports.envFileSynchronization = envFileSynchronization;
async function envFileSynchronization(saveFile) {
  const fileEnvExist = fs.existsSync(envSavedPath);
  if ((!fileEnvExist && env_name === "back") || saveFile) {
    fs.copyFileSync(envBackPath, envSavedPath);
  } else if (fileEnvExist && env_name === "back") {
    fs.copyFileSync(envSavedPath, envBackPath);
  } else if (fileEnvExist && env_name === "front") {
    fs.copyFileSync(envSavedPath, envFrontPath);
  }
  return;
}

module.exports.startApi = async (app, service) => {
  app.get("/ping", async (req, res) => {
    res.sendStatus(200);
  });

  app.get("/gitPull", async (req, res) => {
    res.sendStatus(200);

    const newCode = await servicesManager.gitPull();
    if (newCode || env_modified || is_test_mode) {
      env_modified = false;
      service = await servicesManager.restartService(service);
    }
  });

  if (env_name === "back")
    app.post("/env", async (req, res) => {
      const action = req.query.action;
      const key = req.query.key;
      const value = req.query.value;
      if (!action || !key) {
        return res.sendStatus(400);
      }

      const env = fs.readFileSync(envBackPath, { encoding: "utf8", flag: "r" });
      const lines = env.split("\n");
      let indexKey = -1;
      for (let index = 0; index < lines.length; index++) {
        const element = lines[index];
        if (element.includes(key + "=")) indexKey = index;
      }

      switch (action) {
        case "add":
          if (!value) return res.sendStatus(400);
          if (indexKey !== -1) return res.sendStatus(405);
          lines.push(`${key}=${value}\n`);
          break;
        case "update":
          if (!value) return res.sendStatus(400);
          if (indexKey === -1) return res.sendStatus(405);
          lines[indexKey] = `${key}=${value}`;
          break;
        case "remove":
          if (indexKey === -1) return res.sendStatus(405);
          lines.splice(indexKey, 1);
          break;

        default:
          return res.sendStatus(400);
      }

      let newEnv = lines.length === 0 ? "" : lines[0];
      for (let index = 1; index < lines.length; index++) {
        const element = lines[index];
        newEnv += "\n" + element;
      }

      fs.writeFileSync(envBackPath, newEnv);

      await envFileSynchronization(true);
      env_modified = true;

      res.sendStatus(200);
    });

  if (env_name === "front")
    app.post("/env", async (req, res) => {
      await envFileSynchronization();
      env_modified = true;
      res.sendStatus(200);
    });

  app.get("/restart", async (req, res) => {
    res.sendStatus(200);

    process.exit(1);
  });

  app.get("/logs", async (req, res) => {
    let agent;
    let service;

    try {
      agent = fs.readFileSync(agentLogsPath, "utf-8");
    } catch (err) {
      agent = err;
    }
    try {
      service = fs.readFileSync(serviceLogsPath, "utf-8");
    } catch (err) {
      service = err;
    }

    res.send({
      agent: agent,
      service: service,
    });
  });
};
