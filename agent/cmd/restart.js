const axios = require("axios");
require("dotenv").config();
const target = process.env.TARGET?.trim();
const generateCode =
  require("../../back/functions/userAuthorization").generateCode;

async function cmd() {
  const res = await makeRequest();
  if (res.status === 200) {
    console.log("MyFab has restarted");
  } else if (res.status === 404) {
    console.log("Special code is invalid");
  } else {
    console.log(res);
  }
}

async function makeRequest() {
  const code = generateCode(new Date());
  return await new Promise(async (resolve, reject) => {
    console.log(target + "/api/agent/restart");
    await axios({
      method: "get",
      url: target + "/api/agent/restart",
      headers: {
        specialcode: code,
      },
    })
      .then(function (response) {
        // handle success
        resolve(response);
      })
      .catch(function (error) {
        // handle error
        resolve(error.response);
      });
  });
}

cmd();
