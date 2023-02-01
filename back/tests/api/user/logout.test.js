const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("DELETE /api/user/logout/", () => {
  test("200", async () => {
    const user = "logoutDelete200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {
          dvflcookieTest: "test",
        },
      },
      dvflcookie: "dvflcookieTest",
    };
    const response = await require("../../../api/user/logout").deleteLogout(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    expect(data.app.cookiesList["dvflcookieTest"] == null).toBe(true);
  });

  test("401_noIdUser", async () => {
    const user = "logoutDelete401noIdUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {
          dvflcookieTest: "test",
        },
      },
      dvflcookie: "dvflcookieTest",
    };
    const response = await require("../../../api/user/logout").deleteLogout(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    expect(data.app.cookiesList["dvflcookieTest"] == null).toBe(false);
  });
});
