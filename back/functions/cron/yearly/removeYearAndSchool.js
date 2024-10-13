module.exports.action = action;
async function action(app) {
  const querySetPrevious = `UPDATE users
                SET i_idschoolprevious = i_idschool,
                i_schoolyearprevious = i_schoolyear
                WHERE i_idschool IS NOT NULL
                AND i_schoolyear IS NOT NULL;`;
  const dbResSetPrevious = await app.executeQuery(app.db, querySetPrevious, []);
  if (dbResSetPrevious[0]) console.log(dbResSetPrevious[0]);

  const querySetNull = `UPDATE users
                SET i_idschool = NULL,
                i_schoolyear = NULL
                WHERE i_idschool IS NOT NULL
                AND i_schoolyear IS NOT NULL;`;
  const dbResSetNull = await app.executeQuery(app.db, querySetNull, []);
  if (dbResSetNull[0]) console.log(dbResSetNull[0]);
}
