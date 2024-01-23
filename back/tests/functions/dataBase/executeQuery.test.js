const queryFonction = jest.fn((query, options, callback) => {
  callback(true, true, true);
});

describe("executeQuery", () => {
  test("query", async () => {
    const connection = { query: queryFonction };
    const query = "SHOW TABLES;";

    const response =
      await require("../../../functions/dataBase/executeQuery").run(
        connection,
        query,
        []
      );

    expect(queryFonction).toHaveBeenCalledTimes(1);
  });
});
