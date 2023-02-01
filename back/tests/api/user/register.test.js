const executeQuery = require("../../../functions/dataBase/executeQuery").run;
let db;

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

beforeAll(async () => {
  db = await require("../../../functions/dataBase/createConnection").open();
});

afterAll(() => {
  db.end();
});

describe("POST /user/register/", () => {
  test("200", async () => {
    let mailSend = false;
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
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(true);
  });

  test("400noBody", async () => {
    let mailSend = false;
    const data = {
      app: {
        db: db,
        executeQuery: executeQuery,
        io,
      },
      sendMailFunction: {
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(false);
  });

  test("400noFirstName", async () => {
    let mailSend = false;
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
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(false);
  });

  test("400noLastName", async () => {
    let mailSend = false;
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
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(false);
  });

  test("400noEmail", async () => {
    let mailSend = false;
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
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(false);
  });

  test("400noPassword", async () => {
    let mailSend = false;
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
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(false);
  });

  test("400invalidEmail", async () => {
    let mailSend = false;
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
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
    };
    const response = await require("../../../api/user/register").postRegister(data);
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(false);
  });

  test("400", async () => {
    let mailSend = false;
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
        sendMail: (email, title, body) => {
          mailSend = true;
        },
      },
    };
    await require("../../../api/user/register").postRegister(data);
    mailSend = false;
    const response = await require("../../../api/user/register").postRegister(data);
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    expect(mailSend).toBe(false);
  });
});
