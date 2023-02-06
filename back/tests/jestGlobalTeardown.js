const fs = require("fs");
const executeQuery = require("../functions/dataBase/executeQuery").run;
require("dotenv").config();

module.exports = async () => {
  const dbName = process.env.DB_DATABASE + "test";

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
