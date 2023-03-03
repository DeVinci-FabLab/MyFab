describe("DELETE /api/user/logout/", () => {
  test("200", async () => {
    const data = {
      userId: 1,
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        cookiesList: {
          dvflcookieTest: "test",
        },
      },
      dvflcookie: "dvflcookieTest",
    };
    const response = await require("../../../api/user/logout").deleteLogout(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    expect(data.app.cookiesList["dvflcookieTest"] == null).toBe(true);
  });

  test("401_noIdUser", async () => {
    const data = {
      userAuthorization: require("../../../functions/userAuthorization"),
      app: {
        cookiesList: {
          dvflcookieTest: "test",
        },
      },
      dvflcookie: "dvflcookieTest",
    };
    const response = await require("../../../api/user/logout").deleteLogout(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    expect(data.app.cookiesList["dvflcookieTest"] == null).toBe(false);
  });
});
