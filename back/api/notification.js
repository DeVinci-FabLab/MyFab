/**
 * @swagger
 * /notification/:
 *   get:
 *     summary: Get the current user's in-site notifications (recent + unread count).
 *     tags: [Notification]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       required: true
 *       type: string
 *     responses:
 *       "200":
 *         description: "List of notifications + unread count"
 *       401:
 *        description: "The user is unauthenticated"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.getNotifications = getNotifications;
async function getNotifications(data) {
  const userId = data.userId;
  if (!userId) {
    return { type: "code", code: 401 };
  }

  const query = `SELECT i_id AS id, v_message AS message, v_link AS link,
              b_read AS isRead, dt_creationDate AS creationDate
            FROM notifications
            WHERE i_idUser = ?
            ORDER BY i_id DESC
            LIMIT 20`;
  const dbRes = await data.app.executeQuery(data.app.db, query, [userId]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */

  const queryUnread = `SELECT COUNT(*) AS unread FROM notifications WHERE i_idUser = ? AND b_read = 0`;
  const dbUnread = await data.app.executeQuery(data.app.db, queryUnread, [
    userId,
  ]);
  /* c8 ignore start */
  if (dbUnread[0]) {
    console.log(dbUnread[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */

  return {
    type: "json",
    code: 200,
    json: {
      unread: dbUnread[1][0].unread,
      values: dbRes[1],
    },
  };
}

/**
 * @swagger
 * /notification/read:
 *   put:
 *     summary: Mark all the current user's notifications as read.
 *     tags: [Notification]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       required: true
 *       type: string
 *     responses:
 *       "200":
 *         description: "Notifications marked as read"
 *       401:
 *        description: "The user is unauthenticated"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.putNotificationsRead = putNotificationsRead;
async function putNotificationsRead(data) {
  const userId = data.userId;
  if (!userId) {
    return { type: "code", code: 401 };
  }
  const query = `UPDATE notifications SET b_read = 1 WHERE i_idUser = ? AND b_read = 0`;
  const dbRes = await data.app.executeQuery(data.app.db, query, [userId]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */
  return { type: "code", code: 200 };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/notification/", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(
        app,
        req,
        res,
      );
      const result = await getNotifications(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/notification/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put("/api/notification/read", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(
        app,
        req,
        res,
      );
      const result = await putNotificationsRead(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: PUT /api/notification/read");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
