const fs = require("fs");

/**
 * @swagger
 * /files/{type}/{tag}:
 *   get:
 *     summary: Test to detect if the server is responding correctly
 *     parameters:
 *     - name: "type"
 *       in: "path"
 *       description: "Type of the file"
 *       required: true
 *       type: "string"
 *     - name: "tag"
 *       in: "path"
 *       description: "Tag of the file"
 *       required: true
 *       type: "string"
 *     responses:
 *       200:
 *        description: "All good"
 */

const allowedFileType = ["image"];
module.exports.getImage = getImage;
async function getImage(data) {
  if (!data.params || !data.params.type || !data.params.tag || !allowedFileType.includes(data.params.type)) {
    return {
      type: "code",
      code: 400,
    };
  }
  if (!fs.existsSync(`./data/files/${data.params.type}/${data.params.tag}`)) {
    return {
      type: "file",
      code: 200,
      name: `logo.png`,
      root: "defaultFiles",
    };
  }

  return {
    type: "file",
    code: 200,
    name: `${data.params.type}/${data.params.tag}`,
  };
}

module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/files/:type/:tag", async function (req, res) {
    const data = await require("../../functions/apiActions").prepareData(app, req, res);
    try {
      const result = await getImage(data);
      await require("../../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/files/:type/:tag");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
