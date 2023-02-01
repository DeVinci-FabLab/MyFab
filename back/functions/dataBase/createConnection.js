const mysql = require("mysql");
const config = require("../../config.json");

/* c8 ignore start */
function getDb() {
  const options = {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    connectTimeout: 10000,
  };
  if (config.db.port) options.port = config.db.port;
  const db = mysql.createConnection(options);
  return db;
}

module.exports.getDb = getDb;

module.exports.open = async (callback, dontNeedToUse) => {
  const db = getDb();

  return await new Promise((resolve, reject) => {
    db.connect(function (err) {
      if (err) {
        console.log(err);
        console.log("Can not reach the database");
        process.exit(1);
      }
      db.query("USE ??", [config.db.database], function (error, results, fields) {
        if (error) {
          if (dontNeedToUse) {
            if (callback) callback(db);
            resolve(db);
            return;
          } else {
            console.log("Can not use database : '" + config.db.database + "'");
            process.exit(1);
          }
        }
        if (callback) callback(db);
        resolve(db);
      });
    });
  });
};

module.exports.close = (db) => {
  db.end();
  return;
};
/* c8 ignore stop */
