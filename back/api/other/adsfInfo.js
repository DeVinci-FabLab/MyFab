//DELETE THIS FILE
const fs = require("fs");

module.exports.changeOpenMyFab = changeOpenMyFab;
async function changeOpenMyFab(data) {
  const resCheckCode = await data.userAuthorization.checkSpecialCode(data.specialcode);
  if (!resCheckCode) {
    return {
      type: "code",
      code: 404,
    };
  }
  const res = fs.existsSync(__dirname + "/../../data/samlResult.json") ? JSON.parse(fs.readFileSync(__dirname + "/../../data/samlResult.json")) : { file: "doesn't exist" };

  return {
    type: "json",
    code: 200,
    json: res,
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/adsfInfo/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await changeOpenMyFab(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/setMyFabOpen/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
