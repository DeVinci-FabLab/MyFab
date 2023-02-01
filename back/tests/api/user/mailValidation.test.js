const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("PUT /user/mailValidation/:tocken", () => {
  test("200", async () => {
    const user = "userMailValidationPost200";
    const token = "umvP200";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLogWithoutMailValidated(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `mailtocken` (`i_idUser`, `v_value`, `b_mailSend`) VALUES (?, ?, 1);", [userData, token]);
    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        tocken: token,
      },
    };
    const response = await require("../../../api/user/mailValidation").putMailValidation(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const resSelectMailValidated = await executeQuery(db, "SELECT b_mailValidated AS 'mailValidated' FROM `users` WHERE i_id = ?", [userData]);
    expect(resSelectMailValidated[1][0].mailValidated).toBe(1);
  });

  test("400_noParams", async () => {
    const user = "userMailValidationPostNoParams400";
    const token = "umvP400";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLogWithoutMailValidated(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `mailtocken` (`i_idUser`, `v_value`, `b_mailSend`) VALUES (?, ?, 1);", [userData, token]);
    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
    };
    const response = await require("../../../api/user/mailValidation").putMailValidation(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resSelectMailValidated = await executeQuery(db, "SELECT b_mailValidated AS 'mailValidated' FROM `users` WHERE i_id = ?", [userData]);
    expect(resSelectMailValidated[1][0].mailValidated).toBe(0);
  });

  test("400_noParamsTocken", async () => {
    const user = "userMailValidationPostNoParamsTocken400";
    const token = "umvP400";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLogWithoutMailValidated(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `mailtocken` (`i_idUser`, `v_value`, `b_mailSend`) VALUES (?, ?, 1);", [userData, token]);
    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {},
    };
    const response = await require("../../../api/user/mailValidation").putMailValidation(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const resSelectMailValidated = await executeQuery(db, "SELECT b_mailValidated AS 'mailValidated' FROM `users` WHERE i_id = ?", [userData]);
    expect(resSelectMailValidated[1][0].mailValidated).toBe(0);
  });

  test("401_noParamsTocken", async () => {
    const user = "userMailValidationPostNoParamsTocken401";
    const token = "umvP401";
    const userData = await require("../../createNewUserAndLog").createNewUserAndLogWithoutMailValidated(db, executeQuery, user);
    expect(userData, "User '" + user + "' already exist").not.toBe(0);
    await executeQuery(db, "INSERT INTO `mailtocken` (`i_idUser`, `v_value`, `b_mailSend`) VALUES (?, ?, 1);", [userData, token]);
    const data = {
      userId: userData,
      app: {
        db: db,
        executeQuery: executeQuery,
      },
      params: {
        tocken: "token",
      },
    };
    const response = await require("../../../api/user/mailValidation").putMailValidation(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const resSelectMailValidated = await executeQuery(db, "SELECT b_mailValidated AS 'mailValidated' FROM `users` WHERE i_id = ?", [userData]);
    expect(resSelectMailValidated[1][0].mailValidated).toBe(0);
  });
});
