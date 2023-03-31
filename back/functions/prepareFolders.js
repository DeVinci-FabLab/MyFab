const fs = require("fs");

module.exports.prepareFolders = () => {
  if (!fs.existsSync(__dirname + "/../tmp")) fs.mkdirSync(__dirname + "/../tmp");
  fs.readdir(__dirname + "/../tmp", (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlinkSync(__dirname + "/../tmp/" + file);
    }
  });

  //Create files/folders if not exist
  if (!fs.existsSync(__dirname + "/../data")) fs.mkdirSync(__dirname + "/../data");
  if (!fs.existsSync(__dirname + "/../data/files")) fs.mkdirSync(__dirname + "/../data/files");
  if (!fs.existsSync(__dirname + "/../data/files/image")) fs.mkdirSync(__dirname + "/../data/files/image");
  if (!fs.existsSync(__dirname + "/../data/files/stl")) fs.mkdirSync(__dirname + "/../data/files/stl");
  if (!fs.existsSync(__dirname + "/../data/serviceData.json"))
    fs.writeFileSync(__dirname + "/../data/serviceData.json", JSON.stringify({ myFabOpen: true }));
  if (fs.existsSync(__dirname + "/../data/samlResult.json")) fs.unlinkSync(__dirname + "/../data/samlResult.json"); //DELETE THIS
};
