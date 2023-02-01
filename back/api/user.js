const maxUserDefault = 30;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: "integer"
 *           format: "int64"
 *           description: Id of the user
 *         firstName:
 *           type: "string"
 *           description: First name of the user
 *         lastName:
 *           type: "string"
 *           description: Last name of the user
 *         email:
 *           type: "string"
 *           description: Email of the user
 *         creationDate:
 *           type: "string"
 *           format: "date-time"
 *           description: "Date when the user was created"
 *         discordid:
 *           type: "string"
 *           description: "Discord id when the user was created, if seted"
 *         language:
 *           type: "string"
 *           description: "The language selected by the user. By default the language is 'fr'"
 *         title:
 *           type: "string"
 *           description: "The title of user. For example 'Etudiant A2'"
 *         acceptedRule:
 *           type: "boolean"
 *           description: "If the user has accepted the general conditions of use"
 *         mailValidated:
 *           type: "boolean"
 *           description: "If the user has validated his email address"
 *       example:
 *         id: 212
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@mailcom
 *         creationDate: 2021-12-16T09:31:38.000Z
 *         discordid: 012345678901
 *         language: fr
 *         acceptedRule: 1
 *         mailValidated: 1
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ShortUser:
 *       type: object
 *       properties:
 *         id:
 *           type: "integer"
 *           format: "int64"
 *           description: Id of the user
 *         firstName:
 *           type: "string"
 *           description: First name of the user
 *         lastName:
 *           type: "string"
 *           description: Last name of the user
 *         email:
 *           type: "string"
 *           description: Email of the user
 *       example:
 *         id: 212
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@mailcom
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Everything about users
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users data
 *     tags: [User]
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

function getOrderCollumnName(collumnName) {
  switch (collumnName) {
    case "firstname":
      return "v_firstName";
    case "lastname":
      return "v_lastName";
    case "email":
      return "v_email";
    case "title":
      return "v_title";
    default:
      return "i_id";
  }
}

module.exports.userGetAll = userGetAll;
async function userGetAll(data) {
  const userIdAgent = data.userId;
  // unauthenticated user
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const authViewResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "viewUsers");
  if (!authViewResult) {
    return {
      type: "code",
      code: 403,
    };
  }
  const maxUser = data.query && data.query.maxUser ? data.query.maxUser : maxUserDefault;
  const inputText = data.query && data.query.inputValue ? data.query.inputValue : "";
  const page = data.query && data.query.page ? data.query.page : 0;
  const orderCollumn = getOrderCollumnName(data.query && data.query.collumnName ? data.query.collumnName : "i_id");
  const order = data.query && data.query.order === "false" ? "DESC" : "ASC";
  const querySelect = `SELECT i_id AS id,
                v_firstName AS firstName,
                v_lastName AS lastName,
                v_email AS email,
                v_title AS "title",
                b_isMicrosoft AS "isMicrosoft"
                FROM users
                WHERE b_deleted = 0
                AND b_visible = 1
                AND (
                    "" = ?
                    OR i_id LIKE CONCAT("%", ?, "%")
                    OR v_firstName LIKE CONCAT("%", ?, "%")
                    OR v_lastName LIKE CONCAT("%", ?, "%")
                    OR v_email LIKE CONCAT("%", ?, "%")
                    )
                ORDER BY ${orderCollumn} ${order}
                ${data.query && data.query.all ? "" : "LIMIT ? OFFSET ?"};`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [inputText, inputText, inputText, inputText, inputText, maxUser, maxUser * page]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  const queryCount = `SELECT COUNT(1) AS count
                FROM users
                WHERE b_deleted = 0
                AND b_visible = 1
                AND (
                    "" = ?
                    OR i_id LIKE CONCAT("%", ?, "%")
                    OR v_firstName LIKE CONCAT("%", ?, "%")
                    OR v_lastName LIKE CONCAT("%", ?, "%")
                    OR v_email LIKE CONCAT("%", ?, "%")
                    );`;

  const dbResCount = await data.app.executeQuery(data.app.db, queryCount, [inputText, inputText, inputText, inputText, inputText, maxUser, maxUser * page]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  const calcUserByMaxUser = dbResCount[1][0].count / maxUser;
  const maxPage = Math.trunc(calcUserByMaxUser) === calcUserByMaxUser ? calcUserByMaxUser : Math.trunc(calcUserByMaxUser) + 1;

  return {
    type: "json",
    code: 200,
    json: { maxPage: data.query && data.query.all ? 1 : maxPage, values: dbRes[1] },
  };
}

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get data of the current user
 *     tags: [User]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Get one user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       204:
 *        description: "The request has no content"
 *       401:
 *        description: "The user is unauthenticated"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.userGetMe = userGetMe;
async function userGetMe(data) {
  const userIdAgent = data.userId;
  // unauthenticated user
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const querySelect = `SELECT i_id AS id,
                    v_firstName AS "firstName",
                    v_lastName AS "lastName",
                    v_email AS "email",
                    dt_creationdate AS "creationDate",
                    v_discordid AS "discordid",
                    v_language AS "language",
                    v_title AS "title",
                    b_isMicrosoft AS "isMicrosoft",
                    (SELECT CASE WHEN dt_ruleSignature IS NULL THEN FALSE ELSE TRUE END FROM users WHERE i_id = ?) AS "acceptedRule",
                    b_mailValidated AS "mailValidated"
                    FROM users
                    WHERE i_id = ?
                    AND b_deleted = 0`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [userIdAgent, userIdAgent]);
  // The sql request has an error
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  // The response has no value
  if (dbRes[1].length !== 1) {
    return {
      type: "code",
      code: 204,
    };
  }
  return {
    type: "json",
    code: 200,
    json: dbRes[1][0],
  };
}

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get one user data
 *     tags: [User]
 *     consumes:
 *     - "application/x-www-form-urlencoded"
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "id"
 *       in: "path"
 *       description: "Id of user"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       200:
 *         description: Get one user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       204:
 *        description: "The request has no content"
 *       400:
 *        description: "id is not valid"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.userGetById = userGetById;
async function userGetById(data) {
  const userIdAgent = data.userId;
  const idUserTarget = data.params.id;
  // Id is not a number
  if (isNaN(idUserTarget)) {
    return {
      type: "code",
      code: 400,
    };
  }
  // unauthenticated user
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const authViewResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "viewUsers");
  if (!authViewResult) {
    return {
      type: "code",
      code: 403,
    };
  }
  const querySelect = `SELECT i_id AS "id",
                    v_firstName AS "firstName",
                    v_lastName AS "lastName",
                    v_email AS "email",
                    dt_creationdate AS "creationDate",
                    v_discordid AS "discordid",
                    v_language AS "language",
                    v_title AS "title",
                    b_isMicrosoft AS "isMicrosoft",
                    (SELECT CASE WHEN dt_ruleSignature IS NULL THEN FALSE ELSE TRUE END FROM users WHERE i_id = ?) AS "acceptedRule",
                    b_mailValidated AS "mailValidated"
                    FROM users
                    WHERE i_id = ?
                    AND b_deleted = 0`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [idUserTarget, idUserTarget]);
  // The sql request has an error
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  // The response has no value
  if (dbRes[1].length !== 1) {
    return {
      type: "code",
      code: 204,
    };
  }
  return {
    type: "json",
    code: 200,
    json: dbRes[1][0],
  };
}

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete one user
 *     tags: [User]
 *     consumes:
 *     - "application/x-www-form-urlencoded"
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "id"
 *       in: "path"
 *       description: "Id of user"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       200:
 *        description: "Suppression succed"
 *       204:
 *        description: "No user deleted"
 *       400:
 *        description: "id is not valid"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.userDeleteById = userDeleteById;
async function userDeleteById(data) {
  const userIdAgent = data.userId;
  const idUserTarget = data.params ? data.params.id : undefined;
  // if the user is not allowed
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const authViewResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "viewUsers");
  if (!authViewResult) {
    return {
      type: "code",
      code: 403,
    };
  }
  const authManageUserResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "manageUser");
  if (!authManageUserResult) {
    return {
      type: "code",
      code: 403,
    };
  }
  // Id is not a number or user try to delete himself
  if (isNaN(idUserTarget) || idUserTarget == userIdAgent) {
    return {
      type: "code",
      code: 400,
    };
  }
  const queryUpdate = `UPDATE users
                         SET b_deleted = "1",
                         dt_creationdate = CURRENT_TIMESTAMP
                         WHERE i_id = ?;`;
  const dbRes = await data.app.executeQuery(data.app.db, queryUpdate, [idUserTarget]);
  // The sql request has an error
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  // The response has no value
  if (dbRes[1].changedRows !== 1) {
    return {
      type: "code",
      code: 204,
    };
  }
  data.app.io.emit("event-reload-users"); // reload users menu on client
  data.app.io.to(`user-${idUserTarget}`).emit("reload-user");
  return {
    type: "code",
    code: 200,
  };
}

module.exports.userRenamePut = userRenamePut;
async function userRenamePut(data) {
  const idUserTarget = data.params ? data.params.id : undefined;
  const resCheckCode = await data.userAuthorization.checkSpecialCode(data.specialcode);
  // Id is not a number
  if (isNaN(idUserTarget) || !resCheckCode || !data.body) {
    return {
      type: "code",
      code: 404,
    };
  }
  if (data.body.firstName) {
    const queryUpdate = `UPDATE users SET v_firstName = ? WHERE i_id = ?;`;
    const dbRes = await data.app.executeQuery(data.app.db, queryUpdate, [data.body.firstName, idUserTarget]);
    // The sql request has an error
    /* c8 ignore start */
    if (dbRes[0]) {
      console.log(dbRes[0]);
      return {
        type: "code",
        code: 500,
      };
    }
    /* c8 ignore stop */
  }
  if (data.body.lastName) {
    const queryUpdate = `UPDATE users SET v_lastName = ? WHERE i_id = ?;`;
    const dbRes = await data.app.executeQuery(data.app.db, queryUpdate, [data.body.lastName, idUserTarget]);
    // The sql request has an error
    /* c8 ignore start */
    if (dbRes[0]) {
      console.log(dbRes[0]);
      return {
        type: "code",
        code: 500,
      };
    }
    /* c8 ignore stop */
  }
  if (data.body.title) {
    const queryUpdate = `UPDATE users SET v_title = ? WHERE i_id = ?;`;
    const dbRes = await data.app.executeQuery(data.app.db, queryUpdate, [data.body.title, idUserTarget]);
    // The sql request has an error
    /* c8 ignore start */
    if (dbRes[0]) {
      console.log(dbRes[0]);
      return {
        type: "code",
        code: 500,
      };
    }
    /* c8 ignore stop */
  }
  data.app.io.emit("event-reload-users"); // reload users menu on client
  data.app.io.to(`user-${idUserTarget}`).emit("reload-user");

  return {
    type: "code",
    code: 200,
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/user/", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await userGetAll(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/user/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.get("/api/user/me", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await userGetMe(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/user/me");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.get("/api/user/:id", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await userGetById(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/user/:id");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.delete("/api/user/:id", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await userDeleteById(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: DELETE /api/user/:id");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put("/api/user/rename/:id", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await userRenamePut(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: PUT /api/user/rename/:id");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
