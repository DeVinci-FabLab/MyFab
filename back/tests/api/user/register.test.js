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
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
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
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
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
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
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
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
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
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
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
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
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
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
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
