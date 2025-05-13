const fs = require("fs");
const csvConverter = require("json-2-csv");

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

  // Get status from tickets (ALL TIME)
  result.ticketStatusAllTime = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
          s.name,
          s.color,
          COUNT(s.id) AS count
        FROM
        (SELECT
            p.i_status AS id,
            s.v_name AS name,
            p.dt_creationdate AS creationdate,
            s.v_color AS color
          FROM printstickets AS p
          INNER JOIN gd_status AS s ON p.i_status = s.i_id)
        AS s GROUP BY s.id;`
  );

  // Get status from tickets (BY years)
  result.ticketStatusByYears = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
          CONCAT(DATE_FORMAT(DATE_ADD(DATE_ADD(s.creationdate, INTERVAL -1 YEAR), INTERVAL 4 MONTH), '%Y'), '-', DATE_FORMAT(DATE_ADD(s.creationdate, INTERVAL 4 MONTH), '%Y')) AS 'year',
          s.name,
          s.color,
          COUNT(s.id) AS count
        FROM
        (SELECT
            p.i_status AS id,
            s.v_name AS name,
            p.dt_creationdate AS creationdate,
            s.v_color AS color
          FROM printstickets AS p
          INNER JOIN gd_status AS s ON p.i_status = s.i_id)
        AS s GROUP BY 1, s.id;`
  );

  // Get status from tickets (BY months)
  result.ticketStatusByMonths = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT 
          DATE_FORMAT(s.creationdate,'%Y-%m') AS 'month',
          CONCAT(DATE_FORMAT(DATE_ADD(DATE_ADD(s.creationdate, INTERVAL -1 YEAR), INTERVAL 4 MONTH), '%Y'), '-', DATE_FORMAT(DATE_ADD(s.creationdate, INTERVAL 4 MONTH), '%Y')) AS 'year',
          s.name,
          s.color,
          COUNT(s.id) AS count
        FROM
        (SELECT
            p.i_status AS id,
            s.v_name AS name,
            p.dt_creationdate AS creationdate,
            s.v_color AS color
          FROM printstickets AS p
          INNER JOIN gd_status AS s ON p.i_status = s.i_id)
        AS s GROUP BY 1, s.id;`
  );

  // Get status from tickets (BY weeks)
  result.ticketStatusByWeeks = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT 
          DATE_FORMAT(s.creationdate,'%Y-%u') AS 'week',
          DATE_FORMAT(s.creationdate,'%Y-%m') AS 'month',
          CONCAT(DATE_FORMAT(DATE_ADD(DATE_ADD(s.creationdate, INTERVAL -1 YEAR), INTERVAL 4 MONTH), '%Y'), '-', DATE_FORMAT(DATE_ADD(s.creationdate, INTERVAL 4 MONTH), '%Y')) AS 'year',
          s.name,
          s.color,
          COUNT(s.id) AS count
        FROM
        (SELECT
            p.i_status AS id,
            s.v_name AS name,
            p.dt_creationdate AS creationdate,
            s.v_color AS color
          FROM printstickets AS p
          INNER JOIN gd_status AS s ON p.i_status = s.i_id)
        AS s GROUP BY 1, s.id;`
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

/**
 * @swagger
 * /stats/prints/csv:
 *   get:
 *     summary: Export prints stats into csv
 *     tags: [GlobalData]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request. The user need to be the ticket owner or an agent.
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: "Export prints stats into csv"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports.getStatsPrintCsv = getStatsPrintCsv;
async function getStatsPrintCsv(data) {
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const authChangeRoleResult = await data.userAuthorization.validateUserAuth(
    data.app,
    userIdAgent,
    "changeUserRole"
  );
  if (!authChangeRoleResult) {
    return {
      type: "code",
      code: 401,
    };
  }

  const tmpFolder = __dirname + "/../tmp/";
  const fileName = `export_${makeid(20)}.csv`;

  const resData = await runQuerryStats(
    data.app.db,
    data.app.executeQuery,
    `SELECT
        p.i_id AS 'id',
        p.i_groupNumber AS 'groupNumber',
        p.dt_creationdate AS 'creationDate',
        stats.dt_enddate AS 'enddate',
        tpt.v_name AS projectType,
        s.v_name AS status
      FROM printstickets AS p
      INNER JOIN gd_ticketprojecttype AS tpt ON p.i_projecttype = tpt.i_id
      INNER JOIN gd_status AS s ON p.i_status = s.i_id
      INNER JOIN (${queryStatsTicket}) AS stats ON p.i_id = stats.i_id`
  );

  const formatDate = (date) => {
    if (!date) return date;
    const pad = (n) => String(n).padStart(2, "0");

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear(); // YY
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const resDataFormated = resData.map((item) => ({
    ...item,
    creationDate: formatDate(item.creationDate),
    enddate: formatDate(item.enddate),
  }));

  const csvData = csvConverter.json2csv(resDataFormated);
  fs.writeFileSync(tmpFolder + fileName, csvData);

  return {
    type: "download",
    code: 200,
    path: __dirname + "/../tmp/" + fileName,
    fileName: "myfab_export.csv",
  };
}

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

  app.get("/api/stats/prints/csv", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(
        app,
        req,
        res
      );
      const result = await getStatsPrintCsv(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/stats/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
