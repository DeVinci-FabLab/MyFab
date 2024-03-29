//Mock stats function
const stats = require("../../../functions/stats");
jest.mock("../../../functions/stats");
stats.increment.mockReturnValue(true);

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

describe("POST /user/register/", () => {
  test("200", async () => {
    //Execute
    let requestNumber = 0;
    const data = {
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, { affectedRows: 1 }];
            case 3:
              return [null, [{ id: 1 }]];
            case 4:
              return [null, []];
            case 5:
              return [null, {}];

            default:
              return null;
          }
        },
        io,
      },
      body: {
        firstName: "test",
        lastName: "200",
        email: "test@test.fr",
        password: "test",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/register").postRegister(
      data
    );
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200language", async () => {
    //Execute
    let requestNumber = 0;
    const data = {
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, { affectedRows: 1 }];
            case 3:
              return [null, [{ id: 1 }]];
            case 4:
              return [null, []];
            case 5:
              return [null, {}];

            default:
              return null;
          }
        },
        io,
      },
      body: {
        firstName: "test",
        lastName: "200",
        email: "test@test.fr",
        password: "test",
        language: "fr",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/register").postRegister(
      data
    );
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200sendMail", async () => {
    //Execute
    let requestNumber = 0;
    const data = {
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, []];
            case 2:
              return [null, { affectedRows: 1 }];
            case 3:
              return [null, [{ id: 1 }]];
            case 4:
              return [null, []];
            case 5:
              return [null, {}];

            default:
              return null;
          }
        },
        io,
      },
      body: {
        firstName: "test",
        lastName: "200",
        email: "test@test.fr",
        password: "test",
        sendMail: false,
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/register").postRegister(
      data
    );
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    //Execute
    const data = {
      app: {
        io,
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
    };
    const response = await require("../../../api/user/register").postRegister(
      data
    );
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noFirstName", async () => {
    //Execute
    const data = {
      app: {
        io,
      },
      body: {
        lastName: "200",
        email: "test@test.fr",
        password: "test",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/register").postRegister(
      data
    );
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noLastName", async () => {
    //Execute
    const data = {
      app: {
        io,
      },
      body: {
        firstName: "test",
        email: "test@test.fr",
        password: "test",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/register").postRegister(
      data
    );
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noEmail", async () => {
    //Execute
    const data = {
      app: {
        io,
      },
      body: {
        firstName: "test",
        lastName: "200",
        password: "test",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/register").postRegister(
      data
    );
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noPassword", async () => {
    //Execute
    const data = {
      app: {
        io,
      },
      body: {
        firstName: "test",
        lastName: "200",
        email: "test@test.fr",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/register").postRegister(
      data
    );
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400invalidEmail", async () => {
    //Execute
    const data = {
      app: {
        io,
      },
      body: {
        firstName: "test",
        lastName: "200",
        email: "test.fr",
        password: "test",
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/user/register").postRegister(
      data
    );
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401", async () => {
    //Execute
    const data = {
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ 1: 1 }]];
        },
        io,
      },
      body: {
        firstName: "test",
        lastName: "200",
        email: "test2@test.fr",
        password: "test",
      },
      sendMailFunction: emptyFunction,
    };
    await require("../../../api/user/register").postRegister(data);
    const response = await require("../../../api/user/register").postRegister(
      data
    );
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
