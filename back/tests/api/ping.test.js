describe("GET /api/ping/", () => {
  test("200", async () => {
    const data = {};
    const response = await require("../../api/ping.js").pingGet(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(Object.keys(response.json).length).toBe(1);
    expect(response.json.result).toBe("pong");
  });
});

describe("POST /api/ping/", () => {
  test("200", async () => {
    const data = {};
    const response = await require("../../api/ping.js").pingPost(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(Object.keys(response.json).length).toBe(1);
    expect(response.json.result).toBe("pong");
  });
});

describe("PUT /api/ping/", () => {
  test("200", async () => {
    const data = {};
    const response = await require("../../api/ping.js").pingPut(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(Object.keys(response.json).length).toBe(1);
    expect(response.json.result).toBe("pong");
  });
});

describe("DELETE /api/ping/", () => {
  test("200", async () => {
    const data = {};
    const response = await require("../../api/ping.js").pingDelete(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(Object.keys(response.json).length).toBe(1);
    expect(response.json.result).toBe("pong");
  });
});
