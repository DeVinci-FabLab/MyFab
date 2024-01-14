describe("show return string date", () => {
  test("No date provided", async () => {
    const response = await require("../../functions/date").format();

    expect(response).toBe("NO DATE PROVIDED");
  });

  test("Unknown style", async () => {
    const response = await require("../../functions/date").format(
      new Date(),
      "cody"
    );

    expect(typeof response).toBe("string");
  });

  test("Style fr", async () => {
    const response = await require("../../functions/date").format(
      new Date(),
      "fr"
    );

    expect(typeof response).toBe("string");
  });

  test("Style frAt", async () => {
    const response = await require("../../functions/date").format(
      new Date(),
      "frAt"
    );

    expect(typeof response).toBe("string");
  });

  test("Style us", async () => {
    const response = await require("../../functions/date").format(
      new Date(),
      "us"
    );

    expect(typeof response).toBe("string");
  });

  test("Style usAt", async () => {
    const response = await require("../../functions/date").format(
      new Date(),
      "usAt"
    );

    expect(typeof response).toBe("string");
  });
});
