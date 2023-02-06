const mysql = require("mysql");
require("dotenv").config();
let isTest = false;
module.exports.isTest = isTest;

/* c8 ignore start */
function getDb() {
  const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectTimeout: 10000,
  };
  const db = mysql.createConnection(options);
  return db;
}

module.exports.getDb = getDb;

module.exports.open = async ({ callback, dontNeedToUse, isTest } = {}) => {
  const db = getDb();

  return await new Promise((resolve, reject) => {
    db.connect(function (err) {
      if (err) {
        console.log(err);
        console.log("Can not reach the database");
        process.exit(1);
      }
      db.query("USE ??", [isTest ? process.env.DB_DATABASE + "test" : process.env.DB_DATABASE], function (error, results, fields) {
        if (error) {
          if (dontNeedToUse) {
            if (callback) callback(db);
            resolve(db);
            return;
          } else {
            console.log("Can not use database : '" + process.env.DB_DATABASE + "'");
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
