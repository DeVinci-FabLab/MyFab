describe("GET /api/status/", () => {
  test("200", async () => {
    const data = {
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ id: 1, name: "Ouvert", color: "2ca1bb" }]];
        },
      },
    };
    const response = await require("../../api/getGlobaldata").getStatus(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json[0].id != null).toBe(true);
    expect(response.json[0].name != null).toBe(true);
    expect(response.json[0].color != null).toBe(true);
  });
});

describe("GET /api/projectType/", () => {
  test("200", async () => {
    const data = {
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ id: 1, name: "PIX" }]];
        },
      },
    };
    const response = await require("../../api/getGlobaldata").getProjectType(
      data
    );

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json[0].id != null).toBe(true);
    expect(response.json[0].name != null).toBe(true);
  });
});

describe("GET /api/printer/", () => {
  test("200", async () => {
    const data = {
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ id: 4, name: "Cody" }]];
        },
      },
    };
    const response = await require("../../api/getGlobaldata").getPrinter(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.length !== 0).toBe(true);
    expect(response.json[0].id != null).toBe(true);
    expect(response.json[0].name != null).toBe(true);
  });
});

describe("GET /api/version/", () => {
  test("200", async () => {
    const data = {};
    const response = await require("../../api/getGlobaldata").getVersion(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.version != null).toBe(true);
  });
});

describe("GET /api/myFabOpen/", () => {
  test("200", async () => {
    const data = {};
    const response = await require("../../api/getGlobaldata").getMyFabOpen(
      data
    );

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.myFabOpen !== undefined).toBe(true);
  });
});
