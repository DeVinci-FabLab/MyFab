const CronJob = require("cron").CronJob;
const validRulesForRoot = require("./validRulesForRoot").action;
const autoCloseTicket = require("./autoCloseTicket").action;
const updatePriority = require("./updatePriority").action;

module.exports.action = action;
async function action(app) {
  await validRulesForRoot(app);
  await autoCloseTicket(app);
  await updatePriority(app);
}

module.exports.run = async (app) => {
  action(app);
  new CronJob(
    "22 24 06 * * *",
    async function () {
      action(app);
    },
    null,
    true
  );
};
