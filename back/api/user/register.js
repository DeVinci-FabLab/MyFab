const sha256 = require("sha256");
const config = require("../../config.json");
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

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
 * /user/register/:
 *   post:
 *     summary: Post all data for account creation (firstName, lastName, email and password) and send an email to validate the account
 *     tags: [User]
 *     requestBody:
 *       description: "Post all data for account creation (firstName, lastName, email and password) and send an email to validate the account"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *       200:
 *         description: Account created successfully and an email was sent
 *       400:
 *        description: "The body does not have all the necessary field or email not valid"
 *       401:
 *        description: "L'adresse email est déjà utilisé"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.postRegister = postRegister;
async function postRegister(data) {
  // The body does not have all the necessary field
  if (!data.body || !data.body.firstName || !data.body.lastName || !data.body.email || !data.body.password || validateEmail(data.body.email) === null) {
    return {
      type: "code",
      code: 400,
    };
  }
  const queryCheckIfEmailExist = `SELECT 1 FROM users
                                WHERE v_email = ?;`;
  const resTestIfAccountExist = await data.app.executeQuery(data.app.db, queryCheckIfEmailExist, [data.body.email]);
  // Error with the sql request
  if (resTestIfAccountExist[0]) {
    console.log(resTestIfAccountExist[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  if (resTestIfAccountExist[1].length !== 0) {
    return {
      type: "code",
      code: 401,
    };
  }

  const language = data.body.language ? data.body.language : "fr";
  const queryInsert = `INSERT INTO users (v_firstName, v_lastName, v_email, v_password, v_language)
                        VALUES (?, ?, ?, ?, ?);`;
  const resInsertNewAccount = await data.app.executeQuery(data.app.db, queryInsert, [
    data.body.firstName,
    data.body.lastName,
    data.body.email,
    sha256(data.body.password),
    language,
  ]);
  // Error with the sql request
  if (resInsertNewAccount[0] || resInsertNewAccount[1].affectedRows !== 1) {
    console.log(resInsertNewAccount[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  const queryLastInsert = `SELECT LAST_INSERT_ID() AS 'id';`;
  const resGetIdUserInserted = await data.app.executeQuery(data.app.db, queryLastInsert, []);
  // Error with the sql request
  if (resGetIdUserInserted[0] || resGetIdUserInserted[1].length !== 1 || resGetIdUserInserted[1][0].id === 0) {
    console.log(resGetIdUserInserted[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  const idNewUser = resGetIdUserInserted[1][0].id;

  let tocken = null;
  while (tocken == null) {
    const testTocken = makeid(10);
    const querySelectTocken = `SELECT 1 FROM mailtocken
                                WHERE v_value = ?`;
    const resTestTocken = await data.app.executeQuery(data.app.db, querySelectTocken, [testTocken]);
    if (resTestTocken[0]) {
      console.log(resTestTocken[0]);
      return {
        type: "code",
        code: 500,
      };
    }
    if (resTestTocken[1]) tocken = testTocken;
  }

  const sendMail = data.body.sendMail == null ? true : data.body.sendMail;

  const queryInsertTocken = `INSERT INTO mailtocken (i_idUser, v_value, b_mailSend)
                            VALUES (?, ?, ?);`;
  const resInsertTocken = await data.app.executeQuery(data.app.db, queryInsertTocken, [idNewUser, tocken, sendMail ? "1" : "0"]);
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
      data.body.email,
      "[MyFab] Validation de mail",
      "Bonjour,\nPour valider votre mail merci de cliquer sur ce lien\n" + config.siteRoot + "auth/verify/" + tocken
    );
  }
  data.app.io.emit("event-reload-users"); // reload users menu on client

  return {
    type: "code",
    code: 200,
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  app.post("/api/user/register/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      data.sendMailFunction = require("../../functions/sendMail");
      const result = await postRegister(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /user/register/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
