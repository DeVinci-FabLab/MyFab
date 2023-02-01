const fs = require("fs");
const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
  await executeQuery(db, "INSERT INTO `gd_ticketpriority` (`v_name`, `v_color`) VALUES ('testTicket', '000000')", []);
  idProjectType = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
  await executeQuery(db, "INSERT INTO `gd_ticketpriority` (`v_name`, `v_color`) VALUES ('newTestTicket', '000000')", []);
  idNewProjectType = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
  await executeQuery(db, "INSERT INTO `gd_ticketpriority` (`v_name`, `v_color`) VALUES ('testTicket', '000000')", []);
  idPriority = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
  await executeQuery(db, "INSERT INTO `gd_ticketpriority` (`v_name`, `v_color`) VALUES ('newTestTicket', '000000')", []);
  idNewPriority = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
});

afterAll(() => {
  db.end();
  fs.readdir(__dirname + "/../../../data/files/stl/", (err, files) => {
    files.forEach((file) => {
      if (file.endsWith("-test.STL")) fs.unlinkSync(__dirname + "/../../../data/files/stl/" + file);
    });
  });
});

describe("GET /api/ticket/:id/message/", () => {
  test("200myFabAgent", async () => {
    //Prepare
    const user = "ticketGetTicketMessages200user";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userAgent = "ticketGetTicketMessages200myFabAgent";
    const userDataAgent = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userAgent);
    expect(userDataAgent, "User '" + userAgent + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
    };
    const response = await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].userName).toBe("string");
    expect(typeof response.json[0].content).toBe("string");
    expect(Object.prototype.toString.call(response.json[0].creationDate) === "[object Date]").toBe(true);
  });

  test("200userOwner", async () => {
    //Prepare
    const user = "ticketGetTicketMessages200userOwner";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
    };
    const response = await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].userName).toBe("string");
    expect(typeof response.json[0].content).toBe("string");
    expect(Object.prototype.toString.call(response.json[0].creationDate) === "[object Date]").toBe(true);
  });

  test("400noParams", async () => {
    //Prepare
    const user = "ticketGetTicketMessages400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
    };
    const response = await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    //Prepare
    const user = "ticketGetTicketMessages400noId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
    };
    const response = await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400idIsNan", async () => {
    //Prepare
    const user = "ticketGetTicketMessages400idIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
    };
    const response = await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    //Prepare
    const user = "ticketGetTicketMessages401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
    };
    const response = await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403unauthorized", async () => {
    //Prepare
    const user = "ticketGetTicketMessages403unauthorizedUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userAgent = "ticketGetTicketMessages403unauthorizedAgent";
    const userDataAgent = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userAgent);
    expect(userDataAgent, "User '" + userAgent + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
        io,
      },
      params: {
        id: idTicket,
      },
    };
    const response = await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/ticket/:id/message/", () => {
  test("200myFabAgent", async () => {
    //Prepare
    const user = "ticketPostTicketMessages200user";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userAgent = "ticketPostTicketMessages200myFabAgent";
    const userDataAgent = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userAgent);
    expect(userDataAgent, "User '" + userAgent + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
      body: {
        content: "testContent",
      },
    };
    const response = await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200userOwner", async () => {
    //Prepare
    const user = "ticketPostTicketMessages200userOwner";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
      body: {
        content: "testContent",
      },
    };
    const response = await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noParams", async () => {
    //Prepare
    const user = "ticketPostTicketMessages400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
        content: "testContent",
      },
    };
    const response = await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    //Prepare
    const user = "ticketPostTicketMessages400noId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
        content: "testContent",
      },
    };
    const response = await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400idIsNan", async () => {
    //Prepare
    const user = "ticketPostTicketMessages400idIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
      body: {
        content: "testContent",
      },
    };
    const response = await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    //Prepare
    const user = "ticketPostTicketMessages400noBody";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
    };
    const response = await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noContent", async () => {
    //Prepare
    const user = "ticketPostTicketMessages400noContent";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
      body: {},
    };
    const response = await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    //Prepare
    const user = "ticketPostTicketMessages401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
      body: {
        content: "testContent",
      },
    };
    const response = await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403unauthorized", async () => {
    //Prepare
    const user = "ticketPostTicketMessages403unauthorizedUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userAgent = "ticketPostTicketMessages403unauthorizedAgent";
    const userDataAgent = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userAgent);
    expect(userDataAgent, "User '" + userAgent + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, 1, 1)", [userData]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
    await executeQuery(db, "INSERT INTO `ticketmessages` (`i_idUser`, `i_idTicket`, `v_content`) VALUES (?, ?, ?)", [userData, idTicket, user]);

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
        io,
      },
      params: {
        id: idTicket,
      },
      body: {
        content: "testContent",
      },
    };
    const response = await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });
});
