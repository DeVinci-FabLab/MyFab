const sha256 = require("sha256");
const sendMailFunction =
  require("../../functions/sendMail/register").sendRegisterMail;
const statsIncrement = require("../../functions/stats").increment;
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
  if (
    !data.body ||
    !data.body.firstName ||
    !data.body.lastName ||
    !data.body.email ||
    !data.body.password ||
    validateEmail(data.body.email) === null
  ) {
    return {
      type: "code",
      code: 400,
    };
  }
  const queryCheckIfEmailExist = `SELECT 1 FROM users
                                WHERE v_email = ?;`;
  const resTestIfAccountExist = await data.app.executeQuery(
    data.app.db,
    queryCheckIfEmailExist,
    [data.body.email]
  );
  // Error with the sql request
  /* c8 ignore start */
  if (resTestIfAccountExist[0]) {
    console.log(resTestIfAccountExist[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  if (resTestIfAccountExist[1].length !== 0) {
    return {
      type: "code",
      code: 401,
    };
  }

  const language = data.body.language ? data.body.language : "fr";
  const queryInsert = `INSERT INTO users (v_firstName, v_lastName, v_email, v_password, v_language)
                        VALUES (?, ?, ?, ?, ?);`;
  const resInsertNewAccount = await data.app.executeQuery(
    data.app.db,
    queryInsert,
    [
      data.body.firstName,
      data.body.lastName,
      data.body.email,
      sha256(data.body.password),
      language,
    ]
  );
  // Error with the sql request
  /* c8 ignore start */
  if (resInsertNewAccount[0] || resInsertNewAccount[1].affectedRows !== 1) {
    console.log(resInsertNewAccount[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  const queryLastInsert = `SELECT LAST_INSERT_ID() AS 'id';`;
  const resGetIdUserInserted = await data.app.executeQuery(
    data.app.db,
    queryLastInsert,
    []
  );
  // Error with the sql request
  /* c8 ignore start */
  if (
    resGetIdUserInserted[0] ||
    resGetIdUserInserted[1].length !== 1 ||
    resGetIdUserInserted[1][0].id === 0
  ) {
    console.log(resGetIdUserInserted[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  const idNewUser = resGetIdUserInserted[1][0].id;

  let token = null;
  while (token == null) {
    const testToken = makeid(10);
    const querySelectToken = `SELECT 1 FROM mailtocken
                                WHERE v_value = ?`;
    const resTestToken = await data.app.executeQuery(
      data.app.db,
      querySelectToken,
      [testToken]
    );
    /* c8 ignore start */
    if (resTestToken[0]) {
      console.log(resTestToken[0]);
      return {
        type: "code",
        code: 500,
      };
    }
    /* c8 ignore stop */
    if (resTestToken[1]) token = testToken;
  }

  const sendMail = data.body.sendMail == null ? true : data.body.sendMail;

  const queryInsertToken = `INSERT INTO mailtocken (i_idUser, v_value, b_mailSend)
                            VALUES (?, ?, ?);`;
  const resInsertToken = await data.app.executeQuery(
    data.app.db,
    queryInsertToken,
    [idNewUser, token, sendMail ? "1" : "0"]
  );

  await data.sendMailFunction({
    userMail: data.body.email,
    firstName: data.body.firstName,
    token,
  });
  statsIncrement(data.app.db, "mailSent");

  /* c8 ignore start */
  if (resInsertToken[0]) {
    console.log(resInsertToken[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  data.app.io.emit("event-reload-users"); // reload users menu on client

  return {
    type: "code",
    code: 200,
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.post("/api/user/register/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(
        app,
        req,
        res
      );
      data.sendMailFunction = sendMailFunction;
      const result = await postRegister(data);
      await require("../../functions/apiActions").sendResponse(
        req,
        res,
        result
      );
    } catch (error) {
      console.log("ERROR: POST /user/register/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
