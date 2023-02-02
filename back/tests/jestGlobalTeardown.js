const fs = require("fs");
const dbName = require("./databaseName");
const executeQuery = require("../functions/dataBase/executeQuery").run;
require("dotenv").config();

module.exports = async () => {
  if (!process.env.DB_DATABASE.endsWith("test")) return;

  const connection = await require("../functions/dataBase/createConnection").getDb();
  await executeQuery(connection, "DROP DATABASE ??", [dbName]);

  connection.end();

  //Remove all STL files for tests
  await new Promise((resolve) => {
    fs.readdir(__dirname + "/../data/files/stl/", (err, files) => {
      files.forEach((file) => {
        if (file.endsWith("-test.STL")) fs.unlinkSync(__dirname + "/../data/files/stl/" + file);
      });
    });
    resolve();
  });
};
