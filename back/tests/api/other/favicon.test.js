describe("GET /favicon.ico", () => {
  test("200", async () => {
    const data = {};

    const response = await require("../../../api/other/favicon").getImage(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("file");
    expect(response.name).toBe("favicon.ico");
    expect(response.root).toBe("defaultFiles");
  });
});
