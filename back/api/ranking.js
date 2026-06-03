// Classement des agents par score d'actions pondérées.
// Poids : fermeture d'un ticket +3 · changement de statut +2 · message/note +1
// Agrégé depuis log_ticketschange (+ ticketmessages), par mois / année scolaire / total.

const WEIGHTS = { close: 3, status: 2, message: 1 };

// Expressions SQL réutilisées (période).
const isMonth = (col) =>
  `DATE_FORMAT(${col},'%Y-%m') = DATE_FORMAT(NOW(),'%Y-%m')`;
// Année universitaire : bascule en septembre (même décalage +4 mois que les stats).
const isYear = (col) =>
  `YEAR(DATE_ADD(${col},INTERVAL 4 MONTH)) = YEAR(DATE_ADD(NOW(),INTERVAL 4 MONTH))`;

/**
 * @swagger
 * /ranking/:
 *   get:
 *     summary: Classement des agents par score d'actions pondérées (par mois / année / total). L'utilisateur doit être 'myFabAgent'.
 *     tags: [GlobalData]
 *     parameters:
 *     - name: dvflCookie
 *       in: header
 *       required: true
 *       type: string
 *     responses:
 *       "200":
 *         description: "Liste des agents avec leurs scores + poids appliqués"
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
  const run = (q, p = []) => data.app.executeQuery(data.app.db, q, p);

  // 1) Agents = utilisateurs ayant un rôle "myFabAgent" (hors système/root)
  //    OU ayant déjà eu de l'activité (anciens agents qui ont perdu le rôle).
  //    Rôle d'affichage = le plus élevé (i_id de rôle le plus petit : Admin < Modo < Agent).
  //    Un ancien agent (plus de rôle myFabAgent) a role = NULL -> "Ancien agent".
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

  // 2) Points + compteurs depuis log_ticketschange.
  const w = `(CASE
                WHEN ltc.v_action = 'upd_status' AND gs.b_isOpen = 0 THEN ${WEIGHTS.close}
                WHEN ltc.v_action = 'upd_status' THEN ${WEIGHTS.status}
                ELSE ${WEIGHTS.message} END)`;
  const logsRes = await run(`
    SELECT ltc.i_idUser AS id,
        SUM(CASE WHEN ${isMonth("ltc.dt_timeStamp")} THEN ${w} ELSE 0 END) AS pMonth,
        SUM(CASE WHEN ${isYear("ltc.dt_timeStamp")} THEN ${w} ELSE 0 END) AS pYear,
        SUM(${w}) AS pTotal,
        SUM(CASE WHEN ltc.v_action = 'upd_status' AND gs.b_isOpen = 0 THEN 1 ELSE 0 END) AS closures,
        COUNT(*) AS actions
      FROM log_ticketschange AS ltc
      LEFT JOIN gd_status AS gs ON ltc.v_action = 'upd_status' AND gs.i_id = ltc.v_newValue
      GROUP BY ltc.i_idUser;`);
  /* c8 ignore start */
  if (logsRes[0]) {
    console.log(logsRes[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */

  // 3) Points depuis les messages d'agents.
  const msgRes = await run(`
    SELECT i_idUser AS id,
        SUM(CASE WHEN ${isMonth("dt_creationDate")} THEN ${WEIGHTS.message} ELSE 0 END) AS pMonth,
        SUM(CASE WHEN ${isYear("dt_creationDate")} THEN ${WEIGHTS.message} ELSE 0 END) AS pYear,
        COUNT(*) * ${WEIGHTS.message} AS pTotal,
        COUNT(*) AS actions
      FROM ticketmessages
      GROUP BY i_idUser;`);
  /* c8 ignore start */
  if (msgRes[0]) {
    console.log(msgRes[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */

  // 4) Délai moyen (heures) sur les tickets fermés par l'agent.
  const delayRes = await run(`
    SELECT ltc.i_idUser AS id,
        ROUND(AVG(TIMESTAMPDIFF(HOUR, pt.dt_creationdate, ltc.dt_timeStamp))) AS avgDelayHours
      FROM log_ticketschange AS ltc
      INNER JOIN gd_status AS gs ON gs.i_id = ltc.v_newValue
      INNER JOIN printstickets AS pt ON pt.i_id = ltc.i_idTicket
      WHERE ltc.v_action = 'upd_status' AND gs.b_isOpen = 0
      GROUP BY ltc.i_idUser;`);
  /* c8 ignore start */
  if (delayRes[0]) {
    console.log(delayRes[0]);
    return { type: "code", code: 500 };
  }
  /* c8 ignore stop */

  // Fusion par agent.
  const byId = {};
  for (const a of agentsRes[1]) {
    byId[a.id] = {
      id: a.id,
      name: a.name,
      // Ancien agent (plus de rôle myFabAgent) : libellé + couleur neutres.
      role: a.role || "Ancien agent",
      roleColor: a.roleColor || "9ca3af",
      former: !a.role,
      pointsMonth: 0,
      pointsYear: 0,
      pointsTotal: 0,
      closures: 0,
      actions: 0,
      avgDelayHours: 0,
      isMe: Number(a.id) === Number(userIdAgent),
    };
  }
  for (const r of logsRes[1]) {
    if (!byId[r.id]) continue;
    byId[r.id].pointsMonth += Number(r.pMonth) || 0;
    byId[r.id].pointsYear += Number(r.pYear) || 0;
    byId[r.id].pointsTotal += Number(r.pTotal) || 0;
    byId[r.id].closures += Number(r.closures) || 0;
    byId[r.id].actions += Number(r.actions) || 0;
  }
  for (const r of msgRes[1]) {
    if (!byId[r.id]) continue;
    byId[r.id].pointsMonth += Number(r.pMonth) || 0;
    byId[r.id].pointsYear += Number(r.pYear) || 0;
    byId[r.id].pointsTotal += Number(r.pTotal) || 0;
    byId[r.id].actions += Number(r.actions) || 0;
  }
  for (const r of delayRes[1]) {
    if (!byId[r.id]) continue;
    byId[r.id].avgDelayHours = Number(r.avgDelayHours) || 0;
  }

  // On ne garde que les agents ayant fait au moins une action (≥ 1 ticket touché).
  const agentsList = Object.values(byId).filter((a) => a.actions > 0);

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
