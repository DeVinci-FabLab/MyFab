describe("POST /api/clickonlogopaint/", () => {
  test("200", async () => {
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, {}];
        },
      },
    };

    const response =
      await require("../../../api/other/clickonlogopaint").clickOnLogoPaintPost(
        data
      );

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("401", async () => {
    const data = {
      app: {},
    };

    const response =
      await require("../../../api/other/clickonlogopaint").clickOnLogoPaintPost(
        data
      );

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
