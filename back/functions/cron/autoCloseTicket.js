const CronJob = require("cron").CronJob;

module.exports.action = action;
async function action(app) {
  const queryOneWeek = `SELECT i_id AS id FROM printstickets WHERE i_status = 2 AND NOW() > DATE_ADD(dt_modificationdate, INTERVAL 1 WEEK);`;
  const dbResOneWeek = await app.executeQuery(app.db, queryOneWeek, []);
  if (dbResOneWeek[0]) console.log(dbResOneWeek[0]);

  for (let index = 0; index < dbResOneWeek[1].length; index++) {
    const element = dbResOneWeek[1][index].id;
    const updateQuery = `UPDATE printstickets SET i_status = '4' WHERE i_id = ?;`;
    const dbResUpdate = await app.executeQuery(app.db, updateQuery, [element]);
    if (dbResUpdate[0]) console.log(dbResUpdate[0]);

    const queryInsert = `INSERT INTO ticketmessages (i_idUser, i_idTicket, v_content)
                    VALUES ((SELECT i_id FROM users WHERE v_email = 'system@system.com'), ?, "Bonjour, votre demande est en attente de réponse de votre part depuis plus d'une semaine, cette demande a automatiquement été clôturée. Vous pouvez répondre à ce message pour la réouvrir ou créer une nouvelle demande. Merci pour votre compréhension")`;
    const dbRes = await app.executeQuery(app.db, queryInsert, [element]);
    if (dbRes[0]) {
      console.log(dbRes[0]);
    }
  }
}

module.exports.run = async (app) => {
  action(app);
  new CronJob(
    "10 24 08 * * *",
    async function () {
      action(app);
    },
    null,
    true
  );
};
