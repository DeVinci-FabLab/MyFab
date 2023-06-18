describe("GET /api/user/mailtoken/", () => {
  test("200", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [
            null,
            [
              {
                email: "getUserMailToken200@test.com",
                token: "token",
              },
            ],
          ];
        },
        cookiesList: {},
      },
    };

    const response = await require("../../../api/user/mailTocken").getMailtoken(
      data
    );

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(response.json[0].email).not.toBe(null);
    expect(response.json[0].token).not.toBe(null);
  });

  test("401noUser", async () => {
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
    };

    const response = await require("../../../api/user/mailTocken").getMailtoken(
      data
    );

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403notAuthorized", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        cookiesList: {},
      },
    };

    const response = await require("../../../api/user/mailTocken").getMailtoken(
      data
    );

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });
});
