const { exec, spawn } = require("node:child_process");
const fs = require("fs");

module.exports.stopService = async (service) => {
  if (service) service.kill();
  return await new Promise((resolve, reject) => {
    exec(
      "ps | grep 'node' | grep ? | sed 's/  */ /g' | cut -d ' ' -f2",
      (err, pid, stderr) => {
        if (err) throw err;
        if (!pid) resolve();
        exec("kill " + pid, (err, stdout, stderr) => {
          if (err) throw err;
          resolve();
        });
      }
    );
  });
};

module.exports.startService = async (serviceName) => {
  const date = new Date();
  fs.writeFileSync(
    "logApp.txt", //("0" + (date.getMinutes() + 1)).slice(-2)
    `Service '${serviceName}' is starting at : ${("0" + date.getDate()).slice(
      -2
    )}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()} ${(
      "0" + date.getHours()
    ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}\n`
  );
  let service = null;
  switch (serviceName) {
    case "back":
      service = spawn("sh", ["run.sh", "node", "index.js"], { cwd: "../back" });
      break;

    default:
      console.log(`Service '${serviceName}' is unknown`);
      return null;
  }

  console.log(`Service '${serviceName}' is starting`);

  service.stdout.on("data", (data) => {
    fs.appendFile("logApp.txt", data.toString(), function (err) {
      if (err) throw err;
    });
  });

  service.stderr.on("data", (data) => {
    fs.appendFile("logApp.txt", data.toString(), function (err) {
      if (err) throw err;
    });
  });

  service.on("exit", (code) => {
    console.log(`Service '${serviceName}' is stopping`);
    if (code === null) return;

    console.log(`Service '${serviceName}' is stopping with code '${code}'`);
    console.log(`Safe mode activation`);
    //Safe mode
  });

  return service;
};

module.exports.gitPull = async () => {
  return await new Promise((resolve, reject) => {
    exec("git pull", (err, stdout, stderr) => {
      if (err) throw err;
      if (stdout.split("\n").length <= 2) resolve(false); //No change

      resolve(true); //New code
    });
  });
};
