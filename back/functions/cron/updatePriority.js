const CronJob = require("cron").CronJob;

module.exports.action = action;
async function action(app) {
  const queryOneWeek = `UPDATE printstickets
                    SET i_priority = '2'
                    WHERE NOW() > DATE_ADD(dt_creationdate, INTERVAL 1 WEEK);`;
  const dbResOneWeek = await app.executeQuery(app.db, queryOneWeek, []);
  if (dbResOneWeek[0]) console.log(dbResOneWeek[0]);

  const queryTwoWeek = `UPDATE printstickets
                    SET i_priority = '3'
                    WHERE NOW() > DATE_ADD(dt_creationdate, INTERVAL 2 WEEK);`;
  const dbResTwoWeek = await app.executeQuery(app.db, queryTwoWeek, []);
  if (dbResTwoWeek[0]) console.log(dbResTwoWeek[0]);
}

module.exports.run = async (app) => {
  action(app);
  new CronJob(
    "10 12 08 * * *",
    async function () {
      action(app);
    },
    null,
    true
  );
};
