const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("POST /api/user/login/adfs/", () => {
  test("200userAlreadyExist", async () => {
    const user = "loginPost200userAlreadyExist";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: user + "@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[user] = pendingUser;

    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        token: user,
      },
    };
    await executeQuery(db, "UPDATE `users` SET `v_title` = ? WHERE `i_id` = ?;", [pendingUser.title, userData]);

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);

    const selectRes = await executeQuery(db, "SELECT 1 FROM `users` WHERE v_email = ?", [user + "@test.com"]);
    expect(selectRes[1].length).toBe(1);
  });

  test("200userAlreadyExistAndTitleChanged", async () => {
    const user = "loginPost200userAlreadyExistAndTitleChanged";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: user + "@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[user] = pendingUser;

    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        token: user,
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);

    const selectRes = await executeQuery(db, "SELECT 1 FROM `users` WHERE v_email = ?", [user + "@test.com"]);
    expect(selectRes[1].length).toBe(1);
  });

  test("200newUser", async () => {
    const user = "loginPost200newUser";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: user + "@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[user] = pendingUser;

    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        token: user,
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);

    const selectRes = await executeQuery(db, "SELECT 1 FROM `users` WHERE v_email = ?", [user + "@test.com"]);
    expect(selectRes[1].length).toBe(1);
  });

  test("200newUserWithLanguage", async () => {
    const user = "loginPost200newUserWithLanguage";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: user + "@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[user] = pendingUser;

    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        token: user,
        language: "en",
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);

    const selectRes = await executeQuery(db, "SELECT 1 FROM `users` WHERE v_email = ?", [user + "@test.com"]);
    expect(selectRes[1].length).toBe(1);
  });

  test("403myFabClosed", async () => {
    const user = "loginPost403myFabClosed";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: user + "@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[user] = pendingUser;

    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: false,
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        token: user,
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");

    const selectRes = await executeQuery(db, "SELECT 1 FROM `users` WHERE v_email = ?", [user + "@test.com"]);
    expect(selectRes[1].length).toBe(0);
  });

  test("400noBody", async () => {
    const user = "loginPost400noBody";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: user + "@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[user] = pendingUser;

    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");

    const selectRes = await executeQuery(db, "SELECT 1 FROM `users` WHERE v_email = ?", [user + "@test.com"]);
    expect(selectRes[1].length).toBe(0);
  });

  test("400noToken", async () => {
    const user = "loginPost400noToken";
    const pendingUser = {
      timestamp: Date.now(),
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: user + "@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[user] = pendingUser;

    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {},
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");

    const selectRes = await executeQuery(db, "SELECT 1 FROM `users` WHERE v_email = ?", [user + "@test.com"]);
    expect(selectRes[1].length).toBe(0);
  });

  test("404timout", async () => {
    const user = "loginPost404timout";
    const pendingUser = {
      timestamp: Date.now() - 60 * 1000,
      firstName: "firstNameTest",
      lastName: "lastNameTest",
      email: user + "@test.com",
      title: "titleTest",
    };
    require("../../../api/user/adfs").pendingUsers[user] = pendingUser;

    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      myFabOpen: true,
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        token: user,
      },
    };

    const response = await require("../../../api/user/adfs").postLoginADFS(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");

    const selectRes = await executeQuery(db, "SELECT 1 FROM `users` WHERE v_email = ?", [user + "@test.com"]);
    expect(selectRes[1].length).toBe(0);
  });
});
