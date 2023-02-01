const fs = require("fs");
const dbName = require("./databaseName");
const executeQuery = require("../functions/dataBase/executeQuery").run;
let realConfig = null;

module.exports = async () => {
  realConfig = fs.readFileSync(__dirname + "/../config.json");
  if (!fs.existsSync(__dirname + "/../config_copy.json")) fs.writeFileSync(__dirname + "/../config_copy.json", realConfig);
  const config = JSON.parse(realConfig);
  config.db.database = dbName;
  config.activelogs = false;
  fs.writeFileSync(__dirname + "/../config.json", JSON.stringify(config));

  const connection = await require("../functions/dataBase/createConnection").getDb();
  await executeQuery(connection, "DROP DATABASE ??", [dbName]);
  await executeQuery(connection, "CREATE DATABASE IF NOT EXISTS ??", [dbName]);
  await executeQuery(connection, "USE ??", [dbName]);
  await require("./importSqlTables.js").importSqlTables(connection, __dirname + "/../myFabUltimateDb.sql");
  await require("./importSqlTables.js").importSqlTables(connection, __dirname + "/../globalData.sql");
  connection.end();
};

module.exports.getRealConfig = async () => {
  return realConfig;
};
