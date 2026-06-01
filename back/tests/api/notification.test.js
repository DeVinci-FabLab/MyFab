const notifApi = require("../../api/notification");

describe("GET /api/notification", () => {
  test("401 sans utilisateur", async () => {
    const res = await notifApi.getNotifications({ userId: null });
    expect(res.code).toBe(401);
  });

  test("200 + unread + values", async () => {
    const data = {
      userId: 7,
      app: {
        db: {},
        executeQuery: async (db, query, options) => {
          if (query.includes("COUNT(*)")) return [null, [{ unread: 3 }]];
          return [null, [{ id: 1, message: "Nouveau message", isRead: 0 }]];
        },
      },
    };
    const res = await notifApi.getNotifications(data);
    expect(res.code).toBe(200);
    expect(res.type).toBe("json");
    expect(res.json.unread).toBe(3);
    expect(Array.isArray(res.json.values)).toBe(true);
    expect(res.json.values[0].id).toBe(1);
  });
});

describe("PUT /api/notification/read", () => {
  test("401 sans utilisateur", async () => {
    const res = await notifApi.putNotificationsRead({ userId: null });
    expect(res.code).toBe(401);
  });

  test("200 et émet bien un UPDATE", async () => {
    let updateQuery = null;
    const data = {
      userId: 7,
      app: {
        db: {},
        executeQuery: async (db, query, options) => {
          updateQuery = query;
          return [null, []];
        },
      },
    };
    const res = await notifApi.putNotificationsRead(data);
    expect(res.code).toBe(200);
    expect(updateQuery.includes("UPDATE notifications")).toBe(true);
  });
});
