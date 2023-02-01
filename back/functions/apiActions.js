/* c8 ignore start */

const fs = require("fs");
const sign = require("jwt-encode");
const activeLogs = require("../config.json").activeLogs;
const jwtSecret = require("../config.json").specialTocken;

async function runFolder(path, app) {
  return await new Promise(async (resolve) => {
    fs.readdirSync(__dirname + "/.." + path).forEach(async (file) => {
      const filePath = path + "/" + file;
      if (fs.lstatSync(__dirname + "/.." + filePath).isDirectory()) await runFolder(filePath, app);
      else {
        const fileSplited = file.split(".");
        if (fileSplited[fileSplited.length - 1] !== "js") console.log("Unexpected file type : " + file);
        else {
          const route = require(__dirname + "/.." + filePath);
          if (route["startApi"]) {
            try {
              route["startApi"](app);
            } catch (error) {
              //Error for api start
              console.log("Error for api start");
              console.log(error);
            }
          } else {
            console.log(__dirname + "/.." + filePath);
            const keys = Object.keys(route);
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              try {
                route[key](app);
              } catch (error) {
                //Error for api start
                console.log("Error for api start");
                console.log(error);
              }
            }
          }
        }
      }
      resolve();
    });
  });
}

module.exports.startApi = async (app) => {
  await runFolder("/api", app);
  app.get("*", async function (req, res) {
    res.sendStatus(404);
  });
};

const userAuthorization = require("../functions/userAuthorization");
module.exports.prepareData = async (app, req, res) => {
  if (activeLogs) addLogsApiRequest(req);
  const data = {
    app,
    params: req.params,
    query: req.query,
    body: req.body,
    files: req.files,
    userId: req.headers.dvflcookie && app.cookiesList[req.headers.dvflcookie] ? app.cookiesList[req.headers.dvflcookie].id : null,
    files: req.files,
    specialcode: req.headers.specialcode,
    userAuthorization: userAuthorization,
  };
  return data;
};

module.exports.saveNewCookie = async (app, userData) => {
  const data = {
    email: userData.email,
    created: new Date(),
    expire: userData.expireIn ? userData.expireIn : "never",
  };
  const jwt = sign(data, jwtSecret);
  app.cookiesList[jwt] = { id: userData.id, expire: userData.expireIn ? new Date(userData.expireIn) : null };
  return jwt;
};

module.exports.sendResponse = async (req, res, data) => {
  if (activeLogs && data.code !== 200 && data.message) addLogsError(data.code + ": " + data.message);
  switch (data.type) {
    case "json":
      res.json(data.json);
      break;
    case "code":
      res.sendStatus(data.code);
      break;
    case "file":
      res.sendFile(data.name, {
        root: __dirname + `/../${data.root ? data.root : "data/files/"}`,
        dotfiles: "deny",
        headers: {
          "x-timestamp": Date.now(),
          "x-sent": true,
        },
      });
      break;
    case "download":
      res.download(data.path, data.fileName);
      break;

    default:
      console.log("ERROR : Send result of api\nUnknown type: " + data.type);
      res.sendStatus(500);
      break;
  }
};

async function addLogsApiRequest(req) {
  const date = new Date();
  const stringDate =
    "[" +
    ("0" + date.getDate()).slice(-2) +
    "/" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    date.getFullYear() +
    " " +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2) +
    "]";
  const apiUsed = Object.keys(req.route.methods)[0].toUpperCase() + " " + req.route.path;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const newLog = stringDate + " " + ip + " " + apiUsed + "\n";

  const fileName = "logs_" + date.getFullYear() + "_" + ("0" + (date.getMonth() + 1)).slice(-2) + "_" + ("0" + date.getDate()).slice(-2);
  if (!fs.existsSync("./logs/")) fs.mkdirSync("./logs/");
  if (!fs.existsSync("./logs/api/")) fs.mkdirSync("./logs/api/");
  if (!fs.existsSync("./logs/api/" + fileName)) fs.writeFileSync("./logs/api/" + fileName, "");
  fs.appendFileSync("./logs/api/" + fileName, newLog);
}

async function addLogsError(line) {
  const date = new Date();
  const fileName = "logs_" + date.getFullYear() + "_" + ("0" + (date.getMonth() + 1)).slice(-2) + "_" + ("0" + date.getDate()).slice(-2);
  if (!fs.existsSync("./logs/")) fs.mkdirSync("./logs/");
  if (!fs.existsSync("./logs/apiError/")) fs.mkdirSync("./logs/apiError/");
  if (!fs.existsSync("./logs/apiError/" + fileName)) fs.writeFileSync("./logs/apiError/" + fileName, "");
  fs.appendFileSync("./logs/apiError/" + fileName, line + "\n");
}

/* c8 ignore stop */
