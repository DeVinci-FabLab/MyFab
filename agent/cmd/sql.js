const axios = require("axios");
require("dotenv").config();
const target = process.env.TARGET?.trim();
const generateCode = require("../../back/functions/userAuthorization").generateCode;
const readline = require("readline");

async function cmd() {
  const sqlQuery = await askQuestion("Sql query : ");
  const res = await makeRequest(sqlQuery);
  if (res.status === 200) {
    if (res.data[0]) {
      console.log(res.data[0]);
    } else if (res.data[1].length === undefined || res.data[1].length === 0) {
      console.log(res.data[1]);
    } else {
      console.log(res.data[1]);
      //Améliorer affichage ici
    }
  } else if (res.status === 404) {
    console.log("Special code is invalid");
  } else {
    console.log(res);
  }
}

async function makeRequest(query) {
  const code = generateCode(new Date());
  return await new Promise(async (resolve, reject) => {
    await axios({
      method: "post",
      url: target + "/api/agent/sql",
      headers: {
        specialcode: code,
      },
      data: {
        querry: query,
      },
    })
      .then(function (response) {
        // handle success
        resolve(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
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
