describe("GET /api/agent/getLogs/", () => {
  test("200", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      backGetLogs: async () => {
        return {
          status: 200,
          data: {
            agent: "Text agent back",
            service: "Text service back",
          },
        };
      },
      frontGetLogs: async () => {
        return {
          status: 200,
          data: {
            agent: "Text agent front",
            service: "Text service front",
          },
        };
      },
    };

    const response = await require("../../../api/agent/getLogs").getLogs(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json).toStrictEqual({
      back: {
        agent: "Text agent back",
        service: "Text service back",
      },
      front: {
        agent: "Text agent front",
        service: "Text service front",
      },
    });
  });

  test("back404", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      backGetLogs: async () => {
        return null;
      },
      frontGetLogs: async () => {
        return {
          status: 200,
          data: {
            agent: "Text agent front",
            service: "Text service front",
          },
        };
      },
    };

    const response = await require("../../../api/agent/getLogs").getLogs(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json).toStrictEqual({
      back: { status: 404 },
      front: {
        agent: "Text agent front",
        service: "Text service front",
      },
    });
  });

  test("front404", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      backGetLogs: async () => {
        return {
          status: 200,
          data: {
            agent: "Text agent back",
            service: "Text service back",
          },
        };
      },
      frontGetLogs: async () => {
        return null;
      },
    };

    const response = await require("../../../api/agent/getLogs").getLogs(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json).toStrictEqual({
      back: {
        agent: "Text agent back",
        service: "Text service back",
      },
      front: { status: 404 },
    });
  });

  test("back400", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      backGetLogs: async () => {
        return {
          status: 400,
        };
      },
      frontGetLogs: async () => {
        return {
          status: 200,
          data: {
            agent: "Text agent front",
            service: "Text service front",
          },
        };
      },
    };

    const response = await require("../../../api/agent/getLogs").getLogs(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json).toStrictEqual({
      back: { status: 400 },
      front: {
        agent: "Text agent front",
        service: "Text service front",
      },
    });
  });

  test("front400", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      backGetLogs: async () => {
        return {
          status: 200,
          data: {
            agent: "Text agent back",
            service: "Text service back",
          },
        };
      },
      frontGetLogs: async () => {
        return {
          status: 400,
        };
      },
    };

    const response = await require("../../../api/agent/getLogs").getLogs(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json).toStrictEqual({
      back: {
        agent: "Text agent back",
        service: "Text service back",
      },
      front: { status: 400 },
    });
  });

  test("404specialCodeIsFalse", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return false;
        },
      },
      backGetLogs: async () => {
        return {
          status: 200,
          data: {
            agent: "Text agent back",
            service: "Text service back",
          },
        };
      },
      frontGetLogs: async () => {
        return {
          status: 200,
          data: {
            agent: "Text agent front",
            service: "Text service front",
          },
        };
      },
    };

    const response = await require("../../../api/agent/getLogs").getLogs(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });
});
