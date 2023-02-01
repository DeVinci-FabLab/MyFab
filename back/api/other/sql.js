module.exports.sql = sql;
async function sql(data) {
  const resCheckCode = await data.userAuthorization.checkSpecialCode(data.specialcode);
  const userIdAgent = data.userId;
  if (!resCheckCode || !userIdAgent || !data.body || !data.body.querry) {
    return {
      type: "code",
      code: 404,
    };
  }

  const res = await data.app.executeQuery(data.app.db, data.body.querry, []);

  return {
    type: "json",
    code: 200,
    json: res,
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  app.post("/api/sql/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(app, req, res);
      const result = await sql(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/sql/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
