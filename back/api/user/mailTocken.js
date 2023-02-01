/**
 * @swagger
 * /user/mailtoken/:
 *   get:
 *     summary: Get all existing tocken for user
 *     tags: [User]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: "The list of token"
 *       404:
 *        description: "Error"
 */

module.exports.getMailtoken = getMailtoken;
async function getMailtoken(data) {
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }

  const authChangeRoleResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "manageUser");
  if (!authChangeRoleResult) {
    return {
      type: "code",
      code: 403,
    };
  }

  const querySelect = `SELECT
    users.v_email AS 'email', 
    mailtocken.v_value AS 'token' 
    FROM mailtocken 
    INNER JOIN users ON 
        mailtocken.i_idUser = users.i_id;`;
  const resToken = await data.app.executeQuery(data.app.db, querySelect, []);
  // Error with the sql request
  /* c8 ignore start */
  if (resToken[0]) {
    console.log(resToken[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */

  return {
    type: "json",
    code: 200,
    json: resToken[1],
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/user/mailtoken/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await getMailtoken(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /user/mailtoken/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
