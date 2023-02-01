/**
 * @swagger
 * components:
 *   schemas:
 *     TicketMessage:
 *       type: object
 *       properties:
 *         userName:
 *           type: "string"
 *           description: Name of the user
 *         content:
 *           type: "string"
 *           description: Content of the message
 *         creationDate:
 *           type: "string"
 *           format: "date-time"
 *           description: Date when the user post the message
 *       example:
 *         userName: John D.
 *         content: Hello world
 *         creationDate: 2021-12-16T09:31:38.000Z
 */

/**
 * @swagger
 * /ticket/{id}/message:
 *   get:
 *     summary: Get all messages from a ticket. The user need to be a 'myFabAgent' or the ticket owner
 *     tags: [Ticket]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "id"
 *       in: "path"
 *       description: "Id of the ticket"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       "200":
 *         description: "Get all messages from a ticket"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/TicketMessage'
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.getTicketMessage = getTicketMessage;
async function getTicketMessage(data) {
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  // The body does not have all the necessary field
  if (!data.params || !data.params.id || isNaN(data.params.id)) {
    return {
      type: "code",
      code: 400,
    };
  }
  const querySelectTicket = `SELECT i_idUser AS 'id'
                        FROM printstickets
                        WHERE i_id = ?`;
  const resGetUserTicket = await data.app.executeQuery(data.app.db, querySelectTicket, [data.params.id]);
  if (resGetUserTicket[0] || resGetUserTicket[1].length !== 1) {
    console.log(resGetUserTicket[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  const idTicketUser = resGetUserTicket[1][0].id;
  if (idTicketUser != userIdAgent) {
    const authViewResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "myFabAgent");
    if (!authViewResult) {
      return {
        type: "code",
        code: 403,
      };
    }
  }
  const querySelectTicketMessage = `SELECT CONCAT(u.v_firstName, ' ', LEFT(u.v_lastName, 1), '.') AS 'userName',
                                    tm.v_content AS 'content',
                                    tm.dt_creationDate AS 'creationDate'
                                    FROM ticketmessages AS tm
                                    INNER JOIN users AS u
                                    ON tm.i_idUser = u.i_id
                                    WHERE i_idTicket = ?
                                    ORDER BY creationDate ASC`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelectTicketMessage, [data.params.id]);
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  return {
    type: "json",
    code: 200,
    json: dbRes[1],
  };
}

/**
 * @swagger
 * /ticket/{id}/message:
 *   post:
 *     summary: Get all messages from a ticket. The user need to be a 'myFabAgent' or the ticket owner
 *     tags: [Ticket]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "id"
 *       in: "path"
 *       description: "Id of the ticket"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     requestBody:
 *       description: "Post all data for post new message"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: "string"
 *            example:
 *              content: hello world
 *     responses:
 *       200:
 *         description: "The message is posted"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.postTicketMessage = postTicketMessage;
async function postTicketMessage(data) {
  // The body does not have all the necessary field
  if (!data.params || !data.params.id || isNaN(data.params.id) || !data.body || !data.body.content) {
    return {
      type: "code",
      code: 400,
    };
  }
  // if the user is not allowed
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const querySelect = `SELECT i_idUser AS 'id'
                    FROM printstickets
                    WHERE i_id = ?`;
  const resGetUserTicket = await data.app.executeQuery(data.app.db, querySelect, [data.params.id]);
  if (resGetUserTicket[0] || resGetUserTicket[1].length !== 1) {
    console.log(resGetUserTicket[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  const idTicketUser = resGetUserTicket[1][0].id;
  if (idTicketUser != userIdAgent) {
    const authViewResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "myFabAgent");
    if (!authViewResult) {
      return {
        type: "code",
        code: 403,
      };
    }
  } else {
    const querySetNormalStatus = `UPDATE printstickets SET i_status = (SELECT i_id FROM gd_status WHERE v_name = 'Ouvert') WHERE i_id = ?;`;
    const resSetNormalStatus = await data.app.executeQuery(data.app.db, querySetNormalStatus, [data.params.id]);
    if (resSetNormalStatus[0]) {
      console.log(resSetNormalStatus[0]);
      return {
        type: "code",
        code: 500,
      };
    }
  }

  const queryInsert = `INSERT INTO ticketmessages (i_idUser, i_idTicket, v_content)
                        VALUES (?, ?, ?)`;
  const dbRes = await data.app.executeQuery(data.app.db, queryInsert, [userIdAgent, data.params.id, data.body.content]);
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  //Update bot channels
  data.app.io.to(`ticket-${data.params.id}`).emit("reload-ticket");

  return {
    type: "code",
    code: 200,
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/ticket/:id/message/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await getTicketMessage(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/ticket/:id/message/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.post("/api/ticket/:id/message/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await postTicketMessage(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/ticket/:id/message/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
