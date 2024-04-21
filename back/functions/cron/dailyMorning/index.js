const CronJob = require("cron").CronJob;
const myFabWeather = require("./myFabWeather").action;

module.exports.action = action;
async function action(app) {
  await myFabWeather(app);
}

module.exports.run = async (app) => {
  action(app);
  new CronJob(
    "00 00 10 * * *",
    async function () {
      action(app);
    },
    null,
    true
  );
};
