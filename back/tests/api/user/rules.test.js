describe("GET /api/user/validateRules/", () => {
  test("200", async () => {
    //Execute
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, { affectedRows: 1 }];
        },
      },
    };
    const response = await require("../../../api/user/rules").putValidateRules(
      data
    );
    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("204userAlreadyValidated", async () => {
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, { affectedRows: 0 }];
        },
      },
    };
    const response = await require("../../../api/user/rules").putValidateRules(
      data
    );
    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });

  test("401noUser", async () => {
    const data = {
      app: {},
    };
    const response = await require("../../../api/user/rules").putValidateRules(
      data
    );
    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
