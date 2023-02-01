const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("GET /api/user/authorization/", () => {
  test("200", async () => {
    const user = "authGet200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
      },
    };
    const response = await require("../../../api/user/authorisation").getAuth(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    for (const key of Object.keys(response.json)) {
      expect(response.json[key]).toBe(0);
    }
  });

  test("401", async () => {
    const user = "authGet401";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {};

    const response = await require("../../../api/user/authorisation").getAuth(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
