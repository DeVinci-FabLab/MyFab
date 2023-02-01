const sha256 = require("sha256");
const config = require("../../config.json");

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * @swagger
 * /user/password/:
 *   put:
 *     summary: Change the user's password with the associated cookie
 *     tags: [User]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     requestBody:
 *       description: "Data to change password"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              actualPassword:
 *                type: string
 *              newPassword:
 *                type: string
 *     responses:
 *       200:
 *        description: "Password updated successfully"
 *       204:
 *        description: "User not found"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user is unauthenticated"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.putPasswordMe = putPasswordMe;
async function putPasswordMe(data) {
  // The body does not have all the necessary field
  if (!data.body || !data.body.actualPassword || !data.body.newPassword) {
    return {
      type: "code",
      code: 400,
    };
  }

  // unauthenticated user
  const userTarget = data.userId;
  if (!userTarget) {
    return {
      type: "code",
      code: 401,
    };
  }

  const queryUpdate = `UPDATE users
                        SET v_password = ?
                        WHERE i_id = ?
                        AND v_password = ?;`;
  const dbRes = await data.app.executeQuery(data.app.db, queryUpdate, [sha256(data.body.newPassword), userTarget, sha256(data.body.actualPassword)]);
  // Error with the sql request
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  // No match with tables => invalid password
  if (dbRes[1].affectedRows < 1) {
    return {
      type: "code",
      code: 204,
    };
  }
  // Too much match with tables
  if (dbRes[1].affectedRows > 1) {
    console.log("update one user affect multiple users");
    return {
      type: "code",
      code: 500,
    };
  }
  // Everything is fine
  return {
    type: "code",
    code: 200,
  };
}

/**
 * @swagger
 * /user/password/{id}:
 *   put:
 *     summary: Update selected user password
 *     tags: [User]
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       description: "Id of user"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     requestBody:
 *       description: "Data to change password"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              newPassword:
 *                type: string
 *     responses:
 *       200:
 *        description: "Password updated successfully"
 *       204:
 *        description: "User not found"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.putPasswordUser = putPasswordUser;
async function putPasswordUser(data) {
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  // The body does not have all the necessary field or id is not a number
  if (!data.params || !data.params.id || isNaN(data.params.id) || !data.body || !data.body.newPassword) {
    return {
      type: "code",
      code: 400,
    };
  }
  const idUserTarget = data.params.id;
  // if the user is not allowed
  const authViewResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "viewUsers");
  if (!authViewResult) {
    return {
      type: "code",
      code: 403,
    };
  }
  const authManageUsersResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "manageUser");
  if (!authManageUsersResult) {
    return {
      type: "code",
      code: 403,
    };
  }
  const queryUpdate = `UPDATE users
                    SET v_password = ?
                    WHERE i_id = ?;`;
  const dbRes = await data.app.executeQuery(data.app.db, queryUpdate, [sha256(data.body.newPassword), idUserTarget]);
  // Error with the sql request
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  // No match with tables => invalid password
  if (dbRes[1].affectedRows < 1) {
    return {
      type: "code",
      code: 204,
    };
  }
  // Too much match with tables
  if (dbRes[1].affectedRows > 1) {
    console.log("Update one user affect multiple users");
    return {
      type: "code",
      code: 500,
    };
  }
  // Everything is fine
  return {
    type: "code",
    code: 200,
  };
}

/**
 * @swagger
 * /user/forgottenPassword/:
 *   post:
 *     summary: Send an email to reset password, if the request will be accepted if the email is valid and when it is incorrect
 *     tags: [User]
 *     requestBody:
 *       description: "Email of the user"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *     responses:
 *       200:
 *         description: "An email to reset the password has been sent"
 *       400:
 *        description: "Email not specified"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.postForgottenPassword = postForgottenPassword;
async function postForgottenPassword(data) {
  if (!data.body || !data.body.email) {
    return {
      type: "code",
      code: 400,
    };
  }
  const email = data.body.email;

  const querySelect = `SELECT i_id AS id
                        FROM users
                        WHERE v_email = ?
                        AND b_deleted = 0
                        AND b_visible = 1`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [email]);
  // The sql request has an error
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  // The response has no value
  if (dbRes[1].length !== 1) {
    return {
      type: "code",
      code: 200,
    };
  }
  const idNewUser = dbRes[1][0].id;
  const tocken = makeid(10);

  const sendMail = data.body.sendMail == null ? true : data.body.sendMail;
  const queryInsert = `INSERT INTO mailtocken (i_idUser, v_value, b_mailSend)
                        VALUES (?, ?, ?);`;
  const resInsertTocken = await data.app.executeQuery(data.app.db, queryInsert, [idNewUser, tocken, sendMail ? "1" : "0"]);
  if (resInsertTocken[0]) {
    console.log(resInsertTocken[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  //Send validation email to the user
  if (sendMail) {
    data.sendMailFunction.sendMail(
      email,
      "[MyFab] Réinitialisation du mot de passe",
      "Bonjour,\nPour changer de mot de mot de passe, merci de cliquer sur ce lien\n" + config.siteRoot + "auth/password/" + tocken
    );
  }

  return {
    type: "code",
    code: 200,
  };
}

/**
 * @swagger
 * /user/resetPassword/{tocken}:
 *   put:
 *     summary: Change the user's password with the associated tocken
 *     tags: [User]
 *     parameters:
 *     - name: "tocken"
 *       in: "path"
 *       description: "Tocken of user"
 *       required: true
 *       type: "string"
 *     requestBody:
 *       description: "Data to change password"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              newPassword:
 *                type: string
 *     responses:
 *       200:
 *        description: "The user password is updated"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user is unauthenticated"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.putResetPassword = putResetPassword;
async function putResetPassword(data) {
  // The body does not have all the necessary field
  if (!data.body || !data.body.newPassword || !data.params || !data.params.tocken) {
    return {
      type: "code",
      code: 400,
    };
  }

  const querySelect = `SELECT i_idUser AS 'id'
                        FROM mailtocken
                        WHERE v_value = ?`;
  const dbSelectId = await data.app.executeQuery(data.app.db, querySelect, [data.params.tocken]);
  if (dbSelectId[0]) {
    console.log(dbSelectId[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  if (dbSelectId[1].length != 1) {
    return {
      type: "code",
      code: 401,
    };
  }

  const idUser = dbSelectId[1][0].id;
  const queryUpdate = `UPDATE users
                        SET v_password = ?
                        WHERE i_id = ?;`;
  const dbRes = await data.app.executeQuery(data.app.db, queryUpdate, [sha256(data.body.newPassword), idUser]);
  // Error with the sql request
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  const queryDelete = `DELETE FROM mailtocken
                        WHERE v_value = ?`;
  const dbDelete = await data.app.executeQuery(data.app.db, queryDelete, [data.params.tocken]);
  if (dbDelete[0]) {
    console.log(dbDelete[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  // Everything is fine
  return {
    type: "code",
    code: 200,
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  app.put("/api/user/password/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await putPasswordMe(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: PUT /user/password/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put("/api/user/password/:id", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await putPasswordUser(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: PUT /user/password/:id");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.post("/api/user/forgottenPassword/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      data.sendMailFunction = require("../../functions/sendMail");
      const result = await postForgottenPassword(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/user/forgottenPassword/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put("/api/user/resetPassword/:tocken", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await putResetPassword(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: PUT /api/user/resetPassword/:tocken");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
