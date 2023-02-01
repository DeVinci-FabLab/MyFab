/* c8 ignore start */
const sha256 = require("sha256");
const config = require("../config.json");

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
  const banColumn = ["i_id", "v_name", "v_description", "v_idDiscordRole", "v_color", "b_isProtected", "v_discordPrefix"];
  for (const column of resDescGdRole[1]) {
    if (!banColumn.includes(column.Field)) {
      if (columnToSee.length !== 0) columnToSee = columnToSee + ", gd_roles." + column.Field + " AS '" + column.Field.split("_")[1] + "'";
      else columnToSee = "gd_roles." + column.Field + " AS '" + column.Field.split("_")[1] + "'";
    }
  }

  const resTestIfCorrelationExist = await app.executeQuery(
    app.db,
    "SELECT " + columnToSee + " FROM `rolescorrelation` INNER JOIN gd_roles ON rolescorrelation.i_idRole = gd_roles.i_id WHERE rolescorrelation.i_idUser = ?",
    [userId]
  );
  // Error with the sql request
  if (resTestIfCorrelationExist[0]) {
    console.log(resTestIfCorrelationExist[0]);
    return;
  }
  if (resTestIfCorrelationExist[1].length === 0) {
    const emptyRes = {};
    for (const column of resDescGdRole[1]) {
      if (!banColumn.includes(column.Field)) emptyRes[column.Field.split("_")[1]] = 0;
    }
    return emptyRes;
  }
  const userAuth = resTestIfCorrelationExist[1].reduce(authReducer);
  return userAuth;
}

module.exports.validateUserAuth = async (app, userId, authName) => {
  const userAuth = await getUserAuth(app, userId);
  if (userAuth[authName] === 1 || userAuth[authName] === 0) return userAuth[authName] ? true : false;
  else return null;
};

module.exports.checkSpecialCode = async (codeToTest) => {
  if (!config.specialTocken || !codeToTest) {
    return false;
  }
  const nowDate = new Date();
  const tockenNow = sha256(
    config.specialTocken + (nowDate.getMonth() + 1) + Math.trunc(nowDate.getSeconds() / 10) + nowDate.getFullYear() + nowDate.getMinutes() + nowDate.getHours()
  );
  if (tockenNow === codeToTest) return true;

  nowDate.setSeconds(nowDate.getSeconds() - 10);
  const tockenPrev = sha256(
    config.specialTocken + (nowDate.getMonth() + 1) + Math.trunc(nowDate.getSeconds() / 10) + nowDate.getFullYear() + nowDate.getMinutes() + nowDate.getHours()
  );
  if (tockenPrev === codeToTest) return true;
  return false;
};
/* c8 ignore stop */
