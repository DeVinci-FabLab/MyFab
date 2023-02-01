const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("POST /api/user/login/", () => {
  test("200", async () => {
    const user = "loginPost200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        email: user + "@test.com",
        password: "string",
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);
    expect(Object.keys(data.app.cookiesList).length).not.toBe(0);
    expect(data.app.cookiesList[response.json.dvflCookie].id).toBe(userData);
  });

  test("200testExpire", async () => {
    const user = "loginPost200testExpire";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        email: user + "@test.com",
        password: "string",
        expires: new Date().setHours(new Date().getHours() + 2),
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.dvflCookie != null).toBe(true);
    expect(Object.keys(data.app.cookiesList).length).not.toBe(0);
    expect(data.app.cookiesList[response.json.dvflCookie].id).toBe(userData);
  });

  test("400_noBody", async () => {
    const user = "loginPostNoBody400";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {};

    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noEmailAndPassword", async () => {
    const user = "loginPostNoEmailAndPassword400";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      body: {},
    };

    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noEmail", async () => {
    const user = "loginPostNoEmail400";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
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
    const user = "loginPostNoPassword400";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      body: {
        email: user + "@test.com",
      },
    };

    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401_wrongEmail", async () => {
    const user = "loginPostWrongEmail401";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
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
    const user = "loginPostWrongPassword401";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        email: user + "@test.com",
        password: "wrongPassword",
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_wrongEmailAndPassword401", async () => {
    const user = "loginPostWrongEmailAndPassword401";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
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
    const user = "loginPostDeleted401";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, `UPDATE users SET b_deleted = '1' WHERE i_id = ?`, [userData]);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        email: user + "@test.com",
        password: "string",
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("204_mailNotValidated", async () => {
    const user = "loginPostMailNotValidated204";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, `UPDATE users SET b_mailValidated = '0' WHERE i_id = ?`, [userData]);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        email: user + "@test.com",
        password: "string",
      },
    };
    const response = await require("../../../api/user/login").postLogin(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});
