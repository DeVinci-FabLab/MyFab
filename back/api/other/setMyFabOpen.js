const fs = require("fs");

module.exports.changeOpenMyFab = changeOpenMyFab;
async function changeOpenMyFab(data) {
  const resCheckCode = await data.userAuthorization.checkSpecialCode(data.specialcode);
  if (!resCheckCode || !data.body || typeof data.body.status !== "boolean") {
    return {
      type: "code",
      code: 404,
    };
  }
  if (!data.body.status) data.app.cookiesList = {};
  const serviceData = JSON.parse(fs.readFileSync(__dirname + "/../../data/serviceData.json"));
  serviceData.myFabOpen = data.body.status;
  fs.writeFileSync(__dirname + "/../../data/serviceData.json", JSON.stringify(serviceData));

  return {
    type: "code",
    code: 200,
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  app.post("/api/setMyFabOpen/", async function (req, res) {
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
