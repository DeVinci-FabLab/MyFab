const fs = require("fs");
const dbName = require("./databaseName");
const executeQuery = require("../functions/dataBase/executeQuery").run;

module.exports = async () => {
  const connection = await require("../functions/dataBase/createConnection").getDb();
  await executeQuery(connection, "DROP DATABASE ??", [dbName]);

  connection.end();
  fs.writeFileSync(__dirname + "/../config.json", await require(__dirname + "/jestGlobalSetup.js").getRealConfig());

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
