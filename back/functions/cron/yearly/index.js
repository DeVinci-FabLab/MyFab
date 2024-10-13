const CronJob = require("cron").CronJob;
const removeYearAndSchool = require("./removeYearAndSchool").action;

module.exports.action = action;
async function action(app) {
  await removeYearAndSchool(app);
}

module.exports.run = async (app) => {
  new CronJob(
    "12 52 06 1 9 *",
    async function () {
      action(app);
    },
    null,
    true
  );
};
