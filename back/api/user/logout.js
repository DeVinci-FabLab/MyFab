const sha256 = require("sha256");

/**
 * @swagger
 * /user/logout/:
 *   delete:
 *     summary: Logout user and delete the cookie saved
 *     tags: [User]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *        description: "The user is now logout"
 *       401:
 *        description: "Email or password is incorrect"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.deleteLogout = deleteLogout;
async function deleteLogout(data) {
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  delete data.app.cookiesList[data.dvflcookie];
  return {
    type: "code",
    code: 200,
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.delete("/api/user/logout/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      data.dvflcookie = req.headers.dvflcookie;
      const result = await deleteLogout(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: DELETE /api/user/logout/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
