const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open({ isTest: true });
});

afterAll(() => {
  db.end();
});

describe("POST /api/sql/", () => {
  test("200", async () => {
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      body: { querry: "SHOW TABLES" },
    };

    const response = await require("../../../api/other/sql").sql(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json != null).toBe(true);
  });

  test("404specialCodeIsFalse", async () => {
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      userAuthorization: {
        checkSpecialCode: async () => {
          return false;
        },
      },
      body: { querry: "SHOW TABLES" },
    };

    const response = await require("../../../api/other/sql").sql(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });

  test("404noBody", async () => {
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
    };

    const response = await require("../../../api/other/sql").sql(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });

  test("404noQuerry", async () => {
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      body: {},
    };

    const response = await require("../../../api/other/sql").sql(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });
});
