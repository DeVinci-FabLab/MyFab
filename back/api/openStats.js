/**
 * @swagger
 * /stats/tickets/open:
 *   get:
 *     summary: Get count of open tickets
 *     tags: [GlobalData]
 *     responses:
 *       200:
 *         description: Get count of open tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *               example:
 *                 result: 5
 */

module.exports.getStats = getStats;
async function getStats(data) {
  const queryGetCount = `SELECT COUNT(*) AS 'count'
                            FROM printstickets AS pt
                            LEFT OUTER JOIN gd_status AS stat ON pt.i_status = stat.i_id
                            WHERE pt.b_isDeleted = 0
                            AND stat.b_isOpen = 1; `;
  const dbRes = await data.app.executeQuery(data.app.db, queryGetCount, []);

  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */

  return {
    type: "json",
    code: 200,
    json: dbRes[1][0],
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/stats/tickets/open", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(
        app,
        req,
        res
      );
      const result = await getStats(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /stats/tickets/open");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
