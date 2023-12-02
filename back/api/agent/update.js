module.exports.update = update;
async function update(data) {
  const resBack = await data.sendApiRequest("http://back:2224/gitPull");
  const resFront = await data.sendApiRequest("http://front:2224/gitPull");

  return {
    type: "json",
    code: 200,
    json: { back: resBack, front: resFront },
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/agent/update/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(
        app,
        req,
        res
      );
      const result = await update(data);
      await require("../../functions/apiActions").sendResponse(
        req,
        res,
        result
      );
    } catch (error) {
      console.log("ERROR: GET /api/agent/update/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
