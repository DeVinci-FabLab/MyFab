const rankingApi = require("../../api/ranking");

describe("GET /api/ranking (v2)", () => {
  test("401 sans utilisateur", async () => {
    const res = await rankingApi.getRanking({ userId: null });
    expect(res.code).toBe(401);
  });

  test("403 sans permission myFabAgent", async () => {
    const res = await rankingApi.getRanking({
      userId: 1,
      userAuthorization: { validateUserAuth: async () => false },
    });
    expect(res.code).toBe(403);
  });

  test("200 : score par ticket, anti-triche, crédit partagé, badges", async () => {
    const NOW = "2026-03-15T12:00:00";
    const T = "2026-03-15T11:00:00";

    const agents = [
      { id: 1, name: "Admin A.", role: "Administrateur", roleColor: "db1010" }, // moi
      { id: 2, name: "Agent B.", role: "Agent MyFab", roleColor: "e0dd22" },
      { id: 3, name: "Ancien C.", role: null, roleColor: null }, // ancien agent
      { id: 9, name: "Inactif D.", role: "Agent MyFab", roleColor: "e0dd22" }, // 0 ticket
    ];

    // statuts : 3 = fermé (abouti), 4 = annulé, 2 = ouvert
    const closed = [{ i_id: 3 }];

    const logs = [
      // t100 : fermé par agent1 (ses points : +2 +3). demandeur = user 50.
      { agent: 1, ticket: 100, action: "upd_status", newValue: 3, ts: T, requester: 50, curStatus: 3, creation: "2026-03-15T01:00:00" }, // prettier-ignore
      // t101 : agent1 ferme SON PROPRE ticket (demandeur = 1) -> 0 point.
      { agent: 1, ticket: 101, action: "upd_status", newValue: 3, ts: T, requester: 1, curStatus: 3, creation: T }, // prettier-ignore
      // t102 : partagé. agent2 met en cours puis ferme. demandeur = user 51.
      { agent: 2, ticket: 102, action: "upd_status", newValue: 2, ts: "2026-03-15T10:00:00", requester: 51, curStatus: 3, creation: "2026-03-15T09:00:00" }, // prettier-ignore
      { agent: 2, ticket: 102, action: "upd_status", newValue: 3, ts: "2026-03-15T11:00:00", requester: 51, curStatus: 3, creation: "2026-03-15T09:00:00" }, // prettier-ignore
      // t103 : agent1 ferme PUIS rouvre -> pas de fermeture (close/reopen).
      { agent: 1, ticket: 103, action: "upd_status", newValue: 3, ts: "2026-03-15T10:00:00", requester: 52, curStatus: 2, creation: "2026-03-15T08:00:00" }, // prettier-ignore
      { agent: 1, ticket: 103, action: "upd_status", newValue: 2, ts: "2026-03-15T11:00:00", requester: 52, curStatus: 2, creation: "2026-03-15T08:00:00" }, // prettier-ignore
      // t104 : ancien agent annule un ticket (statut 4) -> participation, pas de fermeture.
      { agent: 3, ticket: 104, action: "upd_status", newValue: 4, ts: T, requester: 53, curStatus: 4, creation: T }, // prettier-ignore
    ];

    // message agent1 sur t102 (le rend contributeur du ticket partagé)
    const messages = [
      { agent: 1, ticket: 102, ts: "2026-03-15T10:30:00", requester: 51 },
    ];

    const data = {
      userId: 1,
      now: NOW,
      userAuthorization: { validateUserAuth: async () => true },
      app: {
        db: {},
        executeQuery: async (db, query) => {
          if (query.includes("b_myFabAgent")) return [null, agents];
          if (query.includes("b_isCancel = 0")) return [null, closed];
          if (query.includes("ticketmessages AS tm")) return [null, messages];
          return [null, logs]; // log_ticketschange
        },
      },
    };

    const res = await rankingApi.getRanking(data);
    expect(res.code).toBe(200);
    expect(res.json.weights.participation).toBe(2);
    expect(res.json.weights.close).toBe(5);

    const me = res.json.agents.find((a) => a.id === 1);
    // t100 (fermeture = 5) + t102 (participation = 2) + t103 (participation = 2)
    // t101 (son propre ticket) = 0
    expect(me.isMe).toBe(true);
    expect(me.pointsTotal).toBe(9);
    expect(me.pointsMonth).toBe(9); // tout est dans le mois courant (now injecté)
    expect(me.ticketsHandled).toBe(3); // t100, t102, t103 (pas t101)
    expect(me.closures).toBe(1); // seulement t100
    expect(me.sharedTickets).toBe(1); // t102
    expect(me.avgDelayHours).toBe(10); // 11:00 - 01:00

    const b = res.json.agents.find((a) => a.id === 2);
    expect(b.pointsTotal).toBe(5); // participation 2 + fermeture 3
    expect(b.closures).toBe(1);
    expect(b.sharedTickets).toBe(1);
    expect(b.avgDelayHours).toBe(2); // 11:00 - 09:00

    // ancien agent : gardé, libellé + flag
    const former = res.json.agents.find((a) => a.id === 3);
    expect(former).toBeDefined();
    expect(former.former).toBe(true);
    expect(former.role).toBe("Ancien agent");
    expect(former.pointsTotal).toBe(2); // annulation = participation seule
    expect(former.closures).toBe(0);

    // agent sans aucun ticket traité : exclu
    expect(res.json.agents.find((a) => a.id === 9)).toBeUndefined();
  });

  test("série (streak) : jours consécutifs d'activité", async () => {
    const NOW = "2026-03-15T12:00:00";
    const agents = [
      { id: 1, name: "Admin A.", role: "Administrateur", roleColor: "db1010" },
    ];
    const closed = [{ i_id: 3 }];
    // 3 jours consécutifs d'activité (10, 11, 12 mars) sur des tickets distincts
    const logs = [
      { agent: 1, ticket: 200, action: "upd_priority", newValue: 1, ts: "2026-03-10T09:00:00", requester: 60, curStatus: 2, creation: "2026-03-10T08:00:00" }, // prettier-ignore
      { agent: 1, ticket: 201, action: "upd_priority", newValue: 1, ts: "2026-03-11T09:00:00", requester: 61, curStatus: 2, creation: "2026-03-11T08:00:00" }, // prettier-ignore
      { agent: 1, ticket: 202, action: "upd_priority", newValue: 1, ts: "2026-03-12T09:00:00", requester: 62, curStatus: 2, creation: "2026-03-12T08:00:00" }, // prettier-ignore
    ];
    const data = {
      userId: 1,
      now: NOW,
      userAuthorization: { validateUserAuth: async () => true },
      app: {
        db: {},
        executeQuery: async (db, query) => {
          if (query.includes("b_myFabAgent")) return [null, agents];
          if (query.includes("b_isCancel = 0")) return [null, closed];
          if (query.includes("ticketmessages AS tm")) return [null, []];
          return [null, logs];
        },
      },
    };
    const res = await rankingApi.getRanking(data);
    const me = res.json.agents.find((a) => a.id === 1);
    expect(me.streak).toBe(3);
    expect(me.ticketsHandled).toBe(3);
  });
});
