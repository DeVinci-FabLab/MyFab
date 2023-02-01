const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("POST /api/clickonlogopaint/", () => {
  test("200", async () => {
    const user = "postClickonlogopaint200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
    };

    const response = await require("../../../api/other/clickonlogopaint").clickOnLogoPaintPost(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT dt_rickrolled FROM `users` WHERE i_id = ?", [userData]);
    expect(resCount[1][0].dt_rickrolled != null).toBe(true);
  });

  test("401", async () => {
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
      },
    };

    const response = await require("../../../api/other/clickonlogopaint").clickOnLogoPaintPost(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
