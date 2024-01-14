const executeQuery = require("./dataBase/executeQuery").run;

module.exports.increment = async (db, name, incrementation = 1) => {
  const date = new Date();
  const year =
    (date.getMonth() < 8 ? date.getFullYear() - 1 : date.getFullYear()) + "";

  const queryUpdateincrement = `UPDATE stats
                                SET i_value = i_value + ?
                                WHERE v_name = ?
                                AND v_year = ?;`;
  const resUpdateIncrement = await executeQuery(db, queryUpdateincrement, [
    incrementation,
    name,
    year,
  ]);
  /* c8 ignore start */
  if (resUpdateIncrement[0]) {
    console.log(resUpdateIncrement[0]);
    /* c8 ignore stop */
  } else if (resUpdateIncrement[1].affectedRows === 0) {
    const queryInsert = `INSERT INTO stats (v_name, i_value, v_year) 
                        VALUES (?, ?, ?);`;
    await executeQuery(db, queryInsert, [name, incrementation, year]);
  }
};
