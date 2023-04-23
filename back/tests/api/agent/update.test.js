describe("GET /api/agent/update/", () => {
  test("200", async () => {
    const data = {
      app: {},
      sendApiRequest: async () => {
        return true;
      },
    };

    const response = await require("../../../api/agent/update").update(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json != null).toBe(true);
    expect(response.json.back).toBe(true);
    expect(response.json.front).toBe(true);
  });
});
