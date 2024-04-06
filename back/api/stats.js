/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get stats from MyFab
 *     tags: [GlobalData]
 *     responses:
 *       200:
 *         description: Get stats from MyFab
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *               example:
 *                 result: wait
 */

async function runQuerryStats(db, executeQuery, query) {
  const dbRes = await executeQuery(db, query, []);
  if (dbRes[0]) console.log(dbRes[0]);
  return dbRes[1];
}

module.exports.getStats = getStats;
async function getStats(data) {
  const userIdAgent = data.userId;
  // unauthenticated user
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const authViewResult = await data.userAuthorization.validateUserAuth(
    data.app,
    userIdAgent,
    "viewUsers"
  );
  if (!authViewResult) {
    return {
      type: "code",
      code: 403,
    };
  }

  const result = {};

  // Get total users
  result.users = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT 
        COUNT(*) AS total_users,
        SUM(
          CASE WHEN b_darkMode = true 
              THEN 1 ELSE 0 END
        ) AS dark_mode_users 
      FROM users;`
  );

  // Get total users BY schools
  result.usersBySchools = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT 
        s.v_name,
        COUNT(DISTINCT u.i_id) AS 'count_user'
      FROM users AS u
      INNER JOIN gd_school AS s ON u.i_idschool = s.i_id
      GROUP BY u.i_idschool`
  );

  // Get total users BY schools AND years
  result.usersBySchoolsAndYears = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
        s.v_name,
        u.i_schoolyear,
        COUNT(DISTINCT u.i_id) AS 'count_user'
      FROM users AS u 
      INNER JOIN gd_school AS s ON u.i_idschool = s.i_id
      GROUP BY u.i_idschool, 2;`
  );

  // Get stats tickets, simple query :)
  const queryStatsTicket = `SELECT 
                                i_id,
                                i_idUser,
                                i_status,
                                count_file,
                                dt_creationdate,
                                dt_enddate,
                                TIMESTAMPDIFF(MINUTE, dt_creationdate, dt_enddate) AS diff
                              FROM (
                                SELECT
                                    i_id,
                                    i_idUser,
                                    i_status,
                                    CASE WHEN tf.count_file IS NOT NULL
                                      THEN tf.count_file
                                      ELSE 0 END AS count_file,
                                    dt_creationdate,
                                    CASE WHEN pt.i_status = 5 OR pt.i_status = 6
                                      THEN dtend.dt_enddate
                                      ELSE NOW() END AS dt_enddate
                                  FROM printstickets AS pt
                                  LEFT JOIN (
                                    SELECT
                                        i_idTicket,
                                        MAX(dt_timeStamp) AS dt_enddate
                                      FROM log_ticketschange
                                      WHERE v_action = 'upd_status'
                                      GROUP BY 1)
                                  AS dtend ON pt.i_id = dtend.i_idTicket
                                  LEFT JOIN (
                                    SELECT
                                        i_idTicket,
                                        COUNT(*) AS count_file
                                      FROM ticketfiles
                                      GROUP BY 1)
                                  AS tf ON pt.i_id = tf.i_idTicket
                                  WHERE pt.i_status != 7
                                  AND NOT pt.b_isDeleted) AS data`;

  // Get stats tickets (ALL TIME)
  result.ticketStatsAllTime = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
        FLOOR(AVG(diff)/60/24) AS diffday,
        FLOOR(AVG(diff)/60) - FLOOR(AVG(diff)/60/24)*24 AS diffhours,
        FLOOR(AVG(diff)) - FLOOR(AVG(diff)/60/24)*24*60 - (FLOOR(AVG(diff)/60) - FLOOR(AVG(diff)/60/24)*24)*60 AS diffminutes,
        FLOOR(MAX(diff)/60/24) AS maxdiffday,
        FLOOR(MAX(diff)/60) - FLOOR(MAX(diff)/60/24)*24 AS maxdiffhours,
        FLOOR(MAX(diff)) - FLOOR(MAX(diff)/60/24)*24*60 - (FLOOR(MAX(diff)/60) - FLOOR(MAX(diff)/60/24)*24)*60 AS maxdiffminutes,
        FLOOR(MIN(diff)/60/24) AS mindiffday,
        FLOOR(MIN(diff)/60) - FLOOR(MIN(diff)/60/24)*24 AS mindiffhours,
        FLOOR(MIN(diff)) - FLOOR(MIN(diff)/60/24)*24*60 - (FLOOR(MIN(diff)/60) - FLOOR(MIN(diff)/60/24)*24)*60 AS mindiffminutes,
        COUNT(DISTINCT i_id) AS 'count_ticket',
        COUNT(DISTINCT i_idUser) AS 'count_user',
        SUM(count_file) AS count_file
      FROM (${queryStatsTicket}) AS stats`
  );

  // Get stats tickets (BY years)
  result.ticketStatsByYears = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
        CONCAT(DATE_FORMAT(DATE_ADD(DATE_ADD(stats.dt_creationdate, INTERVAL -1 YEAR), INTERVAL 4 MONTH), '%Y'), '-', DATE_FORMAT(DATE_ADD(stats.dt_creationdate, INTERVAL 4 MONTH), '%Y')) AS 'year',
        FLOOR(AVG(diff)/60/24) AS diffday,
        FLOOR(AVG(diff)/60) - FLOOR(AVG(diff)/60/24)*24 AS diffhours,
        FLOOR(AVG(diff)) - FLOOR(AVG(diff)/60/24)*24*60 - (FLOOR(AVG(diff)/60) - FLOOR(AVG(diff)/60/24)*24)*60 AS diffminutes,
        FLOOR(MAX(diff)/60/24) AS maxdiffday,
        FLOOR(MAX(diff)/60) - FLOOR(MAX(diff)/60/24)*24 AS maxdiffhours,
        FLOOR(MAX(diff)) - FLOOR(MAX(diff)/60/24)*24*60 - (FLOOR(MAX(diff)/60) - FLOOR(MAX(diff)/60/24)*24)*60 AS maxdiffminutes,
        FLOOR(MIN(diff)/60/24) AS mindiffday,
        FLOOR(MIN(diff)/60) - FLOOR(MIN(diff)/60/24)*24 AS mindiffhours,
        FLOOR(MIN(diff)) - FLOOR(MIN(diff)/60/24)*24*60 - (FLOOR(MIN(diff)/60) - FLOOR(MIN(diff)/60/24)*24)*60 AS mindiffminutes,
        COUNT(DISTINCT i_id) AS 'count_ticket',
        COUNT(DISTINCT i_idUser) AS 'count_user',
        SUM(count_file) AS count_file
      FROM (${queryStatsTicket}) AS stats
      GROUP BY 1
      ORDER BY 1`
  );

  // Get stats tickets (BY months)
  result.ticketStatsByMonths = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
        DATE_FORMAT(stats.dt_creationdate,'%Y-%m') AS 'month',
        CONCAT(DATE_FORMAT(DATE_ADD(DATE_ADD(stats.dt_creationdate, INTERVAL -1 YEAR), INTERVAL 4 MONTH), '%Y'), '-', DATE_FORMAT(DATE_ADD(stats.dt_creationdate, INTERVAL 4 MONTH), '%Y')) AS 'year',
        FLOOR(AVG(diff)/60/24) AS diffday,
        FLOOR(AVG(diff)/60) - FLOOR(AVG(diff)/60/24)*24 AS diffhours,
        FLOOR(AVG(diff)) - FLOOR(AVG(diff)/60/24)*24*60 - (FLOOR(AVG(diff)/60) - FLOOR(AVG(diff)/60/24)*24)*60 AS diffminutes,
        FLOOR(MAX(diff)/60/24) AS maxdiffday,
        FLOOR(MAX(diff)/60) - FLOOR(MAX(diff)/60/24)*24 AS maxdiffhours,
        FLOOR(MAX(diff)) - FLOOR(MAX(diff)/60/24)*24*60 - (FLOOR(MAX(diff)/60) - FLOOR(MAX(diff)/60/24)*24)*60 AS maxdiffminutes,
        FLOOR(MIN(diff)/60/24) AS mindiffday,
        FLOOR(MIN(diff)/60) - FLOOR(MIN(diff)/60/24)*24 AS mindiffhours,
        FLOOR(MIN(diff)) - FLOOR(MIN(diff)/60/24)*24*60 - (FLOOR(MIN(diff)/60) - FLOOR(MIN(diff)/60/24)*24)*60 AS mindiffminutes,
        COUNT(DISTINCT i_id) AS 'count_ticket',
        COUNT(DISTINCT i_idUser) AS 'count_user',
        SUM(count_file) AS count_file
      FROM (${queryStatsTicket}) AS stats
      GROUP BY 1
      ORDER BY 1`
  );

  // Get stats tickets (BY weeks)
  result.ticketStatsByWeeks = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
        DATE_FORMAT(stats.dt_creationdate,'%u') AS 'week',
        DATE_FORMAT(stats.dt_creationdate,'%Y-%m') AS 'month',
        CONCAT(DATE_FORMAT(DATE_ADD(DATE_ADD(stats.dt_creationdate, INTERVAL -1 YEAR), INTERVAL 4 MONTH), '%Y'), '-', DATE_FORMAT(DATE_ADD(stats.dt_creationdate, INTERVAL 4 MONTH), '%Y')) AS 'year',
        FLOOR(AVG(diff)/60/24) AS diffday,
        FLOOR(AVG(diff)/60) - FLOOR(AVG(diff)/60/24)*24 AS diffhours,
        FLOOR(AVG(diff)) - FLOOR(AVG(diff)/60/24)*24*60 - (FLOOR(AVG(diff)/60) - FLOOR(AVG(diff)/60/24)*24)*60 AS diffminutes,
        FLOOR(MAX(diff)/60/24) AS maxdiffday,
        FLOOR(MAX(diff)/60) - FLOOR(MAX(diff)/60/24)*24 AS maxdiffhours,
        FLOOR(MAX(diff)) - FLOOR(MAX(diff)/60/24)*24*60 - (FLOOR(MAX(diff)/60) - FLOOR(MAX(diff)/60/24)*24)*60 AS maxdiffminutes,
        FLOOR(MIN(diff)/60/24) AS mindiffday,
        FLOOR(MIN(diff)/60) - FLOOR(MIN(diff)/60/24)*24 AS mindiffhours,
        FLOOR(MIN(diff)) - FLOOR(MIN(diff)/60/24)*24*60 - (FLOOR(MIN(diff)/60) - FLOOR(MIN(diff)/60/24)*24)*60 AS mindiffminutes,
        COUNT(DISTINCT i_id) AS 'count_ticket',
        COUNT(DISTINCT i_idUser) AS 'count_user',
        SUM(count_file) AS count_file
      FROM (${queryStatsTicket}) AS stats
      GROUP BY 1
      ORDER BY 2,1`
  );

  // Get stats tickets for SCHOOL (ALL TIME)
  result.ticketStatsForSchoolsAllTime = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
        s.v_name,
        COUNT(DISTINCT p.i_id) AS 'count_ticket',
        COUNT(DISTINCT i_idUser) AS 'count_user'
      FROM printstickets AS p
      INNER JOIN users AS u ON p.i_idUser = u.i_id
      INNER JOIN gd_school AS s ON u.i_idschool = s.i_id
      GROUP BY u.i_idschool;`
  );

  // Get stats tickets for SCHOOL (BY years)
  result.ticketStatsForSchoolsByYears = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
        CONCAT(DATE_FORMAT(DATE_ADD(DATE_ADD(p.dt_creationdate, INTERVAL -1 YEAR), INTERVAL 4 MONTH), '%Y'), '-', DATE_FORMAT(DATE_ADD(p.dt_creationdate, INTERVAL 4 MONTH), '%Y')) AS 'year',
        s.v_name,
        COUNT(DISTINCT p.i_id) AS 'count_ticket',
        COUNT(DISTINCT i_idUser) AS 'count_user'
      FROM printstickets AS p
      INNER JOIN users AS u ON p.i_idUser = u.i_id
      INNER JOIN gd_school AS s ON u.i_idschool = s.i_id
      GROUP BY 1, u.i_idschool;`
  );

  // Get stats tickets for SCHOOL (BY months)
  result.ticketStatsForSchoolsByMonths = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
        DATE_FORMAT(p.dt_creationdate,'%Y-%m') AS 'month',
        CONCAT(DATE_FORMAT(DATE_ADD(DATE_ADD(p.dt_creationdate, INTERVAL -1 YEAR), INTERVAL 4 MONTH), '%Y'), '-', DATE_FORMAT(DATE_ADD(p.dt_creationdate, INTERVAL 4 MONTH), '%Y')) AS 'year',
        s.v_name,
        COUNT(DISTINCT p.i_id) AS 'count_ticket',
        COUNT(DISTINCT i_idUser) AS 'count_user'
      FROM printstickets AS p
      INNER JOIN users AS u ON p.i_idUser = u.i_id
      INNER JOIN gd_school AS s ON u.i_idschool = s.i_id
      GROUP BY 1, u.i_idschool;`
  );

  // Get stats tickets for SCHOOL (BY weeks)
  result.ticketStatsForSchoolsByWeeks = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
        DATE_FORMAT(p.dt_creationdate,'%Y-%u') AS 'week',
        DATE_FORMAT(p.dt_creationdate,'%Y-%m') AS 'month',
        CONCAT(DATE_FORMAT(DATE_ADD(DATE_ADD(p.dt_creationdate, INTERVAL -1 YEAR), INTERVAL 4 MONTH), '%Y'), '-', DATE_FORMAT(DATE_ADD(p.dt_creationdate, INTERVAL 4 MONTH), '%Y')) AS 'year',
        s.v_name,
        COUNT(DISTINCT p.i_id) AS 'count_ticket',
        COUNT(DISTINCT i_idUser) AS 'count_user'
      FROM printstickets AS p
      INNER JOIN users AS u ON p.i_idUser = u.i_id
      INNER JOIN gd_school AS s ON u.i_idschool = s.i_id
      GROUP BY 1, u.i_idschool;`
  );

  return {
    type: "json",
    code: 200,
    json: result,
  };
}
// Moyenne de demande par école
// SELECT DATE_FORMAT(p.dt_creationdate,'%Y-%u') AS 'week', s.v_name, COUNT(DISTINCT p.i_id) AS 'count_ticket', COUNT(DISTINCT i_idUser) AS 'count_user' FROM printstickets AS p INNER JOIN users AS u ON p.i_idUser = u.i_id INNER JOIN gd_school AS s ON u.i_idschool = s.i_id GROUP BY 1, u.i_idschool;

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/stats/", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(
        app,
        req,
        res
      );
      const result = await getStats(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/stats/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
