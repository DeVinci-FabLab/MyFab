const axios = require("axios");

module.exports.getLogs = getLogs;
async function getLogs(data) {
  const resCheckCode = await data.userAuthorization.checkSpecialCode(
    data.specialcode
  );
  if (!resCheckCode) {
    return {
      type: "code",
      code: 404,
    };
  }

  const resBack = await data.backGetLogs();
  const resFront = await data.frontGetLogs();

  return {
    type: "json",
    code: 200,
    json: {
      back: resBack
        ? resBack.status === 200
          ? resBack.data
          : { status: resBack.status }
        : { status: 404 },
      front: resFront
        ? resFront.status === 200
          ? resFront.data
          : { status: resFront.status }
        : { status: 404 },
    },
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/agent/getLogs/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(
        app,
        req,
        res
      );

      data.backGetLogs = async () => {
        return await new Promise(async (resolve, reject) => {
          try {
            return await axios({
              method: "get",
              url: "http://back:2224/logs",
            })
              .then(function (response) {
                // handle success
                resolve(response);
              })
              .catch(function (error) {
                // handle error
                resolve(error.response);
              });
          } catch {
            resolve(404);
          }
        });
      };

      data.frontGetLogs = async () => {
        return await new Promise(async (resolve, reject) => {
          try {
            return await axios({
              method: "get",
              url: "http://front:2224/logs",
            })
              .then(function (response) {
                // handle success
                resolve(response);
              })
              .catch(function (error) {
                // handle error
                resolve(error.response);
              });
          } catch {
            resolve(404);
          }
        });
      };

      const result = await getLogs(data);
      await require("../../functions/apiActions").sendResponse(
        req,
        res,
        result
      );
    } catch (error) {
      console.log("ERROR: GET /api/agent/getLogs/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
