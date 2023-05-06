const axios = require("axios");
require("dotenv").config();
const target = process.env.TARGET?.trim();
const generateCode = require("../../back/functions/userAuthorization").generateCode;
const readline = require("readline");

async function cmd() {
  const res = await makeRequest();
  if (res.status === 200) {
    console.log("0: Agent back");
    console.log("1: Service back");
    console.log("2: Agent front");
    console.log("3: Service front");
    const resultQuestion = await askQuestion("Select a value [0-3] : ");
    console.log("\n");
    switch (resultQuestion) {
      case "0":
        console.log("Agent back :\n");
        console.log(res.data.back.agent);
        break;
      case "1":
        console.log("Service back :\n");
        console.log(res.data.back.service);
        break;
      case "2":
        console.log("Agent front :\n");
        console.log(res.data.front.agent);
        break;
      case "3":
        console.log("Service front :\n");
        console.log(res.data.front.service);
        break;

      default:
        console.log(`Value is '${resultQuestion}' not accepted`);
        break;
    }
  } else if (res.status === 404) {
    console.log("Special code is invalid");
  } else {
    console.log(res);
  }
}

async function makeRequest() {
  const code = generateCode(new Date());
  return await new Promise(async (resolve, reject) => {
    await axios({
      method: "get",
      url: target + "/api/agent/getLogs",
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

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

cmd();
