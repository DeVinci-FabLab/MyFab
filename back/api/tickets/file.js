const fs = require("fs");

function makeid(length, filename) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  /* c8 ignore start */
  if (fs.existsSync(__dirname + "/../../data/files/stl/" + result + "_" + filename)) {
    // Test ignoré parce que cette fonction n'est pas idempotent. Cette condition gère les fichiers qui ont le même nom et id
    return makeid(length, filename);
    /* c8 ignore stop */
  } else {
    return result + "_" + filename;
  }
}

/**
 * @swagger
 * /ticket/{id}/file:
 *   get:
 *     summary: Get the list of files from a ticket
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
 *         description: Get the list of files from a ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: "integer"
 *                   format: "int64"
 *                 filename:
 *                   type: string
 *                 comment:
 *                   type: string
 *                 isValid:
 *                   type: boolean
 *                 creationDate:
 *                   type: "string"
 *                   format: "date-time"
 *                 modificationDate:
 *                   type: "string"
 *                   format: "date-time"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.ticketFileGetListOfFile = ticketFileGetListOfFile;
async function ticketFileGetListOfFile(data) {
  // The body does not have all the necessary field
  if (!data.params || !data.params.id || isNaN(data.params.id)) {
    return {
      type: "code",
      code: 400,
    };
  }
  const userIdAgent = data.userId;
  const idTicket = data.params.id;
  // unauthenticated user
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }

  const queryGetUserTicket = `SELECT i_idUser AS 'id'
                            FROM printstickets 
                            WHERE i_id = ?`;
  const resGetUserTicket = await data.app.executeQuery(data.app.db, queryGetUserTicket, [idTicket]);
  /* c8 ignore start */
  if (resGetUserTicket[0] || resGetUserTicket[1].length !== 1) {
    console.log(resGetUserTicket[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */

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

  const querySelectFiles = `SELECT tf.i_id AS 'id', 
                            tf.v_fileName AS 'filename',
                            tf.v_comment AS 'comment',
                            tf.b_valid AS 'isValid',
                            tf.dt_creationDate AS 'creationDate',
                            tf.dt_modificationDate AS 'modificationDate',
                            gp.i_id AS 'idprinter',
                            gp.v_name AS 'printerName'
                            FROM ticketfiles AS tf
                            LEFT JOIN gd_printer AS gp
                            ON i_idprinter = gp.i_id
                            WHERE tf.i_idTicket = ?`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelectFiles, [idTicket]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  return {
    type: "json",
    code: 200,
    json: dbRes[1],
  };
}

/**
 * @swagger
 * /file/{id}:
 *   get:
 *     summary: Download a file from a ticket
 *     tags: [Ticket]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request. The user need to be the ticket owner or an agent.
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
 *         description: "Get a file from a ticket"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.ticketFileGetOneFile = ticketFileGetOneFile;
async function ticketFileGetOneFile(data) {
  // The body does not have all the necessary field
  if (!data.params || !data.params.id || isNaN(data.params.id)) {
    return {
      type: "code",
      code: 400,
    };
  }
  const idFile = data.params.id;

  // if the user is not allowed
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }

  const query = `SELECT pt.i_idUser AS 'id',
                tf.v_fileServerName AS 'fileServerName',
                tf.v_fileName AS 'fileName',
                gdpt.v_name AS 'projectTypeName'
                FROM ticketfiles AS tf
                INNER JOIN printstickets AS pt ON tf.i_idTicket = pt.i_id
                INNER JOIN gd_ticketprojecttype AS gdpt ON pt.i_projecttype = gdpt.i_id
                WHERE tf.i_id = ?`;
  const resGetUserTicket = await data.app.executeQuery(data.app.db, query, [idFile]);
  /* c8 ignore start */
  if (resGetUserTicket[0] || resGetUserTicket[1].length > 1) {
    console.log(resGetUserTicket[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
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
  if (fs.existsSync(__dirname + "/../../data/files/stl/" + resGetUserTicket[1][0].fileServerName)) {
    return {
      type: "download",
      code: 200,
      path: __dirname + "/../../data/files/stl/" + resGetUserTicket[1][0].fileServerName,
      fileName: idTicketUser == userIdAgent ? resGetUserTicket[1][0].fileName : resGetUserTicket[1][0].projectTypeName + "-" + idFile + "_" + resGetUserTicket[1][0].fileName,
    };
  } else {
    return {
      type: "code",
      code: 204,
    };
  }
}

/**
 * @swagger
 * /ticket/{id}/file:
 *   post:
 *     summary: Add a new file to an existing ticket
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
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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

module.exports.ticketFilePost = ticketFilePost;
async function ticketFilePost(data) {
  //Detects if there are one or more files
  let files;
  if (data.files == null) files = [];
  else if (data.files.filedata.length == null) files = [data.files.filedata];
  else files = data.files.filedata;

  // The body does not have all the necessary field
  if (!data.params || !data.params.id || isNaN(data.params.id)) {
    for (const file of files) {
      fs.unlinkSync(file.tempFilePath);
    }
    return {
      type: "code",
      code: 400,
    };
  }
  const idTicket = data.params.id;

  // if the user is not allowed
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    for (const file of files) {
      fs.unlinkSync(file.tempFilePath);
    }
    return {
      type: "code",
      code: 401,
    };
  }
  const querySelect = `SELECT i_idUser AS 'id'
                        FROM printstickets 
                        WHERE i_id = ?`;
  const resGetUserTicket = await data.app.executeQuery(data.app.db, querySelect, [idTicket]);
  /* c8 ignore start */
  if (resGetUserTicket[0] || resGetUserTicket[1].length > 1) {
    console.log(resGetUserTicket[0]);
    for (const file of files) {
      fs.unlinkSync(file.tempFilePath);
    }
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  if (resGetUserTicket[1].length < 1) {
    for (const file of files) {
      fs.unlinkSync(file.tempFilePath);
    }
    return {
      type: "code",
      code: 400,
    };
  }
  const idTicketUser = resGetUserTicket[1][0].id;
  if (idTicketUser != userIdAgent) {
    const authViewResult = await data.userAuthorization.validateUserAuth(data.app, userIdAgent, "myFabAgent");
    if (!authViewResult) {
      for (const file of files) {
        fs.unlinkSync(file.tempFilePath);
      }
      return {
        type: "code",
        code: 403,
      };
    }
  }

  //loop all files
  for (const file of files) {
    const fileNameSplited = file.name.split(".");
    if (fileNameSplited[fileNameSplited.length - 1].toLowerCase() === "stl") {
      const res = await new Promise(async (resolve) => {
        const newFileName = makeid(10, file.name);
        fs.copyFile(file.tempFilePath, __dirname + "/../../data/files/stl/" + newFileName, async (err) => {
          /* c8 ignore start */
          if (err) throw err;
          /* c8 ignore stop */
          const queryInsert = `INSERT INTO ticketfiles (i_idUser, i_idTicket, v_fileName, v_fileServerName)
                                        VALUES (?, ?, ?, ?);`;
          const resInsertFile = await data.app.executeQuery(data.app.db, queryInsert, [userIdAgent, idTicket, file.name, newFileName]);
          /* c8 ignore start */
          if (resInsertFile[0]) {
            console.log(resInsertFile[0]);
            resolve({
              type: "code",
              code: 500,
            });
          }
          /* c8 ignore stop */
          resolve();
        });
      });
      /* c8 ignore start */
      if (res) {
        // return 500
        return res;
      }
      /* c8 ignore stop */
      fs.unlinkSync(file.tempFilePath);
    }
  }

  //return response
  return {
    type: "code",
    code: 200,
  };
}

/**
 * @swagger
 * /file/{id}:
 *   put:
 *     summary: Change comment and isValid for a ticket
 *     tags: [Ticket]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "id"
 *       in: "path"
 *       description: "Id of the file"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Modification saved successfully"
 *       400:
 *        description: "The body does not have all the necessary field"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.ticketFilePut = ticketFilePut;
async function ticketFilePut(data) {
  const userIdAgent = data.userId;
  // unauthenticated user
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }
  if (
    !data.params ||
    !data.params.id ||
    isNaN(data.params.id) ||
    !data.body ||
    (!data.body.comment ? data.body.comment !== "" : false) ||
    (data.body.idprinter !== undefined ? isNaN(data.body.idprinter) : false)
  ) {
    return {
      type: "code",
      code: 400,
    };
  }
  const idTicket = data.params.id;

  const queryGetUserTicket = `SELECT i_idUser AS 'id'
                            FROM ticketfiles 
                            WHERE i_id = ?`;
  const resGetUserTicket = await data.app.executeQuery(data.app.db, queryGetUserTicket, [idTicket]);
  /* c8 ignore start */
  if (resGetUserTicket[0]) {
    console.log(resGetUserTicket[0]);
    return {
      type: "code",
      code: 500,
    };
    /* c8 ignore stop */
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

  const queryUpdate = `UPDATE ticketfiles
                        SET v_comment = ?
                        ${data.body.idprinter !== undefined ? ", `i_idprinter` = ?" : ""}
                        WHERE i_id = ?`;
  const options = data.body.idprinter !== undefined ? [data.body.comment, data.body.idprinter, idTicket] : [data.body.comment, idTicket];
  const resUpdateFile = await data.app.executeQuery(data.app.db, queryUpdate, options);
  /* c8 ignore start */
  if (resUpdateFile[0]) {
    console.log(resUpdateFile[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */

  //Update web clients
  data.app.io.to(`ticket-${idTicket}`).emit("reload-ticket");

  //return response
  return {
    type: "code",
    code: 200,
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/ticket/:id/file", async (req, res) => {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await ticketFileGetListOfFile(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (err) {
      console.log("ERROR: GET /api/ticket/:id/file/");
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.get("/api/file/:id/", async (req, res) => {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await ticketFileGetOneFile(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (err) {
      console.log("ERROR: GET /api/file/:id/");
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.post("/api/ticket/:id/file/", async (req, res) => {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await ticketFilePost(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (err) {
      console.log("ERROR: POST /api/ticket/:id/file/");
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.put("/api/file/:id/", async (req, res) => {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await ticketFilePut(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (err) {
      console.log("ERROR: PUT /api/file/:id/");
      console.log(err);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
