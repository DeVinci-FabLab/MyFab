const fs = require("fs");

module.exports.importSqlTables = async (db, file) => {
  const executeQuery = require("../functions/dataBase/executeQuery").run;
  await new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const lineData = data.split("\n");
      for (const line of lineData) {
        if ((line !== "\r" || line !== "") && !line.startsWith("--")) {
          const res = await executeQuery(db, line, []);
          if (res[0] && (res[0].sql == null || res[0].sql.length > 5)) console.log(res[0]);
        }
      }

      resolve();
    });
  });
};
