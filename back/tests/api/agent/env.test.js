describe("POST /api/agent/sql/", () => {
  test("200", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      backEnv: async () => {
        return 200;
      },
      frontEnv: async () => {
        return 200;
      },
    };

    const response = await require("../../../api/agent/env").env(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json).toStrictEqual({ back: 200, front: 200 });
  });

  test("404specialcodenotValid", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return false;
        },
      },
      backEnv: async () => {
        return 200;
      },
      frontEnv: async () => {
        return 200;
      },
    };

    const response = await require("../../../api/agent/env").env(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });

  test("404backNotResponding", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      backEnv: async () => {
        return 404;
      },
      frontEnv: async () => {
        return 200;
      },
    };

    const response = await require("../../../api/agent/env").env(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });

  test("200frontNotResponding", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      backEnv: async () => {
        return 200;
      },
      frontEnv: async () => {
        return 404;
      },
    };

    const response = await require("../../../api/agent/env").env(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json).toStrictEqual({ back: 200, front: 404 });
  });
});
