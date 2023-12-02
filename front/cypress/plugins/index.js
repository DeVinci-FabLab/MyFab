const { existsSync, rmdir } = require("fs");

module.exports = (on, config) => {
  on("task", {
    deleteFolder(folderName) {
      if (!existsSync(folderName)) return null;

      return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
          if (err) {
            console.error(err);
            return reject(err);
          }
          resolve(null);
        });
      });
    },
  });
};
