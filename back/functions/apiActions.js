/* c8 ignore start */

const fs = require("fs");
const sign = require("jwt-encode");
const sha256 = require("sha256");
require("dotenv").config();
const activeLogs = process.env.activeLogs === "true";
const jwtSecret = process.env.SPECIALTOKEN;

const reIpAddress = new RegExp("(?:[0-9]{1,3}.){3}[0-9]{1,3}");
function getIpAddress(remoteAddress) {
  if (remoteAddress) {
    const result = remoteAddress.match(reIpAddress);
    if (result) return result[0];
  }
  return "127.0.0.1";
}

async function runFolder(path, app) {
  return await new Promise(async (resolve) => {
    fs.readdirSync(__dirname + "/.." + path).forEach(async (file) => {
      const filePath = path + "/" + file;
      if (fs.lstatSync(__dirname + "/.." + filePath).isDirectory())
        await runFolder(filePath, app);
      else {
        const fileSplited = file.split(".");
        if (fileSplited[fileSplited.length - 1] !== "js")
          console.log("Unexpected file type : " + file);
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
    console.log(`ERROR : Route "${req.path}" not found`);
    res.sendStatus(404);
  });
};

const userAuthorization = require("../functions/userAuthorization");
const sendApiRequest = require("../functions/sendApiRequest").sendApiRequest;
module.exports.prepareData = async (app, req, res) => {
  if (activeLogs) addLogsApiRequest(req);

  const userId = await new Promise(async (resolve, reject) => {
    const jwt = req.headers.dvflcookie;
    if (!jwt) return resolve(null);
    const sha256_jwt = sha256(jwt);

    const querySelect = `SELECT i_idUser AS id 
                      FROM usercookies
                      WHERE v_value = ?
                      AND (dt_expireDate IS NULL OR dt_expireDate > CURDATE());`;
    const dbRes = await app.executeQuery(app.db, querySelect, [sha256_jwt]);
    /* c8 ignore start */
    if (dbRes[0]) {
      console.log(dbRes[0]);
      return resolve(null);
    }
    /* c8 ignore stop */
    const queryUpdate = `UPDATE usercookies 
                    SET dt_lastUsed = CURRENT_TIMESTAMP
                    WHERE v_value = ?`;
    app.executeQuery(app.db, queryUpdate, [sha256_jwt]);
    return resolve(dbRes[1][0]?.id);
  });

  const userAgent = req.headers["user-agent"];
  const browser = req.headers["sec-ch-ua"];
  const ip = getIpAddress(req.ip);

  const data = {
    app,
    params: req.params,
    query: req.query,
    body: req.body,
    files: req.files,
    userId: userId,
    files: req.files,
    specialcode: req.headers.specialcode,
    userAgent,
    browser,
    ip,
    userAuthorization,
    sendApiRequest,
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

  const queryCookie = `INSERT INTO usercookies (i_idUser, v_value, dt_expireDate)
                    VALUES (?, ?, ?);`;
  await app.executeQuery(app.db, queryCookie, [
    userData.id,
    sha256(jwt),
    userData.expireIn ? new Date(userData.expireIn) : null,
  ]);

  const queryLog = `INSERT INTO log_connection (i_idUser, v_userAgent, v_browser, v_ip)
                    VALUES (?, ?, ?, ?);`;
  await app.executeQuery(app.db, queryLog, [
    userData.id,
    userData.userAgent,
    userData.browser,
    userData.ip,
  ]);
  return jwt;
};

module.exports.sendResponse = async (req, res, data) => {
  if (activeLogs && data.code !== 200 && data.message)
    addLogsError(data.code + ": " + data.message);
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
  const apiUsed =
    Object.keys(req.route.methods)[0].toUpperCase() + " " + req.route.path;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const newLog = stringDate + " " + ip + " " + apiUsed + "\n";

  const fileName =
    "logs_" +
    date.getFullYear() +
    "_" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "_" +
    ("0" + date.getDate()).slice(-2);
  if (!fs.existsSync("./logs/")) fs.mkdirSync("./logs/");
  if (!fs.existsSync("./logs/api/")) fs.mkdirSync("./logs/api/");
  if (!fs.existsSync("./logs/api/" + fileName))
    fs.writeFileSync("./logs/api/" + fileName, "");
  fs.appendFileSync("./logs/api/" + fileName, newLog);
}

async function addLogsError(line) {
  const date = new Date();
  const fileName =
    "logs_" +
    date.getFullYear() +
    "_" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "_" +
    ("0" + date.getDate()).slice(-2);
  if (!fs.existsSync("./logs/")) fs.mkdirSync("./logs/");
  if (!fs.existsSync("./logs/apiError/")) fs.mkdirSync("./logs/apiError/");
  if (!fs.existsSync("./logs/apiError/" + fileName))
    fs.writeFileSync("./logs/apiError/" + fileName, "");
  fs.appendFileSync("./logs/apiError/" + fileName, line + "\n");
}

/* c8 ignore stop */
