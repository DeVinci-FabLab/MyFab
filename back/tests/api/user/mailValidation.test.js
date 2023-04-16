describe("PUT /user/mailValidation/:tocken", () => {
  test("200", async () => {
    //Execute
    let requestNumber = 0;
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          requestNumber++;
          switch (requestNumber) {
            case 1:
              return [null, [{ userId: 1 }]];
            case 2:
              return [null, {}];
            case 3:
              return [null, { affectedRows: 1 }];

            default:
              const res = await executeQuery(db, query, options);
              console.log(requestNumber);
              console.log(res);
              return res;
          }
        },
      },
      params: {
        tocken: "token",
      },
    };
    const response =
      await require("../../../api/user/mailValidation").putMailValidation(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400_noParams", async () => {
    //Execute
    const data = {
      userId: 1,
      app: {},
    };
    const response =
      await require("../../../api/user/mailValidation").putMailValidation(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400_noParamsTocken", async () => {
    //Execute
    const data = {
      userId: 1,
      app: {},
      params: {},
    };
    const response =
      await require("../../../api/user/mailValidation").putMailValidation(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401_noParamsTocken", async () => {
    //Execute
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, []];
        },
      },
      params: {
        tocken: "token",
      },
    };
    const response =
      await require("../../../api/user/mailValidation").putMailValidation(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
