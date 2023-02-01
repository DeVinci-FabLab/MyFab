module.exports.run = async (connection, query, options) => {
  return await new Promise((resolve) => {
    connection.query(query, options, function (error, results, fields) {
      resolve([error, results, fields]);
    });
  });
};
