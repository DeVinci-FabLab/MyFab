/**
 * @swagger
 * /user/mailValidation/{tocken}:
 *   put:
 *     summary: Valid the user account link with the account
 *     tags: [User]
 *     parameters:
 *     - name: "tocken"
 *       in: "path"
 *       description: "Tocken to validate user email"
 *       required: true
 *       type: "string"
 *     responses:
 *       200:
 *         description: "Account validate successfully"
 *       400:
 *        description: "The body does not have all the necessary field or email not valid"
 *       401:
 *        description: "Invalid code"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.putMailValidation = putMailValidation;
async function putMailValidation(data) {
  // The body does not have all the necessary field
  const token = data.params ? data.params.tocken : null;
  if (!token) {
    return {
      type: "code",
      code: 400,
    };
  }
  const querySelect = `SELECT i_idUser AS userId
                    FROM mailtocken
                    WHERE v_value = ?`;
  const resGetUserId = await data.app.executeQuery(data.app.db, querySelect, [token]);
  // Error with the sql request
  if (resGetUserId[0]) {
    console.log(resGetUserId[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  if (resGetUserId[1].length !== 1 || !resGetUserId[1][0].userId) {
    return {
      type: "code",
      code: 401,
    };
  }

  const userId = resGetUserId[1][0].userId;

  const queryDelete = `DELETE FROM mailtocken
                    WHERE v_value = ?`;
  const resDeleteEmailTocken = await data.app.executeQuery(data.app.db, queryDelete, [token]);
  // Error with the sql request
  if (resDeleteEmailTocken[0]) {
    console.log(resDeleteEmailTocken[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  const queryUpdate = `UPDATE users
                        SET b_mailValidated = '1'
                        WHERE i_id = ?`;
  const resValidUser = await data.app.executeQuery(data.app.db, queryUpdate, [userId]);

  // Error with the sql request
  if (resValidUser[0] || resValidUser[1].affectedRows !== 1) {
    console.log("Error : update user for email validation");
    console.log(resValidUser[0]);
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
  app.put("/api/user/mailValidation/:tocken", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await putMailValidation(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: PUT /user/mailValidation/:tocken");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
