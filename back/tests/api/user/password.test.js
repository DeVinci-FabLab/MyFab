//Mock stats function
const stats = require("../../../functions/stats");
jest.mock("../../../functions/stats");
stats.increment.mockReturnValue(true);

function emptyFunction() {
  return;
}

describe("PUT /user/password/", () => {
  test("200", async () => {
    //Execute
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, { affectedRows: 1 }];
        },
        cookiesList: {},
      },
      body: {
        actualPassword: "string",
        newPassword: "newPassword",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/password").putPasswordMe(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    //Execute
    const data = {
      userId: 1,
      app: {
        cookiesList: {},
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/password").putPasswordMe(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noActualPassword", async () => {
    //Execute
    const data = {
      userId: 1,
      app: {
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/password").putPasswordMe(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noNewPassword", async () => {
    //Execute
    const data = {
      userId: 1,
      app: {
        cookiesList: {},
      },
      body: {
        actualPassword: "string",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/password").putPasswordMe(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    //Execute
    const data = {
      app: {
        cookiesList: {},
      },
      body: {
        actualPassword: "string",
        newPassword: "newPassword",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/password").putPasswordMe(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("204invalidPassword", async () => {
    //Execute
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, { affectedRows: 0 }];
        },
        cookiesList: {},
      },
      body: {
        actualPassword: "incorrectPassword",
        newPassword: "newPassword",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/password").putPasswordMe(
      data
    );

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("PUT /user/password/:id", () => {
  test("200", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, { affectedRows: 1 }];
        },
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: 2,
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putPasswordUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noParams", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putPasswordUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {},
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putPasswordUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400idIsNan", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: "userDataTarget",
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putPasswordUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      params: {
        id: 2,
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putPasswordUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noNewPassword", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      body: {},
      params: {
        id: 2,
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putPasswordUser(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    //Execute
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: 2,
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putPasswordUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403noViewUsersAuth", async () => {
    //Execute
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
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: 2,
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putPasswordUser(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("403nomanageUserAuth", async () => {
    //Execute
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
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: 2,
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putPasswordUser(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204unknownUser", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, { affectedRows: 0 }];
        },
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: 2,
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putPasswordUser(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/user/forgottenPassword/", () => {
  test("200", async () => {
    //Execute
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
              return [null, [{ id: 1 }]];
            case 2:
              return [null, {}];

            default:
              return null;
          }
        },
        cookiesList: {},
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
      body: {
        email: "test@test.com",
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").postForgottenPassword(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200dontSendMail", async () => {
    //Execute
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
              return [null, [{ id: 1 }]];
            case 2:
              return [null, {}];

            default:
              return null;
          }
        },
        cookiesList: {},
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
      body: {
        email: "test@test.com",
        sendMail: false,
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").postForgottenPassword(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200butUnknownMail", async () => {
    //Execute
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
        cookiesList: {},
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
      body: {
        email: "user@wrongMail.com",
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").postForgottenPassword(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").postForgottenPassword(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noEmail", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
      body: {},
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").postForgottenPassword(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });
});

describe("PUT /api/user/resetPassword/:tocken", () => {
  test("200", async () => {
    //Execute
    let requestNumber = 0;
    const data = {
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
              return [null, [{ id: 1 }]];
            case 2:
              return [null, {}];
            case 3:
              return [null, {}];

            default:
              const res = await executeQuery(db, query, options);
              console.log(requestNumber);
              console.log(res);
              return res;
          }
        },
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        tocken: "token",
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putResetPassword(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noParams", async () => {
    //Execute
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putResetPassword(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noTocken", async () => {
    //Execute
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {},
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putResetPassword(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    //Execute
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      params: {
        tocken: "token",
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putResetPassword(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noNewPassword", async () => {
    //Execute
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        cookiesList: {},
      },
      body: {},
      params: {
        tocken: "token",
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putResetPassword(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401unknownToken", async () => {
    //Execute
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
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        tocken: "token",
      },
      sendMailFunction: emptyFunction,
    };
    const response =
      await require("../../../api/user/password").putResetPassword(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
