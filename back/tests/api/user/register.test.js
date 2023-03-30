const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open({ isTest: true });
});

afterAll(() => {
  db.end();
});

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
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
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
    const response = await require("../../../api/user/register").postRegister(data);
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
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
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
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
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
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
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
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
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
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400", async () => {
    //Execute
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      body: {
        firstName: "test",
        lastName: "200",
        email: "test2@test.fr",
        password: "test",
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {},
      },
    };
    await require("../../../api/user/register").postRegister(data);
    const response = await require("../../../api/user/register").postRegister(data);
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
