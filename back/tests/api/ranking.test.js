const rankingApi = require("../../api/ranking");

describe("GET /api/ranking", () => {
  test("401 sans utilisateur", async () => {
    const res = await rankingApi.getRanking({ userId: null });
    expect(res.code).toBe(401);
  });

  test("200 + agrège logs + messages, marque isMe, garde les agents sans activité à 0", async () => {
    const data = {
      userId: 1,
      app: {
        db: {},
        executeQuery: async (db, query) => {
          if (query.includes("b_myFabAgent")) {
            return [
              null,
              [
                { id: 1, name: "Admin A.", role: "Administrateur", roleColor: "db1010" }, // prettier-ignore
                { id: 2, name: "Agent B.", role: "Agent MyFab", roleColor: "e0dd22" }, // prettier-ignore
              ],
            ];
          }
          if (query.includes("ticketmessages")) {
            return [
              null,
              [{ id: 1, pMonth: 2, pYear: 5, pTotal: 9, actions: 9 }],
            ];
          }
          if (query.includes("TIMESTAMPDIFF")) {
            return [null, [{ id: 1, avgDelayHours: 20 }]];
          }
          // log_ticketschange
          return [
            null,
            [{ id: 1, pMonth: 10, pYear: 30, pTotal: 50, closures: 8, actions: 25 }], // prettier-ignore
          ];
        },
      },
    };
    const res = await rankingApi.getRanking(data);
    expect(res.code).toBe(200);
    expect(res.type).toBe("json");
    expect(res.json.weights.close).toBe(3);

    const me = res.json.agents.find((a) => a.id === 1);
    expect(me.isMe).toBe(true);
    expect(me.pointsTotal).toBe(59); // 50 (logs) + 9 (messages)
    expect(me.pointsMonth).toBe(12); // 10 + 2
    expect(me.closures).toBe(8);
    expect(me.avgDelayHours).toBe(20);

    const other = res.json.agents.find((a) => a.id === 2);
    expect(other.pointsTotal).toBe(0);
    expect(other.isMe).toBe(false);
  });
});
