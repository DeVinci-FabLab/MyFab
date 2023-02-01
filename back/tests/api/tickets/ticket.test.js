const fs = require("fs");
const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;
let idProjectType;
let idNewProjectType;
let idPriority;

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
});

describe("GET /api/ticket/me/", () => {
  test("200", async () => {
    //Prepare
    const user = "ticketGetAllMe200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const res = await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);

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
    const response = await require("../../../api/tickets/ticket").getTicketAllFromUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.maxPage).toBe("number");
    expect(response.json.values.length).not.toBe(0);
    expect(typeof response.json.values[0].id).toBe("number");
    expect(typeof response.json.values[0].userName).toBe("string");
    expect(Object.prototype.toString.call(response.json.values[0].creationDate) === "[object Date]").toBe(true);
    expect(Object.prototype.toString.call(response.json.values[0].modificationDate) === "[object Date]").toBe(true);
    expect(typeof response.json.values[0].priorityName).toBe("string");
    expect(typeof response.json.values[0].priorityColor).toBe("string");
  });

  test("401_noUser", async () => {
    //Prepare
    const user = "ticketGetAllMe401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
    };
    const response = await require("../../../api/tickets/ticket").getTicketAllFromUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/ticket/", () => {
  test("200", async () => {
    //Prepare
    const user = "ticketGetAll200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTicket = "ticketGetAllTicket200";
    const userDataTicket = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTicket);
    expect(userDataTicket, "User '" + userTicket + "' already exist").not.toBe(0);
    const res = await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userDataTicket, idProjectType, idPriority]);

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
    const response = await require("../../../api/tickets/ticket").getTicketAll(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.maxPage).toBe("number");
    expect(response.json.values.length).not.toBe(0);
    expect(typeof response.json.values[0].id).toBe("number");
    expect(typeof response.json.values[0].userName).toBe("string");
    expect(Object.prototype.toString.call(response.json.values[0].creationDate) === "[object Date]").toBe(true);
    expect(Object.prototype.toString.call(response.json.values[0].modificationDate) === "[object Date]").toBe(true);
    expect(typeof response.json.values[0].priorityName).toBe("string");
    expect(typeof response.json.values[0].priorityColor).toBe("string");
  });

  test("401noUser", async () => {
    //Prepare
    const user = "ticketGetAll401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
    };
    const response = await require("../../../api/tickets/ticket").getTicketAll(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403noRoleMyFabAgent", async () => {
    //Prepare
    const user = "ticketGetAll401noRoleMyFabAgent";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
    };
    const response = await require("../../../api/tickets/ticket").getTicketAll(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/ticket/:id/", () => {
  test("200userAgent", async () => {
    //Prepare
    const user = "ticketGetById200userAgent";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userOwner = "ticketGetById200userOwner";
    const userDataOwner = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userOwner);
    expect(userDataOwner, "User '" + userOwner + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userDataOwner, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT i_id AS 'id' FROM printstickets WHERE i_idUser = ?", [userDataOwner]))[1][0].id;

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
    const response = await require("../../../api/tickets/ticket").getTicketById(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.id).toBe("number");
    expect(typeof response.json.userName).toBe("string");
    expect(typeof response.json.email).toBe("string");
    expect(Object.prototype.toString.call(response.json.creationDate) === "[object Date]").toBe(true);
    expect(Object.prototype.toString.call(response.json.modificationDate) === "[object Date]").toBe(true);
    expect(typeof response.json.priorityName).toBe("string");
    expect(typeof response.json.priorityColor).toBe("string");
  });

  test("200userOwner", async () => {
    //Prepare
    const user = "ticketGetById200userOwner2";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT i_id AS 'id' FROM printstickets WHERE i_idUser = ?", [userData]))[1][0].id;

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
        id: idTicket,
      },
    };
    const response = await require("../../../api/tickets/ticket").getTicketById(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.id).toBe("number");
    expect(typeof response.json.userName).toBe("string");
    expect(typeof response.json.email).toBe("string");
    expect(Object.prototype.toString.call(response.json.creationDate) === "[object Date]").toBe(true);
    expect(Object.prototype.toString.call(response.json.modificationDate) === "[object Date]").toBe(true);
    expect(typeof response.json.priorityName).toBe("string");
    expect(typeof response.json.priorityColor).toBe("string");
  });

  test("400noParams", async () => {
    //Prepare
    const user = "ticketGetById400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
    };
    const response = await require("../../../api/tickets/ticket").getTicketById(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noParamsId", async () => {
    //Prepare
    const user = "ticketGetById400noParamsId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
      params: {},
    };
    const response = await require("../../../api/tickets/ticket").getTicketById(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noParamsIdIsNan", async () => {
    //Prepare
    const user = "ticketGetById400noParamsIdIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
        id: "NaN",
      },
    };
    const response = await require("../../../api/tickets/ticket").getTicketById(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    //Prepare
    const user = "ticketGetById401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT i_id AS 'id' FROM printstickets WHERE i_idUser = ?", [userData]))[1][0].id;

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
    const response = await require("../../../api/tickets/ticket").getTicketById(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("204ticketNotFound", async () => {
    //Prepare
    const user = "ticketGetById204ticketNotFound";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
        id: 100000000,
      },
    };
    const response = await require("../../../api/tickets/ticket").getTicketById(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });

  test("403userNotAlowed", async () => {
    //Prepare
    const user = "ticketGetById403userNotAlowed";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userOther = "ticketGetById200userOther";
    const userDataOther = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userOther);
    expect(userDataOther, "User '" + userOther + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT i_id AS 'id' FROM printstickets WHERE i_idUser = ?", [userData]))[1][0].id;

    //Execute
    const data = {
      userId: userDataOther,
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
    const response = await require("../../../api/tickets/ticket").getTicketById(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/ticket/", () => {
  test("200_noFile", async () => {
    //Prepare
    const user = "ticketPost200_noFile";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
        projectType: 1,
        comment: "test",
      },
      files: null,
    };
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.id != null).toBe(true);
  });

  test("200_1file", async () => {
    //Prepare
    const user = "ticketPost200_1file";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test-" + user));

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
        projectType: 1,
        comment: "test",
      },
      files: {
        filedata: {
          name: "test-" + user + "-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-" + user,
        },
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.id != null).toBe(true);
  });

  test("200_multiplesFiles", async () => {
    //Prepare
    const user = "ticketPost200_multiplesFiles";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test1-" + user));
    await fs.createReadStream(__dirname + "../../../Forme-Boîte.stl").pipe(fs.createWriteStream(__dirname + "../../../../tmp/test2-" + user));

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
        projectType: 1,
        comment: "test",
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
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.id != null).toBe(true);
  });

  test("200_withGroupNumber", async () => {
    //Prepare
    const user = "ticketPost200_withGroupNumber";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
        projectType: 1,
        comment: "test",
        groupNumber: 1,
      },
      files: null,
    };
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.id != null).toBe(true);
  });

  test("400_noBody", async () => {
    //Prepare
    const user = "ticketPost400_noBody";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noProjectType", async () => {
    //Prepare
    const user = "ticketPost400_noProjectType";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
        comment: "test",
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_projectTypeIsNan", async () => {
    //Prepare
    const user = "ticketPost400_projectTypeIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
        projectType: "NaN",
        comment: "test",
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noComment", async () => {
    //Prepare
    const user = "ticketPost400_noComment";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
        projectType: 1,
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_groupNumberNan", async () => {
    //Prepare
    const user = "ticketPost400_groupNumberNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
        projectType: 1,
        comment: "test",
        groupNumber: "NaN",
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(400);
  });

  test("400_projectTypeUnknown", async () => {
    //Prepare
    const user = "ticketPost400_projectTypeUnknown";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
        projectType: 100,
        comment: "test",
        groupNumber: 1,
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401_noUser", async () => {
    //Prepare
    const user = "ticketPost401_noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
      body: {
        projectType: 1,
        comment: "test",
        groupNumber: 1,
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("DELETE /api/ticket/:id", () => {
  test("200_ticketOwner", async () => {
    //Prepare
    const user = "ticketDelete200ticketOwner";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
        id: idTicket,
      },
    };
    const response = await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const resTicketDeleted = (await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM printstickets WHERE i_id = ? AND b_isDeleted = 0", [idTicket]))[1][0].count;
    expect(resTicketDeleted).toBe(0);
  });

  test("200_myFabAgent", async () => {
    //Prepare
    const user = "ticketDelete200myFabAgent";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userOwner = "ticketDelete200myFabAgentOwner";
    const userOwnerData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userOwner);
    expect(userOwnerData, "User '" + userOwner + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userOwnerData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
    const response = await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const resTicketDeleted = (await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM printstickets WHERE i_id = ? AND b_isDeleted = 0", [idTicket]))[1][0].count;
    expect(resTicketDeleted).toBe(0);
  });

  test("400_noParams", async () => {
    //Prepare
    const user = "ticketDelete400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
    };
    const response = await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resTicketDeleted = (await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM printstickets WHERE i_id = ? AND b_isDeleted = 0", [idTicket]))[1][0].count;
    expect(resTicketDeleted).toBe(1);
  });

  test("400_noParamsId", async () => {
    //Prepare
    const user = "ticketDelete400noParamsId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      params: {},
    };
    const response = await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resTicketDeleted = (await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM printstickets WHERE i_id = ? AND b_isDeleted = 0", [idTicket]))[1][0].count;
    expect(resTicketDeleted).toBe(1);
  });

  test("401_noUser", async () => {
    //Prepare
    const user = "ticketDelete401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

    //Execute
    const data = {
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
    const response = await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resTicketDeleted = (await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM printstickets WHERE i_id = ? AND b_isDeleted = 0", [idTicket]))[1][0].count;
    expect(resTicketDeleted).toBe(1);
  });

  test("400_noTicket", async () => {
    //Prepare
    const user = "ticketDelete400noTicket";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
        id: 1000000,
      },
    };
    const response = await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resTicketDeleted = (await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM printstickets WHERE i_id = ? AND b_isDeleted = 0", [idTicket]))[1][0].count;
    expect(resTicketDeleted).toBe(1);
  });

  test("403_noMyFabAgent", async () => {
    //Prepare
    const user = "ticketDelete403noMyFabAgent";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userOwner = "ticketDelete403noMyFabAgentOwner";
    const userOwnerData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userOwner);
    expect(userOwnerData, "User '" + userOwner + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userOwnerData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
        id: idTicket,
      },
    };
    const response = await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
    const resTicketDeleted = (await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM printstickets WHERE i_id = ? AND b_isDeleted = 0", [idTicket]))[1][0].count;
    expect(resTicketDeleted).toBe(1);
  });

  test("204", async () => {
    //Prepare
    const user = "ticketDelete204";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`, `b_isDeleted`) VALUES (?, ?, ?, 1)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
        id: idTicket,
      },
    };
    const response = await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
    const resTicketDeleted = (await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM printstickets WHERE i_id = ? AND b_isDeleted = 0", [idTicket]))[1][0].count;
    expect(resTicketDeleted).toBe(0);
  });
});

describe("PUT /api/ticket/:id/setProjecttype/", () => {
  test("200", async () => {
    //Prepare
    const user = "ticketPutProjectType200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        projecttype: idNewProjectType,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewProjectType(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noParams", async () => {
    //Prepare
    const user = "ticketPutProjectType400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        projecttype: idNewProjectType,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewProjectType(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    //Prepare
    const user = "ticketPutProjectType400noId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        projecttype: idNewProjectType,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewProjectType(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400idIsNan", async () => {
    //Prepare
    const user = "ticketPutProjectType400idIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        projecttype: idNewProjectType,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewProjectType(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noQuery", async () => {
    //Prepare
    const user = "ticketPutProjectType400noQuery";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
    const response = await require("../../../api/tickets/ticket").putTicketNewProjectType(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noProjecttype", async () => {
    //Prepare
    const user = "ticketPutProjectType400noProjecttype";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {},
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewProjectType(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400projecttypeIsNan", async () => {
    //Prepare
    const user = "ticketPutProjectType400projecttypeIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        projecttype: "idNewProjectType",
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewProjectType(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    //Prepare
    const user = "ticketPutProjectType401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        projecttype: idNewProjectType,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewProjectType(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403userUnauthorized", async () => {
    //Prepare
    const user = "ticketPutProjectType403userUnauthorized";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
        id: idTicket,
      },
      query: {
        projecttype: idNewProjectType,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewProjectType(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204", async () => {
    //Prepare
    const user = "ticketPutProjectType204";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
      query: {
        projecttype: idNewProjectType,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewProjectType(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("PUT /api/ticket/:id/setStatus", () => {
  test("200", async () => {
    //Prepare
    const user = "ticketPutSetStatus200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        idStatus: idNewPriority,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noParams", async () => {
    //Prepare
    const user = "ticketPutSetStatus400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        idStatus: idNewPriority,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    //Prepare
    const user = "ticketPutSetStatus400noId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        idStatus: idNewPriority,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400idIsNan", async () => {
    //Prepare
    const user = "ticketPutSetStatus400idIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        idStatus: idNewPriority,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noQuery", async () => {
    //Prepare
    const user = "ticketPutSetStatus400noQuery";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
    const response = await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noIdStatus", async () => {
    //Prepare
    const user = "ticketPutSetStatus400noIdStatus";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {},
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400idStatusIsNan", async () => {
    //Prepare
    const user = "ticketPutSetStatus400idStatusIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        idStatus: "idNewPriority",
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    //Prepare
    const user = "ticketPutSetStatus401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        idStatus: idNewPriority,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403unauthorizedUser", async () => {
    //Prepare
    const user = "ticketPutSetStatus403unauthorizedUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
        id: idTicket,
      },
      query: {
        idStatus: idNewPriority,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204ticketUnknown", async () => {
    //Prepare
    const user = "ticketPutSetStatus204ticketUnknown";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `printstickets` (`i_idUser`, `i_projecttype`, `i_priority`) VALUES (?, ?, ?)", [userData, idProjectType, idPriority]);
    const idTicket = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;

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
      query: {
        idStatus: idNewPriority,
      },
    };
    const response = await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});
