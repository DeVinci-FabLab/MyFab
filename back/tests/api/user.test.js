const executeQuery = require("../../functions/dataBase/executeQuery").run;
let db;

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

beforeAll(async () => {
  db = await require("../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("GET /api/user/", () => {
  test("200", async () => {
    const user = "userGetAllGood";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(!!response.json && response.json.constructor === Object).toBe(true);
    expect(!!response.json && response.json.values.constructor === Array).toBe(true);
    expect(response.json.values.length).toBeGreaterThanOrEqual(1);
    expect(!!response.json && response.json.maxPage.constructor === Number).toBe(true);
    expect(response.json.values[0]["id"] != null).toBe(true);
    expect(response.json.values[0]["firstName"] != null).toBe(true);
    expect(response.json.values[0]["lastName"] != null).toBe(true);
    expect(response.json.values[0]["email"] != null).toBe(true);
  });

  test("401-userIsUnauthenticated", async () => {
    const user = "userGetAllGoodWithoutValidUser";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

    const data = {};
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403-noViewUsersAuth", async () => {
    const user = "userGetAllGoodWithUserNotAuthorised";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
      },
    };
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("200TestInputText", async () => {
    const user = "userGetAllGoodTestInputText";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
      query: { inputValue: "userGetAllGoodTestInputTe" },
    };
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(!!response.json && response.json.constructor === Object).toBe(true);
    expect(!!response.json && response.json.values.constructor === Array).toBe(true);
    expect(response.json.values.length).toBeGreaterThanOrEqual(1);
    expect(!!response.json && response.json.maxPage.constructor === Number).toBe(true);
    expect(response.json.values[0]["id"] != null).toBe(true);
    expect(response.json.values[0]["firstName"] != null).toBe(true);
    expect(response.json.values[0]["lastName"] != null).toBe(true);
    expect(response.json.values[0]["email"] != null).toBe(true);
  });

  test("200TestPage", async () => {
    const user = "userGetAllGoodTestPage";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
      query: { page: 1, maxUser: 1 },
    };
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(!!response.json && response.json.constructor === Object).toBe(true);
    expect(!!response.json && response.json.values.constructor === Array).toBe(true);
    expect(response.json.values.length).toBeGreaterThanOrEqual(1);
    expect(!!response.json && response.json.maxPage.constructor === Number).toBe(true);
    expect(response.json.values[0]["id"] != null).toBe(true);
    expect(response.json.values[0]["firstName"] != null).toBe(true);
    expect(response.json.values[0]["lastName"] != null).toBe(true);
    expect(response.json.values[0]["email"] != null).toBe(true);
  });

  test("200TestOrderByFirstname", async () => {
    const user = "userGetAllGoodTestOrderByFirstname";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
      query: { collumnName: "firstname" },
    };
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(!!response.json && response.json.constructor === Object).toBe(true);
    expect(!!response.json && response.json.values.constructor === Array).toBe(true);
    expect(response.json.values.length).toBeGreaterThanOrEqual(1);
    expect(!!response.json && response.json.maxPage.constructor === Number).toBe(true);
    expect(response.json.values[0]["id"] != null).toBe(true);
    expect(response.json.values[0]["firstName"] != null).toBe(true);
    expect(response.json.values[0]["lastName"] != null).toBe(true);
    expect(response.json.values[0]["email"] != null).toBe(true);
  });

  test("200TestOrderByLastname", async () => {
    const user = "userGetAllGoodTestOrderByLastname";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
      query: { collumnName: "lastname" },
    };
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(!!response.json && response.json.constructor === Object).toBe(true);
    expect(!!response.json && response.json.values.constructor === Array).toBe(true);
    expect(response.json.values.length).toBeGreaterThanOrEqual(1);
    expect(!!response.json && response.json.maxPage.constructor === Number).toBe(true);
    expect(response.json.values[0]["id"] != null).toBe(true);
    expect(response.json.values[0]["firstName"] != null).toBe(true);
    expect(response.json.values[0]["lastName"] != null).toBe(true);
    expect(response.json.values[0]["email"] != null).toBe(true);
  });

  test("200TestOrderByEmail", async () => {
    const user = "userGetAllGoodTestOrderByEmail";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
      query: { collumnName: "email" },
    };
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(!!response.json && response.json.constructor === Object).toBe(true);
    expect(!!response.json && response.json.values.constructor === Array).toBe(true);
    expect(response.json.values.length).toBeGreaterThanOrEqual(1);
    expect(!!response.json && response.json.maxPage.constructor === Number).toBe(true);
    expect(response.json.values[0]["id"] != null).toBe(true);
    expect(response.json.values[0]["firstName"] != null).toBe(true);
    expect(response.json.values[0]["lastName"] != null).toBe(true);
    expect(response.json.values[0]["email"] != null).toBe(true);
  });

  test("200TestOrderByTitle", async () => {
    const user = "userGetAllGoodTestOrderByTitle";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
      query: { collumnName: "title" },
    };
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(!!response.json && response.json.constructor === Object).toBe(true);
    expect(!!response.json && response.json.values.constructor === Array).toBe(true);
    expect(response.json.values.length).toBeGreaterThanOrEqual(1);
    expect(!!response.json && response.json.maxPage.constructor === Number).toBe(true);
    expect(response.json.values[0]["id"] != null).toBe(true);
    expect(response.json.values[0]["firstName"] != null).toBe(true);
    expect(response.json.values[0]["lastName"] != null).toBe(true);
    expect(response.json.values[0]["email"] != null).toBe(true);
  });

  test("200TestOrderDESC", async () => {
    const user = "userGetAllGoodTestOrderDESC";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
      query: { order: "false" },
    };
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(!!response.json && response.json.constructor === Object).toBe(true);
    expect(!!response.json && response.json.values.constructor === Array).toBe(true);
    expect(response.json.values.length).toBeGreaterThanOrEqual(1);
    expect(!!response.json && response.json.maxPage.constructor === Number).toBe(true);
    expect(response.json.values[0]["id"] != null).toBe(true);
    expect(response.json.values[0]["firstName"] != null).toBe(true);
    expect(response.json.values[0]["lastName"] != null).toBe(true);
    expect(response.json.values[0]["email"] != null).toBe(true);
  });

  test("200TestNoLimit", async () => {
    const user = "userGetAllGoodTestNoLimit";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
      query: { all: "true" },
    };
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(!!response.json && response.json.constructor === Object).toBe(true);
    expect(!!response.json && response.json.values.constructor === Array).toBe(true);
    expect(response.json.values.length).toBeGreaterThanOrEqual(1);
    expect(!!response.json && response.json.maxPage.constructor === Number).toBe(true);
    expect(response.json.values[0]["id"] != null).toBe(true);
    expect(response.json.values[0]["firstName"] != null).toBe(true);
    expect(response.json.values[0]["lastName"] != null).toBe(true);
    expect(response.json.values[0]["email"] != null).toBe(true);
  });
});

describe("GET /api/user/me", () => {
  test("200", async () => {
    const user = "userGetMeGood";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

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
    const response = await require("../../api/user").userGetMe(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json["id"] != null).toBe(true);
    expect(response.json["firstName"] != null).toBe(true);
    expect(response.json["lastName"] != null).toBe(true);
    expect(response.json["email"] != null).toBe(true);
    expect(response.json["creationDate"] != null).toBe(true);
    expect(response.json["language"] != null).toBe(true);
    expect(Number.isInteger(response.json["acceptedRule"])).toBe(true);
    expect(Number.isInteger(response.json["mailValidated"])).toBe(true);
  });

  test("204-noDataForUser", async () => {
    const data = {
      userId: 999999999999999999999999999,
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

    const response = await require("../../api/user").userGetMe(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });

  test("401-userIsUnauthenticated", async () => {
    const data = {};
    const response = await require("../../api/user").userGetMe(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/user/:id", () => {
  test("200", async () => {
    const user = "userGetIdGood";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);
    const userTarget = "userTargetGetIdGood";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

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
      params: { id: userTargetData },
    };
    const response = await require("../../api/user").userGetById(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json["id"] != null).toBe(true);
    expect(response.json["firstName"] != null).toBe(true);
    expect(response.json["lastName"] != null).toBe(true);
    expect(response.json["email"] != null).toBe(true);
    expect(response.json["creationDate"] != null).toBe(true);
    expect(response.json["language"] != null).toBe(true);
    expect(Number.isInteger(response.json["acceptedRule"])).toBe(true);
    expect(Number.isInteger(response.json["isMicrosoft"])).toBe(true);
    expect(Number.isInteger(response.json["mailValidated"])).toBe(true);
  });

  test("400-idUserTargetIsNaN", async () => {
    const user = "userGetIdIdUserTargetIsNaN";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);
    const userTarget = "userTargetGetIdIdUserTargetIsNaN";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

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
      params: { id: "Nan" },
    };
    const response = await require("../../api/user").userGetById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401-userIsUnauthenticated", async () => {
    const userTarget = "userTargetGetIdUserIsUnauthenticated";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

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
      params: { id: userTargetData },
    };
    const response = await require("../../api/user").userGetById(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403-noViewUsersAuth", async () => {
    const user = "userGetIdNoViewUsersAuth";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);
    const userTarget = "userTargetGetIdNoViewUsersAuth";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "viewUsers") return false;
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: { id: userTargetData },
    };
    const response = await require("../../api/user").userGetById(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204-noData", async () => {
    const user = "userGetIdNoData";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);
    const userTarget = "userTargetGetIdNoData";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

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
      params: { id: 9999999999999999999999999999999 },
    };
    const response = await require("../../api/user").userGetById(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("DELETE /api/user/:id", () => {
  test("200", async () => {
    const user = "userGetByIdGood";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

    const data = {
      userId: userData,
      params: {
        id: 1,
      },
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
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("401-userIsUnauthenticated", async () => {
    const user = "userGetByIdWhithoutValidUser";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

    const data = {};
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403-noViewUsersAuth", async () => {
    const user = "userGetByIdNoViewUsersAuth";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

    const data = {
      userId: userData,
      params: {
        id: 1,
      },
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "viewUsers") return false;
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
      },
    };
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("403-noManageUserAuth", async () => {
    const user = "userGetByIdNoManageUserAuth";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

    const data = {
      userId: userData,
      params: {
        id: 1,
      },
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "manageUser") return false;
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
      },
    };
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("400-idUserTargetIsNan", async () => {
    const user = "userGetByIdIdUserTargetIsNan";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

    const data = {
      userId: userData,
      params: {
        id: "test",
      },
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
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400-userTryToDeleteHimself", async () => {
    const user = "userGetByIdUserTryToDeleteHimself";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

    const data = {
      userId: userData,
      params: {
        id: userData,
      },
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
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("204-userDoesNotExist", async () => {
    const user = "userGetByIdUuserDoesNotExist";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, 'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))', [userData]);

    const data = {
      userId: userData,
      params: {
        id: 99999999999999,
      },
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
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("PUT /api/user/rename/:id", () => {
  test("200", async () => {
    const userTarget = "userTargetRenameGood";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

    const data = {
      params: {
        id: userTargetData,
      },
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      body: { firstName: "test", lastName: "test", title: "test" },
    };
    const response = await require("../../api/user").userRenamePut(data);

    const queryVerification = `SELECT v_firstName, v_lastName, v_title FROM users WHERE i_id = ?;`;
    const dbRes = await executeQuery(db, queryVerification, [userTargetData]);
    // The sql request has an error
    if (dbRes[0]) {
      throw dbRes[0];
    }

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    expect(dbRes[1][0].v_firstName).toBe("test");
    expect(dbRes[1][0].v_lastName).toBe("test");
    expect(dbRes[1][0].v_title).toBe("test");
  });

  test("200NoModification", async () => {
    const userTarget = "userTargetRenameGoodNoModification";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

    const data = {
      params: {
        id: userTargetData,
      },
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      body: {},
    };
    const response = await require("../../api/user").userRenamePut(data);

    const queryVerification = `SELECT v_firstName, v_lastName, v_title FROM users WHERE i_id = ?;`;
    const dbRes = await executeQuery(db, queryVerification, [userTargetData]);
    // The sql request has an error
    if (dbRes[0]) {
      throw dbRes[0];
    }

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    expect(dbRes[1][0].v_firstName).toBe("firstNameTest");
    expect(dbRes[1][0].v_lastName).toBe("lastNameTest");
    expect(dbRes[1][0].v_title).toBe(null);
  });

  test("404noParams", async () => {
    const userTarget = "userTargetRenameNoParams";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

    const data = {
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      body: { firstName: "test", lastName: "test", title: "test" },
    };
    const response = await require("../../api/user").userRenamePut(data);

    const queryVerification = `SELECT v_firstName, v_lastName, v_title FROM users WHERE i_id = ?;`;
    const dbRes = await executeQuery(db, queryVerification, [userTargetData]);
    // The sql request has an error
    if (dbRes[0]) {
      throw dbRes[0];
    }

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
    expect(dbRes[1][0].v_firstName).toBe("firstNameTest");
    expect(dbRes[1][0].v_lastName).toBe("lastNameTest");
    expect(dbRes[1][0].v_title).toBe(null);
  });

  test("404noUserId", async () => {
    const userTarget = "userTargetRenameNoUserId";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

    const data = {
      params: {},
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      body: { firstName: "test", lastName: "test", title: "test" },
    };
    const response = await require("../../api/user").userRenamePut(data);

    const queryVerification = `SELECT v_firstName, v_lastName, v_title FROM users WHERE i_id = ?;`;
    const dbRes = await executeQuery(db, queryVerification, [userTargetData]);
    // The sql request has an error
    if (dbRes[0]) {
      throw dbRes[0];
    }

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
    expect(dbRes[1][0].v_firstName).toBe("firstNameTest");
    expect(dbRes[1][0].v_lastName).toBe("lastNameTest");
    expect(dbRes[1][0].v_title).toBe(null);
  });

  test("404userIdIsString", async () => {
    const userTarget = "userTargetRenameUserIdIsString";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

    const data = {
      params: {
        id: "userTargetData",
      },
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      body: {},
    };
    const response = await require("../../api/user").userRenamePut(data);

    const queryVerification = `SELECT v_firstName, v_lastName, v_title FROM users WHERE i_id = ?;`;
    const dbRes = await executeQuery(db, queryVerification, [userTargetData]);
    // The sql request has an error
    if (dbRes[0]) {
      throw dbRes[0];
    }

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
    expect(dbRes[1][0].v_firstName).toBe("firstNameTest");
    expect(dbRes[1][0].v_lastName).toBe("lastNameTest");
    expect(dbRes[1][0].v_title).toBe(null);
  });

  test("404invalidSpecialCode", async () => {
    const userTarget = "userTargetRenameInvalidSpecialCode";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

    const data = {
      params: {
        id: userTargetData,
      },
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return false;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      body: { firstName: "test", lastName: "test", title: "test" },
    };
    const response = await require("../../api/user").userRenamePut(data);

    const queryVerification = `SELECT v_firstName, v_lastName, v_title FROM users WHERE i_id = ?;`;
    const dbRes = await executeQuery(db, queryVerification, [userTargetData]);
    // The sql request has an error
    if (dbRes[0]) {
      throw dbRes[0];
    }

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
    expect(dbRes[1][0].v_firstName).toBe("firstNameTest");
    expect(dbRes[1][0].v_lastName).toBe("lastNameTest");
    expect(dbRes[1][0].v_title).toBe(null);
  });

  test("404noBody", async () => {
    const userTarget = "userTargetRenameNoBody";
    const userTargetData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userTargetData, "User '" + userTarget + "' already exist").not.toBe(0);

    const data = {
      params: {
        id: userTargetData,
      },
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
    };
    const response = await require("../../api/user").userRenamePut(data);

    const queryVerification = `SELECT v_firstName, v_lastName, v_title FROM users WHERE i_id = ?;`;
    const dbRes = await executeQuery(db, queryVerification, [userTargetData]);
    // The sql request has an error
    if (dbRes[0]) {
      throw dbRes[0];
    }

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
    expect(dbRes[1][0].v_firstName).toBe("firstNameTest");
    expect(dbRes[1][0].v_lastName).toBe("lastNameTest");
    expect(dbRes[1][0].v_title).toBe(null);
  });
});
