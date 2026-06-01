// Mock du endpoint /stats pour le mode test.
// La forme reproduit ce que le backend renvoie et ce que components/stats.js consomme :
// vue d'ensemble (all time), par année scolaire ("2024-2025") et par mois ("2025-01").

const STATUSES = [
  { name: "Nouveau", color: "00AEEF", w: 0.15 },
  { name: "En cours", color: "F39200", w: 0.25 },
  { name: "Terminé", color: "22C55E", w: 0.55 },
  { name: "Refusé", color: "EF4444", w: 0.05 },
];

const SCHOOL_W = { ESILV: 0.55, EMLV: 0.2, IIM: 0.25 };
const SCHOOLS = ["ESILV", "EMLV", "IIM"];

const MATERIALS = ["PLA", "PETG", "Résine", "TPU"];
const TYPES = ["Projet associatif", "Cours", "Personnel"];
const GROUPS = ["401E", "402", "PEIP-1", "A3-ESILV", "M1-IIM", "L3-EMLV"];

const YEARS = ["2024-2025", "2025-2026"];

const MONTHS = [
  { year: "2024-2025", month: "2024-10", ticket: 40, file: 70, user: 28, dd: 1, dh: 2, dm: 10, mdd: 5, mdh: 3 }, // prettier-ignore
  { year: "2024-2025", month: "2024-11", ticket: 45, file: 80, user: 30, dd: 1, dh: 6, dm: 0, mdd: 6, mdh: 1 }, // prettier-ignore
  { year: "2024-2025", month: "2025-01", ticket: 35, file: 60, user: 24, dd: 0, dh: 18, dm: 40, mdd: 4, mdh: 5 }, // prettier-ignore
  { year: "2025-2026", month: "2025-10", ticket: 32, file: 55, user: 22, dd: 0, dh: 22, dm: 5, mdd: 3, mdh: 6 }, // prettier-ignore
  { year: "2025-2026", month: "2025-11", ticket: 30, file: 52, user: 20, dd: 1, dh: 1, dm: 15, mdd: 4, mdh: 0 }, // prettier-ignore
  { year: "2025-2026", month: "2026-02", ticket: 28, file: 48, user: 18, dd: 0, dh: 16, dm: 30, mdd: 2, mdh: 4 }, // prettier-ignore
];

function sum(arr, f) {
  return arr.reduce((s, x) => s + f(x), 0);
}

const ticketStatsByMonths = MONTHS.map((m) => ({
  year: m.year,
  month: m.month,
  count_ticket: m.ticket,
  count_file: m.file,
  count_user: m.user,
  diffday: m.dd,
  diffhours: m.dh,
  diffminutes: m.dm,
  maxdiffday: m.mdd,
  maxdiffhours: m.mdh,
}));

const ticketStatsByYears = YEARS.map((y) => {
  const ms = MONTHS.filter((m) => m.year === y);
  return {
    year: y,
    count_ticket: sum(ms, (m) => m.ticket),
    count_file: sum(ms, (m) => m.file),
    count_user: sum(ms, (m) => m.user),
    diffday: 1,
    diffhours: 4,
    diffminutes: 30,
    maxdiffday: Math.max(...ms.map((m) => m.mdd)),
    maxdiffhours: 5,
  };
});

const ticketStatsAllTime = [
  {
    count_ticket: sum(MONTHS, (m) => m.ticket),
    count_file: sum(MONTHS, (m) => m.file),
    count_user: 90,
    diffday: 1,
    diffhours: 0,
    diffminutes: 50,
    maxdiffday: 6,
    maxdiffhours: 5,
  },
];

function statusSplit(total) {
  return STATUSES.map((s) => ({
    name: s.name,
    color: s.color,
    count: Math.max(1, Math.round(total * s.w)),
  }));
}

const ticketStatusByMonths = MONTHS.flatMap((m) =>
  statusSplit(m.ticket).map((s) => ({ month: m.month, ...s })),
);
const ticketStatusByYears = ticketStatsByYears.flatMap((y) =>
  statusSplit(y.count_ticket).map((s) => ({ year: y.year, ...s })),
);
const ticketStatusAllTime = statusSplit(ticketStatsAllTime[0].count_ticket);

function schoolSplit(total) {
  return SCHOOLS.map((name) => ({
    v_name: name,
    count_ticket: Math.max(0, Math.round(total * SCHOOL_W[name])),
  }));
}

const ticketStatsForSchoolsByMonths = MONTHS.flatMap((m) =>
  schoolSplit(m.ticket).map((s) => ({ month: m.month, ...s })),
);
const ticketStatsForSchoolsByYears = ticketStatsByYears.flatMap((y) =>
  schoolSplit(y.count_ticket).map((s) => ({ year: y.year, ...s })),
);
const ticketStatsForSchoolsAllTime = schoolSplit(
  ticketStatsAllTime[0].count_ticket,
);

function detailed(names) {
  const rows = [];
  MONTHS.forEach((m) => {
    const base = Math.round(m.ticket / names.length);
    names.forEach((name, ni) => {
      rows.push({
        name,
        count: Math.max(1, base - ni),
        month: m.month,
        year: m.year,
      });
    });
  });
  return rows;
}

const statsByMaterialDetailed = detailed(MATERIALS);
const statsByTypeDetailed = detailed(TYPES);
const statsByGroupDetailed = detailed(GROUPS);

const totalTickets = ticketStatsAllTime[0].count_ticket;
const ticketKpis = [
  {
    total: totalTickets,
    closed: Math.round(totalTickets * 0.55),
    open: Math.round(totalTickets * 0.25),
  },
];
const busiestWeekday = [{ weekday: 4 }]; // mercredi
const users = [{ total_users: 90, dark_mode_users: 37 }];

export function mock(path, jwt, options) {
  return {
    status: 200,
    data: {
      ticketStatsByYears,
      ticketStatsByMonths,
      ticketStatsAllTime,
      ticketStatusByMonths,
      ticketStatusByYears,
      ticketStatusAllTime,
      ticketStatsForSchoolsByMonths,
      ticketStatsForSchoolsByYears,
      ticketStatsForSchoolsAllTime,
      statsByMaterialDetailed,
      statsByTypeDetailed,
      statsByGroupDetailed,
      ticketKpis,
      busiestWeekday,
      users,
    },
  };
}
