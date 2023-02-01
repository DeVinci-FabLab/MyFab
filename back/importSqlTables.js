const fs = require("fs");
const sha256 = require("sha256");

async function importSqlTables(file) {
  const db = await require("./functions/dataBase/createConnection").open(null, true);
  const executeQuery = require("./functions/dataBase/executeQuery").run;
  const dbName = require("./config.json").db.database;
  await executeQuery(db, "CREATE DATABASE IF NOT EXISTS ??", [dbName]);
  await executeQuery(db, "USE ??", [dbName]);
  await new Promise((resolve) => {
    fs.readFile(file, "utf8", async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const lineData = data.split("\n");
      for (const line of lineData) {
        if ((line !== "\r" || line !== "") && !line.startsWith("--")) {
          const res = await executeQuery(db, line, []);
          if (res[0] && res[0].code !== "ER_DUP_ENTRY" && res[0].sql.length > 5) console.log(res[0]);
        }
      }

      await require("./functions/dataBase/createConnection").close(db);
      resolve();
    });
  });
}

async function addRootUser() {
  const db = await require("./functions/dataBase/createConnection").open();
  const executeQuery = require("./functions/dataBase/executeQuery").run;
  const dbName = require("./config.json").db.database;
  await executeQuery(db, "CREATE DATABASE IF NOT EXISTS ??", [dbName]);
  await executeQuery(db, "USE ??", [dbName]);

  const rootPassword = require("./functions/makeid").makeid(30);
  const queryInsertRootUser = `INSERT INTO users
                            (v_firstName, v_lastName, v_email, v_password, dt_creationdate, v_language, dt_ruleSignature, b_deleted, b_visible, b_mailValidated, b_isMicrosoft, v_title)
                            VALUES
                            ('root', 'root', 'root@root.com', ?, current_timestamp(), 'fr', current_timestamp(), '0', '0', '1', '0', 'Root');`;
  const res = await executeQuery(db, queryInsertRootUser, [sha256(rootPassword)]);
  if (res[0]) {
    await require("./functions/dataBase/createConnection").close(db);
    return;
  }
  const queryInsertRoolRole = `INSERT INTO rolescorrelation (i_idUser, i_idRole)
                                VALUES ((SELECT i_id FROM users WHERE v_email = 'root@root.com'),
                                (SELECT i_id FROM gd_roles WHERE v_name = 'Administrateur'))`;
  const resInserRoleRootUser = await executeQuery(db, queryInsertRoolRole, []);
  if (resInserRoleRootUser[0]) {
    await require("./functions/dataBase/createConnection").close(db);
    return;
  }
  await fs.writeFileSync("./data/defaultRootPassword", rootPassword + "\n");

  const systemPassword = require("./functions/makeid").makeid(64);
  const queryInsertSystemUser = `INSERT INTO users
                            (v_firstName, v_lastName, v_email, v_password, dt_creationdate, v_language, dt_ruleSignature, b_deleted, b_visible, b_mailValidated, b_isMicrosoft, v_title)
                            VALUES
                            ('Système', '', 'system@system.com', ?, current_timestamp(), 'fr', current_timestamp(), '0', '0', '1', '0', 'Système');`;
  const resInsertSystemUser = await executeQuery(db, queryInsertSystemUser, [systemPassword]);
  await require("./functions/dataBase/createConnection").close(db);
  return;
}

async function start() {
  await importSqlTables("./myFabUltimateDb.sql");
  await importSqlTables("./globalData.sql");
  await addRootUser();
  console.log("The database is ready");
}

start();
