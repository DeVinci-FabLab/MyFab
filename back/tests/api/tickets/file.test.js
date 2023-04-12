const fs = require("fs");

function emptyFunction() {
  return io;
}
const io = { emit: emptyFunction, to: emptyFunction };

beforeAll(async () => {
  await fs.copyFileSync(__dirname + "/../../pyramid.stl", __dirname + "/../../../data/files/stl/token-test.STL");
});

describe("GET /api/ticket/:id/file/", () => {
  test("200myFabAgent", async () => {
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
              return [null, [{ id: 1 }]];
            case 2:
              return [
                null,
                [
                  {
                    id: 1,
                    filename: "test.stl",
                    comment: "test",
                    isValid: null,
                    creationDate: new Date("2023-03-27T14:44:52.000Z"),
                    modificationDate: new Date("2023-03-27T14:44:52.000Z"),
                    idprinter: null,
                    printerName: null,
                  },
                ],
              ];

            default:
              return null;
          }
        },
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].id).toBe("number");
    expect(typeof response.json[0].filename).toBe("string");
    expect(typeof response.json[0].comment).toBe("string");
    expect(response.json[0].isValid == null).toBe(true);
    expect(Object.prototype.toString.call(response.json[0].creationDate) === "[object Date]").toBe(true);
    expect(Object.prototype.toString.call(response.json[0].modificationDate) === "[object Date]").toBe(true);
  });

  test("200userOwner", async () => {
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
              return [
                null,
                [
                  {
                    id: 1,
                    filename: "test.stl",
                    comment: "test",
                    isValid: null,
                    creationDate: new Date("2023-03-27T14:44:52.000Z"),
                    modificationDate: new Date("2023-03-27T14:44:52.000Z"),
                    idprinter: null,
                    printerName: null,
                  },
                ],
              ];

            default:
              return null;
          }
        },
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length).not.toBe(0);
    expect(typeof response.json[0].id).toBe("number");
    expect(typeof response.json[0].filename).toBe("string");
    expect(typeof response.json[0].comment).toBe("string");
    expect(response.json[0].isValid == null).toBe(true);
    expect(Object.prototype.toString.call(response.json[0].creationDate) === "[object Date]").toBe(true);
    expect(Object.prototype.toString.call(response.json[0].modificationDate) === "[object Date]").toBe(true);
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
      app: {},
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

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
      app: {},
      params: {},
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

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
      app: {},
      params: {
        id: "idTicket",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

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
      app: {},
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("400fileNotExist", async () => {
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
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(400);
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
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetListOfFile(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/file/:id/getToken/", () => {
  test("200myFabAgent", async () => {
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
          return [
            null,
            [
              {
                id: 3,
                fileServerName: "token-test.STL",
                fileName: "oneFileTest200UserAgent.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetToken(data);
    const tokenDownload = await require("../../../api/tickets/file").tokenDownload;

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json != null).toBe(true);
    expect(tokenDownload[response.json] != null).toBe(true);
    expect(tokenDownload[response.json].fileId != null).toBe(true);
    expect(tokenDownload[response.json].timoutId != null).toBe(true);
    expect(tokenDownload[response.json].expire != null).toBe(true);
    clearTimeout(tokenDownload[response.json].timoutId);
    delete tokenDownload[response.json];
  });

  test("200userOwner", async () => {
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
          return [
            null,
            [
              {
                id: 1,
                fileServerName: "token-test.STL",
                fileName: "oneFileTest200UserOwner.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetToken(data);
    const tokenDownload = await require("../../../api/tickets/file").tokenDownload;

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json != null).toBe(true);
    expect(tokenDownload[response.json] != null).toBe(true);
    expect(tokenDownload[response.json].fileId != null).toBe(true);
    expect(tokenDownload[response.json].timoutId != null).toBe(true);
    expect(tokenDownload[response.json].expire != null).toBe(true);
    clearTimeout(tokenDownload[response.json].timoutId);
    delete tokenDownload[response.json];
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
      app: {},
    };
    const response = await require("../../../api/tickets/file").ticketFileGetToken(data);

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
      app: {},
      params: {},
    };
    const response = await require("../../../api/tickets/file").ticketFileGetToken(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400fileDataNotExist", async () => {
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
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetToken(data);

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
      app: {},
      params: {
        id: "idTicket",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetToken(data);

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
      app: {},
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetToken(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403unauthorized", async () => {
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
          return [
            null,
            [
              {
                id: 3,
                fileServerName: "token-test.STL",
                fileName: "oneFileTest403unauthorized.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetToken(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204noSavedFile", async () => {
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
          return [
            null,
            [
              {
                id: 3,
                fileServerName: "noFile.STL",
                fileName: "oneFileTest204noSavedFile.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetToken(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("GET /api/file/:id/", () => {
  test("200myFabAgent", async () => {
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
          return [
            null,
            [
              {
                id: 3,
                fileServerName: "token-test.STL",
                fileName: "oneFileTest200UserAgent.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("download");
    expect(response.path != null).toBe(true);
    expect(response.fileName.endsWith("oneFileTest200UserAgent.stl")).toBe(true);
  });

  test("200userOwner", async () => {
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
          return [
            null,
            [
              {
                id: 1,
                fileServerName: "token-test.STL",
                fileName: "oneFileTest200UserOwner.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("download");
    expect(response.path != null).toBe(true);
    expect(response.fileName.endsWith("oneFileTest200UserOwner.stl")).toBe(true);
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
      app: {},
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

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
      app: {},
      params: {},
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400fileDataNotExist", async () => {
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
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

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
      app: {},
      params: {
        id: "idTicket",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

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
      app: {},
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403unauthorized", async () => {
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
          return [
            null,
            [
              {
                id: 3,
                fileServerName: "token-test.STL",
                fileName: "oneFileTest403unauthorized.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204noSavedFile", async () => {
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
          return [
            null,
            [
              {
                id: 3,
                fileServerName: "noFile.STL",
                fileName: "oneFileTest204noSavedFile.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });

  test("200token", async () => {
    token = "testToken200";
    require("../../../api/tickets/file").tokenDownload[token] = {
      fileId: 1,
      expire: new Date(new Date().setSeconds(new Date().getSeconds() + 100)),
    };

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
          return [
            null,
            [
              {
                id: 3,
                fileServerName: "token-test.STL",
                fileName: "oneFileTest200UserAgent.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: token,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("download");
    expect(response.path != null).toBe(true);
    expect(response.fileName.endsWith("oneFileTest200UserAgent.stl")).toBe(true);
  });

  test("400unknownToken", async () => {
    token = "testToken400unknownToken";

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
          return [
            null,
            [
              {
                id: 3,
                fileServerName: "token-test.STL",
                fileName: "oneFileTest200UserAgent.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: token,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400tokenExpired", async () => {
    token = "400tokenExpired";
    require("../../../api/tickets/file").tokenDownload[token] = {
      fileId: 1,
      expire: new Date(),
    };

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
          return [
            null,
            [
              {
                id: 3,
                fileServerName: "token-test.STL",
                fileName: "oneFileTest200UserAgent.stl",
                projectTypeName: "PIX",
              },
            ],
          ];
        },
      },
      params: {
        id: token,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFileGetOneFile(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/ticket/:id/file/", () => {
  test("200_noFile", async () => {
    //Prepare
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

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
          return [null, [{ id: 1 }]];
        },
        io,
      },
      params: {
        id: 1,
      },
      files: null,
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("200_1file", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-200_1file"));

    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

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
              return [null, [{ id: 3 }]];
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
      files: {
        filedata: {
          name: "test-200_1file-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-200_1file",
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount + 1);
  });

  test("200_multiplesFiles", async () => {
    //Prepare
    const file1Stream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test1-200_multiplesFiles"));
    //wait end copy of file
    await new Promise((resolve) => {
      file1Stream.on("finish", () => {
        resolve();
      });
    });
    const file2Stream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test2-200_multiplesFiles"));
    //wait end copy of file
    await new Promise((resolve) => {
      file2Stream.on("finish", () => {
        resolve();
      });
    });
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

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
              return [null, [{ id: 3 }]];
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
      files: {
        filedata: [
          {
            name: "test1-200_multiplesFiles-test.STL",
            tempFilePath: __dirname + "/../../../tmp/test1-200_multiplesFiles",
          },
          {
            name: "test2-200_multiplesFiles-test.STL",
            tempFilePath: __dirname + "/../../../tmp/test2-200_multiplesFiles",
          },
        ],
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount + 2);
  });

  test("200_myFabAgent", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-200_myFabAgent"));
    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

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
              return [null, [{ id: 3 }]];
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
      files: {
        filedata: {
          name: "test-200_myFabAgent-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-200_myFabAgent",
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount + 1);
  });

  test("400noParams", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-400noParams"));
    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

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
        filedata: {
          name: "test-400noParams-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-400noParams",
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("400noId", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-400noId"));
    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

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
      files: {
        filedata: {
          name: "test-400noId-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-400noId",
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("400idIsNan", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-400idIsNan"));
    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

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
      files: {
        filedata: {
          name: "test-test-400idIsNan-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-400idIsNan",
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("401unauthenticatedUser", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-401unauthenticatedUser"));
    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

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
      files: {
        filedata: {
          name: "test-401unauthenticatedUser-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-401unauthenticatedUser",
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("400unknownTicket", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-400unknownTicket"));
    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

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
      files: {
        filedata: {
          name: "test-400unknownTicket-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-400unknownTicket",
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });

  test("403unauthorizedUser", async () => {
    //Prepare
    const fileStream = await fs
      .createReadStream(__dirname + "/../../pyramid.stl")
      .pipe(fs.createWriteStream(__dirname + "/../../../tmp/test-403unauthorizedUser"));
    //wait end copy of file
    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve();
      });
    });
    const filesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;

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
      files: {
        filedata: {
          name: "test-403unauthorizedUser-test.STL",
          tempFilePath: __dirname + "/../../../tmp/test-403unauthorizedUser",
        },
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePost(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
    const newFilesCount = (await fs.readdirSync(__dirname + "/../../../data/files/stl/")).length;
    expect(newFilesCount).toBe(filesCount);
  });
});

describe("PUT /api/file/:id/", () => {
  test("200validAndComment", async () => {
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
              return [null, [{ id: 3 }]];
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
      body: {
        comment: "New comment",
        idprinter: "1",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200valid", async () => {
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
              return [null, [{ id: 3 }]];
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
      body: {
        comment: "test",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200comment", async () => {
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
              return [null, [{ id: 3 }]];
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
      body: {
        comment: "New comment",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200noModification", async () => {
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
              return [null, [{ id: 3 }]];
            case 2:
              return [null, {}];
            case 3:
              return [null, [{ id: 1 }]];
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
        comment: "New comment",
        isValid: true,
      },
    };
    await require("../../../api/tickets/file").ticketFilePut(data);
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

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
        io,
      },
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

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
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

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
        id: "idFile",
      },
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

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
        io,
      },
      params: {
        id: 1,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noValidAndComment", async () => {
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
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400InvalidValid", async () => {
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
      body: {
        isValid: "notABoolean",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

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
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("403unauthorizedUser", async () => {
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
          return [null, [{ id: 4 }]];
        },
        io,
      },
      params: {
        id: 1,
      },
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(403);
    expect(response.type).toBe("code");
  });

  test("204unknownFile", async () => {
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
      body: {
        comment: "New comment",
        isValid: true,
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });

  test("204noFileMatch", async () => {
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
      body: {
        comment: "test",
      },
    };
    const response = await require("../../../api/tickets/file").ticketFilePut(data);

    //Tests
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});
