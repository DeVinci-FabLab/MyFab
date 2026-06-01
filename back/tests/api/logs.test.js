const logsApi = require("../../api/logs");

function authMock(allowed) {
  return { validateUserAuth: async () => allowed };
}

describe("GET /api/logs", () => {
  test("401 sans utilisateur", async () => {
    const res = await logsApi.getLogs({ userId: null });
    expect(res.code).toBe(401);
  });

  test("403 sans permission myFabAgent", async () => {
    const res = await logsApi.getLogs({
      userId: 1,
      userAuthorization: authMock(false),
    });
    expect(res.code).toBe(403);
  });

  test("200 + maxPage/total/values", async () => {
    const data = {
      userId: 1,
      userAuthorization: authMock(true),
      query: {},
      app: {
        db: {},
        executeQuery: async (db, query, options) => {
          if (query.includes("SUM(c)")) return [null, [{ total: 45 }]];
          return [
            null,
            [{ dt: "2026-01-01", category: "ticket", action: "upd_status" }],
          ];
        },
      },
    };
    const res = await logsApi.getLogs(data);
    expect(res.code).toBe(200);
    expect(res.type).toBe("json");
    expect(res.json.total).toBe(45);
    expect(res.json.maxPage).toBe(2); // ceil(45 / 30) = 2
    expect(Array.isArray(res.json.values)).toBe(true);
  });

  test("filtre category + page négative bornée à 0", async () => {
    let capturedMainQuery = null;
    let capturedOffset = null;
    const data = {
      userId: 1,
      userAuthorization: authMock(true),
      query: { category: "ticket", page: "-5" },
      app: {
        db: {},
        executeQuery: async (db, query, options) => {
          if (query.includes("SUM(c)")) return [null, [{ total: 0 }]];
          capturedMainQuery = query;
          capturedOffset = options[1];
          return [null, []];
        },
      },
    };
    const res = await logsApi.getLogs(data);
    expect(res.code).toBe(200);
    // page = -5 doit être ramené à 0 -> OFFSET = 0
    expect(capturedOffset).toBe(0);
    // category=ticket -> une seule sous-requête, donc pas de UNION ALL
    expect(capturedMainQuery.includes("UNION ALL")).toBe(false);
    // total 0 -> maxPage minimal de 1
    expect(res.json.maxPage).toBe(1);
  });
});
