const axios = require("axios");
const CronJob = require("cron").CronJob;
require("dotenv").config();
const servicesManager = require("./service");

const env_name = process.env.ENV_NAME.trim();
const is_linux = !process.env.IS_LINUX?.includes("false");
const restart_cron_time =
  process.env.RESTART_CRON_TIME?.trim() || "0 12 2 * * *";
const daily_pull_always_restarts = process.env.DAILY_PULL_ALWAYS_RESTARTS?.includes("true");
const failsafe_cron_time =
  process.env.FAILSAFE_CRON_TIME?.trim() || "0 */15 9-23 * * *";
const ping_url = is_linux ? "http://back:5000/api/ping" :
  env_name == "back" ? "http://localhost:5000/api/ping"
    : null;

module.exports.startCron = async (service) => {
  const dailyRestart = new CronJob(
    restart_cron_time,
    async function () {
      console.log("Checking for updates...");
      const behindHead = await servicesManager.gitPull();
      if (behindHead || daily_pull_always_restarts) {
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
      console.log("Pinging '" + ping_url + "'...");
      ping(ping_url)
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
    ping_url
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
