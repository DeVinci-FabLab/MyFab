describe("POST /api/sql/", () => {
  test("200", async () => {
    const data = {
      app: {
        executeQuery: async (db, query, options) => {
          return [
            null,
            [
              { Tables_in_myfabultimatetest: "gd_printer" },
              { Tables_in_myfabultimatetest: "gd_roles" },
              { Tables_in_myfabultimatetest: "gd_status" },
            ],
          ];
        },
      },
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      body: { querry: "SHOW TABLES" },
    };

    const response = await require("../../../api/agent/sql").sql(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json != null).toBe(true);
  });

  test("404specialCodeIsFalse", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return false;
        },
      },
      body: { querry: "SHOW TABLES" },
    };

    const response = await require("../../../api/agent/sql").sql(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });

  test("404noBody", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
    };

    const response = await require("../../../api/agent/sql").sql(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });

  test("404noQuerry", async () => {
    const data = {
      app: {},
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      body: {},
    };

    const response = await require("../../../api/agent/sql").sql(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });
});
