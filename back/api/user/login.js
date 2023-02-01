const sha256 = require("sha256");

/**
 * @swagger
 * /user/login/:
 *   post:
 *     summary: Check data for login (email and password) and return the cookie
 *     tags: [User]
 *     requestBody:
 *       description: "Data to change log the user"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *       200:
 *         description: Test to detect if the server is responding correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dvflCookie:
 *                   type: string
 *               example:
 *                 dvflCookie: "cookieValue"
 *       204:
 *        description: "The user haven't confirmed their mail"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "Email or password is incorrect"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.postLogin = postLogin;
async function postLogin(data) {
  // The body does not have all the necessary field
  if (!data.body || !data.body.email || !data.body.password) {
    return {
      type: "code",
      code: 400,
    };
  }

  const querySelect = `SELECT i_id AS 'id',
                        b_mailValidated AS 'mailValidated'
                        FROM users
                        WHERE v_email = ?
                        AND v_password = ?
                        AND b_deleted = 0;`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [data.body.email, sha256(data.body.password)]);
  // Error with the sql request
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  // No match with tables => invalid email or password
  if (dbRes[1].length < 1) {
    return {
      type: "code",
      code: 401,
    };
  }
  // Too much match with tables
  /* c8 ignore start */
  if (dbRes[1].length > 1) {
    console.log("Login match with multiple users : " + data.body.email);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */

  const mailValidated = dbRes[1][0].mailValidated;
  if (mailValidated === 0) {
    return {
      type: "code",
      code: 204,
    };
  }
  const id = dbRes[1][0].id;
  const cookie = await require("../../functions/apiActions").saveNewCookie(data.app, {
    id,
    email: data.body.email,
    expireIn: data.body.expires ? new Date(data.body.expires).toISOString() : null,
  });

  return {
    type: "json",
    code: 200,
    json: {
      dvflCookie: cookie,
    },
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.post("/api/user/login/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await postLogin(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/user/login/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
