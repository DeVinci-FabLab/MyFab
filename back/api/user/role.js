/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: "integer"
 *           format: "int64"
 *           description: Id of the role
 *         name:
 *           type: "string"
 *           description: Name of the role
 *         description:
 *           type: "string"
 *           description: Description of the role
 *         color:
 *           type: "string"
 *           description: Color of the role
 *       example:
 *         id: 212
 *         name: Agent
 *         description: Agent qui permet de voir et de réaliser les tickets de MyFab
 *         color: F7FA31
 */

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Everything about roles and permissions
 */

/**
 * @swagger
 * /role/:
 *   get:
 *     summary: Get all existing roles
 *     tags: [Role]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: "The role list is send"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user making the request is not authorized"
 *       500:
 *        description: "Internal error with the request or unknown role or user"
 */

module.exports.getRoles = getRoles;
async function getRoles(data) {
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }

  const querySelect = `SELECT
                         i_id AS 'id',
                         v_name AS 'name',
                         v_description AS 'description',
                         v_color AS 'color',
                         b_isProtected AS 'isProtected'
                         FROM gd_roles
                         ORDER BY i_id ASC`;
  const resTestIfCorrelationExist = await data.app.executeQuery(data.app.db, querySelect, []);
  // Error with the sql request
  if (resTestIfCorrelationExist[0]) {
    console.log(resTestIfCorrelationExist[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  return {
    type: "json",
    code: 200,
    json: resTestIfCorrelationExist[1],
  };
}

/**
 * @swagger
 * /user/{idUser}/role/:
 *   get:
 *     summary: See all role for a user
 *     tags: [Role]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "idUser"
 *       in: "path"
 *       description: "Id of user"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       200:
 *         description: "The role list is send"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       204:
 *         description: "The target user is not unknown"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user making the request is not authorized"
 *       403:
 *        description: "This correlation already exist"
 *       500:
 *        description: "Internal error with the request or unknown role or user"
 */

module.exports.getRolesForUserById = getRolesForUserById;
async function getRolesForUserById(data) {
  // The body does not have all the necessary field
  if (!data.params || !data.params.idUser || isNaN(data.params.idUser)) {
    return {
      type: "code",
      code: 400,
    };
  }
  const userId = data.params.idUser;

  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const authResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "viewUsers");
  if (!authResult) {
    return {
      type: "code",
      code: 401,
    };
  }

  const querySelect = `SELECT
                         gd_roles.i_id AS 'id',
                         gd_roles.v_name AS 'name',
                         gd_roles.v_description AS 'description',
                         gd_roles.v_color AS 'color',
                         b_isProtected AS 'isProtected'
                         FROM rolescorrelation
                         INNER JOIN gd_roles
                         ON rolescorrelation.i_idRole = gd_roles.i_id
                         WHERE rolescorrelation.i_idUser = ?
                         ORDER BY gd_roles.i_id ASC`;
  const resTestIfCorrelationExist = await data.app.executeQuery(data.app.db, querySelect, [userId]);
  // Error with the sql request
  if (resTestIfCorrelationExist[0]) {
    console.log(resTestIfCorrelationExist[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  return {
    type: "json",
    code: 200,
    json: resTestIfCorrelationExist[1],
  };
}

/**
 * @swagger
 * /user/role/:
 *   get:
 *     summary: See all role for actual user
 *     tags: [Role]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: "The role list is send"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       204:
 *         description: "The target user is not unknown"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user making the request is not authorized"
 *       403:
 *        description: "This correlation already exist"
 *       500:
 *        description: "Internal error with the request or unknown role or user"
 */

module.exports.getRolesForActualUser = getRolesForActualUser;
async function getRolesForActualUser(data) {
  const userId = data.userId;
  if (!userId) {
    return {
      type: "code",
      code: 401,
    };
  }

  const querySelect = `SELECT
                         gd_roles.i_id AS 'id',
                         gd_roles.v_name AS 'name',
                         gd_roles.v_description AS 'description',
                         gd_roles.v_color AS 'color',
                         b_isProtected AS 'isProtected'
                         FROM rolescorrelation
                         INNER JOIN gd_roles ON rolescorrelation.i_idRole = gd_roles.i_id
                         WHERE rolescorrelation.i_idUser = ?
                         ORDER BY gd_roles.i_id ASC`;
  const resTestIfCorrelationExist = await data.app.executeQuery(data.app.db, querySelect, [userId]);
  // Error with the sql request
  if (resTestIfCorrelationExist[0]) {
    console.log(resTestIfCorrelationExist[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  return {
    type: "json",
    code: 200,
    json: resTestIfCorrelationExist[1],
  };
}

/**
 * @swagger
 * /user/{idUser}/role/{idRole}:
 *   post:
 *     summary: Add a role to a user
 *     tags: [Role]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "idUser"
 *       in: "path"
 *       description: "Id of user"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     - name: "idRole"
 *       in: "path"
 *       description: "Id of role"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       200:
 *         description: "Role added successfully to the user"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user is not authorized"
 *       409:
 *        description: "This correlation already exist"
 *       500:
 *        description: "Internal error with the request or unknown role or user"
 */

module.exports.postAddRoleForUser = postAddRoleForUser;
async function postAddRoleForUser(data) {
  // The body does not have all the necessary field
  if (!data.params || !data.params.idUser || !data.params.idRole || isNaN(data.params.idUser) || isNaN(data.params.idRole)) {
    return {
      type: "code",
      code: 400,
    };
  }

  const userIdAgent = data.userId;
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
      code: 401,
    };
  }
  const authChangeRoleResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "changeUserRole");
  if (!authChangeRoleResult) {
    return {
      type: "code",
      code: 401,
    };
  }

  const userId = data.params.idUser;
  const roleId = data.params.idRole;
  if (userId == userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }

  const querySelectIfExist = `SELECT 1
                         FROM rolescorrelation
                         WHERE i_idUser = ?
                         AND i_idRole = ?;`;
  const resTestIfCorrelationExist = await data.app.executeQuery(data.app.db, querySelectIfExist, [userId, roleId]);
  // Error with the sql request
  if (resTestIfCorrelationExist[0]) {
    console.log(resTestIfCorrelationExist[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  if (resTestIfCorrelationExist[1].length !== 0) {
    return {
      type: "code",
      code: 409,
    };
  }

  const queryIfProtected = `SELECT
                             b_isProtected AS 'isProtected'
                             FROM gd_roles
                             WHERE i_id = ? ;`;
  const resIsProtected = await data.app.executeQuery(data.app.db, queryIfProtected, [roleId]);
  // Error with the sql request
  if (resIsProtected[0]) {
    console.log(resIsProtected[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  if (resIsProtected[1].length !== 1) {
    return {
      type: "code",
      code: 401,
    };
  }
  if (resIsProtected[1][0].isProtected) {
    const authChangeProtectedRoleResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "changeUserProtectedRole");
    if (!authChangeProtectedRoleResult) {
      return {
        type: "code",
        code: 401,
      };
    }
  }

  const queryInsertCorrelation = `INSERT INTO rolescorrelation (i_idUser, i_idRole)
                                     VALUES (?, ?);`;
  const resInsertNewRoleCorrelation = await data.app.executeQuery(data.app.db, queryInsertCorrelation, [userId, roleId]);
  // Error with the sql request
  if (resInsertNewRoleCorrelation[0] || resInsertNewRoleCorrelation[1].affectedRows !== 1) {
    console.log(resInsertNewRoleCorrelation[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  const queryInsertLog = `INSERT INTO log_roleschange (i_idUserAdmin, i_idUserTarget, v_actionType, i_idRole)
                             VALUES (?, ?, 'ADD', ?);`;
  const resInsertNewLog = await data.app.executeQuery(data.app.db, queryInsertLog, [userIdAgent, userId, roleId]);
  // Error with the sql request
  if (resInsertNewLog[0] || resInsertNewLog[1].affectedRows !== 1) {
    console.log(resInsertNewLog[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  data.app.io.to(`user-${userId}`).emit("reload-user");

  return {
    type: "code",
    code: 200,
  };
}

/**
 * @swagger
 * /user/{idUser}/role/{idRole}:
 *   delete:
 *     summary: Delete a role to a user
 *     tags: [Role]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "idUser"
 *       in: "path"
 *       description: "Id of user"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     - name: "idRole"
 *       in: "path"
 *       description: "Id of role"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       200:
 *         description: "Role deleted successfully to the user"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "This correlation already exist"
 *       409:
 *        description: "The user hasn't this role"
 *       500:
 *        description: "Internal error with the request or unknown role or user"
 */

module.exports.deleteRemoveRoleForUser = deleteRemoveRoleForUser;
async function deleteRemoveRoleForUser(data) {
  // The body does not have all the necessary field
  if (!data.params || !data.params.idUser || !data.params.idRole || isNaN(data.params.idUser) || isNaN(data.params.idRole)) {
    return {
      type: "code",
      code: 400,
    };
  }

  const userIdAgent = data.userId;
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
      code: 401,
    };
  }
  const authChangeRoleResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "manageUser");
  if (!authChangeRoleResult) {
    return {
      type: "code",
      code: 401,
    };
  }

  const userId = data.params.idUser;
  const roleId = data.params.idRole;
  if (userId == userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }

  const querySelectIfCorrelation = `SELECT i_id AS 'id'
                                     FROM rolescorrelation
                                     WHERE i_idUser = ?
                                     AND i_idRole = ?`;
  const resTestIfCorrelationExist = await data.app.executeQuery(data.app.db, querySelectIfCorrelation, [userId, roleId]);
  // Error with the sql request
  if (resTestIfCorrelationExist[0]) {
    console.log(resTestIfCorrelationExist[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  if (resTestIfCorrelationExist[1].length === 0) {
    return {
      type: "code",
      code: 409,
    };
  }

  const querySelectIfProtected = `SELECT b_isProtected AS 'isProtected'
                                     FROM gd_roles
                                     WHERE i_id = ?`;
  const resIsProtected = await data.app.executeQuery(data.app.db, querySelectIfProtected, [roleId]);
  // Error with the sql request
  if (resIsProtected[0]) {
    console.log(resIsProtected[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  if (resIsProtected[1].length !== 1) {
    return {
      type: "code",
      code: 401,
    };
  }

  if (resIsProtected[1][0].isProtected) {
    const authChangeProtectedRoleResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "changeUserProtectedRole");
    if (!authChangeProtectedRoleResult) {
      return {
        type: "code",
        code: 401,
      };
    }
  }

  const queryDelete = `DELETE FROM rolescorrelation
                         WHERE i_id = ?`;
  const resInsertNewRoleCorrelation = await data.app.executeQuery(data.app.db, queryDelete, [resTestIfCorrelationExist[1][0].id]);
  // Error with the sql request
  if (resInsertNewRoleCorrelation[0] || resInsertNewRoleCorrelation[1].affectedRows !== 1) {
    console.log(resInsertNewRoleCorrelation[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  const queryInsert = `INSERT INTO log_roleschange (i_idUserAdmin, i_idUserTarget, v_actionType, i_idRole)
                         VALUES (?, ?, 'DEL', ?);`;
  const resInsertNewLog = await data.app.executeQuery(data.app.db, queryInsert, [userIdAgent, userId, roleId]);
  // Error with the sql request
  if (resInsertNewLog[0] || resInsertNewLog[1].affectedRows !== 1) {
    console.log(resInsertNewLog[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  data.app.io.to(`user-${userId}`).emit("reload-user");

  return {
    type: "code",
    code: 200,
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/role/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await getRoles(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/role/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.get("/api/user/:idUser/role/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await getRolesForUserById(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/user/:idUser/role/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.get("/api/user/role/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await getRolesForActualUser(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/user/role/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.post("/api/user/:idUser/role/:idRole/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await postAddRoleForUser(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/user/:idUser/role/:idRole/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.delete("/api/user/:idUser/role/:idRole/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await deleteRemoveRoleForUser(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: DELETE /api/user/:idUser/role/:idRole/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
