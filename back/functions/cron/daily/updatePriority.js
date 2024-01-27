module.exports.action = action;
async function action(app) {
  const queryOneWeek = `UPDATE printstickets
                    SET i_priority = (SELECT i_id FROM gd_ticketpriority WHERE v_name = 'A traiter')
                    WHERE NOW() > DATE_ADD(dt_creationdate, INTERVAL 1 WEEK);`;
  const dbResOneWeek = await app.executeQuery(app.db, queryOneWeek, []);
  if (dbResOneWeek[0]) console.log(dbResOneWeek[0]);

  const queryTwoWeek = `UPDATE printstickets
                    SET i_priority = (SELECT i_id FROM gd_ticketpriority WHERE v_name = 'Urgent')
                    WHERE NOW() > DATE_ADD(dt_creationdate, INTERVAL 2 WEEK);`;
  const dbResTwoWeek = await app.executeQuery(app.db, queryTwoWeek, []);
  if (dbResTwoWeek[0]) console.log(dbResTwoWeek[0]);
}
