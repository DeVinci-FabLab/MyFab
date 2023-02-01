const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("PUT /user/password/", () => {
  test("200", async () => {
    const user = "passwordPutMe200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        actualPassword: "string",
        newPassword: "newPassword",
      },
    };
    const response = await require("../../../api/user/password").putPasswordMe(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    const user = "passwordPutMe400noBody";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
    };
    const response = await require("../../../api/user/password").putPasswordMe(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noActualPassword", async () => {
    const user = "passwordPutMe400noActualPassword";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
    };
    const response = await require("../../../api/user/password").putPasswordMe(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noNewPassword", async () => {
    const user = "passwordPutMe400noNewPassword";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        actualPassword: "string",
      },
    };
    const response = await require("../../../api/user/password").putPasswordMe(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    const user = "passwordPutMe401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        actualPassword: "string",
        newPassword: "newPassword",
      },
    };
    const response = await require("../../../api/user/password").putPasswordMe(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("204invalidPassword", async () => {
    const user = "passwordPutMe204invalidPassword";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        actualPassword: "incorrectPassword",
        newPassword: "newPassword",
      },
    };
    const response = await require("../../../api/user/password").putPasswordMe(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("PUT /user/password/:id", () => {
  test("200", async () => {
    const user = "passwordPutId200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "passwordPutId200Target";
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
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: userDataTarget,
      },
    };
    const response = await require("../../../api/user/password").putPasswordUser(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noParams", async () => {
    const user = "passwordPutId400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "passwordPutId400noParamsTarget";
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
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
    };
    const response = await require("../../../api/user/password").putPasswordUser(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    const user = "passwordPutId400noId";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "passwordPutId400noIdTarget";
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
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {},
    };
    const response = await require("../../../api/user/password").putPasswordUser(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400idIsNan", async () => {
    const user = "passwordPutId400idIsNan";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "passwordPutId400idIsNanTarget";
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
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: "userDataTarget",
      },
    };
    const response = await require("../../../api/user/password").putPasswordUser(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    const user = "passwordPutId400noBody";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "passwordPutId400noBodyTarget";
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
        cookiesList: {},
      },
      params: {
        id: userDataTarget,
      },
    };
    const response = await require("../../../api/user/password").putPasswordUser(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noNewPassword", async () => {
    const user = "passwordPutId400noNewPassword";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "passwordPutId400noNewPasswordTarget";
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
        cookiesList: {},
      },
      body: {},
      params: {
        id: userDataTarget,
      },
    };
    const response = await require("../../../api/user/password").putPasswordUser(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    const user = "passwordPutId401noUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "passwordPutId401noUserTarget";
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
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: userDataTarget,
      },
    };
    const response = await require("../../../api/user/password").putPasswordUser(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403noViewUsersAuth", async () => {
    const user = "passwordPutId403noViewUsersAuth";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "passwordPutId403noViewUsersAuthTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "viewUsers") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: userDataTarget,
      },
    };
    const response = await require("../../../api/user/password").putPasswordUser(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("403nomanageUserAuth", async () => {
    const user = "passwordPutId403nomanageUserAuth";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "passwordPutId403nomanageUserAuthTarget";
    const userDataTarget = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, userTarget);
    expect(userDataTarget, "User '" + userTarget + "' already exist").not.toBe(0);
    const data = {
      userId: userData,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          if (authName === "manageUser") {
            return false;
          }
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: userDataTarget,
      },
    };
    const response = await require("../../../api/user/password").putPasswordUser(data);

    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204unknownUser", async () => {
    const user = "passwordPutId204unknownUser";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const userTarget = "passwordPutId204unknownUserTarget";
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
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        id: 1000000,
      },
    };
    const response = await require("../../../api/user/password").putPasswordUser(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/user/forgottenPassword/", () => {
  test("200", async () => {
    const user = "forgottenPasswordPost200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    let mailSend = false;
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
        cookiesList: {},
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
      body: {
        email: user + "@test.com",
      },
    };
    const response = await require("../../../api/user/password").postForgottenPassword(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(true);
  });

  test("200butUnknownMail", async () => {
    const user = "forgottenPasswordPost200butUnknownMail";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    let mailSend = false;
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
        cookiesList: {},
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
      body: {
        email: user + "@wrongMail.com",
      },
    };
    const response = await require("../../../api/user/password").postForgottenPassword(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(false);
  });

  test("400noBody", async () => {
    const user = "forgottenPasswordPost400noBody";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    let mailSend = false;
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
        cookiesList: {},
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
    };
    const response = await require("../../../api/user/password").postForgottenPassword(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(false);
  });

  test("400noEmail", async () => {
    const user = "forgottenPasswordPost400noEmail";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    let mailSend = false;
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
        cookiesList: {},
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
      body: {},
    };
    const response = await require("../../../api/user/password").postForgottenPassword(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(false);
  });
});

describe("PUT /api/user/resetPassword/:tocken", () => {
  test("200", async () => {
    const user = "resetPassword200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const token = "200";
    await executeQuery(db, "INSERT INTO `mailtocken` (`i_idUser`, `v_value`, `b_mailSend`) VALUES (?, ?, '1')", [userData, token]);
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        tocken: token,
      },
    };
    const response = await require("../../../api/user/password").putResetPassword(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noParams", async () => {
    const user = "resetPassword400noParams";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const token = "400noParams";
    await executeQuery(db, "INSERT INTO `mailtocken` (`i_idUser`, `v_value`, `b_mailSend`) VALUES (?, ?, '1')", [userData, token]);
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
    };
    const response = await require("../../../api/user/password").putResetPassword(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noTocken", async () => {
    const user = "resetPassword400noTocken";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const token = "400noTocken";
    await executeQuery(db, "INSERT INTO `mailtocken` (`i_idUser`, `v_value`, `b_mailSend`) VALUES (?, ?, '1')", [userData, token]);
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {},
    };
    const response = await require("../../../api/user/password").putResetPassword(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    const user = "resetPassword400noBody";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const token = "400noBody";
    await executeQuery(db, "INSERT INTO `mailtocken` (`i_idUser`, `v_value`, `b_mailSend`) VALUES (?, ?, '1')", [userData, token]);
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      params: {
        tocken: token,
      },
    };
    const response = await require("../../../api/user/password").putResetPassword(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noNewPassword", async () => {
    const user = "resetPassword400noNewPassword";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const token = "400noNewPassword";
    await executeQuery(db, "INSERT INTO `mailtocken` (`i_idUser`, `v_value`, `b_mailSend`) VALUES (?, ?, '1')", [userData, token]);
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      app: {
        db: db,
        executeQuery: executeQuery,
        cookiesList: {},
      },
      body: {},
      params: {
        tocken: token,
      },
    };
    const response = await require("../../../api/user/password").putResetPassword(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401unknownToken", async () => {
    const user = "resetPassword401unknownToken";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLog(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    const token = "401unknownToken";
    await executeQuery(db, "INSERT INTO `mailtocken` (`i_idUser`, `v_value`, `b_mailSend`) VALUES (?, ?, '1')", [userData, token]);
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
        cookiesList: {},
      },
      body: {
        newPassword: "newPassword",
      },
      params: {
        tocken: "token",
      },
    };
    const response = await require("../../../api/user/password").putResetPassword(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
