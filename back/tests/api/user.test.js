const executeQuery = require("../../functions/dataBase/executeQuery").run;
let db;

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

beforeAll(async () => {
  db = await require("../../functions/dataBase/createConnection").open({ isTest: true });
});

afterAll(() => {
  db.end();
});

describe("GET /api/user/", () => {
  test("200", async () => {
    let requestNumber = 0;

    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "emailTest@test.com",
                    title: null,
                    isMicrosoft: 0,
                  },
                ],
              ];
            case 2:
              return [null, [{ count: 1 }]];

            default:
              return null;
          }
        },
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
    const data = {};
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403-noViewUsersAuth", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
    };
    const response = await require("../../api/user").userGetAll(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("200TestInputText", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "emailTest@test.com",
                    title: null,
                    isMicrosoft: 0,
                  },
                ],
              ];
            case 2:
              return [null, [{ count: 1 }]];

            default:
              return null;
          }
        },
      },
      query: { inputValue: "userTest" },
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
    let requestNumber = 0;

    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "emailTest@test.com",
                    title: null,
                    isMicrosoft: 0,
                  },
                ],
              ];
            case 2:
              return [null, [{ count: 1 }]];

            default:
              return null;
          }
        },
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
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "emailTest@test.com",
                    title: null,
                    isMicrosoft: 0,
                  },
                ],
              ];
            case 2:
              return [null, [{ count: 1 }]];

            default:
              return null;
          }
        },
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
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "emailTest@test.com",
                    title: null,
                    isMicrosoft: 0,
                  },
                ],
              ];
            case 2:
              return [null, [{ count: 1 }]];

            default:
              return null;
          }
        },
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
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "emailTest@test.com",
                    title: null,
                    isMicrosoft: 0,
                  },
                ],
              ];
            case 2:
              return [null, [{ count: 1 }]];

            default:
              return null;
          }
        },
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
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "emailTest@test.com",
                    title: null,
                    isMicrosoft: 0,
                  },
                ],
              ];
            case 2:
              return [null, [{ count: 1 }]];

            default:
              return null;
          }
        },
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
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "emailTest@test.com",
                    title: null,
                    isMicrosoft: 0,
                  },
                ],
              ];
            case 2:
              return [null, [{ count: 1 }]];

            default:
              return null;
          }
        },
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
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "emailTest@test.com",
                    title: null,
                    isMicrosoft: 0,
                  },
                ],
              ];
            case 2:
              return [null, [{ count: 1 }]];

            default:
              return null;
          }
        },
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
    let requestNumber = 0;

    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "userGetMeGood@test.com",
                    creationDate: new Date("2023-03-02T09:02:49.000Z"),
                    discordid: null,
                    language: "fr",
                    title: null,
                    isMicrosoft: 0,
                    acceptedRule: 0,
                    mailValidated: 1,
                  },
                ],
              ];

            default:
              return null;
          }
        },
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
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];

            default:
              return null;
          }
        },
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
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 2,
                    firstName: "firstNameTest",
                    lastName: "lastNameTest",
                    email: "emailTest@test.com",
                    creationDate: new Date("2023-03-02T09:07:33.000Z"),
                    discordid: null,
                    language: "fr",
                    title: null,
                    isMicrosoft: 0,
                    acceptedRule: 0,
                    mailValidated: 1,
                  },
                ],
              ];

            default:
              return null;
          }
        },
      },
      params: { id: 2 },
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
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
      },
      params: { id: "Nan" },
    };
    const response = await require("../../api/user").userGetById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401-userIsUnauthenticated", async () => {
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
      },
      params: { id: 2 },
    };
    const response = await require("../../api/user").userGetById(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403-noViewUsersAuth", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "viewUsers") return false;
          return true;
        },
      },
      app: {
        db: db,
      },
      params: { id: 2 },
    };
    const response = await require("../../api/user").userGetById(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204-noData", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];

            default:
              return null;
          }
        },
      },
      params: { id: 2 },
    };
    const response = await require("../../api/user").userGetById(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("DELETE /api/user/:id", () => {
  test("200", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      params: {
        id: 2,
      },
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
              return [null, { changedRows: 1 }];

            default:
              return null;
          }
        },
        io,
      },
    };
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("401-userIsUnauthenticated", async () => {
    const data = {};
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403-noViewUsersAuth", async () => {
    const data = {
      userId: 1,
      params: {
        id: 2,
      },
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "viewUsers") return false;
          return true;
        },
      },
    };
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("403-noManageUserAuth", async () => {
    const data = {
      userId: 1,
      params: {
        id: 2,
      },
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "manageUser") return false;
          return true;
        },
      },
      app: {},
    };
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("400-idUserTargetIsNan", async () => {
    const data = {
      userId: 1,
      params: {
        id: "test",
      },
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {},
    };
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400-userTryToDeleteHimself", async () => {
    const user = "userGetByIdUserTryToDeleteHimself";
    const userData = await require("../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(
      db,
      'INSERT INTO `rolescorrelation` (`i_idUser`, `i_idRole`) VALUES (?, (SELECT i_id FROM `gd_roles` WHERE v_name = "roleViewUsers"))',
      [userData]
    );

    const data = {
      userId: 1,
      params: {
        id: 1,
      },
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {},
    };
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("204-userDoesNotExist", async () => {
    let requestNumber = 0;
    const data = {
      userId: 1,
      params: {
        id: 2,
      },
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, { changedRows: 0 }];

            default:
              return null;
          }
        },
      },
    };
    const response = await require("../../api/user").userDeleteById(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("PUT /api/user/rename/:id", () => {
  test("200", async () => {
    const data = {
      params: {
        id: 2,
      },
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, {}];
        },
        io,
      },
      body: { firstName: "test", lastName: "test", title: "test" },
    };
    const response = await require("../../api/user").userRenamePut(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200NoModification", async () => {
    const data = {
      params: {
        id: 1,
      },
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, {}];
        },
        io,
      },
      body: {},
    };
    const response = await require("../../api/user").userRenamePut(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("404noParams", async () => {
    const data = {
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        io,
      },
      body: { firstName: "test", lastName: "test", title: "test" },
    };
    const response = await require("../../api/user").userRenamePut(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });

  test("404noUserId", async () => {
    const data = {
      params: {},
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        io,
      },
      body: { firstName: "test", lastName: "test", title: "test" },
    };
    const response = await require("../../api/user").userRenamePut(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });

  test("404userIdIsString", async () => {
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
        io,
      },
      body: {},
    };
    const response = await require("../../api/user").userRenamePut(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });

  test("404invalidSpecialCode", async () => {
    const data = {
      params: {
        id: 1,
      },
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return false;
        },
      },
      app: {
        io,
      },
      body: { firstName: "test", lastName: "test", title: "test" },
    };
    const response = await require("../../api/user").userRenamePut(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });

  test("404noBody", async () => {
    const data = {
      params: {
        id: 1,
      },
      userAuthorization: {
        checkSpecialCode: async (specialcode) => {
          return true;
        },
      },
      app: {
        io,
      },
    };
    const response = await require("../../api/user").userRenamePut(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });
});
