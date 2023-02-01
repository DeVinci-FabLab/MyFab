const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("GET /api/user/mailtoken/", () => {
  test("200", async () => {
    const user = "getUserMailToken200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const queryInsertTocken = `INSERT INTO mailtocken (i_idUser, v_value, b_mailSend) VALUES (?, ?, ?);`;
    executeQuery(db, queryInsertTocken, [userData, "token", "1"]);

    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        token: user,
      },
    };

    const response = await require("../../../api/user/mailTocken").getMailtoken(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(response.json[0].email).not.toBe(null);
    expect(response.json[0].token).not.toBe(null);
  });

  test("401noUser", async () => {
    const user = "getUserMailToken401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const queryInsertTocken = `INSERT INTO mailtocken (i_idUser, v_value, b_mailSend) VALUES (?, ?, ?);`;
    executeQuery(db, queryInsertTocken, [userData, "token", "1"]);

    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        token: user,
      },
    };

    const response = await require("../../../api/user/mailTocken").getMailtoken(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403notAuthorized", async () => {
    const user = "getUserMailToken403notAuthorized";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const queryInsertTocken = `INSERT INTO mailtocken (i_idUser, v_value, b_mailSend) VALUES (?, ?, ?);`;
    executeQuery(db, queryInsertTocken, [userData, "token", "1"]);

    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        token: user,
      },
    };

    const response = await require("../../../api/user/mailTocken").getMailtoken(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });
});
