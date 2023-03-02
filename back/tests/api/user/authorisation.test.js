describe("GET /api/user/authorization/", () => {
  test("200", async () => {
    const data = {
      userId: 1,
      userAuthorization: {
        getUserAuth: async (app, idUser) => {
          return {
            viewUsers: 0,
            manageUser: 0,
            changeUserRole: 0,
            changeUserProtectedRole: 0,
            myFabAgent: 0,
            blogAuthor: 0,
          };
        },
      },
      app: {},
    };
    const response = await require("../../../api/user/authorisation").getAuth(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    for (const key of Object.keys(response.json)) {
      expect(response.json[key]).toBe(0);
    }
  });

  test("401userUnauthenticated", async () => {
    const data = {};

    const response = await require("../../../api/user/authorisation").getAuth(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });
});
