const maxUser = 30;

/**
 * @swagger
 * tags:
 *   name: ag
 *   description: Everything about ag
 */

/**
 * @swagger
 * /ag/:
 *   get:
 *     summary: Get data for ag
 *     tags: [ag]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       "200":
 *         description: "Get all users data. Warning the returned users do not contain all the data"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/ShortUser'
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.getAg = getAg;
async function getAg(data) {
  const userIdAgent = data.userId;
  // unauthenticated user
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }

  return {
    type: "code",
    code: 200,
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  //Feature not available yet
  return;
  app.get("/api/ag/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(
        app,
        req,
        res
      );
      const result = await getAg(data);
      await require("../../functions/apiActions").sendResponse(
        req,
        res,
        result
      );
    } catch (error) {
      console.log("ERROR: GET /api/ag/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
