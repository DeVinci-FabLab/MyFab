// In-memory status store (pas de DB pour le statut temps réel, trop volatile)
const printerStatusCache = {};

module.exports.startApi = startApi;
async function startApi(app) {
  // POST /api/printers/:id/status — appelé par l'agent local, protégé par token
  app.post("/api/printers/:id/status", async function (req, res) {
    try {
      if (req.headers.agenttoken !== process.env.SPECIALTOKEN) {
        return res.sendStatus(401);
      }
      const { id } = req.params;
      const { status } = req.body;
      if (!id || !status) return res.sendStatus(400);

      printerStatusCache[id] = status;
      app.io.emit("printer-status-update", { printerId: id, status });
      res.sendStatus(200);
    } catch (e) {
      console.log("ERROR: POST /api/printers/:id/status");
      console.log(e);
      res.sendStatus(500);
    }
  });

  // GET /api/printers/ — liste les imprimantes configurées + leur statut
  app.get("/api/printers/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      if (!data.userId) return res.sendStatus(401);

      const querySelect = `SELECT
          p.v_serial AS serial,
          p.v_name AS name,
          p.v_model AS model,
          p.v_ip AS ip,
          p.b_active AS active,
          pt.i_id AS ticketId,
          CONCAT(u.v_firstName, ' ', LEFT(u.v_lastName, 1), '.') AS ticketUser,
          tf.v_fileName AS ticketFile
        FROM printers AS p
        LEFT JOIN gd_printer AS gp ON gp.v_serial = p.v_serial
        LEFT JOIN ticketfiles AS tf ON tf.i_idprinter = gp.i_id
          AND tf.b_deleted = 0
          AND tf.b_valid IS NULL
        LEFT JOIN printstickets AS pt ON pt.i_id = tf.i_idTicket
          AND pt.b_isDeleted = 0
        LEFT JOIN gd_status AS st ON st.i_id = pt.i_status
          AND st.b_isOpen = 1
        LEFT JOIN users AS u ON u.i_id = pt.i_idUser
        ORDER BY p.v_name ASC`;
      const dbRes = await app.executeQuery(app.db, querySelect, []);
      if (dbRes[0]) {
        console.log(dbRes[0]);
        return res.sendStatus(500);
      }

      const printers = dbRes[1].map((p) => ({
        ...p,
        status: printerStatusCache[p.serial] || null,
        currentTicket: p.ticketId ? { id: p.ticketId, user: p.ticketUser, file: p.ticketFile } : null,
        ticketId: undefined,
        ticketUser: undefined,
        ticketFile: undefined,
      }));

      res.json(printers);
    } catch (e) {
      console.log("ERROR: GET /api/printers/");
      console.log(e);
      res.sendStatus(500);
    }
  });

  // POST /api/printers/ — ajouter une imprimante (admin seulement)
  app.post("/api/printers/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      if (!data.userId) return res.sendStatus(401);

      const authResult = await data.userAuthorization.validateUserAuth(
        app,
        data.userId,
        "myFabAgent",
      );
      if (!authResult) return res.sendStatus(403);

      const { serial, name, model, ip } = data.body;
      if (!serial || !name || !model || !ip) return res.sendStatus(400);

      const queryInsert = `INSERT INTO printers (v_serial, v_name, v_model, v_ip) VALUES (?, ?, ?, ?)`;
      const dbRes = await app.executeQuery(app.db, queryInsert, [serial, name, model, ip]);
      if (dbRes[0]) {
        console.log(dbRes[0]);
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    } catch (e) {
      console.log("ERROR: POST /api/printers/");
      console.log(e);
      res.sendStatus(500);
    }
  });

  // DELETE /api/printers/:serial — supprimer une imprimante (admin seulement)
  app.delete("/api/printers/:serial", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      if (!data.userId) return res.sendStatus(401);

      const authResult = await data.userAuthorization.validateUserAuth(
        app,
        data.userId,
        "myFabAgent",
      );
      if (!authResult) return res.sendStatus(403);

      const queryDelete = `DELETE FROM printers WHERE v_serial = ?`;
      const dbRes = await app.executeQuery(app.db, queryDelete, [req.params.serial]);
      if (dbRes[0]) {
        console.log(dbRes[0]);
        return res.sendStatus(500);
      }
      delete printerStatusCache[req.params.serial];
      res.sendStatus(200);
    } catch (e) {
      console.log("ERROR: DELETE /api/printers/:serial");
      console.log(e);
      res.sendStatus(500);
    }
  });
}
