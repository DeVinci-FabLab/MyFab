const axios = require("axios");
const CronJob = require("cron").CronJob;
require("dotenv").config();
const env_name = process.env.ENV_NAME.trim();
const restart_cron_time =
  process.env.RESTART_CRON_TIME?.trim() || "0 12 2 * * *";
const always_restart = process.env.ALWAYS_RESTART?.includes("true");
const servicesManager = require("./service");
const backLocation = "back/";

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
};
