async function updateUser(app, email) {
  const queryUpdateUser = `UPDATE users SET dt_lastUsed = NOW(), dt_ruleSignature = NOW() WHERE v_email = ?;`;
  const dbResUpdateUser = await app.executeQuery(app.db, queryUpdateUser, []);
  if (dbResUpdateUser[0]) console.log(dbResUpdateUser[0]);
}

module.exports.action = action;
async function action(app) {
  await updateUser(app, "root@root.com");
  await updateUser(app, "system@system.com");
}
