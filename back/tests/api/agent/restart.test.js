describe("GET /api/agent/restart/", () => {
  test("200", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      sendApiRequest: async () => {
        return true;
      },
    };

    const response = await require("../../../api/agent/restart").restart(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json != null).toBe(true);
    expect(response.json.back).toBe(true);
    expect(response.json.front).toBe(true);
  });

  test("404specialCodeIsFalse", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return false;
        },
      },
    };

    const response = await require("../../../api/agent/restart").restart(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });
});
