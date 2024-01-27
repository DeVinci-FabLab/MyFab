const CronJob = require("cron").CronJob;
const removeExpiredJWT = require("./removeExpiredCookies").action;

module.exports.action = action;
async function action(app) {
  await removeExpiredJWT(app);
}

module.exports.run = async (app) => {
  action(app);
  new CronJob(
    "10 */5 * * * *",
    async function () {
      action(app);
    },
    null,
    true
  );
};
