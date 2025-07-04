const fs = require("fs");

//Mock updateTicketDate
const updateTicketDate = require("../../../functions/stats").updateTicketDate;
jest.mock("../../../functions/stats");
const updateTicketDateMock = jest.fn().mockResolvedValue(true);

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

beforeEach(() => {
  jest.clearAllMocks(); // Reset all mock function calls before each test
});

describe("GET /api/ticket/me/", () => {
  test("200", async () => {
    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    userName: "firstNameTest l.",
                    projectType: "PI²",
                    title: null,
                    creationDate: new Date("2023-03-03T16:17:23.000Z"),
                    modificationDate: new Date("2023-03-03T16:17:23.000Z"),
                    statusName: null,
                    statusColor: null,
                    priorityName: "newTestTicket",
                    priorityColor: "000000",
                  },
                ],
              ];
            case 2:
              return [
                null,
                [
                  {
                    count: 1,
                  },
                ],
              ];

            default:
              return null;
          }
        },
        io,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").getTicketAllFromUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.maxPage).toBe("number");
    expect(response.json.values.length).not.toBe(0);
    expect(typeof response.json.values[0].id).toBe("number");
    expect(typeof response.json.values[0].userName).toBe("string");
    expect(
      Object.prototype.toString.call(response.json.values[0].creationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(
      Object.prototype.toString.call(
        response.json.values[0].modificationDate
      ) === "[object Date]"
    ).toBe(true);
    expect(typeof response.json.values[0].priorityName).toBe("string");
    expect(typeof response.json.values[0].priorityColor).toBe("string");
  });

  test("200countEqualMaxTicket", async () => {
    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    userName: "firstNameTest l.",
                    projectType: "PI²",
                    title: null,
                    creationDate: new Date("2023-03-03T16:17:23.000Z"),
                    modificationDate: new Date("2023-03-03T16:17:23.000Z"),
                    statusName: null,
                    statusColor: null,
                    priorityName: "newTestTicket",
                    priorityColor: "000000",
                  },
                ],
              ];
            case 2:
              return [
                null,
                [
                  {
                    count: require("../../../api/tickets/ticket").maxTicket,
                  },
                ],
              ];

            default:
              return null;
          }
        },
        io,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").getTicketAllFromUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.maxPage).toBe("number");
    expect(response.json.values.length).not.toBe(0);
    expect(typeof response.json.values[0].id).toBe("number");
    expect(typeof response.json.values[0].userName).toBe("string");
    expect(
      Object.prototype.toString.call(response.json.values[0].creationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(
      Object.prototype.toString.call(
        response.json.values[0].modificationDate
      ) === "[object Date]"
    ).toBe(true);
    expect(typeof response.json.values[0].priorityName).toBe("string");
    expect(typeof response.json.values[0].priorityColor).toBe("string");
  });

  test("200withParams", async () => {
    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    userName: "firstNameTest l.",
                    projectType: "PI²",
                    title: null,
                    creationDate: new Date("2023-03-03T16:17:23.000Z"),
                    modificationDate: new Date("2023-03-03T16:17:23.000Z"),
                    statusName: null,
                    statusColor: null,
                    priorityName: "newTestTicket",
                    priorityColor: "000000",
                  },
                ],
              ];
            case 2:
              return [
                null,
                [
                  {
                    count: 1,
                  },
                ],
              ];

            default:
              return null;
          }
        },
        io,
      },
      query: { page: 2, all: true },
    };
    const response =
      await require("../../../api/tickets/ticket").getTicketAllFromUser(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.maxPage).toBe("number");
    expect(response.json.values.length).not.toBe(0);
    expect(typeof response.json.values[0].id).toBe("number");
    expect(typeof response.json.values[0].userName).toBe("string");
    expect(
      Object.prototype.toString.call(response.json.values[0].creationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(
      Object.prototype.toString.call(
        response.json.values[0].modificationDate
      ) === "[object Date]"
    ).toBe(true);
    expect(typeof response.json.values[0].priorityName).toBe("string");
    expect(typeof response.json.values[0].priorityColor).toBe("string");
  });

  test("401_noUser", async () => {
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
    };
    const response =
      await require("../../../api/tickets/ticket").getTicketAllFromUser(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/ticket/", () => {
  test("200", async () => {
    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    userName: "firstNameTest l.",
                    projectType: "PI²",
                    title: null,
                    groupNumber: null,
                    creationDate: new Date("2023-03-03T16:22:34.000Z"),
                    modificationDate: new Date("2023-03-03T16:22:34.000Z"),
                    statusName: null,
                    statusColor: null,
                    isOpen: null,
                    priorityName: "newTestTicket",
                    priorityColor: "000000",
                  },
                ],
              ];
            case 2:
              return [
                null,
                [
                  {
                    count: 1,
                  },
                ],
              ];

            default:
              return null;
          }
        },
        io,
      },
    };
    const response = await require("../../../api/tickets/ticket").getTicketAll(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.maxPage).toBe("number");
    expect(response.json.values.length).not.toBe(0);
    expect(typeof response.json.values[0].id).toBe("number");
    expect(typeof response.json.values[0].userName).toBe("string");
    expect(
      Object.prototype.toString.call(response.json.values[0].creationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(
      Object.prototype.toString.call(
        response.json.values[0].modificationDate
      ) === "[object Date]"
    ).toBe(true);
    expect(typeof response.json.values[0].priorityName).toBe("string");
    expect(typeof response.json.values[0].priorityColor).toBe("string");
  });

  test("200countEqualMaxTicket", async () => {
    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    userName: "firstNameTest l.",
                    projectType: "PI²",
                    title: null,
                    groupNumber: null,
                    creationDate: new Date("2023-03-03T16:22:34.000Z"),
                    modificationDate: new Date("2023-03-03T16:22:34.000Z"),
                    statusName: null,
                    statusColor: null,
                    isOpen: null,
                    priorityName: "newTestTicket",
                    priorityColor: "000000",
                  },
                ],
              ];
            case 2:
              return [
                null,
                [
                  {
                    count: require("../../../api/tickets/ticket").maxTicket,
                  },
                ],
              ];

            default:
              return null;
          }
        },
        io,
      },
    };
    const response = await require("../../../api/tickets/ticket").getTicketAll(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.maxPage).toBe("number");
    expect(response.json.values.length).not.toBe(0);
    expect(typeof response.json.values[0].id).toBe("number");
    expect(typeof response.json.values[0].userName).toBe("string");
    expect(
      Object.prototype.toString.call(response.json.values[0].creationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(
      Object.prototype.toString.call(
        response.json.values[0].modificationDate
      ) === "[object Date]"
    ).toBe(true);
    expect(typeof response.json.values[0].priorityName).toBe("string");
    expect(typeof response.json.values[0].priorityColor).toBe("string");
  });

  test("200withParams", async () => {
    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [
                null,
                [
                  {
                    id: 1,
                    userName: "firstNameTest l.",
                    projectType: "PI²",
                    title: null,
                    groupNumber: null,
                    creationDate: new Date("2023-03-03T16:22:34.000Z"),
                    modificationDate: new Date("2023-03-03T16:22:34.000Z"),
                    statusName: null,
                    statusColor: null,
                    isOpen: null,
                    priorityName: "newTestTicket",
                    priorityColor: "000000",
                  },
                ],
              ];
            case 2:
              return [
                null,
                [
                  {
                    count: 1,
                  },
                ],
              ];

            default:
              return null;
          }
        },
        io,
      },
      query: {
        order: "false",
        all: true,
        page: 2,
        selectOpenOnly: true,
        inputValue: "test",
      },
    };
    const response = await require("../../../api/tickets/ticket").getTicketAll(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.maxPage).toBe("number");
    expect(response.json.values.length).not.toBe(0);
    expect(typeof response.json.values[0].id).toBe("number");
    expect(typeof response.json.values[0].userName).toBe("string");
    expect(
      Object.prototype.toString.call(response.json.values[0].creationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(
      Object.prototype.toString.call(
        response.json.values[0].modificationDate
      ) === "[object Date]"
    ).toBe(true);
    expect(typeof response.json.values[0].priorityName).toBe("string");
    expect(typeof response.json.values[0].priorityColor).toBe("string");
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
    };
    const response = await require("../../../api/tickets/ticket").getTicketAll(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403noRoleMyFabAgent", async () => {
    //Execute
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
    };
    const response = await require("../../../api/tickets/ticket").getTicketAll(
      data
    );

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/ticket/:id/", () => {
  test("200userAgent", async () => {
    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 10 }]];
            case 2:
              return [
                null,
                [
                  {
                    id: 1,
                    idUser: 2,
                    userName: "firstNameTest l.",
                    userFirstName: "firstNameTest",
                    userLastName: "lastNameTest",
                    projectType: "PI²",
                    idProjectType: 4,
                    title: null,
                    email: "ticketGetById200userOwner@test.com",
                    groupNumber: null,
                    creationDate: new Date("2023-03-03T16:26:38.000Z"),
                    modificationDate: new Date("2023-03-03T16:26:38.000Z"),
                    statusName: null,
                    isCancel: null,
                    statusColor: null,
                    priorityName: "newTestTicket",
                    priorityColor: "000000",
                  },
                ],
              ];
            case 3:
              return [null, [{ countUser: 0 }]];
            case 4:
              return [null, []];
            case 5:
              return [
                null,
                [
                  { message: "TestMessage", timeStamp: new Date() },
                  { message: "TestMessage", timeStamp: new Date() },
                ],
              ];
            case 6:
              return [
                null,
                [
                  { message: "TestMessage", timeStamp: new Date() },
                  { message: "TestMessage", timeStamp: new Date() },
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
    const response = await require("../../../api/tickets/ticket").getTicketById(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.id).toBe("number");
    expect(typeof response.json.userName).toBe("string");
    expect(typeof response.json.email).toBe("string");
    expect(
      Object.prototype.toString.call(response.json.creationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(
      Object.prototype.toString.call(response.json.modificationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(typeof response.json.priorityName).toBe("string");
    expect(typeof response.json.priorityColor).toBe("string");
  });

  test("200userOwner", async () => {
    let requestNumber = 0;
    //Execute
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
              return [null, [{ id: 1 }]];
            case 2:
              return [
                null,
                [
                  {
                    id: 1,
                    idUser: 1,
                    userName: "firstNameTest l.",
                    userFirstName: "firstNameTest",
                    userLastName: "lastNameTest",
                    projectType: "PI²",
                    idProjectType: 4,
                    title: null,
                    email: "ticketGetById200userOwner@test.com",
                    groupNumber: null,
                    creationDate: new Date("2023-03-03T16:26:38.000Z"),
                    modificationDate: new Date("2023-03-03T16:26:38.000Z"),
                    statusName: null,
                    isCancel: null,
                    statusColor: null,
                    priorityName: "newTestTicket",
                    priorityColor: "000000",
                  },
                ],
              ];
            case 3:
              return [null, [{ countUser: 0 }]];
            case 4:
              return [null, []];
            case 5:
              return [null, []];
            case 6:
              return [null, []];

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
    const response = await require("../../../api/tickets/ticket").getTicketById(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.id).toBe("number");
    expect(typeof response.json.userName).toBe("string");
    expect(typeof response.json.email).toBe("string");
    expect(
      Object.prototype.toString.call(response.json.creationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(
      Object.prototype.toString.call(response.json.modificationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(typeof response.json.priorityName).toBe("string");
    expect(typeof response.json.priorityColor).toBe("string");
  });

  test("200groupId", async () => {
    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 10 }]];
            case 2:
              return [
                null,
                [
                  {
                    id: 1,
                    idUser: 2,
                    userName: "firstNameTest l.",
                    userFirstName: "firstNameTest",
                    userLastName: "lastNameTest",
                    projectType: "PI²",
                    idProjectType: 4,
                    title: null,
                    email: "ticketGetById200userOwner@test.com",
                    groupNumber: 12,
                    creationDate: new Date("2023-03-03T16:26:38.000Z"),
                    modificationDate: new Date("2023-03-03T16:26:38.000Z"),
                    statusName: null,
                    isCancel: null,
                    statusColor: null,
                    priorityName: "newTestTicket",
                    priorityColor: "000000",
                  },
                ],
              ];
            case 3:
              return [null, [{ countGroup: 4 }]];
            case 4:
              return [null, [{ countUser: 0 }]];
            case 5:
              return [null, []];
            case 6:
              return [null, []];
            case 7:
              return [null, []];

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
    const response = await require("../../../api/tickets/ticket").getTicketById(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(typeof response.json.id).toBe("number");
    expect(typeof response.json.userName).toBe("string");
    expect(typeof response.json.email).toBe("string");
    expect(
      Object.prototype.toString.call(response.json.creationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(
      Object.prototype.toString.call(response.json.modificationDate) ===
        "[object Date]"
    ).toBe(true);
    expect(typeof response.json.priorityName).toBe("string");
    expect(typeof response.json.priorityColor).toBe("string");
  });

  test("400noParams", async () => {
    //Execute
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
    };
    const response = await require("../../../api/tickets/ticket").getTicketById(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noParamsId", async () => {
    //Execute
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
      params: {},
    };
    const response = await require("../../../api/tickets/ticket").getTicketById(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noParamsIdIsNan", async () => {
    //Execute
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
        id: "NaN",
      },
    };
    const response = await require("../../../api/tickets/ticket").getTicketById(
      data
    );

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
    const response = await require("../../../api/tickets/ticket").getTicketById(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("204ticketNotFound", async () => {
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
        io,
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/ticket").getTicketById(
      data
    );

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });

  test("403userNotAlowed", async () => {
    //Execute
    const data = {
      userId: 2,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ id: 1 }]];
        },
        io,
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/ticket").getTicketById(
      data
    );

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204userAgent", async () => {
    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 10 }]];
            case 2:
              return [null, []];

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
    const response = await require("../../../api/tickets/ticket").getTicketById(
      data
    );

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/ticket/", () => {
  test("200_noFile", async () => {
    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, [{ 1: 1 }]];
            case 3:
              return [null, {}];
            case 4:
              return [null, [{ id: 1 }]];
            case 5:
              return [null, {}];
            case 6:
              return [null, []];

            default:
              return [null, null];
          }
        },
        io,
      },
      body: {
        projectType: 1,
        projectMaterial: 1,
        comment: "test",
      },
      files: null,
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.id != null).toBe(true);
  });

  test("200_1file", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-file.stl"));

    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });

    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, [{ 1: 1 }]];
            case 3:
              return [null, {}];
            case 4:
              return [null, [{ id: 1 }]];
            case 5:
              return [null, {}];
            case 6:
              return [null, {}];
            case 7:
              return [null, []];

            default:
              return [null, null];
          }
        },
        io,
      },
      body: {
        projectType: 1,
        projectMaterial: 1,
        comment: "test",
      },
      files: {
        filedata: {
          name: "test-file.STL",
          tempFilePath: __dirname + "/../../../tmp/test-file.stl",
        },
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.id != null).toBe(true);
  });

  test("200_multiplesFiles", async () => {
    //Prepare
    const file1Stream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test1-file.stl"));
    const file2Stream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test2-file.stl"));

    await new Promise((resolve) => {
      let nbStreamFinished = 0;
      file1Stream.on("finish", () => {
        nbStreamFinished++;
        if (nbStreamFinished >= 2) resolve();
      });

      file2Stream.on("finish", () => {
        nbStreamFinished++;
        if (nbStreamFinished >= 2) resolve();
      });
    });

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
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, [{ 1: 1 }]];
            case 3:
              return [null, {}];
            case 4:
              return [null, [{ id: 1 }]];
            case 5:
              return [null, {}];
            case 6:
              return [null, {}];
            case 7:
              return [null, {}];
            case 8:
              return [null, []];

            default:
              return [null, null];
          }
        },
        io,
      },
      body: {
        projectType: 1,
        projectMaterial: 1,
        comment: "test",
      },
      files: {
        filedata: [
          {
            name: "test1-file.stl",
            tempFilePath: __dirname + "/../../../tmp/test1-file.stl",
          },
          {
            name: "test2-file.stl",
            tempFilePath: __dirname + "/../../../tmp/test2-file.stl",
          },
        ],
      },
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.id != null).toBe(true);
  });

  test("200_withGroupNumber", async () => {
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
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, [{ 1: 1 }]];
            case 3:
              return [null, [{}]];
            case 4:
              return [null, [{ id: 1 }]];
            case 5:
              return [null, [{}]];
            case 6:
              return [null, []];

            default:
              return [null, null];
          }
        },
        io,
      },
      body: {
        projectType: 1,
        projectMaterial: 1,
        comment: "test",
        groupNumber: 1,
      },
      files: null,
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.id != null).toBe(true);
  });

  test("200_withoutGroupNumber", async () => {
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
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, [{ 1: 1 }]];
            case 3:
              return [null, [{}]];
            case 4:
              return [null, [{ id: 1 }]];
            case 5:
              return [null, [{}]];
            case 6:
              return [null, []];

            default:
              return [null, null];
          }
        },
        io,
      },
      body: {
        projectType: 1,
        projectMaterial: 1,
        comment: "test",
        groupNumber: "",
      },
      files: null,
      sendMailFunction: emptyFunction,
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.id != null).toBe(true);
  });

  test("400_noBody", async () => {
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
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noProjectType", async () => {
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
        projectMaterial: 1,
        comment: "test",
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_projectTypeIsNan", async () => {
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
        projectMaterial: 1,
        projectType: "NaN",
        comment: "test",
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noProjectMaterial", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-file.stl"));

    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });

    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, [{ 1: 1 }]];
            case 3:
              return [null, {}];
            case 4:
              return [null, [{ id: 1 }]];
            case 5:
              return [null, {}];
            case 6:
              return [null, {}];

            default:
              return [null, null];
          }
        },
        io,
      },
      body: {
        projectType: 1,
        comment: "test",
      },
      files: {
        filedata: {
          name: "test-file.STL",
          tempFilePath: __dirname + "/../../../tmp/test-file.stl",
        },
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_projectMaterialIsNaN", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-file.stl"));

    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });

    let requestNumber = 0;
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
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, [{ 1: 1 }]];
            case 3:
              return [null, {}];
            case 4:
              return [null, [{ id: 1 }]];
            case 5:
              return [null, {}];
            case 6:
              return [null, {}];

            default:
              return [null, null];
          }
        },
        io,
      },
      body: {
        projectType: 1,
        projectMaterial: "NaN",
        comment: "test",
      },
      files: {
        filedata: {
          name: "test-file.STL",
          tempFilePath: __dirname + "/../../../tmp/test-file.stl",
        },
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noComment", async () => {
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
        projectMaterial: 1,
        projectType: 1,
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noComment", async () => {
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
        projectType: 1,
        projectMaterial: 1,
        comment:
          "Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères. Test avec un commentaire de plus de 1000 carctères.",
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_groupNumberNan", async () => {
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
        projectType: 1,
        projectMaterial: 1,
        comment: "test",
        groupNumber: "NaN",
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(400);
  });

  test("400_projectTypeUnknown", async () => {
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
              return [null, [{ acceptedRule: 1 }]];
            case 2:
              return [null, []];

            default:
              return [null, null];
          }
        },
        io,
      },
      body: {
        projectMaterial: 1,
        projectType: 100,
        comment: "test",
        groupNumber: 1,
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_rulesNotValid", async () => {
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
              return [null, [{ acceptedRule: 0 }]];

            default:
              return [null, null];
          }
        },
        io,
      },
      body: {
        projectMaterial: 1,
        projectType: 100,
        comment: "test",
        groupNumber: 1,
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401_noUser", async () => {
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
      body: {
        projectMaterial: 1,
        projectType: 1,
        comment: "test",
        groupNumber: 1,
      },
      files: {
        filedata: [],
      },
    };
    const response = await require("../../../api/tickets/ticket").postTicket(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});

describe("DELETE /api/ticket/:id", () => {
  test("200_ticketOwner", async () => {
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
              return [null, [{ id: 1, isDeleted: 0 }]];
            case 2:
              return [null, { changedRows: 1 }];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 2,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200_myFabAgent", async () => {
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
              return [null, [{ id: 2, isDeleted: 0 }]];
            case 2:
              return [null, { changedRows: 1 }];

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
        id: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400_noParams", async () => {
    //Execute
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
    };
    const response =
      await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noParamsId", async () => {
    //Execute
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
      params: {},
    };
    const response =
      await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401_noUser", async () => {
    //Execute
    const data = {
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
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
      await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("400_noTicket", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, []];
        },
        io,
      },
      params: {
        id: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("403_noMyFabAgent", async () => {
    //Execute
    const data = {
      userId: 1,
      userAuthorization: {
        validateUserAuth: async (app, userIdAgent, authName) => {
          return false;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ id: 2, isDeleted: 0 }]];
        },
        io,
      },
      params: {
        id: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204", async () => {
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
              return [null, [{ id: 1, isDeleted: 0 }]];
            case 2:
              return [null, { changedRows: 0 }];

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
      await require("../../../api/tickets/ticket").deleteTicketWithId(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("PUT /api/ticket/:id/setProjecttype/", () => {
  test("200", async () => {
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
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ 1: 1 }]];
            case 2:
              return [null, {}];
            case 3:
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
      query: {
        projecttype: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewProjectType(
        data
      );

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
      query: {
        projecttype: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewProjectType(
        data
      );

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
      query: {
        projecttype: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewProjectType(
        data
      );

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
      query: {
        projecttype: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewProjectType(
        data
      );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400noQuery", async () => {
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
      await require("../../../api/tickets/ticket").putTicketNewProjectType(
        data
      );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400noProjecttype", async () => {
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
      query: {},
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewProjectType(
        data
      );

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400projecttypeIsNan", async () => {
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
      query: {
        projecttype: "idNewProjectType",
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewProjectType(
        data
      );

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
      query: {
        projecttype: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewProjectType(
        data
      );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("403userUnauthorized", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
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
        id: 1,
      },
      query: {
        projecttype: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewProjectType(
        data
      );

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("204", async () => {
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
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ 1: 1 }]];
            case 2:
              return [null, { changedRows: 0 }];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 1,
      },
      query: {
        projecttype: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewProjectType(
        data
      );

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });
});

describe("PUT /api/ticket/:id/setStatus", () => {
  test("200", async () => {
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
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ changedRows: 1 }]];
            case 2:
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
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewStatus(data);

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
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewStatus(data);

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
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewStatus(data);

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
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400noQuery", async () => {
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
      await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400noIdStatus", async () => {
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
      query: {},
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("400idStatusIsNan", async () => {
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
      query: {
        idStatus: "idNewPriority",
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewStatus(data);

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
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("403unauthorizedUser", async () => {
    //Mock
    updateTicketDate.mockImplementation(updateTicketDateMock);

    //Execute
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
        id: 1,
      },
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("204ticketUnknown", async () => {
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
        executeQuery: async (db, query, options) => {
          return [null, { changedRows: 0 }];
        },
        io,
      },
      params: {
        id: 1,
      },
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketNewStatus(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });
});

describe("PUT /api/ticket/:id/setCancelStatus", () => {
  test("200", async () => {
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
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 1 }]];
            case 2:
              return [null, { changedRows: 1 }];
            case 3:
              return [null, { changedRows: 1 }];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 1,
      },
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketCancelStatus(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).toHaveBeenCalledTimes(1);
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
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketCancelStatus(data);

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
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketCancelStatus(data);

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
        id: "NaN",
      },
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketCancelStatus(data);

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
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketCancelStatus(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("403userIdIsNotUserTargetId", async () => {
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
        executeQuery: async (db, query, options) => {
          return [null, [{ id: 2 }]];
        },
        io,
      },
      params: {
        id: 1,
      },
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketCancelStatus(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });

  test("204ticketAlreadyClose", async () => {
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
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ id: 1 }]];
            case 2:
              return [null, { changedRows: 0 }];

            default:
              return null;
          }
        },
        io,
      },
      params: {
        id: 1,
      },
      query: {
        idStatus: 1,
      },
    };
    const response =
      await require("../../../api/tickets/ticket").putTicketCancelStatus(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
    expect(updateTicketDateMock).not.toHaveBeenCalled();
  });
});

describe("GET /api/ticket/highDemand/", () => {
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
          return [null, [{ data: 1 }]];
        },
        io,
      },
    };
    const response = await require("../../../api/tickets/ticket").getHighDemand(
      data
    );

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
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
        executeQuery: async (db, query, options) => {
          return [null, [{ data: 1 }]];
        },
        io,
      },
    };
    const response = await require("../../../api/tickets/ticket").getHighDemand(
      data
    );

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
