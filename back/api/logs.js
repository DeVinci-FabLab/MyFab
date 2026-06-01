const PAGE_SIZE = 30;

/**
 * @swagger
 * /logs/:
 *   get:
 *     summary: Get the unified activity log of the site (tickets, roles, users, connections). The user need to be a 'myFabAgent'.
 *     tags: [Logs]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       required: true
 *       type: string
 *     - name: page
 *       in: query
 *       required: false
 *       type: integer
 *     - name: category
 *       in: query
 *       required: false
 *       type: string
 *       description: "ticket | role | user | connection"
 *     responses:
 *       "200":
 *         description: "Paginated unified log feed"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.getLogs = getLogs;
async function getLogs(data) {
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return { type: "code", code: 401 };
  }
  const authResult = await data.userAuthorization.validateUserAuth(
    data.app,
    userIdAgent,
    "myFabAgent",
  );
  if (!authResult) {
    return { type: "code", code: 403 };
  }

  if (data.query === undefined) data.query = {};
  let page =
    data.query.page && !isNaN(data.query.page) ? parseInt(data.query.page) : 0;
  if (page < 0) page = 0;

  const subQueries = {
    ticket: `SELECT lt.dt_timeStamp AS dt, 'ticket' AS category,
              lt.i_idUser AS actorId,
              CONCAT(ua.v_firstName, ' ', LEFT(ua.v_lastName, 1), '.') AS actorName,
              lt.v_action AS action, 'ticket' AS targetType, lt.i_idTicket AS targetId,
              lt.v_newValue AS detail
            FROM log_ticketschange AS lt
            LEFT JOIN users AS ua ON lt.i_idUser = ua.i_id`,
    role: `SELECT lr.dt_changeDate AS dt, 'role' AS category,
              lr.i_idUserAdmin AS actorId,
              CONCAT(ua.v_firstName, ' ', LEFT(ua.v_lastName, 1), '.') AS actorName,
              CASE WHEN lr.v_actionType = 'add' THEN 'add_role' ELSE 'del_role' END AS action,
              'user' AS targetType, lr.i_idUserTarget AS targetId,
              gr.v_name AS detail
            FROM log_roleschange AS lr
            LEFT JOIN users AS ua ON lr.i_idUserAdmin = ua.i_id
            LEFT JOIN gd_roles AS gr ON lr.i_idRole = gr.i_id`,
    user: `SELECT lu.dt_timeStamp AS dt, 'user' AS category,
              lu.i_idUserAdmin AS actorId,
              CONCAT(ua.v_firstName, ' ', LEFT(ua.v_lastName, 1), '.') AS actorName,
              lu.v_action AS action, 'user' AS targetType, lu.i_idUserTarget AS targetId,
              lu.v_newValue AS detail
            FROM log_userschange AS lu
            LEFT JOIN users AS ua ON lu.i_idUserAdmin = ua.i_id`,
    connection: `SELECT lc.dt_creationDate AS dt, 'connection' AS category,
              lc.i_idUser AS actorId,
              CONCAT(ua.v_firstName, ' ', LEFT(ua.v_lastName, 1), '.') AS actorName,
              'login' AS action, NULL AS targetType, NULL AS targetId,
              lc.v_browser AS detail
            FROM log_connection AS lc
            LEFT JOIN users AS ua ON lc.i_idUser = ua.i_id`,
  };

  const countQueries = {
    ticket: "SELECT COUNT(*) AS c FROM log_ticketschange",
    role: "SELECT COUNT(*) AS c FROM log_roleschange",
    user: "SELECT COUNT(*) AS c FROM log_userschange",
    connection: "SELECT COUNT(*) AS c FROM log_connection",
  };

  const category =
    data.query.category && subQueries[data.query.category]
      ? data.query.category
      : null;
  const selectedKeys = category ? [category] : Object.keys(subQueries);

  const union = selectedKeys.map((k) => subQueries[k]).join("\nUNION ALL\n");
  const query = `SELECT * FROM (${union}) AS logs ORDER BY dt DESC LIMIT ? OFFSET ?;`;
  const dbRes = await data.app.executeQuery(data.app.db, query, [
    PAGE_SIZE,
    PAGE_SIZE * page,
  ]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */

  const countUnion = selectedKeys
    .map((k) => countQueries[k])
    .join("\nUNION ALL\n");
  const countQuery = `SELECT SUM(c) AS total FROM (${countUnion}) AS counts;`;
  const dbCount = await data.app.executeQuery(data.app.db, countQuery, []);
  /* c8 ignore start */
  if (dbCount[0]) {
    console.log(dbCount[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */
  const total = Number(dbCount[1][0].total) || 0;
  const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    type: "json",
    code: 200,
    json: { maxPage, total, values: dbRes[1] },
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/logs", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(
        app,
        req,
        res,
      );
      const result = await getLogs(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/logs");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
