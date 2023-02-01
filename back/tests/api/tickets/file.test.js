const fs = require("fs");
const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
  await fs.copyFileSync(__dirname + "/../../Forme-Boîte.stl", __dirname + "/../../../data/files/stl/token-test.STL");
});

afterAll(() => {
  db.end();
});

describe("GET /api/ticket/:id/file/", () => {
  test("200myFabAgent", async () => {
    //Prepare
    const user = "ticketGetTicketFile200user";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userAgent = "ticketGetTicketFile200myFabAgent";
    const userDataAgent = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userAgent);
    expect(userDataAgent, "User '" + userAgent + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
    const data = {
      userId: userDataAgent,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        id: idTicket,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].id).toBe("number");
    expect(typeof response.json[0].filename).toBe("string");
    expect(typeof response.json[0].comment).toBe("string");
    expect(response.json[0].isValid == null).toBe(true);
    expect(Object.prototype.toString.call(response.json[0].creationDate) === "[object Date]").toBe(true);
    expect(Object.prototype.toString.call(response.json[0].modificationDate) === "[object Date]").toBe(true);
  });

  test("200userOwner", async () => {
    //Prepare
    const user = "ticketGetTicketFile200userOwner";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
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
      },
      params: {
        id: idTicket,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].id).toBe("number");
    expect(typeof response.json[0].filename).toBe("string");
    expect(typeof response.json[0].comment).toBe("string");
    expect(response.json[0].isValid == null).toBe(true);
    expect(Object.prototype.toString.call(response.json[0].creationDate) === "[object Date]").toBe(true);
    expect(Object.prototype.toString.call(response.json[0].modificationDate) === "[object Date]").toBe(true);
  });

  test("400noParams", async () => {
    //Prepare
    const user = "ticketGetTicketFile400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
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
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    //Prepare
    const user = "ticketGetTicketFile400noId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
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
      },
      params: {},
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400idIsNan", async () => {
    //Prepare
    const user = "ticketGetTicketFile400idIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
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
      },
      params: {
        id: "idTicket",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    //Prepare
    const user = "ticketGetTicketFile401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        id: idTicket,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403unauthorized", async () => {
    //Prepare
    const user = "ticketGetTicketFile403unauthorizedUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userAgent = "ticketGetTicketFile403unauthorizedAgent";
    const userDataAgent = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userAgent);
    expect(userDataAgent, "User '" + userAgent + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
    const data = {
      userId: userDataAgent,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        id: idTicket,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/file/:id/", () => {
  test("200myFabAgent", async () => {
    //Prepare
    const user = "ticketGetFile200user";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userAgent = "ticketGetFile200myFabAgent";
    const userDataAgent = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userAgent);
    expect(userDataAgent, "User '" + userAgent + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'oneFileTest200UserAgent.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
    const data = {
      userId: userDataAgent,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        id: idFile,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("download");
    expect(response.path != null).toBe(true);
    expect(response.fileName.endsWith("oneFileTest200UserAgent.stl")).toBe(true);
  });

  test("200userOwner", async () => {
    //Prepare
    const user = "ticketGetFile200userOwner";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'oneFileTest200UserOwner.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
      },
      params: {
        id: idFile,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("download");
    expect(response.path != null).toBe(true);
    expect(response.fileName.endsWith("oneFileTest200UserOwner.stl")).toBe(true);
  });

  test("400noParams", async () => {
    //Prepare
    const user = "ticketGetFile400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'oneFileTest400noParams.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    //Prepare
    const user = "ticketGetFile400noId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'oneFileTest400noId.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
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
      },
      params: {},
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400fileDataNotExist", async () => {
    //Prepare
    const user = "ticketGetFile400fileDataNotExist";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'oneFileTest400fileDataNotExist.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
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
      },
      params: {
        id: 9999999999999999999999,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400idIsNan", async () => {
    //Prepare
    const user = "ticketGetFile400idIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'oneFileTest400idIsNan.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
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
      },
      params: {
        id: "idTicket",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    //Prepare
    const user = "ticketGetFile401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'oneFileTest401noUser.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        id: idFile,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403unauthorized", async () => {
    //Prepare
    const user = "ticketGetFile403unauthorizedUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userAgent = "ticketGetFile403unauthorizedAgent";
    const userDataAgent = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userAgent);
    expect(userDataAgent, "User '" + userAgent + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'oneFileTest403unauthorized.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
    const data = {
      userId: userDataAgent,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        id: idFile,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204noSavedFile", async () => {
    //Prepare
    const user = "ticketGetFile204noSavedFile";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'oneFileTest204noSavedFile.stl', 'noFile.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
      },
      params: {
        id: idFile,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/ticket/:id/file/", () => {
  test("200_noFile", async () => {
    //Prepare
    const user = "filePost200_noFile";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

    //Execute
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
        io,
      },
      params: {
        id: idTicket,
      },
      files: null,
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("200_1file", async () => {
    //Prepare
    const user = "filePost200_1file";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test-" + user));
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

    //Execute
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
        io,
      },
      params: {
        id: idTicket,
      },
      files: {
        filedata: {
          name: "test-" + user + "-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-" + user,
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount + 1);
  });

  test("200_multiplesFiles", async () => {
    //Prepare
    const user = "filePost200_multiplesFiles";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test1-" + user));
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test2-" + user));
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

    //Execute
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
        io,
      },
      params: {
        id: idTicket,
      },
      files: {
        filedata: [
          {
            name: "test1-" + user + "-test.STL",
            tempFilePath: __dirname + "/../../../tmp/test1-" + user,
          },
          {
            name: "test2-" + user + "-test.STL",
            tempFilePath: __dirname + "/../../../tmp/test2-" + user,
          },
        ],
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount + 2);
  });

  test("200_myFabAgent", async () => {
    //Prepare
    const user = "filePost200myFabAgentTicketOwner";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userAgent = "filePost200myFabAgentAgent";
    const userDataAgent = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userAgent);
    expect(userDataAgent, "User '" + userAgent + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test-" + user));
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

    //Execute
    const data = {
      userId: userDataAgent,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        id: idTicket,
      },
      files: {
        filedata: {
          name: "test-" + user + "-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-" + user,
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount + 1);
  });

  test("400noParams", async () => {
    //Prepare
    const user = "filePost400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test-" + user));
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

    //Execute
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
        io,
      },
      files: {
        filedata: {
          name: "test-" + user + "-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-" + user,
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("400noId", async () => {
    //Prepare
    const user = "filePost400noId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test-" + user));
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

    //Execute
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
        io,
      },
      params: {},
      files: {
        filedata: {
          name: "test-" + user + "-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-" + user,
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("400idIsNan", async () => {
    //Prepare
    const user = "filePost400idIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test-" + user));
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

    //Execute
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
        io,
      },
      params: {
        id: "idTicket",
      },
      files: {
        filedata: {
          name: "test-" + user + "-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-" + user,
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("401unauthenticatedUser", async () => {
    //Prepare
    const user = "filePost401unauthenticatedUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test-" + user));
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

    //Execute
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        id: idTicket,
      },
      files: {
        filedata: {
          name: "test-" + user + "-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-" + user,
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("400unknownTicket", async () => {
    //Prepare
    const user = "filePost400unknownTicket";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test-" + user));
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

    //Execute
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
        io,
      },
      params: {
        id: 1000000,
      },
      files: {
        filedata: {
          name: "test-" + user + "-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-" + user,
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("403unauthorizedUser", async () => {
    //Prepare
    const user = "filePost403unauthorizedUserTicketOwner";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const unauthorizedUser = "filePost403unauthorizedUserUser";
    const unauthorizeduserData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, unauthorizedUser);
    expect(unauthorizeduserData, "User '" + unauthorizedUser + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test-" + user));
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

    //Execute
    const data = {
      userId: unauthorizeduserData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        id: idTicket,
      },
      files: {
        filedata: {
          name: "test-" + user + "-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-" + user,
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });
});

describe("PUT /api/file/:id/", () => {
  test("200validAndComment", async () => {
    //Prepare
    const user = "filePut200validAndComment";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      params: {
        id: idFile,
      },
      body: {
        comment: "New comment",
        idprinter: "1",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200valid", async () => {
    //Prepare
    const user = "filePut200valid";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      params: {
        id: idFile,
      },
      body: {
        comment: "test",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200comment", async () => {
    //Prepare
    const user = "filePut200comment";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      params: {
        id: idFile,
      },
      body: {
        comment: "New comment",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200noModification", async () => {
    //Prepare
    const user = "filePut";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      params: {
        id: idFile,
      },
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    await require("../../../api/tickets/file").ticketFilePut(data);
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noParams", async () => {
    //Prepare
    const user = "filePut400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    //Prepare
    const user = "filePut400noId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      params: {},
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400idIsNan", async () => {
    //Prepare
    const user = "filePut400idIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
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
        io,
      },
      params: {
        id: "idFile",
      },
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    //Prepare
    const user = "filePut400noBody";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      params: {
        id: idFile,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noValidAndComment", async () => {
    //Prepare
    const user = "filePut400noValidAndComment";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      params: {
        id: idFile,
      },
      body: {},
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400InvalidValid", async () => {
    //Prepare
    const user = "filePut400InvalidValid";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      params: {
        id: idFile,
      },
      body: {
        isValid: "notABoolean",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    //Prepare
    const user = "filePut401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        id: idFile,
      },
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403unauthorizedUser", async () => {
    //Prepare
    const user = "filePut403unauthorizedUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    const userTicketOwner = "filePut403unauthorizedUserTicketOwner";
    const userTicketOwnerData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTicketOwner);
    expect(userTicketOwnerData, "User '" + userTicketOwner + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userTicketOwnerData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userTicketOwnerData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      params: {
        id: idFile,
      },
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204unknownFile", async () => {
    //Prepare
    const user = "filePut204unknownFile";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );

    //Execute
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
        io,
      },
      params: {
        id: 1000000,
      },
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });

  test("204noFileMatch", async () => {
    //Prepare
    const user = "filePut204noFileMatch";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(
      db,
      "INSERT INTO `ticketfiles` (`i_idUser`, `i_idTicket`, `v_fileName`, `v_fileServerName`, `v_comment`) VALUES (?, ?, 'test.stl', 'token-test.STL', 'test')",
      [userData, idTicket]
    );
    const idFile = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
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
        io,
      },
      params: {
        id: 10000000000000,
      },
      body: {
        comment: "test",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});
