/**
 * @swagger
 * /user/authorization/:
 *   get:
 *     summary: Return an object with the authorizations
 *     tags: [Role]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Account created successfully and an email was sent
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "User unknown"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.getAuth = getAuth;
async function getAuth(data) {
  const userIdAgent = data.userId;
  // unauthenticated user
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const result = await data.userAuthorization.getUserAuth(data.app, userIdAgent);
  return {
    type: "json",
    code: 200,
    json: result,
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/user/authorization/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await getAuth(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/user/authorization/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
