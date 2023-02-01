/**
 * @swagger
 * /clickonlogopaint:
 *   post:
 *     summary: Test to detect if the server is responding correctly
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *        description: "All good"
 *       401:
 *        description: "The user is unauthenticated"
 */

module.exports.clickOnLogoPaintPost = clickOnLogoPaintPost;
async function clickOnLogoPaintPost(data) {
  // unauthenticated user
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  //UPDATE `users` SET `dt_rickrolled` = CURRENT_TIMESTAMP WHERE `users`.`i_id` = 1;
  const queryUpdateRickRoll = `UPDATE users
                                SET dt_rickrolled = CURRENT_TIMESTAMP
                                WHERE i_id = ?
                                AND dt_rickrolled IS NULL;`;
  const resUpdateRickRoll = await data.app.executeQuery(data.app.db, queryUpdateRickRoll, [userIdAgent]);
  if (resUpdateRickRoll[0]) {
    console.log(resUpdateRickRoll[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  return {
    type: "code",
    code: 200,
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  app.post("/api/clickonlogopaint/", async function (req, res) {
    const data = await require("../../functions/apiActions").prepareData(app, req, res);
    try {
      const result = await clickOnLogoPaintPost(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/clickonlogopaint/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
