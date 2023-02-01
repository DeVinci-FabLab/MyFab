const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;
let idRoleTest;
let idRoleProtectedTest;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("GET /api/user/validateRules/", () => {
  test("200", async () => {
    const user = "rulesPut200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
    };
    const response = await require("../../../api/user/rules").putValidateRules(data);
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("204userAlreadyValidated", async () => {
    const user = "rulesPut204userAlreadyValidated";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
    };
    await require("../../../api/user/rules").putValidateRules(data);
    const response = await require("../../../api/user/rules").putValidateRules(data);
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
  test("401noUser", async () => {
    const user = "rulesPut401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
      },
    };
    const response = await require("../../../api/user/rules").putValidateRules(data);
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
