/* c8 ignore start */
const sha256 = require("sha256");
require("dotenv").config();
const jwtSecret = process.env.SPECIALTOKEN;

const authReducer = (previousValue, currentValue) => {
  const keys = Object.keys(currentValue);
  for (const key of keys) {
    if (previousValue[key] === 0) previousValue[key] = currentValue[key];
  }
  return previousValue;
};

module.exports.getUserAuth = getUserAuth;
async function getUserAuth(app, userId) {
  const resDescGdRole = await app.executeQuery(app.db, "DESC `gd_roles`", []);

  // Error with the sql request
  if (resDescGdRole[0]) {
    console.log(resDescGdRole[0]);
    return "ERROR";
  }

  let columnToSee = "";
  const banColumn = [
    "i_id",
    "v_name",
    "v_description",
    "v_idDiscordRole",
    "v_color",
    "b_isProtected",
    "v_discordPrefix",
  ];
  for (const column of resDescGdRole[1]) {
    if (!banColumn.includes(column.Field)) {
      if (columnToSee.length !== 0)
        columnToSee =
          columnToSee +
          ", gd_roles." +
          column.Field +
          " AS '" +
          column.Field.split("_")[1] +
          "'";
      else
        columnToSee =
          "gd_roles." +
          column.Field +
          " AS '" +
          column.Field.split("_")[1] +
          "'";
    }
  }

  const emptyRes = {};
  for (const column of resDescGdRole[1]) {
    if (!banColumn.includes(column.Field))
      emptyRes[column.Field.split("_")[1]] = 0;
  }

  const resTestIfCorrelationExist = await app.executeQuery(
    app.db,
    "SELECT " +
      columnToSee +
      " FROM `rolescorrelation` INNER JOIN gd_roles ON rolescorrelation.i_idRole = gd_roles.i_id WHERE rolescorrelation.i_idUser = ?",
    [userId]
  );
  // Error with the sql request
  if (resTestIfCorrelationExist[0]) {
    console.log(resTestIfCorrelationExist[0]);
    return;
  }

  const userAuth =
    resTestIfCorrelationExist[1].length === 0
      ? emptyRes
      : resTestIfCorrelationExist[1].reduce(authReducer);
  const resGetRulesValid = await app.executeQuery(
    app.db,
    `SELECT
      CASE WHEN dt_ruleSignature IS NULL THEN FALSE ELSE DATE_FORMAT(DATE_ADD(dt_ruleSignature, INTERVAL 4 MONTH),'%Y') = DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 4 MONTH),'%Y') END AS "acceptedRule"
      FROM users AS u
      WHERE u.i_id = ?`,
    [userId]
  );

  if (resGetRulesValid[0] || resGetRulesValid[1].length !== 1) {
    console.log(resGetRulesValid[0]);
    return;
  }

  userAuth.acceptedRule = resGetRulesValid[1][0].acceptedRule;

  return userAuth;
}

module.exports.validateUserAuth = async (app, userId, authName) => {
  const userAuth = await getUserAuth(app, userId);
  if (userAuth[authName] === 1 || userAuth[authName] === 0)
    return userAuth[authName] ? true : false;
  else return null;
};
/* c8 ignore stop */

module.exports.generateCode = generateCode;
function generateCode(date) {
  const tocken = sha256(
    jwtSecret +
      (date.getUTCMonth() + 1) +
      Math.trunc(date.getUTCSeconds() / 10) +
      date.getUTCFullYear() +
      date.getUTCMinutes() +
      date.getUTCHours()
  );
  return tocken;
}

module.exports.checkSpecialCode = async (codeToTest) => {
  if (!jwtSecret || !codeToTest) {
    return false;
  }
  const nowDate = new Date();
  const tockenNow = generateCode(nowDate);
  if (tockenNow === codeToTest) return true;

  nowDate.setSeconds(nowDate.getSeconds() - 10);
  const tockenPrev = generateCode(nowDate);
  if (tockenPrev === codeToTest) return true;
  return false;
};
