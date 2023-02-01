const CronJob = require("cron").CronJob;

module.exports.action = action;
async function action(app) {
  const keys = Object.keys(app.cookiesList);
  for (const key of keys) {
    const expire = app.cookiesList[key].expire;
    if (expire && new Date() > expire) {
      delete app.cookiesList[key];
    }
  }
}

module.exports.run = async (app) => {
  new CronJob(
    "10 */5 * * * *",
    async function () {
      action(app);
    },
    null,
    true
  );
};
