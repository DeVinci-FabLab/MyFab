const axios = require("axios");
const CronJob = require("cron").CronJob;
require("dotenv").config();
const env_name = process.env.ENV_NAME.trim();
const is_linux = !process.env.IS_LINUX?.includes("false");
const restart_cron_time =
  process.env.RESTART_CRON_TIME?.trim() || "0 12 2 * * *";
const always_restart = process.env.ALWAYS_RESTART?.includes("true");
const failsafe_cron_time =
  process.env.FAILSAFE_CRON_TIME?.trim() || "0 */15 9-23 * * *";
const servicesManager = require("./service");

module.exports.startCron = async (service) => {
  const dailyRestart = new CronJob(
    restart_cron_time,
    async function () {
      console.log("Checking for updates...");
      const behindHead = await servicesManager.gitPull();
      if (behindHead || always_restart) {
        service = await servicesManager.restartService(service);
      } else {
        console.log("No updates found");
      }
    },
    null,
    true
  );

  const failsafe = new CronJob(
    failsafe_cron_time,
    async function () {
      if (is_linux) url = "http://back:5000/api/ping";
      else if (env_name == "back") url = "http://localhost:5000/api/ping";
      else return;

      console.log("Pinging '" + url + "'...");
      ping(url)
        .then(async (result) => {
          if (!result) {
            console.log("Ping failed");
            saveService(service);
          }
        })
        .catch((error) => {
          console.error("Ping failed: ", error);
          saveService(service);
        });
    },
    null,
    true
  );
};

async function ping(url) {
  try {
    await axios.get(url);
    return true;
  } catch (error) {
    return false;
  }
}

async function saveService(service) {
  console.log("Attempting to save service...");
  await servicesManager.gitPull();
  service = await servicesManager.restartService(service);
}
