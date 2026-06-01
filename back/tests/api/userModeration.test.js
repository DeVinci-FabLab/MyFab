// Tests des endpoints de modération ajoutés dans api/user.js
// (fiche d'activité + note interne). Fichier dédié pour ne pas alourdir user.test.js.
const userApi = require("../../api/user");

function authMock(allowed) {
  return { validateUserAuth: async () => allowed };
}

describe("GET /api/user/:id/tickets", () => {
  test("400 si id non numérique", async () => {
    const res = await userApi.getUserTickets({
      userId: 1,
      params: { id: "abc" },
    });
    expect(res.code).toBe(400);
  });

  test("401 sans utilisateur", async () => {
    const res = await userApi.getUserTickets({
      userId: null,
      params: { id: "2" },
    });
    expect(res.code).toBe(401);
  });

  test("403 sans permission viewUsers", async () => {
    const res = await userApi.getUserTickets({
      userId: 1,
      params: { id: "2" },
      userAuthorization: authMock(false),
    });
    expect(res.code).toBe(403);
  });

  test("200 + liste des demandes", async () => {
    const data = {
      userId: 1,
      params: { id: "2" },
      userAuthorization: authMock(true),
      app: {
        db: {},
        executeQuery: async () => [
          null,
          [{ id: 10, projectType: "PIX", statusName: "Ouvert" }],
        ],
      },
    };
    const res = await userApi.getUserTickets(data);
    expect(res.code).toBe(200);
    expect(res.type).toBe("json");
    expect(res.json[0].id).toBe(10);
  });
});

describe("PUT /api/user/:id/note", () => {
  test("401 sans utilisateur", async () => {
    const res = await userApi.putUserNote({
      userId: null,
      params: { id: "2" },
    });
    expect(res.code).toBe(401);
  });

  test("403 sans permission viewUsers", async () => {
    const res = await userApi.putUserNote({
      userId: 1,
      params: { id: "2" },
      userAuthorization: authMock(false),
    });
    expect(res.code).toBe(403);
  });

  test("200 + met à jour la note ET la journalise", async () => {
    const queries = [];
    const data = {
      userId: 1,
      params: { id: "2" },
      body: { note: "À surveiller" },
      userAuthorization: authMock(true),
      app: {
        db: {},
        executeQuery: async (db, query, options) => {
          queries.push(query);
          return [null, []];
        },
      },
    };
    const res = await userApi.putUserNote(data);
    expect(res.code).toBe(200);
    expect(queries.some((q) => q.includes("UPDATE users"))).toBe(true);
    expect(queries.some((q) => q.includes("log_userschange"))).toBe(true);
  });
});
