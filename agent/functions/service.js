const { exec, spawn } = require("node:child_process");
const fs = require("fs");
require("dotenv").config();
const env_name = process.env.ENV_NAME.trim();
const is_linux =
  process.env.IS_LINUX == undefined
    ? false
    : process.env.IS_LINUX.includes("true");

module.exports.stopService = stopService;
async function stopService(service) {
  if (service) service.kill();
  if (is_linux) {
    return await new Promise((resolve, reject) => {
      exec(
        "ss -lptn 'sport = :5000' | grep LISTEN | sed 's/  */ /g' | cut -d '=' -f2 | cut -d ',' -f1",
        (err, pid, stderr) => {
          if (err) throw err;
          exec("kill " + pid, (err, stdout, stderr) => {
            resolve();
          });
        }
      );
    });
  } else {
    return await new Promise((resolve, reject) => {
      exec(
        "ps | grep 'node' | grep ? | sed 's/  */ /g' | cut -d ' ' -f2",
        (err, pid, stderr) => {
          if (err) throw err;
          exec("kill " + pid, (err, stdout, stderr) => {
            resolve();
          });
        }
      );
    });
  }
}

async function execSpawn(cmd, parameters, options) {
  return await new Promise((resolve, reject) => {
    cmdSpawn = spawn(cmd, parameters, options);

    cmdSpawn.stdout.on("data", (data) => {
      fs.appendFile("logApp.txt", data.toString(), function (err) {
        if (err) throw err;
      });
    });

    cmdSpawn.stderr.on("data", (data) => {
      fs.appendFile("logApp.txt", data.toString(), function (err) {
        if (err) throw err;
      });
    });

    cmdSpawn.on("exit", (code) => {
      fs.appendFile("logApp.txt", "\n", function (err) {
        if (err) throw err;
      });
      resolve();
    });
  });
}

module.exports.startService = startService;
async function startService(serviceName) {
  const date = new Date();
  fs.writeFileSync(
    "logApp.txt", //("0" + (date.getMinutes() + 1)).slice(-2)
    `Service '${serviceName}' is starting at : ${("0" + date.getDate()).slice(
      -2
    )}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()} ${(
      "0" + date.getHours()
    ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}\n\n`
  );
  let service = null;
  switch (serviceName) {
    case "back":
      is_linux
        ? await execSpawn("npm", ["install"], { cwd: "../back" })
        : await execSpawn("sh", ["npm", "install"], { cwd: "../back" });
      service = is_linux
        ? spawn("npm", ["run", "start"], {
            cwd: "../back",
          })
        : spawn("sh", ["npm", "run", "start"], { cwd: "../back" });
      break;

    case "front":
      fs.appendFile("logApp.txt", "Install 'front'\n\n", function (err) {
        if (err) throw err;
      });
      is_linux
        ? await execSpawn("npm", ["install"], { cwd: "../front" })
        : await execSpawn("sh", ["npm", "install"], { cwd: "../front" });

      fs.appendFile("logApp.txt", "Build 'front'\n\n", function (err) {
        if (err) throw err;
      });
      is_linux
        ? await execSpawn("npm", ["run", "build"], {
            cwd: "../front",
          })
        : await execSpawn("sh", ["npm", "run", "build"], {
            cwd: "../front",
          });
      fs.appendFile("logApp.txt", "Starting 'front'\n\n", function (err) {
        if (err) throw err;
      });

      service = is_linux
        ? spawn("npm", ["run", "start"], {
            cwd: "../front",
          })
        : spawn("sh", ["npm", "run", "start"], {
            cwd: "../front",
          });
      break;

    default:
      console.log(`Service '${serviceName}' is unknown`);
      return null;
  }

  console.log(`Service '${serviceName}' is starting`);

  service.stdout.on("data", (data) => {
    fs.appendFile("logApp.txt", data.toString(), function (err) {
      console.log(data.toString());
      if (err) throw err;
    });
  });

  service.stderr.on("data", (data) => {
    fs.appendFile("logApp.txt", data.toString(), function (err) {
      console.log(data.toString());
      if (err) throw err;
    });
  });

  service.on("exit", (code) => {
    console.log(`Service '${serviceName}' is stopping`);
    if (code === null) return;

    console.log(`Service '${serviceName}' is stopping with code '${code}'`);

    if (code === 0) return;

    process.exit(1);
  });

  return service;
}

module.exports.gitPull = gitPull;
async function gitPull() {
  return await new Promise((resolve, reject) => {
    exec("git pull", (err, stdout, stderr) => {
      if (err) throw err;
      if (stdout.split("\n").length <= 2) resolve(false); //No change

      resolve(true); //New code
    });
  });
}

let actionIsRunning = false;
module.exports.restartService = async (service) => {
  return await new Promise(async (resolve, reject) => {
    if (actionIsRunning) return service;
    actionIsRunning = true;

    await stopService(service);
    setTimeout(async () => {
      service = await startService(env_name);
      actionIsRunning = false;
      resolve(service);
    }, 5000);
  });
};
