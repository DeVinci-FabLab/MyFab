module.exports.action = action;
async function action(app) {
  const querySelectLastUsedUsers = `SELECT i_idUser AS idUser, MAX(dt_lastUsed) AS lastUsed FROM usercookies GROUP BY i_idUser;`;
  const dbResLastUsed = await app.executeQuery(
    app.db,
    querySelectLastUsedUsers,
    []
  );
  if (!dbResLastUsed[0]) {
    for (const element of dbResLastUsed[1]) {
      const queryUpdateLastUsed = `UPDATE users SET dt_lastUsed = ? WHERE i_id = ? AND dt_lastUsed < ?;`;
      await app.executeQuery(app.db, queryUpdateLastUsed, [
        element.lastUsed,
        element.idUser,
        element.lastUsed,
      ]);
    }
  }

  // DELETE expired cookies
  const queryDeleteExpiredCookies = `DELETE FROM usercookies WHERE dt_expireDate < CURDATE();`;
  await app.executeQuery(app.db, queryDeleteExpiredCookies, []);

  // DELETE unused cookies
  const queryDeleteUnusedCookies = `DELETE FROM usercookies WHERE dt_expireDate IS NULL AND dt_lastUsed < DATE_ADD(NOW(), INTERVAL -1 MONTH);`;
  await app.executeQuery(app.db, queryDeleteUnusedCookies, []);
}
