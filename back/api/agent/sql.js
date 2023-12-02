module.exports.sql = sql;
async function sql(data) {
  const resCheckCode = await data.userAuthorization.checkSpecialCode(
    data.specialcode
  );
  if (!resCheckCode || !data.body || !data.body.querry) {
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

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.post("/agent/sql/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(
        app,
        req,
        res
      );
      const result = await sql(data);
      await require("../../functions/apiActions").sendResponse(
        req,
        res,
        result
      );
    } catch (error) {
      console.log("ERROR: POST /api/agent/sql/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
