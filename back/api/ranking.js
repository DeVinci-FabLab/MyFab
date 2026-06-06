// Classement des agents — v2.
//
// Principe : on score par TICKET DISTINCT réellement traité, pas par action
// brute. Le spam (messages en rafale, ping-pong de statut) ne rapporte donc
// plus rien au-delà du premier geste sur un ticket.
//
// Pour chaque couple (agent, ticket), en EXCLUANT ses propres tickets
// (agent = demandeur) :
//   • +2 "ticket traité"  : dès ≥1 action dessus (message agent / statut /
//                           priorité / note), compté UNE seule fois.
//   • +3 bonus "fermeture" : à l'agent qui a fait la fermeture finale STABLE
//                           (dernier upd_status vers un statut fermé non annulé).
//   => une vraie fermeture vaut 5, une participation 2.
//
// Crédit partagé : tous les contributeurs d'un ticket touchent leur +2, seul
// le finisseur a +3 en plus. Plus de course à la fermeture.
//
// Aucune table supplémentaire : tout est dérivé de log_ticketschange,
// ticketmessages et printstickets. La série (streak) est calculée en mémoire.

const SCORE = { participation: 2, closeBonus: 3 };
// Valeur "fermeture" affichée dans la légende (participation + bonus).
const WEIGHTS = {
  participation: SCORE.participation,
  close: SCORE.participation + SCORE.closeBonus,
};

// Bucket de période pour une date donnée (mois courant / année universitaire).
// Année universitaire : même décalage +4 mois que les stats (bascule fin août).
function periodFlags(date, now) {
  const d = new Date(date);
  const sameMonth =
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  const shiftedYear = (x) => {
    const y = new Date(x);
    y.setMonth(y.getMonth() + 4);
    return y.getFullYear();
  };
  return { month: sameMonth, year: shiftedYear(d) === shiftedYear(now) };
}

// Clé jour (YYYY-MM-DD) pour les séries.
function dayKey(date) {
  const d = new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// Plus longue série de jours calendaires consécutifs (terminée au jour le plus
// récent d'activité de l'agent).
function currentStreak(dayKeys) {
  if (!dayKeys.size) return 0;
  const days = [...dayKeys].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const cur = new Date(days[i]);
    const diff = Math.round((cur - prev) / 86400000);
    if (diff === 1) {
      run += 1;
      best = Math.max(best, run);
    } else if (diff > 1) {
      run = 1;
    }
  }
  return best;
}

/**
 * @swagger
 * /ranking/:
 *   get:
 *     summary: Classement des agents par score d'actions (par ticket traité, anti-triche). L'utilisateur doit être 'myFabAgent'.
 *     tags: [GlobalData]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       required: true
 *       type: string
 *     responses:
 *       "200":
 *         description: "Liste des agents avec scores et séries"
 *       401:
 *        description: "The user is unauthenticated"
 *       403:
 *        description: "The user is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.getRanking = getRanking;
async function getRanking(data) {
  const userIdAgent = data.userId;
  if (!userIdAgent) {
    return { type: "code", code: 401 };
  }
  const authResult = await data.userAuthorization.validateUserAuth(
    data.app,
    userIdAgent,
    "myFabAgent",
  );
  if (!authResult) {
    return { type: "code", code: 403 };
  }
  const now = data.now ? new Date(data.now) : new Date();
  const run = (q, p = []) => data.app.executeQuery(data.app.db, q, p);

  // 1) Agents = utilisateurs ayant un rôle "myFabAgent" (hors système/root)
  //    OU ayant de l'activité (anciens agents). role NULL -> "Ancien agent".
  const agentsRes = await run(`
    SELECT u.i_id AS id,
        CONCAT(u.v_firstName, ' ', LEFT(u.v_lastName, 1), '.') AS name,
        r.v_name AS role, r.v_color AS roleColor
      FROM users AS u
      LEFT JOIN (
        SELECT rc.i_idUser, MIN(gr.i_id) AS mainRole
          FROM rolescorrelation AS rc
          INNER JOIN gd_roles AS gr ON rc.i_idRole = gr.i_id
          WHERE gr.b_myFabAgent = 1
          GROUP BY rc.i_idUser
      ) AS am ON am.i_idUser = u.i_id
      LEFT JOIN gd_roles AS r ON r.i_id = am.mainRole
      WHERE u.v_email NOT IN ('system@system.com', 'root@root.com')
        AND u.b_deleted = 0
        AND (
          am.i_idUser IS NOT NULL
          OR u.i_id IN (SELECT DISTINCT i_idUser FROM log_ticketschange)
          OR u.i_id IN (SELECT DISTINCT i_idUser FROM ticketmessages)
        );`);
  /* c8 ignore start */
  if (agentsRes[0]) {
    console.log(agentsRes[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */

  // 2) Statuts considérés comme "fermeture aboutie" (fermé ET non annulé).
  const closedRes = await run(
    `SELECT i_id FROM gd_status WHERE b_isOpen = 0 AND b_isCancel = 0;`,
  );
  /* c8 ignore start */
  if (closedRes[0]) {
    console.log(closedRes[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */
  const closedStatusIds = new Set(closedRes[1].map((r) => Number(r.i_id)));

  // 3) Toutes les actions de log (statut/priorité/type/note) + méta du ticket.
  const logsRes = await run(`
    SELECT ltc.i_idUser AS agent, ltc.i_idTicket AS ticket,
        ltc.v_action AS action, ltc.v_newValue AS newValue,
        ltc.dt_timeStamp AS ts,
        pt.i_idUser AS requester, pt.i_status AS curStatus,
        pt.dt_creationdate AS creation
      FROM log_ticketschange AS ltc
      INNER JOIN printstickets AS pt
        ON pt.i_id = ltc.i_idTicket AND pt.b_isDeleted = 0
      ORDER BY ltc.i_idTicket, ltc.dt_timeStamp, ltc.i_id;`);
  /* c8 ignore start */
  if (logsRes[0]) {
    console.log(logsRes[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */

  // 4) Messages d'agents (auteur ≠ demandeur du ticket).
  const msgRes = await run(`
    SELECT tm.i_idUser AS agent, tm.i_idTicket AS ticket,
        tm.dt_creationDate AS ts, pt.i_idUser AS requester
      FROM ticketmessages AS tm
      INNER JOIN printstickets AS pt
        ON pt.i_id = tm.i_idTicket AND pt.b_isDeleted = 0;`);
  /* c8 ignore start */
  if (msgRes[0]) {
    console.log(msgRes[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */

  // ---- Assemblage en mémoire -------------------------------------------------

  // Squelette des agents (seuls ceux-ci pourront marquer des points).
  const byId = {};
  for (const a of agentsRes[1]) {
    byId[a.id] = {
      id: a.id,
      name: a.name,
      role: a.role || "Ancien agent",
      roleColor: a.roleColor || "9ca3af",
      former: !a.role,
      pointsMonth: 0,
      pointsYear: 0,
      pointsTotal: 0,
      closures: 0,
      ticketsHandled: 0,
      sharedTickets: 0,
      avgDelayHours: 0,
      streak: 0,
      isMe: Number(a.id) === Number(userIdAgent),
    };
  }

  // Regroupement par ticket : qui a touché (et quand en dernier), événements
  // de statut (pour le closer), méta.
  const tickets = {};
  const ticketOf = (id, requester, curStatus, creation) => {
    if (!tickets[id]) {
      tickets[id] = {
        requester: requester != null ? Number(requester) : null,
        curStatus: curStatus != null ? Number(curStatus) : null,
        creation: creation || null,
        lastTouch: {}, // agentId -> dernier ts (toute action)
        statusEvents: [], // {agent, statusId, ts}
      };
    }
    return tickets[id];
  };
  // Jours d'activité par agent (pour la série).
  const activeDays = {};
  const touch = (agentId, ts) => {
    if (!byId[agentId]) return false; // pas un agent connu -> ignoré
    (activeDays[agentId] = activeDays[agentId] || new Set()).add(dayKey(ts));
    return true;
  };

  for (const r of logsRes[1]) {
    const t = ticketOf(r.ticket, r.requester, r.curStatus, r.creation);
    if (t.creation == null && r.creation) t.creation = r.creation;
    if (t.requester == null && r.requester != null)
      t.requester = Number(r.requester);
    const agentId = Number(r.agent);
    if (!touch(agentId, r.ts)) continue;
    if (agentId === t.requester) continue; // ses propres tickets : exclus
    t.lastTouch[agentId] = Math.max(
      t.lastTouch[agentId] || 0,
      new Date(r.ts).getTime(),
    );
    if (r.action === "upd_status") {
      t.statusEvents.push({
        agent: agentId,
        statusId: Number(r.newValue),
        ts: r.ts,
      });
    }
  }
  for (const r of msgRes[1]) {
    const t = ticketOf(r.ticket, r.requester, null, null);
    const agentId = Number(r.agent);
    if (!touch(agentId, r.ts)) continue;
    if (agentId === t.requester) continue;
    t.lastTouch[agentId] = Math.max(
      t.lastTouch[agentId] || 0,
      new Date(r.ts).getTime(),
    );
  }

  // Attribution des points par ticket.
  const add = (agentId, ts, pts) => {
    const a = byId[agentId];
    if (!a) return;
    const f = periodFlags(ts, now);
    a.pointsTotal += pts;
    if (f.month) a.pointsMonth += pts;
    if (f.year) a.pointsYear += pts;
  };

  for (const id of Object.keys(tickets)) {
    const t = tickets[id];
    const contributors = Object.keys(t.lastTouch).map(Number);
    const isShared = contributors.length >= 2;

    // Participation : +2 par contributeur, daté de sa dernière action.
    for (const agentId of contributors) {
      add(agentId, t.lastTouch[agentId], SCORE.participation);
      const a = byId[agentId];
      a.ticketsHandled += 1;
      if (isShared) a.sharedTickets += 1;
    }

    // Fermeture stable : dernier upd_status vers un statut fermé non annulé,
    // et le ticket est toujours dans un statut fermé (pas rouvert).
    if (t.statusEvents.length) {
      const last = t.statusEvents[t.statusEvents.length - 1];
      const stillClosed =
        t.curStatus == null || closedStatusIds.has(t.curStatus);
      if (
        closedStatusIds.has(last.statusId) &&
        stillClosed &&
        byId[last.agent]
      ) {
        add(last.agent, last.ts, SCORE.closeBonus);
        const a = byId[last.agent];
        a.closures += 1;
        if (t.creation) {
          const h = Math.max(
            0,
            (new Date(last.ts) - new Date(t.creation)) / 3600000,
          );
          a._delaySum = (a._delaySum || 0) + h;
          a._delayCount = (a._delayCount || 0) + 1;
        }
      }
    }
  }

  // Finitions par agent : délai moyen, série.
  for (const a of Object.values(byId)) {
    if (a._delayCount)
      a.avgDelayHours = Math.round(a._delaySum / a._delayCount);
    delete a._delaySum;
    delete a._delayCount;
    a.streak = currentStreak(activeDays[a.id] || new Set());
  }

  // On ne garde que les agents ayant réellement traité ≥ 1 ticket.
  const agentsList = Object.values(byId).filter((a) => a.ticketsHandled > 0);

  return {
    type: "json",
    code: 200,
    json: { weights: WEIGHTS, agents: agentsList },
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/ranking/", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(
        app,
        req,
        res,
      );
      const result = await getRanking(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/ranking/");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
