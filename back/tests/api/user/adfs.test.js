describe("POST /api/user/login/adfs/", () => {
  test("200userNotExist", async () => {
    const token = "1";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: "test@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[token] = pendingUser;

    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, { affectedRows: 1 }];
            case 3:
              return [null, [{ id: 1 }]];

            default:
              return null;
          }
        },
        cookiesList: {},
      },
      body: {
        token,
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);
  });

  test("200userAlreadyExistAndTitleChanged", async () => {
    const token = "1";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: "test@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[token] = pendingUser;

    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 1, title: null }]];
            case 2:
              return [null, { affectedRows: 1, changedRows: 1 }];

            default:
              return null;
          }
        },
        cookiesList: {},
      },
      body: {
        token,
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);
  });

  test("200newUser", async () => {
    const token = "1";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: "test@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[token] = pendingUser;

    let requestNumber = 0;
    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, { affectedRows: 1 }];
            case 3:
              return [null, [{ id: 1 }]];

            default:
              return null;
          }
        },
        cookiesList: {},
      },
      body: {
        token,
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);
  });

  test("200newUserWithLanguage", async () => {
    const token = "1";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: "test@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[token] = pendingUser;

    let requestNumber = 0;
    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, { affectedRows: 1 }];
            case 3:
              return [null, [{ id: 1 }]];

            default:
              return null;
          }
        },
        cookiesList: {},
      },
      body: {
        token,
        language: "en",
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);
  });

  test("403myFabClosed", async () => {
    const token = "1";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: "test@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[token] = pendingUser;

    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: false,
      app: {
        cookiesList: {},
      },
      body: {
        token,
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    const token = "1";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: "test@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[token] = pendingUser;

    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        cookiesList: {},
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noToken", async () => {
    const token = "1";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: "test@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[token] = pendingUser;

    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        cookiesList: {},
      },
      body: {},
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("404timout", async () => {
    const token = "1";
    const pendingUser = {
      timestamp: Date.now() - 60 * 1000,
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: "test@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[token] = pendingUser;

    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        cookiesList: {},
      },
      body: {
        token,
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });
});
