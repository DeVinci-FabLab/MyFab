const fs = require("fs");
//Mock stats
const stats = require("../../../functions/stats");
jest.mock("../../../functions/stats");
stats.increment.mockReturnValue(true);

//Mock updateTicketDate
const updateTicketDate = require("../../../functions/stats").updateTicketDate;
jest.mock("../../../functions/stats");
const updateTicketDateMock = jest.fn().mockResolvedValue(true);

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

afterAll(() => {
  fs.readdir(__dirname + "/../../../data/files/stl/", (err, files) => {
    files.forEach((file) => {
      if (file.endsWith("-test.STL"))
        fs.unlinkSync(__dirname + "/../../../data/files/stl/" + file);
    });
  });
});

beforeEach(() => {
  jest.clearAllMocks(); // Reset all mock function calls before each test
});

describe("GET /api/ticket/:id/message/", () => {
  test("200myFabAgent", async () => {
    //Execute
    let requestNumber = 0;
    const data = {
      userId: 2,
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
              return [
                null,
                [
                  {
                    userName: "firstNameTest l.",
                    content: "ticketGetTicketMessages200user",
                    creationDate: new Date("2023-03-30T07:16:25.000Z"),
                  },
                ],
              ];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 1,
      },
    };
    const response =
      await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].userName).toBe("string");
    expect(typeof response.json[0].content).toBe("string");
    expect(
      Object.prototype.toString.call(response.json[0].creationDate) ===
        "[object Date]"
    ).toBe(true);
  });

  test("200userOwner", async () => {
    //Execute
    let requestNumber = 0;
    const data = {
      userId: 2,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 2 }]];
            case 2:
              return [
                null,
                [
                  {
                    userName: "firstNameTest l.",
                    content: "ticketGetTicketMessages200user",
                    creationDate: new Date("2023-03-30T07:16:25.000Z"),
                  },
                ],
              ];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 1,
      },
    };
    const response =
      await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].userName).toBe("string");
    expect(typeof response.json[0].content).toBe("string");
    expect(
      Object.prototype.toString.call(response.json[0].creationDate) ===
        "[object Date]"
    ).toBe(true);
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
        io,
      },
    };
    const response =
      await require("../../../api/tickets/message").getTicketMessage(data);

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
        io,
      },
      params: {},
    };
    const response =
      await require("../../../api/tickets/message").getTicketMessage(data);

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
        io,
      },
      params: {
        id: "idTicket",
      },
    };
    const response =
      await require("../../../api/tickets/message").getTicketMessage(data);

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
        io,
      },
      params: {
        id: 1,
      },
    };
    const response =
      await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403unauthorized", async () => {
    //Execute
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 2 }]];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 1,
      },
    };
    const response =
      await require("../../../api/tickets/message").getTicketMessage(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/ticket/:id/message/", () => {
  test("200myFabAgent", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return true;
        },
      },
      sendMailFunction: async () => {
        return true;
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, [{ id: 3, email: "test@example.com" }]];
            case 3:
              return [null, {}];
            case 4:
              return [
                null,
                {
                  userName: "Cody",
                  content:
                    "Bonjour Émile, est-ce que tu trouves que mon mail pour notifier les étudiants, qu'ils ont un nouveau message, est bien ?",
                  creationDate: new Date(2002, 2, 16, 2, 45),
                  isApplicant: 0,
                },
              ];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 1,
      },
      body: {
        content: "testContent",
      },
    };
    const response =
      await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).toHaveBeenCalledTimes(1);
  });

  test("200userOwner", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, [{ id: 1 }]];
            case 3:
              return [null, {}];
            case 4:
              return [null, {}];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 1,
      },
      body: {
        content: "testContent",
      },
    };
    const response =
      await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).toHaveBeenCalledTimes(1);
  });

  test("400noParams", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
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
      body: {
        content: "testContent",
      },
    };
    const response =
      await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400noId", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
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
      body: {
        content: "testContent",
      },
    };
    const response =
      await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400idIsNan", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
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
        id: "idTicket",
      },
      body: {
        content: "testContent",
      },
    };
    const response =
      await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400noBody", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
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
        id: 1,
      },
    };
    const response =
      await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400noContent", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
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
        id: 1,
      },
      body: {},
    };
    const response =
      await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("401noUser", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
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
        id: 1,
      },
      body: {
        content: "testContent",
      },
    };
    const response =
      await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400rulesNotValid", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ acceptedRule: 0 }]];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 1,
      },
      body: {
        content: "testContent",
      },
    };
    const response =
      await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("403unauthorized", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
    let requestNumber = 0;
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, [{ id: 2 }]];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 1,
      },
      body: {
        content: "testContent",
      },
    };
    const response =
      await require("../../../api/tickets/message").postTicketMessage(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });
});
