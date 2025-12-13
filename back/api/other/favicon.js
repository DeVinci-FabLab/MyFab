// Pas de swagger le lien est /favicon.ico

const allowedFileType = ["image"];
module.exports.getImage = getImage;
async function getImage(data) {
  return {
    type: "file",
    code: 200,
    name: `favicon.ico`,
    root: "defaultFiles",
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/favicon.ico", async function (req, res) {
    const data = await require("../../functions/apiActions").prepareData(
      app,
      req,
      res
    );
    try {
      const result = await getImage(data);
      await require("../../functions/apiActions").sendResponse(
        req,
        res,
        result
      );
    } catch (error) {
      console.log("ERROR: GET /favicon.ico");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
