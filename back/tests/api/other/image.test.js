const fs = require("fs");

beforeAll(async () => {
  await fs.copyFileSync("defaultFiles/logo.png", "data/files/image/test.png");
});

afterAll(() => {
  fs.unlinkSync("data/files/image/test.png");
});

describe("GET /api/files/:type/:tag", () => {
  test("200sendDefaultLogo", async () => {
    const data = {
      userId: 1,
      app: {},
      params: {
        type: "image",
        tag: "undifined.png",
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("file");
    expect(response.name != null).toBe(true);
  });

  test("200sendPng", async () => {
    const data = {
      userId: 1,
      app: {},
      params: {
        type: "image",
        tag: "test.png",
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("file");
    expect(response.name != null).toBe(true);
  });

  test("400noParams", async () => {
    const data = {
      userId: 1,
      app: {},
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noType", async () => {
    const data = {
      userId: 1,
      app: {},
      params: {
        tag: "test.png",
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noTag", async () => {
    const data = {
      userId: 1,
      app: {},
      params: {
        type: "image",
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400fileTypeNotAllowed", async () => {
    const data = {
      userId: 1,
      app: {},
      params: {
        type: "undifined",
        tag: "test.png",
      },
    };

    const response = await require("../../../api/other/image").getImage(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });
});
