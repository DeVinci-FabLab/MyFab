/**
 * @swagger
 * /user/validateRules/:
 *   put:
 *     summary: Validate rules for the current user
 *     tags: [User]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: "The target user is not unknown"
 *       401:
 *        description: "The user making the request is not authorized"
 *       500:
 *        description: "Internal error with the request or unknown role or user"
 */

module.exports.putValidateRules = putValidateRules;
async function putValidateRules(data) {
  const userId = data.userId;
  if (!userId) {
    return {
      type: "code",
      code: 401,
    };
  }

  const queryUpdate = `UPDATE users 
                        SET dt_ruleSignature = CURRENT_TIMESTAMP()
                        WHERE i_id = ?
                        AND dt_ruleSignature IS NULL;`;
  const resUpdate = await data.app.executeQuery(data.app.db, queryUpdate, [userId]);
  // Error with the sql request
  /* c8 ignore start */
  if (resUpdate[0]) {
    console.log(resUpdate[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  if (resUpdate[1].affectedRows) {
    return {
      type: "code",
      code: 200,
    };
  } else {
    return {
      type: "code",
      code: 204,
    };
  }
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.put("/api/user/validateRules/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await putValidateRules(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/role/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
