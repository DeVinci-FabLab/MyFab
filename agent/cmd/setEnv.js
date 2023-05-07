const axios = require("axios");
require("dotenv").config();
const target = process.env.TARGET?.trim();
const generateCode = require("../../back/functions/userAuthorization").generateCode;
const readline = require("readline");

async function cmd() {
  console.log("Select action :");
  console.log("0: add");
  console.log("1: update");
  console.log("2: remove");
  console.log("3: get");
  const resultQuestionAction = await askQuestion("Select a value [0-3] : ");
  console.log();
  const action =
    resultQuestionAction === "0"
      ? "add"
      : resultQuestionAction === "1"
      ? "update"
      : resultQuestionAction === "2"
      ? "remove"
      : resultQuestionAction === "3"
      ? "get"
      : null;

  if (!action) {
    console.log(`Value is '${resultQuestionAction}' not accepted`);
    return;
  }

  const resultQuestionKey = action !== "get" ? await askQuestion(`Type the key to ${action} : `) : null;
  if (resultQuestionKey) console.log();

  const resultQuestionValue =
    action !== "remove" && action !== "get" ? await askQuestion(`Type the value to ${action} : `) : null;
  if (resultQuestionValue) console.log();

  const res = await makeRequest({ action, resultQuestionKey, resultQuestionValue });
  if (!res) {
    console.log("Service not responding");
  } else if (res.status === 200 && res.data.env) {
    console.log(res.data.env);
  } else if (res.status === 200) {
    console.log("Env changed");
  } else if (res.status === 404) {
    console.log("Special code is invalid");
  } else if (res.status === 400) {
    console.log("Special code is invalid");
  } else {
    console.log(res.data + " : " + res.status);
  }
}

async function makeRequest({ action, resultQuestionKey: key, resultQuestionValue: value }) {
  const code = generateCode(new Date());
  return await new Promise(async (resolve, reject) => {
    await axios({
      method: "post",
      url: target + "/api/agent/env",
      headers: {
        specialcode: code,
      },
      params: { action, key, value },
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
