module.exports.restart = restart;
async function restart(data) {
  const resCheckCode = await data.userAuthorization.checkSpecialCode(
    data.specialcode
  );
  if (!resCheckCode) {
    return {
      type: "code",
      code: 404,
    };
  }

  const resBack = await data.sendApiRequest("http://back:2224/restart");
  const resFront = await data.sendApiRequest("http://front:2224/restart");

  return {
    type: "json",
    code: 200,
    json: { back: resBack, front: resFront },
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/agent/restart/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(
        app,
        req,
        res
      );
      const result = await restart(data);
      await require("../../functions/restart").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/agent/restart/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
