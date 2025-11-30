const fs = require("fs");

module.exports.action = action;
async function action(app) {
  const querySelectFiles = `SELECT tf.i_id AS id,
                              tf.v_fileServerName AS fileName
                              FROM ticketfiles AS tf
                              INNER JOIN printstickets AS pt ON tf.i_idTicket = pt.i_id
                              LEFT OUTER JOIN gd_status AS stat ON pt.i_status = stat.i_id
                              WHERE pt.dt_modificationDate < DATE_SUB(CURDATE(), INTERVAL 2 YEAR)
                              AND stat.b_isOpen = 0
                              AND tf.b_deleted = 0;`;
  const dbResSelectFiles = await app.executeQuery(app.db, querySelectFiles, []);
  if (dbResSelectFiles[0]) return console.log(dbResSelectFiles[0]);

  for (const element of dbResSelectFiles[1]) {
    const id = element.id;
    const fileName = element.fileName;
    // Delete file from server
    if (fs.existsSync(__dirname + "/../../../data/files/stl/" + fileName)) {
      fs.unlinkSync(__dirname + "/../../../data/files/stl/" + fileName);
    }

    // Delete update file in DB
    const queryDeleteFile = `UPDATE ticketfiles
                              SET b_deleted = 1, dt_modificationDate = NOW()
                              WHERE i_id = ?;`;
    const dbResDeleteFile = await app.executeQuery(app.db, queryDeleteFile, [
      id,
    ]);
    if (dbResDeleteFile[0]) return console.log(dbResDeleteFile[0]);
  }
}
