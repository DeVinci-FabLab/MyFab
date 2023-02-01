const fs = require("fs");
const maxTicket = 30;

function makeid(length, filename) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  if (fs.existsSync(__dirname + "/../../data/files/stl/" + result + "_" + filename)) {
    return makeid(length, filename);
  } else {
    return result + "_" + filename;
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         id:
 *           type: "integer"
 *           format: "int64"
 *           description: Id of the ticket
 *         userName:
 *           type: "string"
 *           description: Name of the user
 *         projectType:
 *           type: "string"
 *           description: Project description
 *         creationDate:
 *           type: "string"
 *           format: "date-time"
 *           description: "Date when the user was created"
 *         modificationDate:
 *           type: "string"
 *           format: "date-time"
 *           description: "Date when the user was modified"
 *         statusName:
 *           type: "string"
 *           description: "The name of the status"
 *         statusColor:
 *           type: "string"
 *           description: "The color of the status"
 *         priorityName:
 *           type: "string"
 *           description: The name of the priority
 *         priorityColor:
 *           type: "string"
 *           description: The color of the priority
 *       example:
 *         id: 212
 *         userName: John D.
 *         projectType: Test
 *         creationDate: 2021-12-16T09:31:38.000Z
 *         modificationDate: 2021-12-16T09:31:38.000Z
 *         statusName: Ouvert
 *         statusColor: 111111
 *         priorityName: Normal
 *         priorityColor: 444444
 */

/**
 * @swagger
 * tags:
 *   name: Ticket
 *   description: Everything about tickets
 */

/**
 * @swagger
 * /ticket/me/:
 *   get:
 *     summary: Get all tickets data from a user.
 *     tags: [Ticket]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       "200":
 *         description: "Get all ticlets data from a user"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *        description: "The user is unauthenticated"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.getTicketAllFromUser = getTicketAllFromUser;
async function getTicketAllFromUser(data) {
  //The user is unauthenticated
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }

  const page = data.query && data.query.page ? data.query.page : 0;
  const query = `SELECT pt.i_id AS 'id',
             CONCAT(u.v_firstName, (CASE WHEN u.v_lastName != "" THEN CONCAT(' ', LEFT(u.v_lastName, 1), '.') ELSE "" END)) AS 'userName',
             tpt.v_name AS 'projectType', u.v_title AS 'title' ,
             pt.dt_creationdate AS 'creationDate', pt.dt_modificationdate AS 'modificationDate',
             stat.v_name AS 'statusName', stat.v_color AS 'statusColor', tp.v_name AS 'priorityName', tp.v_color AS 'priorityColor' 
             FROM printstickets AS pt 
             INNER JOIN users AS u ON pt.i_idUser = u.i_id 
             INNER JOIN gd_ticketprojecttype AS tpt ON pt.i_projecttype = tpt.i_id 
             INNER JOIN gd_ticketpriority AS tp ON pt.i_priority = tp.i_id
             LEFT OUTER JOIN gd_status AS stat ON pt.i_status = stat.i_id
             WHERE pt.i_idUser = ? 
             AND pt.b_isDeleted = 0 
             ORDER BY pt.i_id DESC
             ${data.query && data.query.all ? "" : "LIMIT ? OFFSET ?"};`;

  const dbRes = await data.app.executeQuery(data.app.db, query, [userIdAgent, maxTicket, maxTicket * page]);
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  const queryCount = `SELECT COUNT(1) AS count
             FROM printstickets AS pt
             WHERE pt.i_idUser = ? 
             AND pt.b_isDeleted = 0 
             ORDER BY pt.i_id DESC;`;

  const dbResCount = await data.app.executeQuery(data.app.db, queryCount, [userIdAgent, maxTicket, maxTicket * page]);
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  const calcTicketByMaxTicket = dbResCount[1][0].count / maxTicket;
  const maxPage = Math.trunc(calcTicketByMaxTicket) === calcTicketByMaxTicket ? calcTicketByMaxTicket : Math.trunc(calcTicketByMaxTicket) + 1;

  return {
    type: "json",
    code: 200,
    json: { maxPage: data.query && data.query.all ? 1 : maxPage, values: dbRes[1] },
  };
}

/**
 * @swagger
 * /ticket/:
 *   get:
 *     summary: Get all tickets data. The user need to be a 'myFabAgent'
 *     tags: [Ticket]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       "200":
 *         description: "Get all ticlets data"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

function getOrderCollumnName(collumnName) {
  switch (collumnName) {
    case "name":
      return "u.v_firstName";
    case "createAt":
      return "pt.dt_creationdate";
    case "priority":
      return "tp.v_name";
    case "type":
      return "tpt.v_name";
    case "status":
      return "stat.v_name";

    default:
      return "pt.i_id";
  }
}

module.exports.getTicketAll = getTicketAll;
async function getTicketAll(data) {
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const authViewResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "myFabAgent");
  if (!authViewResult) {
    return {
      type: "code",
      code: 403,
    };
  }
  if (data.query === undefined) data.query = {};
  const inputText = data.query.inputValue ? data.query.inputValue : "";
  const page = data.query.page ? data.query.page : 0;
  const selectOpenOnly = data.query.selectOpenOnly ? data.query.selectOpenOnly : false;
  const orderCollumn = getOrderCollumnName(data.query.collumnName);
  const order = data.query.order === "false" ? "DESC" : "ASC";
  const query = `SELECT pt.i_id AS 'id',
             CONCAT(u.v_firstName, (CASE WHEN u.v_lastName != "" THEN CONCAT(' ', LEFT(u.v_lastName, 1), '.') ELSE "" END)) AS 'userName',
             tpt.v_name AS 'projectType', u.v_title AS 'title' , pt.i_groupNumber AS 'groupNumber' ,
             pt.dt_creationdate AS 'creationDate', pt.dt_modificationdate AS 'modificationDate',
             stat.v_name AS 'statusName', stat.v_color AS 'statusColor',
             stat.b_isOpen AS 'isOpen',
             tp.v_name AS 'priorityName', tp.v_color AS 'priorityColor' 
             FROM printstickets AS pt 
             INNER JOIN users AS u ON pt.i_idUser = u.i_id 
             INNER JOIN gd_ticketprojecttype AS tpt ON pt.i_projecttype = tpt.i_id 
             INNER JOIN gd_ticketpriority AS tp ON pt.i_priority = tp.i_id
             LEFT OUTER JOIN gd_status AS stat ON pt.i_status = stat.i_id
             WHERE pt.b_isDeleted = 0
             ${selectOpenOnly ? "AND stat.b_isOpen = 1" : ""}
             AND (
                "" = ?
                OR pt.i_id LIKE CONCAT("%", ?, "%")
                OR u.v_firstName LIKE CONCAT("%", ?, "%")
                OR u.v_lastName LIKE CONCAT("%", ?, "%")
                OR u.v_title LIKE CONCAT("%", ?, "%")
                OR tpt.v_name LIKE CONCAT("%", ?, "%")
                OR stat.v_name LIKE CONCAT("%", ?, "%")
                OR tp.v_name LIKE CONCAT("%", ?, "%")
                )
             ORDER BY ${orderCollumn} ${order}
             ${data.query.all ? "" : "LIMIT ? OFFSET ?"};`;

  const dbRes = await data.app.executeQuery(data.app.db, query, [
    inputText,
    inputText,
    inputText,
    inputText,
    inputText,
    inputText,
    inputText,
    inputText,
    maxTicket,
    maxTicket * page,
  ]);
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  const queryCount = `SELECT COUNT(1) AS 'count'
            FROM printstickets AS pt
            INNER JOIN users AS u ON pt.i_idUser = u.i_id 
            INNER JOIN gd_ticketprojecttype AS tpt ON pt.i_projecttype = tpt.i_id 
            INNER JOIN gd_ticketpriority AS tp ON pt.i_priority = tp.i_id
            LEFT OUTER JOIN gd_status AS stat ON pt.i_status = stat.i_id
            WHERE pt.b_isDeleted = 0
            ${selectOpenOnly ? "AND stat.b_isOpen = 1" : ""}
            AND (
                "" = ?
                OR pt.i_id LIKE CONCAT("%", ?, "%")
                OR u.v_firstName LIKE CONCAT("%", ?, "%")
                OR u.v_lastName LIKE CONCAT("%", ?, "%")
                OR u.v_title LIKE CONCAT("%", ?, "%")
                OR tpt.v_name LIKE CONCAT("%", ?, "%")
                OR stat.v_name LIKE CONCAT("%", ?, "%")
                OR tp.v_name LIKE CONCAT("%", ?, "%")
                );`;

  const dbResCount = await data.app.executeQuery(data.app.db, queryCount, [inputText, inputText, inputText, inputText, inputText, inputText, inputText, inputText]);
  if (dbResCount[0]) {
    console.log(dbResCount[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  const calcTicketByMaxTicket = dbResCount[1][0].count / maxTicket;
  const maxPage = Math.trunc(calcTicketByMaxTicket) === calcTicketByMaxTicket ? calcTicketByMaxTicket : Math.trunc(calcTicketByMaxTicket) + 1;

  return {
    type: "json",
    code: 200,
    json: { maxPage: data.query.all ? 1 : maxPage, values: dbRes[1] },
  };
}

/**
 * @swagger
 * /ticket/{id}:
 *   get:
 *     summary: Get a ticket data. The user need to be a 'myFabAgent' or the ticket owner
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
 *         description: "Get a ticket data"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       204:
 *        description: "The content of the answer is either empty or contains more than one ticket"
 *       400:
 *        description: "Parameters or body not valid"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.getTicketById = getTicketById;
async function getTicketById(data) {
  // parameters or body not valid
  if (!data.params || !data.params.id || isNaN(data.params.id)) {
    return {
      type: "code",
      code: 400,
    };
  }
  // unauthenticated user
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const querySelectUser = `SELECT i_idUser AS 'id'
                        FROM printstickets
                        WHERE i_id = ? AND b_isDeleted = 0`;
  const resGetUserTicket = await data.app.executeQuery(data.app.db, querySelectUser, [data.params.id]);
  if (resGetUserTicket[0]) {
    console.log(resGetUserTicket[0]);
    return {
      type: "code",
      code: 500,
    };
  } else if (resGetUserTicket[1].length !== 1) {
    return {
      type: "code",
      code: 204,
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
  const querySelect = `SELECT pt.i_id AS 'id', pt.i_idUser AS 'idUser',CONCAT(u.v_firstName, ' ', LEFT(u.v_lastName, 1), '.') AS 'userName',
             u.v_firstName AS 'userFirstName', u.v_lastName AS 'userLastName',
             tpt.v_name AS 'projectType', pt.i_projecttype AS 'idProjectType', u.v_title AS 'title' , u.v_email AS 'email' , pt.i_groupNumber AS 'groupNumber' ,
             pt.dt_creationdate AS 'creationDate', pt.dt_modificationdate AS 'modificationDate',
             stat.v_name AS 'statusName', stat.b_isCancel AS 'isCancel', stat.v_color AS 'statusColor',
             tp.v_name AS 'priorityName', tp.v_color AS 'priorityColor' 
             FROM printstickets AS pt 
             INNER JOIN users AS u ON pt.i_idUser = u.i_id 
             INNER JOIN gd_ticketprojecttype AS tpt ON pt.i_projecttype = tpt.i_id 
             INNER JOIN gd_ticketpriority AS tp ON pt.i_priority = tp.i_id
             LEFT OUTER JOIN gd_status AS stat ON pt.i_status = stat.i_id
             WHERE pt.i_id = ? AND pt.b_isDeleted = 0`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [data.params.id]);
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  if (dbRes[1] == null || dbRes[1].length !== 1) {
    return {
      type: "code",
      code: 204,
    };
  }
  const result = dbRes[1][0];
  // SELECT COUNT(*) AS ticketCreated FROM `printstickets`;
  // SELECT COUNT(*) FROM `printstickets` WHERE i_idUser = ? AND (dt_creationdate BETWEEN CONCAT((YEAR((SELECT dt_creationdate FROM `printstickets` WHERE i_id = ?)) - (MONTH((SELECT dt_creationdate FROM `printstickets` WHERE i_id = ?)) < 9)), "/09/01") and CONCAT((YEAR((SELECT dt_creationdate FROM `printstickets` WHERE i_id = ?)) - (MONTH((SELECT dt_creationdate FROM `printstickets` WHERE i_id = ?)) > 9)), "/08/31"));

  const querySelectCountUser = `SELECT COUNT(*) AS 'countUser' FROM printstickets
            INNER JOIN gd_status ON printstickets.i_status = gd_status.i_id
            WHERE i_idUser = ?
            AND gd_status.b_printCompleted = 1
            AND (dt_creationdate BETWEEN CONCAT((YEAR((SELECT dt_creationdate FROM printstickets WHERE i_id = ?)) - (MONTH((SELECT dt_creationdate FROM printstickets WHERE i_id = ?)) < 9)), "/09/01")
            AND CONCAT((YEAR((SELECT dt_creationdate FROM printstickets WHERE i_id = ?)) + (MONTH((SELECT dt_creationdate FROM printstickets WHERE i_id = ?)) > 9)), "/08/31"));`;
  const dbResSelectCounterUser = await data.app.executeQuery(data.app.db, querySelectCountUser, [result.idUser, result.id, result.id, result.id, result.id]);
  if (dbResSelectCounterUser[0]) {
    console.log(dbResSelectCounterUser[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  result.ticketCountUser = dbResSelectCounterUser[1][0].countUser;

  if (result.groupNumber) {
    const querySelectCountGroup = `SELECT COUNT(*) AS 'countGroup' FROM printstickets
                INNER JOIN gd_status ON printstickets.i_status = gd_status.i_id
                WHERE i_groupNumber = ?
                AND gd_status.b_printCompleted = 1
                AND i_projecttype = ?
                AND (dt_creationdate BETWEEN CONCAT((YEAR((SELECT dt_creationdate FROM printstickets WHERE i_id = ?)) - (MONTH((SELECT dt_creationdate FROM printstickets WHERE i_id = ?)) < 9)), "/09/01")
                AND CONCAT((YEAR((SELECT dt_creationdate FROM printstickets WHERE i_id = ?)) + (MONTH((SELECT dt_creationdate FROM printstickets WHERE i_id = ?)) > 9)), "/08/31"));`;
    const dbResSelectCounterGroup = await data.app.executeQuery(data.app.db, querySelectCountGroup, [
      result.groupNumber,
      result.idProjectType,
      result.id,
      result.id,
      result.id,
      result.id,
    ]);
    if (dbResSelectCounterGroup[0]) {
      console.log(dbResSelectCounterGroup[0]);
      return {
        type: "code",
        code: 500,
      };
    }
    result.ticketCountGroup = dbResSelectCounterGroup[1][0].countGroup;
  } else {
    result.ticketCountGroup = null;
  }

  const querySelectLogUpdProjectType = `SELECT
            CONCAT(u.v_firstName, ' ', LEFT(u.v_lastName, 1), '. a changé le type de projet en ', gdtpt.v_name) AS message,
            ltc.dt_timeStamp AS timeStamp
            FROM log_ticketschange AS ltc
            INNER JOIN users AS u ON ltc.i_idUser = u.i_id
            INNER JOIN gd_ticketprojecttype AS gdtpt ON ltc.v_newValue = gdtpt.i_id
            WHERE i_idTicket = ? AND v_action = 'upd_projType'
            ORDER BY ltc.dt_timeStamp ASC`;
  const dbResSelectLogUpdProjectType = await data.app.executeQuery(data.app.db, querySelectLogUpdProjectType, [data.params.id]);
  if (dbResSelectLogUpdProjectType[0]) {
    console.log(dbResSelectLogUpdProjectType[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  result.history = dbResSelectLogUpdProjectType[1];

  const querySelectLogUpdStatus = `SELECT
            CONCAT(u.v_firstName, ' ', LEFT(u.v_lastName, 1), '. a changé le status projet en : ', gds.v_name) AS message,
            ltc.dt_timeStamp AS timeStamp
            FROM log_ticketschange AS ltc
            INNER JOIN users AS u ON ltc.i_idUser = u.i_id
            LEFT OUTER JOIN gd_status AS gds ON ltc.v_newValue = gds.i_id
            WHERE i_idTicket = ? AND v_action = 'upd_status'
            ORDER BY ltc.dt_timeStamp ASC`;
  const dbResSelectLogStatus = await data.app.executeQuery(data.app.db, querySelectLogUpdStatus, [data.params.id]);
  if (dbResSelectLogStatus[0]) {
    console.log(dbResSelectLogStatus[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  for (const elem of dbResSelectLogStatus[1]) {
    result.history.push(elem);
  }

  const querySelectLogPriority = `SELECT
            CONCAT('La priorité du ticket est passé en : ', gdtp.v_name) AS message,
            dt_timeStamp AS timeStamp
            FROM log_ticketschange AS ltc
            INNER JOIN gd_ticketpriority AS gdtp ON ltc.v_newValue = gdtp.i_id
            WHERE i_idTicket = ? AND v_action = 'upd_priority'`;
  const dbResSelectLogPriority = await data.app.executeQuery(data.app.db, querySelectLogPriority, [data.params.id]);
  if (dbResSelectLogPriority[0]) {
    console.log(dbResSelectLogPriority[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  for (const elem of dbResSelectLogPriority[1]) {
    result.history.push(elem);
  }

  result.history.sort(function (a, b) {
    return new Date(b.timeStamp) - new Date(a.timeStamp);
  });
  result.userCanCancel = idTicketUser == userIdAgent;

  return {
    type: "json",
    code: 200,
    json: result,
  };
}

/**
 * @swagger
 * /ticket/:
 *   post:
 *     summary: Create new ticket. The user need to be authenticated.
 *     tags: [Ticket]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     requestBody:
 *       description: "Post all data for ticket creation (projectType)"
 *       required: true
 *       content:
 *         multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              projectType:
 *                type: "integer"
 *                format: "int64"
 *                required: true
 *              groupNumber:
 *                type: "integer"
 *                format: "int64"
 *              comment:
 *                type: "string"
 *                required: true
 *              filedata:
 *                 type: array
 *                 required: true
 *                 items:
 *                   type: string
 *                   format: binary
 *            example:
 *              projectType: 1
 *     responses:
 *       "200":
 *         description: "The id of the new ticket"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 id:
 *                   type: integer
 *                   format: int64
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user is unauthenticated"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.postTicket = postTicket;
async function postTicket(data) {
  // The body does not have all the necessary field
  if (!data.body || !data.body.projectType || isNaN(data.body.projectType) || isNaN(data.body && data.body.groupNumber ? data.body.groupNumber : 1) || !data.body.comment) {
    return {
      type: "code",
      code: 400,
    };
  }
  const userId = data.userId;
  if (!userId) {
    return {
      type: "code",
      code: 401,
    };
  }
  const querySelectProjectType = `SELECT 1 FROM gd_ticketprojecttype WHERE i_id = ?`;
  const resSelectProjectType = await data.app.executeQuery(data.app.db, querySelectProjectType, [data.body.projectType]);
  if (resSelectProjectType[0]) {
    console.log(resSelectProjectType[0]);
    return {
      type: "code",
      code: 500,
    };
  } else if (resSelectProjectType[1].length == 0) {
    return {
      type: "code",
      code: 400,
    };
  }

  const queryCreateTicket = `INSERT INTO printstickets (i_idUser, i_projecttype, i_groupNumber, i_priority, i_status)
                            VALUES (?, ?, ?, (SELECT i_id FROM gd_ticketpriority WHERE v_name = 'Normal'), (SELECT i_id FROM gd_status WHERE v_name = 'Ouvert'));`;
  const dbRes = await data.app.executeQuery(data.app.db, queryCreateTicket, [userId, data.body.projectType, data.body.groupNumber]);
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  const querySelectLastId = `SELECT LAST_INSERT_ID() AS 'id';`;
  const lastIdentityRes = await data.app.executeQuery(data.app.db, querySelectLastId, []);
  if (lastIdentityRes[0] || lastIdentityRes[1].length !== 1) {
    console.log(lastIdentityRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  //Detects if there are one or more files
  let files;
  if (data.files == null) files = [];
  else if (data.files.filedata.length == null) files = [data.files.filedata];
  else files = data.files.filedata;

  //loop all files
  for (const file of files) {
    const fileNameSplited = file.name.split(".");
    if (fileNameSplited[fileNameSplited.length - 1].toLowerCase() === "stl") {
      await new Promise(async (resolve) => {
        const newFileName = makeid(10, file.name);
        fs.copyFile(file.tempFilePath, __dirname + "/../../data/files/stl/" + newFileName, async (err) => {
          if (err) throw err;
          const queryInsertFile = `INSERT INTO ticketfiles (i_idUser, i_idTicket, v_fileName, v_fileServerName)
                                            VALUES (?, ?, ?, ?);`;
          const resInsertFile = await data.app.executeQuery(data.app.db, queryInsertFile, [userId, lastIdentityRes[1][0].id, file.name, newFileName]);
          if (resInsertFile[0]) {
            console.log(resInsertFile[0]);
            return {
              type: "code",
              code: 500,
            };
          }
          resolve();
        });
      });
    }
    fs.unlinkSync(file.tempFilePath);
  }

  const queryInsert = `INSERT INTO ticketmessages (i_idUser, i_idTicket, v_content)
                        VALUES (?, ?, ?)`;
  const resCommentInsert = await data.app.executeQuery(data.app.db, queryInsert, [userId, lastIdentityRes[1][0].id, data.body.comment]);
  if (resCommentInsert[0]) {
    console.log(resCommentInsert[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  data.app.io.emit("event-reload-tickets"); // reload ticket menu on client
  return {
    type: "json",
    code: 200,
    json: lastIdentityRes[1][0],
  };
}

/**
 * @swagger
 * /ticket/{id}:
 *   delete:
 *     summary: Delete the selected ticket.
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
 *         description: "The ticket is deleted."
 *       "204":
 *         description: "No data changed."
 *       400:
 *        description: "The ticket is not found"
 *       401:
 *        description: "The user is unauthenticated"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.deleteTicketWithId = deleteTicketWithId;
async function deleteTicketWithId(data) {
  // parameters or body not valid
  if (!data.params || !data.params.id) {
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
  const querySelect = `SELECT i_idUser AS 'id',
                                b_isDeleted AS 'isDeleted'
                                FROM printstickets
                                WHERE i_id = ?`;
  const resGetUserTicket = await data.app.executeQuery(data.app.db, querySelect, [data.params.id]);
  if (resGetUserTicket[0] || resGetUserTicket[1].length > 1) {
    console.log(resGetUserTicket[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  if (resGetUserTicket[1].length < 1) {
    return {
      type: "code",
      code: 400,
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

  const queryUpdate = `UPDATE printstickets
                        SET b_isDeleted = '1'
                        WHERE i_id = ?;`;
  const resDeleteTicket = await data.app.executeQuery(data.app.db, queryUpdate, [data.params.id]);
  if (resDeleteTicket[0]) {
    console.log(resDeleteTicket[0]);
    return {
      type: "code",
      code: 500,
    };
  } else if (resDeleteTicket[0] || resDeleteTicket[1].changedRows !== 1) {
    return {
      type: "code",
      code: 204,
    };
  }

  data.app.io.emit("event-reload-tickets"); // reload ticket menu on client
  data.app.io.to(`ticket-${data.params.id}`).emit("reload-ticket");

  //return response
  return {
    type: "code",
    code: 200,
  };
}

/**
 * @swagger
 * /ticket/{id}/setProjecttype:
 *   put:
 *     summary: Change projectType of the ticket. The user need to be a 'myFabAgent'
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
 *     - name: "projecttype"
 *       in: "query"
 *       description: "New status for the ticket"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       200:
 *        description: "The projecttype has been changed"
 *       400:
 *        description: "Parameters or body not valid"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.putTicketNewProjectType = putTicketNewProjectType;
async function putTicketNewProjectType(data) {
  // parameters or body not valid
  if (!data.params || !data.params.id || isNaN(data.params.id) || !data.query || !data.query.projecttype || isNaN(data.query.projecttype)) {
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
  const authViewResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "myFabAgent");
  if (!authViewResult) {
    return {
      type: "code",
      code: 403,
    };
  }

  const querySelect = `SELECT 1
            FROM gd_ticketprojecttype
            WHERE i_id = ?`;
  const resTestIfRoleExist = await data.app.executeQuery(data.app.db, querySelect, [data.query.projecttype]);
  if (resTestIfRoleExist[0]) {
    console.log(resTestIfRoleExist[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  const queryUpdate = `UPDATE printstickets
            SET i_projecttype = ?
            WHERE i_id = ?`;
  const resUpdate = await data.app.executeQuery(data.app.db, queryUpdate, [data.query.projecttype, data.params.id]);
  if (resUpdate[0]) {
    console.log(resUpdate[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  // The response has no value
  if (resUpdate[1].changedRows < 1) {
    return {
      type: "code",
      code: 204,
    };
  }

  const queryInsertLog = `INSERT INTO log_ticketschange
            (i_idUser, i_idTicket, v_action, v_newValue)
            VALUES (?, ?, 'upd_projType', ?)`;
  const resInsertLog = await data.app.executeQuery(data.app.db, queryInsertLog, [userIdAgent, data.params.id, data.query.projecttype]);
  if (resInsertLog[0]) {
    console.log(resInsertLog[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  data.app.io.emit("event-reload-tickets"); // reload ticket menu on client
  data.app.io.to(`ticket-${data.params.id}`).emit("reload-ticket");

  return {
    type: "code",
    code: 200,
  };
}

/**
 * @swagger
 * /ticket/{id}/setStatus:
 *   put:
 *     summary: Change projectType of the ticket. The user need to be a 'myFabAgent'
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
 *     - name: "idStatus"
 *       in: "query"
 *       description: "New status for the ticket"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       200:
 *        description: "The projecttype has been changed"
 *       204:
 *        description: "No tickets have been modified"
 *       400:
 *        description: "Parameters or body not valid"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.putTicketNewStatus = putTicketNewStatus;
async function putTicketNewStatus(data) {
  // parameters or body not valid
  if (!data.params || !data.params.id || isNaN(data.params.id) || !data.query || !data.query.idStatus || isNaN(data.query.idStatus)) {
    return {
      type: "code",
      code: 400,
    };
  }
  const idStatus = data.query.idStatus;
  const idTicket = data.params.id;
  // if the user is not allowed
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  const authViewResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "myFabAgent");
  if (!authViewResult) {
    return {
      type: "code",
      code: 403,
    };
  }

  const queryUpdate = `UPDATE printstickets 
                         SET i_status = ?
                         WHERE i_id = ?`;
  const resUpdate = await data.app.executeQuery(data.app.db, queryUpdate, [idStatus, idTicket]);
  if (resUpdate[0]) {
    console.log(resUpdate[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  // The response has no value
  if (resUpdate[1].changedRows < 1) {
    return {
      type: "code",
      code: 204,
    };
  }

  const queryInsertLog = `INSERT INTO log_ticketschange
             (i_idUser, i_idTicket, v_action, v_newValue)
             VALUES (?, ?, 'upd_status', ?)`;
  const resInsertLog = await data.app.executeQuery(data.app.db, queryInsertLog, [userIdAgent, idTicket, idStatus]);
  if (resInsertLog[0]) {
    console.log(resInsertLog[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  data.app.io.emit("event-reload-tickets"); // reload ticket menu on client
  data.app.io.to(`ticket-${idTicket}`).emit("reload-ticket");

  return {
    type: "code",
    code: 200,
  };
}

/**
 * @swagger
 * /ticket/{id}/setCancelStatus:
 *   put:
 *     summary: Change projectType of the ticket. The user need to be the applicant
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
 *       200:
 *        description: "The projecttype has been changed"
 *       204:
 *        description: "No tickets have been modified"
 *       400:
 *        description: "Parameters or body not valid"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.putTicketCancelStatus = putTicketCancelStatus;
async function putTicketCancelStatus(data) {
  // parameters or body not valid
  if (!data.params || !data.params.id || isNaN(data.params.id)) {
    return {
      type: "code",
      code: 400,
    };
  }
  const idTicket = data.params.id;
  // if the user is not allowed
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
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
    return {
      type: "code",
      code: 403,
    };
  }

  const queryUpdate = `UPDATE printstickets 
                        SET i_status = (
                          SELECT i_id
                          FROM gd_status
                          WHERE b_isCancel = 1
                          )
                        WHERE i_id = ?`;
  const resUpdate = await data.app.executeQuery(data.app.db, queryUpdate, [idTicket]);
  if (resUpdate[0]) {
    console.log(resUpdate[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  // The response has no value
  if (resUpdate[1].changedRows < 1) {
    return {
      type: "code",
      code: 204,
    };
  }

  const queryInsertLog = `INSERT INTO log_ticketschange
            (i_idUser, i_idTicket, v_action, v_newValue)
            VALUES (?, ?, 'upd_status', (
              SELECT i_id
              FROM gd_status
              WHERE b_isCancel = 1
              ))`;
  const resInsertLog = await data.app.executeQuery(data.app.db, queryInsertLog, [userIdAgent, idTicket]);
  if (resInsertLog[0]) {
    console.log(resInsertLog[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  data.app.io.emit("event-reload-tickets"); // reload ticket menu on client
  data.app.io.to(`ticket-${idTicket}`).emit("reload-ticket");

  return {
    type: "code",
    code: 200,
  };
}

/**
 * @swagger
 * /ticket/highDemand/:
 *   get:
 *     summary: Get if there is a high demand.
 *     tags: [Ticket]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       "200":
 *         description: "Get all ticlets data from a user"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *        description: "The user is unauthenticated"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.getHighDemand = getHighDemand;
async function getHighDemand(data) {
  //The user is unauthenticated
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }

  const queryGet = `SELECT COUNT(*) AS 'count'
              FROM printstickets AS pt
              LEFT OUTER JOIN gd_status AS stat ON pt.i_status = stat.i_id
              WHERE pt.b_isDeleted = 0
              AND stat.b_isOpen = 1
              AND pt.dt_creationdate >= DATE_ADD(CURDATE(), INTERVAL -1 MONTH)
              AND pt.dt_creationdate < CURDATE();`;

  const resGet = await data.app.executeQuery(data.app.db, queryGet, []);
  if (resGet[0]) {
    console.log(resGet[0]);
    return {
      type: "code",
      code: 500,
    };
  }

  return {
    type: "json",
    code: 200,
    json: { result: resGet[1][0].count >= 5 },
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/ticket/highDemand/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await getHighDemand(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/ticket/highDemand/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.get("/api/ticket/me/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await getTicketAllFromUser(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/ticket/me/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.get("/api/ticket/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await getTicketAll(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/ticket/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.get("/api/ticket/:id", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await getTicketById(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/ticket/:id/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.post("/api/ticket/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await postTicket(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/ticket/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.delete("/api/ticket/:id", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await deleteTicketWithId(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: DELETE /api/ticket/:id");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put("/api/ticket/:id/setProjecttype", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await putTicketNewProjectType(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: PUT /api/ticket/:id/setProjecttype/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put("/api/ticket/:id/setStatus", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await putTicketNewStatus(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: PUT /api/ticket/:id/setStatus");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put("/api/ticket/:id/setCancelStatus", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await putTicketCancelStatus(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: PUT /api/ticket/:id/setCancelStatus");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
