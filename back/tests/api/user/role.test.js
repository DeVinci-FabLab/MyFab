const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;
let idRoleTest;
let idRoleProtectedTest;

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
  await executeQuery(db, "INSERT INTO gd_roles (v_name, v_description, v_discordPrefix, v_color) VALUES ('testRole', '', '', '')", []);
  idRoleTest = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
  const res = await executeQuery(db, "INSERT INTO gd_roles (v_name, v_description, v_discordPrefix, v_color, b_isProtected) VALUES ('testRoleProtected', '', '', '', '1')", []);
  idRoleProtectedTest = (await executeQuery(db, "SELECT LAST_INSERT_ID() AS 'id'", []))[1][0].id;
});

afterAll(() => {
  db.end();
});

describe("GET /api/role/", () => {
  test("200", async () => {
    const user = "roleGet200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
    const response = await require("../../../api/user/role").getRoles(data);
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].id).toBe("number");
    expect(typeof response.json[0].name).toBe("string");
    expect(typeof response.json[0].description).toBe("string");
    expect(typeof response.json[0].color).toBe("string");
    expect(typeof response.json[0].isProtected).toBe("number");
  });

  test("401_userUnauthorized", async () => {
    const user = "roleGet401userUnauthorized";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);

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
    const response = await require("../../../api/user/role").getRoles(data);
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/user/:idUser/role/", () => {
  test("200", async () => {
    const user = "roleGetById200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleGetById200Target";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM gd_roles WHERE v_name = 'Modérateur'))", [userDataTarget]);

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
        idUser: userDataTarget,
      },
    };
    const response = await require("../../../api/user/role").getRolesForUserById(data);
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].id).toBe("number");
    expect(typeof response.json[0].name).toBe("string");
    expect(typeof response.json[0].description).toBe("string");
    expect(typeof response.json[0].color).toBe("string");
  });

  test("400_noParams", async () => {
    const user = "roleGetById400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleGetById400noParamsTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);

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
    const response = await require("../../../api/user/role").getRolesForUserById(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noIdUserTarget", async () => {
    const user = "roleGetById400noIdUserTarget";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleGetById400noIdUserTargetTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);

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
    const response = await require("../../../api/user/role").getRolesForUserById(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401_noUser", async () => {
    const user = "roleGetById401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleGetById401noUserTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);

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
        idUser: userDataTarget,
      },
    };
    const response = await require("../../../api/user/role").getRolesForUserById(data);
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_unauthorized", async () => {
    const user = "roleGetById401unauthorized";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleGetById401unauthorizedTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);

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
        idUser: userDataTarget,
      },
    };
    const response = await require("../../../api/user/role").getRolesForUserById(data);
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/user/role/", () => {
  test("200", async () => {
    //Prepare
    const user = "roleGetActualUser200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM gd_roles WHERE v_name = 'Modérateur'))", [userData]);
    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").getRolesForActualUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).toBe(1);
    expect(typeof response.json[0].id).toBe("number");
    expect(typeof response.json[0].name).toBe("string");
    expect(typeof response.json[0].description).toBe("string");
    expect(typeof response.json[0].color).toBe("string");
  });

  test("401_noUser", async () => {
    //Prepare
    const user = "roleGetActualUser401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").getRolesForActualUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/user/:idUser/role/:idRole/", () => {
  test("200", async () => {
    //Prepare
    const user = "rolePostAddNewRole200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole200Target";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("400_noParams", async () => {
    //Prepare
    const user = "rolePostAddNewRole400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole400noParamsTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("400_noIdRole", async () => {
    //Prepare
    const user = "rolePostAddNewRole400noIdRole";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole400noIdRoleTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("400_noUserTarget", async () => {
    //Prepare
    const user = "rolePostAddNewRole400noUserTarget";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole400noUserTargetTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("400_userTargetIsNan", async () => {
    //Prepare
    const user = "rolePostAddNewRole400userTargetIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole400userTargetIsNanTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: "userDataTarget",
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("400_idRoleIsNan", async () => {
    //Prepare
    const user = "rolePostAddNewRole400idRoleIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole400idRoleIsNanTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: "idRoleTest",
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("401_noRoleviewUsers", async () => {
    //Prepare
    const user = "rolePostAddNewRole401noRoleviewUsers";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole401noRoleviewUsersTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          if (authName === "viewUsers") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("401_noRoleChangeUserRole", async () => {
    //Prepare
    const user = "rolePostAddNewRole401noRoleChangeUserRole";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole401noRoleChangeUserRoleTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          if (authName === "changeUserRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("401_idUserEqualIdTarget", async () => {
    //Prepare
    const user = "rolePostAddNewRole401idUserEqualIdTarget";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole401idUserEqualIdTargetTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userData,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("409_correlationExist", async () => {
    //Prepare
    const user = "rolePostAddNewRole409correlationExist";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole409correlationExistTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const queryInsertCorrelation = `INSERT INTO rolescorrelation (i_idUser, i_idRole)
                                         VALUES (?, ?);`;
    await executeQuery(db, queryInsertCorrelation, [userDataTarget, idRoleTest]);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(409);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("401_roleUnknown", async () => {
    //Prepare
    const user = "rolePostAddNewRole401roleUnknown";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole401roleUnknownTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: 100000000000000000000,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("200_protectedRule", async () => {
    //Prepare
    const user = "rolePostAddNewRole200protectedRule";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole200protectedRuleTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
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
        idUser: userDataTarget,
        idRole: idRoleProtectedTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("401_cantChangeUserProtectedRole", async () => {
    //Prepare
    const user = "rolePostAddNewRole401cantChangeUserProtectedRole";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "rolePostAddNewRole401cantChangeUserProtectedRoleTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleProtectedTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });
});

describe("DELETE /api/user/:idUser/role/:idRole/", () => {
  test("200", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole200Target";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("400_noParams", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole400noParamsTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("400_noParamsIdUser", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole400noParamsIdUserTarget";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole400noParamsIdUserTargetTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("400_noParamsIdRole", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole400noParamsIdRole";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole400noParamsIdRoleTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("400_idUserTargetIsNan", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole400idUserTargetIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole400idUserTargetIsNanTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: "userDataTarget",
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("400_idRoleIsNan", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole400idRoleIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole400idRoleIsNanTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: "idRoleTest",
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("401_noIdUser", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole401noIdUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole401noIdUserTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("401_noRoleViewUsers", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole401noRoleViewUsers";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole401noRoleViewUsersTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          if (authName === "viewUsers") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("401_noRoleChangeUser", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole401noRoleChangeUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole401noRoleChangeUserTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          if (authName === "manageUser") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("401_idUserEqualIdTarget", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole401idUserEqualIdTarget";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole401idUserEqualIdTargetTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userData,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });

  test("409_correlationNotExist", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole409correlationNotExist";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole409correlationNotExistTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(409);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("200_protectedRole", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole200protectedRole";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole200protectedRoleTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleProtectedTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
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
        idUser: userDataTarget,
        idRole: idRoleProtectedTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(0);
  });

  test("401_cantRemoveprotectedRole", async () => {
    //Prepare
    const user = "roleDeleteRemoveRole401cantRemoveprotectedRole";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "roleDeleteRemoveRole401cantRemoveprotectedRoleTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, ?)", [userDataTarget, idRoleProtectedTest]);

    const resCountBeforeDelete = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCountBeforeDelete[1][0].count).toBe(1);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      params: {
        idUser: userDataTarget,
        idRole: idRoleProtectedTest,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resCount = await executeQuery(db, "SELECT COUNT(*) AS 'count' FROM `rolescorrelation` WHERE i_idUser = ?", [userDataTarget]);
    expect(resCount[1][0].count).toBe(1);
  });
});
