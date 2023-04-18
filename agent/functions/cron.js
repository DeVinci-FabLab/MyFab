const axios = require("axios");
const CronJob = require("cron").CronJob;
require("dotenv").config();
const env_name = process.env.ENV_NAME.trim();
const servicesManager = require("./service");
const backLocation = "back/";

module.exports.startCron = async (service) => {
  const job = new CronJob("* * * * * *", function () {
    console.log("You will see this message every second");
  });
  //job.start();
};
