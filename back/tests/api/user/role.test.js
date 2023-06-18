function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

describe("GET /api/role/", () => {
  test("200", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [
            null,
            [
              {
                id: 1,
                name: "Administrateur",
                description:
                  "Ce role donne acces a tous les outils d'administration et de gestion du site",
                color: "db1010",
                isProtected: 1,
              },
              {
                id: 2,
                name: "Moderateur",
                description:
                  "Ce role donne acces aux outils pour gerer le contenu et les utilisateurs du site",
                color: "eb9413",
                isProtected: 1,
              },
              {
                id: 3,
                name: "Agent MyFab",
                description:
                  "Ce role donne acces aux outils de MyFab pour gerer les demandes du site",
                color: "e0dd22",
                isProtected: 0,
              },
              {
                id: 4,
                name: "Agent blog",
                description:
                  "Ce role donne acces aux outils pour gerer le blog",
                color: "5865F2",
                isProtected: 0,
              },
              {
                id: 5,
                name: "testRole",
                description: "",
                color: "",
                isProtected: 0,
              },
              {
                id: 6,
                name: "testRoleProtected",
                description: "",
                color: "",
                isProtected: 1,
              },
            ],
          ];
        },
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
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
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
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [
            null,
            [
              {
                id: 2,
                name: "Moderateur",
                description:
                  "Ce role donne acces aux outils pour gerer le contenu et les utilisateurs du site",
                color: "eb9413",
                isProtected: 1,
              },
            ],
          ];
        },
        io,
      },
      params: {
        idUser: 2,
      },
    };
    const response =
      await require("../../../api/user/role").getRolesForUserById(data);
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].id).toBe("number");
    expect(typeof response.json[0].name).toBe("string");
    expect(typeof response.json[0].description).toBe("string");
    expect(typeof response.json[0].color).toBe("string");
  });

  test("400_noParams", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        io,
      },
    };
    const response =
      await require("../../../api/user/role").getRolesForUserById(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noIdUserTarget", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        io,
      },
      params: {},
    };
    const response =
      await require("../../../api/user/role").getRolesForUserById(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401_noUser", async () => {
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 2,
      },
    };
    const response =
      await require("../../../api/user/role").getRolesForUserById(data);
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_unauthorized", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 2,
      },
    };
    const response =
      await require("../../../api/user/role").getRolesForUserById(data);
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/user/role/", () => {
  test("200", async () => {
    //Prepare
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [
            null,
            [
              {
                id: 2,
                name: "Moderateur",
                description:
                  "Ce role donne acces aux outils pour gerer le contenu et les utilisateurs du site",
                color: "eb9413",
                isProtected: 1,
              },
            ],
          ];
        },
        io,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").getRolesForActualUser(data);

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
    const data = {
      app: {
        io,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").getRolesForActualUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/user/:idUser/role/:idRole/", () => {
  test("200", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, [{ isProtected: 0 }]];
            case 3:
              return [null, { affectedRows: 1 }];
            case 4:
              return [null, { affectedRows: 1 }];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400_noParams", async () => {
    //Prepare
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noIdRole", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noUserTarget", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 2,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_userTargetIsNan", async () => {
    //Prepare
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: "userDataTarget",
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_idRoleIsNan", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 2,
        idRole: "idRoleTest",
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401_noUser", async () => {
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
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_noRoleviewUsers", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "viewUsers") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_noRoleChangeUserRole", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_idUserEqualIdTarget", async () => {
    let requestNumber = 0;
    const data = {
      userId: 2,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, [{ isProtected: 1 }]];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("409_correlationExist", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ 1: 1 }]];
        },
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(409);
    expect(response.type).toBe("code");
  });

  test("401_roleUnknown", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, []];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("200_protectedRule", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, [{ isProtected: 1 }]];
            case 3:
              return [null, { affectedRows: 1 }];
            case 4:
              return [null, { affectedRows: 1 }];

            default:
              const res = await executeQuery(db, query, options);
              console.log(requestNumber);
              console.log(res);
              return res;
          }
        },
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("401_cantChangeUserProtectedRole", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, [{ isProtected: 1 }]];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response = await require("../../../api/user/role").postAddRoleForUser(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("DELETE /api/user/:idUser/role/:idRole/", () => {
  test("200", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 2 }]];
            case 2:
              return [null, [{ isProtected: 0 }]];
            case 3:
              return [null, { affectedRows: 1 }];
            case 4:
              return [null, { affectedRows: 1 }];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400_noParams", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noParamsIdUser", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idRole: 1,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noParamsIdRole", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 2,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_idUserTargetIsNan", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: "userDataTarget",
        idRole: 1,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_idRoleIsNan", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 2,
        idRole: "idRoleTest",
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401_noIdUser", async () => {
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
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_noRoleViewUsers", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "viewUsers") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_noRoleChangeUser", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "manageUser") {
            return false;
          }
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("401_idUserEqualIdTarget", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        io,
      },
      params: {
        idUser: 1,
        idRole: 1,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("409_correlationNotExist", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, []];
        },
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(409);
    expect(response.type).toBe("code");
  });

  test("200_protectedRole", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 2 }]];
            case 2:
              return [null, [{ isProtected: 1 }]];
            case 3:
              return [null, { affectedRows: 1 }];
            case 4:
              return [null, { affectedRows: 1 }];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("401_cantRemoveprotectedRole", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "changeUserProtectedRole") {
            return false;
          }
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 2 }]];
            case 2:
              return [null, [{ isProtected: 1 }]];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        idUser: 2,
        idRole: 1,
      },
    };

    //Execute
    const response =
      await require("../../../api/user/role").deleteRemoveRoleForUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
