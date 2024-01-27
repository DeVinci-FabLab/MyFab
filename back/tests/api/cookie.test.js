describe("GET /api/cookie/", () => {
  test("200", async () => {
    const data = {
      specialcode: "testCode",
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      app: {},
    };
    const response = await require("../../api/cookie.js").cookieTestSpecialCode(
      data
    );

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("404-invalidCode", async () => {
    const data = {
      specialcode: "testCode",
      userAuthorization: {
        checkSpecialCode: async () => {
          return false;
        },
      },
      app: {},
    };
    const response = await require("../../api/cookie.js").cookieTestSpecialCode(
      data
    );

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
  });
});

describe("DELETE /api/cookie/", () => {
  test("200", async () => {
    const data = {
      specialcode: "testCode",
      userAuthorization: {
        checkSpecialCode: async () => {
          return true;
        },
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, null];
        },
      },
    };
    const response = await require("../../api/cookie.js").cookieDeleteAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("404-invalidCode", async () => {
    const data = {
      specialcode: "testCode",
      userAuthorization: {
        checkSpecialCode: async () => {
          return false;
        },
      },
      app: {
        cookiesList: {
          value: "test",
        },
      },
    };
    const response = await require("../../api/cookie.js").cookieDeleteAll(data);

    expect(response.code).toBe(404);
    expect(response.type).toBe("code");
    expect(Object.keys(data.app.cookiesList).length).not.toBe(0);
  });
});
