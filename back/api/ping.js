/**
 * @swagger
 * tags:
 *   name: Ping
 *   description: Test to detect if the server is responding correctly
 */

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Test to detect if the server is responding correctly
 *     tags: [Ping]
 *     responses:
 *       200:
 *         description: Test to detect if the server is responding correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *               example:
 *                 result: pong
 */

module.exports.pingGet = pingGet;
async function pingGet(data) {
  return {
    type: "json",
    code: 200,
    json: {
      result: "pong",
    },
  };
}

/**
 * @swagger
 * /ping:
 *   post:
 *     summary: Test to detect if the server is responding correctly
 *     tags: [Ping]
 *     responses:
 *       200:
 *         description: Test to detect if the server is responding correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *               example:
 *                 result: pong
 */

module.exports.pingPost = pingPost;
async function pingPost(data) {
  return {
    type: "json",
    code: 200,
    json: {
      result: "pong",
    },
  };
}

/**
 * @swagger
 * /ping:
 *   put:
 *     summary: Test to detect if the server is responding correctly
 *     tags: [Ping]
 *     responses:
 *       200:
 *         description: Test to detect if the server is responding correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *               example:
 *                 result: pong
 */

module.exports.pingPut = pingPut;
async function pingPut(data) {
  return {
    type: "json",
    code: 200,
    json: {
      result: "pong",
    },
  };
}

/**
 * @swagger
 * /ping:
 *   delete:
 *     summary: Test to detect if the server is responding correctly
 *     tags: [Ping]
 *     responses:
 *       200:
 *         description: Test to detect if the server is responding correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *               example:
 *                 result: pong
 */

module.exports.pingDelete = pingDelete;
async function pingDelete(data) {
  return {
    type: "json",
    code: 200,
    json: {
      result: "pong",
    },
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/ping/", async function (req, res) {
    const data = await require("../functions/apiActions").prepareData(app, req, res);
    try {
      const result = await pingGet(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/ping/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.post("/api/ping/", async function (req, res) {
    const data = await require("../functions/apiActions").prepareData(app, req, res);
    try {
      const result = await pingPost(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/ping/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put("/api/ping/", async function (req, res) {
    const data = await require("../functions/apiActions").prepareData(app, req, res);
    try {
      const result = await pingDelete(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/ping/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.delete("/api/ping/", async function (req, res) {
    const data = await require("../functions/apiActions").prepareData(app, req, res);
    try {
      const result = await pingDelete(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/ping/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
