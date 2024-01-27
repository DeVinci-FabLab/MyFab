describe("POST /api/user/login/", () => {
  test("200", async () => {
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ id: 1, mailValidated: 1 }]];
        },
      },
      body: {
        email: "test@test.com",
        password: "string",
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);
  });

  test("200testExpire", async () => {
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ id: 1, mailValidated: 1 }]];
        },
      },
      body: {
        email: "test@test.com",
        password: "string",
        expires: new Date().setHours(new Date().getHours() + 2),
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);
  });

  test("400_noBody", async () => {
    const data = {};

    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noEmailAndPassword", async () => {
    const data = {
      body: {},
    };

    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noEmail", async () => {
    const data = {
      body: {
        password: "string",
      },
    };

    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noPassword", async () => {
    const data = {
      body: {
        email: "test@test.com",
      },
    };

    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401_wrongEmail", async () => {
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, []];
        },
        cookiesList: {},
      },
      body: {
        email: "wrong.Email@test.com",
        password: "string",
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_wrongPassword", async () => {
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, []];
        },
        cookiesList: {},
      },
      body: {
        email: "test@test.com",
        password: "wrongPassword",
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_wrongEmailAndPassword", async () => {
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, []];
        },
        cookiesList: {},
      },
      body: {
        email: "wrong.Email@test.com",
        password: "wrongPassword",
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_deleted401", async () => {
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, []];
        },
        cookiesList: {},
      },
      body: {
        email: "test@test.com",
        password: "string",
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("204_mailNotValidated", async () => {
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ id: 1, mailValidated: 0 }]];
        },
        cookiesList: {},
      },
      body: {
        email: "test@test.com",
        password: "string",
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});
