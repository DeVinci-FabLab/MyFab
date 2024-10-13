const CronJob = require("cron").CronJob;
const validRulesForRoot = require("./validRulesForRoot").action;

module.exports.action = action;
async function action(app) {
  await validRulesForRoot(app);
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
