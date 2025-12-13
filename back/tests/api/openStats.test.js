describe("GET /api/stats/tickets/open", () => {
  test("200", async () => {
    const data = {
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ count: 3 }]];
        },
      },
    };

    const response = await require("../../api/openStats").getStats(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(Object.keys(response.json).length).toBe(1);
    expect(response.json.count).toBe(3);
  });
});
