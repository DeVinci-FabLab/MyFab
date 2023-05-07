const axios = require("axios");
const qs = require("qs");

module.exports.env = env;
async function env(data) {
  const resCheckCode = await data.userAuthorization.checkSpecialCode(
    data.specialcode
  );
  if (!resCheckCode) {
    return {
      type: "code",
      code: 404,
    };
  }

  const resBack = await data.backEnv(data.body);
  if (resBack !== 200) {
    return {
      type: "code",
      code: resBack,
    };
  }

  const resFront = await data.frontEnv();

  return {
    type: "json",
    code: 200,
    json: { back: resBack, front: resFront },
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.post("/api/agent/env/", async function (req, res) {
    try {
      const data = await require("../../functions/apiActions").prepareData(
        app,
        req,
        res
      );

      data.backEnv = async (queryData) => {
        return await new Promise(async (resolve, reject) => {
          try {
            return await axios({
              method: "post",
              url: "http://back:2224/env",
              data: queryData,
            })
              .then(function (response) {
                // handle success
                resolve(response.status);
              })
              .catch(function (error) {
                // handle error
                resolve(error.response.status);
              });
          } catch {
            resolve(404);
          }
        });
      };

      data.frontEnv = async () => {
        return await new Promise(async (resolve, reject) => {
          try {
            return await axios({
              method: "post",
              url: "http://front:2224/env",
            })
              .then(function (response) {
                // handle success
                resolve(response.status);
              })
              .catch(function (error) {
                // handle error
                resolve(error.response.status);
              });
          } catch {
            resolve(404);
          }
        });
      };

      const result = await env(data);
      await require("../../functions/apiActions").sendResponse(
        req,
        res,
        result
      );
    } catch (error) {
      console.log("ERROR: POST /api/agent/env/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
