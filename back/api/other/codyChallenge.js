const sha256 = require("sha256");
const fs = require("fs");
const filePath = "./data/codyChallengeScoreBoard.json";

/**
 * @swagger
 * /codyChallenge:
 *   post:
 *     summary:
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *        description: "All good"
 */

function calculateKey(jwt, score) {
  const string = `${jwt}${score}${jwt}`;
  return sha256(string);
}

function readJsonFile() {
  try {
    // Vérifier si le fichier existe
    if (fs.existsSync(filePath)) {
      // Lire le contenu du fichier
      const data = fs.readFileSync(filePath, "utf8");
      // Retourner le contenu du fichier en tant qu'objet JSON
      return JSON.parse(data);
    } else {
      // Si le fichier n'existe pas, retourner les valeurs par défaut
      return { scoreboard: [], cheaters: [] };
    }
    /* c8 ignore start */
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier JSON:", error);
    // Retourner les valeurs par défaut en cas d'erreur
    return { scoreboard: [], cheaters: [] };
  }
  /* c8 ignore stop */
}

module.exports.codyChallengePost = codyChallengePost;
async function codyChallengePost(data) {
  // unauthenticated user
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return {
      type: "code",
      code: 401,
    };
  }

  if (
    !data?.body?.score ||
    !Number.isInteger(data.body.score) ||
    !data?.body?.key
  ) {
    return {
      type: "code",
      code: 400,
    };
  }

  const querySelect = `SELECT u.v_email AS "email"
                      FROM users AS u
                      WHERE u.i_id = ?`;

  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [
    userIdAgent,
  ]);
  // The sql request has an error
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 200,
    };
  }
  /* c8 ignore stop */
  const email = dbRes[1][0].email;
  const jwt = data.jwt;
  const score = data.body.score;
  const key = data.body.key;
  const trueKey = calculateKey(jwt, score);
  const date = new Date();
  const value = {
    email,
    score,
    date,
  };
  const jsonData = readJsonFile();

  if (key === trueKey) {
    jsonData.scoreboard.push(value);
    jsonData.scoreboard.sort((a, b) => a.score - b.score);
    jsonData.scoreboard.reverse();
  } else {
    jsonData.cheaters.push(value);
    jsonData.cheaters.sort((a, b) => a.score - b.score);
    jsonData.cheaters.reverse();
  }

  fs.writeFileSync(filePath, JSON.stringify(jsonData));

  return {
    type: "code",
    code: 200,
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.post("/api/codyChallenge/", async function (req, res) {
    const data = await require("../../functions/apiActions").prepareData(
      app,
      req,
      res
    );
    data.jwt = req.headers.dvflcookie;
    try {
      const result = await codyChallengePost(data);
      await require("../../functions/apiActions").sendResponse(
        req,
        res,
        result
      );
    } catch (error) {
      console.log("ERROR: POST /api/codyChallenge/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
