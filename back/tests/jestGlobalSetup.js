const dbName = require("./databaseName");
const executeQuery = require("../functions/dataBase/executeQuery").run;
require("dotenv").config();

module.exports = async () => {
  if (!process.env.DB_DATABASE.endsWith("test")) {
    console.log(`The database name : ${process.env.DB_DATABASE} doesn't finish with "test"`);
    return;
  }
  const connection = await require("../functions/dataBase/createConnection").getDb();
  await executeQuery(connection, "DROP DATABASE ??", [dbName]);
  await executeQuery(connection, "CREATE DATABASE IF NOT EXISTS ??", [dbName]);
  await executeQuery(connection, "USE ??", [dbName]);
  await require("./importSqlTables.js").importSqlTables(connection, __dirname + "/../myFabUltimateDb.sql");
  await require("./importSqlTables.js").importSqlTables(connection, __dirname + "/../globalData.sql");
  connection.end();
};
