/* c8 ignore start */
module.exports.createNewUserAndLog = async (db, executeQuery, userName) => {
  const selectRes = await executeQuery(db, "SELECT 1 FROM `users` WHERE v_email = ?", [userName + "@test.com"]);
  if (selectRes[1].length !== 0) return 0;
  await executeQuery(
    db,
    "INSERT INTO `users` (`i_id`, `v_firstName`, `v_lastName`, `v_email`, `v_password`, `dt_creationdate`, `v_discordid`, `v_language`, `dt_ruleSignature`, `b_deleted`, `b_visible`, `b_mailValidated`) VALUES (NULL, 'firstNameTest', 'lastNameTest', ?, '473287f8298dba7163a897908958f7c0eae733e25d2e027992ea2edc9bed2fa8', current_timestamp(), NULL, 'fr', NULL, '0', '1', '1')",
    [userName + "@test.com"]
  );
  const lastIdentityRes = await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id';", []);
  const idUser = lastIdentityRes[1][0].id;
  return idUser;
};

module.exports.createNewUserAndLogWithoutMailValidated = async (db, executeQuery, userName) => {
  const selectRes = await executeQuery(db, "SELECT 1 FROM `users` WHERE v_email = ?", [userName + "@test.com"]);
  if (selectRes[1].length !== 0) return 0;
  await executeQuery(
    db,
    "INSERT INTO `users` (`i_id`, `v_firstName`, `v_lastName`, `v_email`, `v_password`, `dt_creationdate`, `v_discordid`, `v_language`, `dt_ruleSignature`, `b_deleted`, `b_visible`, `b_mailValidated`) VALUES (NULL, 'firstNameTest', 'lastNameTest', ?, '473287f8298dba7163a897908958f7c0eae733e25d2e027992ea2edc9bed2fa8', current_timestamp(), NULL, 'fr', NULL, '0', '1', '0')",
    [userName + "@test.com"]
  );
  const lastIdentityRes = await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id';", []);
  const idUser = lastIdentityRes[1][0].id;
  return idUser;
};
/* c8 ignore stop */
