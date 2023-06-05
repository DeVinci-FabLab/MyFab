describe("sendApiRequest", () => {
  test("service up", async () => {
    const response =
      await require("../../functions/sendApiRequest").sendApiRequest(
        "https://github.com/"
      );

    expect(response).toBe(true);
  });

  test("service down", async () => {
    const response =
      await require("../../functions/sendApiRequest").sendApiRequest(
        "ThisServiceIsDown"
      );

    expect(response).toBe(false);
  });
});
