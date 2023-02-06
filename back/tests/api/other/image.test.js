const executeQuery = require("../../../functions/dataBase/executeQuery").run;
const fs = require("fs");
let db;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open({ isTest: true });
  await fs.copyFileSync("defaultFiles/logo.png", "data/files/image/test.png");
});

afterAll(() => {
  db.end();
  fs.unlinkSync("data/files/image/test.png");
});

describe("GET /api/files/:type/:tag", () => {
  test("200sendDefaultLogo", async () => {
    const user = "getFile200sendDefaultLogo";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        type: "image",
        tag: "undifined.png",
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("file");
    expect(response.name != null).toBe(true);
  });

  test("200sendPng", async () => {
    const user = "getFile200sendPng";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        type: "image",
        tag: "test.png",
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("file");
    expect(response.name != null).toBe(true);
  });

  test("400noParams", async () => {
    const user = "getFile400";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noType", async () => {
    const user = "getFile400noType";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        tag: "test.png",
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noTag", async () => {
    const user = "getFile400noTag";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        type: "image",
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400fileTypeNotAllowed", async () => {
    const user = "getFile400fileTypeNotAllowed";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        type: "undifined",
        tag: "test.png",
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });
});
