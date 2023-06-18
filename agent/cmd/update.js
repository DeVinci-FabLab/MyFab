const axios = require("axios");
require("dotenv").config();
const target = process.env.TARGET?.trim();

async function cmd() {
  const res = await makeRequest();
  if (res.status === 200) {
    console.log(res.data);
  } else {
    console.log(res);
  }
}

async function makeRequest() {
  return await new Promise(async (resolve, reject) => {
    await axios({
      method: "get",
      url: target + "/api/agent/update",
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
