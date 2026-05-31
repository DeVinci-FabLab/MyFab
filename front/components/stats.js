import React from "react";
import { getCookie } from "cookies-next";

import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);
import { Doughnut, Bar } from "react-chartjs-2";

import { UserUse } from "../context/provider";

const regexYear = /^\d{4}\-\d{4}$/;
const regexMonth = /^\d{4}\-\d{2}$/;

const WEEKDAYS = [
  "",
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

// ---------- helpers données ----------

function periodOf(nav) {
  if (!nav || nav === "general" || nav === "alltime") return { type: "all" };
  if (regexMonth.test(nav)) return { type: "month", key: nav };
  if (regexYear.test(nav)) return { type: "year", key: nav };
  return { type: "all" };
}

function aggregate(rows, period) {
  rows = Array.isArray(rows) ? rows : [];
  let filtered = rows;
  if (period.type === "month") filtered = rows.filter((r) => r.month === period.key);
  else if (period.type === "year") filtered = rows.filter((r) => r.year === period.key);
  const map = {};
  for (const r of filtered) {
    if (r.name === null || r.name === undefined || r.name === "") continue;
    map[r.name] = (map[r.name] || 0) + Number(r.count);
  }
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function pickTicketStats(stats, period) {
  if (period.type === "year")
    return (stats.ticketStatsByYears || []).find((y) => y.year === period.key) || {};
  if (period.type === "month")
    return (stats.ticketStatsByMonths || []).find((m) => m.month === period.key) || {};
  return (stats.ticketStatsAllTime && stats.ticketStatsAllTime[0]) || {};
}

function pickStatus(stats, period) {
  if (period.type === "month")
    return (stats.ticketStatusByMonths || []).filter((r) => r.month === period.key);
  if (period.type === "year") {
    const all = stats.ticketStatusByYears || [];
    return all.some((r) => r.year) ? all.filter((r) => r.year === period.key) : all;
  }
  return stats.ticketStatusAllTime || [];
}

function pickSchools(stats, period) {
  let rows;
  if (period.type === "year")
    rows = (stats.ticketStatsForSchoolsByYears || []).filter((r) => r.year === period.key);
  else if (period.type === "month")
    rows = (stats.ticketStatsForSchoolsByMonths || []).filter((r) => r.month === period.key);
  else rows = stats.ticketStatsForSchoolsAllTime || [];
  const pick = (name) =>
    rows.reduce((acc, cur) => (cur.v_name === name ? cur : acc), {
      count_ticket: 0,
      v_name: name,
    });
  return { ESILV: pick("ESILV"), EMLV: pick("EMLV"), IIM: pick("IIM") };
}

// ---------- composants UI ----------

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-md border border-gray-200 dark:border-night-800 bg-white dark:bg-night-900 p-4 ${className}`}
    >
      {children}
    </div>
  );
}

function StatBig({ label, value, color = "text-brand-blue", sub }) {
  return (
    <Card className="flex flex-col justify-between">
      <p className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div>
        <p className={`mt-2 font-mono text-3xl font-semibold ${color}`}>{value}</p>
        {sub ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
        ) : null}
      </div>
    </Card>
  );
}

function ChartCard({ title, children }) {
  return (
    <Card>
      {title ? (
        <p className="font-mono text-xs uppercase tracking-wider text-brand-blue mb-3">
          {title}
        </p>
      ) : null}
      {children}
    </Card>
  );
}

function doughnutOptions(darkMode) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: darkMode ? "#e5e7eb" : "#374151" } },
    },
  };
}

function DoughnutBox({ data, darkMode }) {
  return (
    <div className="relative h-64">
      <Doughnut data={data} options={doughnutOptions(darkMode)} />
    </div>
  );
}

function BarBreakdown({ items, color = "#00AEEF", limit }) {
  const list = limit ? items.slice(0, limit) : items;
  const total = items.reduce((s, i) => s + i.count, 0) || 1;
  const max = list.reduce((m, i) => Math.max(m, i.count), 0) || 1;
  if (!list.length)
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">Aucune donnée.</p>
    );
  return (
    <div className="space-y-2">
      {list.map((it, i) => (
        <div key={`bar-${i}`} className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-700 dark:text-gray-300 w-24 truncate flex-shrink-0">
            {it.name}
          </span>
          <div className="flex-1 h-3 rounded bg-gray-100 dark:bg-night-800 overflow-hidden">
            <div
              className="h-full"
              style={{ width: `${(it.count / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white w-16 text-right whitespace-nowrap">
            {it.count} · {Math.round((it.count / total) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function MonthlyBar({ months, darkMode }) {
  return (
    <ChartCard title="// Demandes par mois">
      <div className="relative h-64">
        <Bar
          data={{
            labels: months.map((m) => m.month),
            datasets: [
              {
                label: "Demandes",
                data: months.map((m) => m.count_ticket),
                backgroundColor: "#E6007E",
                borderRadius: 4,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                ticks: { color: darkMode ? "#9ca3af" : "#6b7280" },
                grid: { display: false },
              },
              y: {
                beginAtZero: true,
                ticks: { color: darkMode ? "#9ca3af" : "#6b7280", precision: 0 },
                grid: { color: darkMode ? "#1f2937" : "#f3f4f6" },
              },
            },
          }}
        />
      </div>
    </ChartCard>
  );
}

// ---------- vue principale ----------

function Stats({ nav, stats }) {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);

  const period = periodOf(nav);
  const isOverview = period.type === "all";

  const ticketStats = pickTicketStats(stats, period);
  const ticketStatus = pickStatus(stats, period);
  const schools = pickSchools(stats, period);

  const materials = aggregate(stats.statsByMaterialDetailed, period);
  const types = aggregate(stats.statsByTypeDetailed, period);
  const groups = aggregate(stats.statsByGroupDetailed, period);

  const allMonths = Array.isArray(stats.ticketStatsByMonths)
    ? stats.ticketStatsByMonths
    : [];
  const months =
    period.type === "year"
      ? allMonths.filter((m) => m.year === period.key)
      : allMonths;

  // doughnut statut
  const statusLabels = ticketStatus.map((s) => s.name);
  const statusCounts = ticketStatus.map((s) => s.count);
  const statusColors = ticketStatus.map((s) => "#" + s.color);

  // KPI extras (all time)
  const kpis = (stats.ticketKpis && stats.ticketKpis[0]) || {
    total: 0,
    closed: 0,
    open: 0,
  };
  const treatmentRate = kpis.total
    ? Math.round((kpis.closed / kpis.total) * 100)
    : 0;
  const busiest =
    stats.busiestWeekday && stats.busiestWeekday[0]
      ? WEEKDAYS[stats.busiestWeekday[0].weekday] || "-"
      : "-";
  const maxDelay = `${ticketStats.maxdiffday || 0} j ${
    ticketStats.maxdiffhours || 0
  } h`;
  const avgDelay = `${ticketStats.diffday || 0} j ${
    ticketStats.diffhours || 0
  } h ${ticketStats.diffminutes || 0} min`;

  return (
    <div className="container px-4 mx-auto pb-10">
      {/* KPI principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBig
          label="// Demandes"
          value={ticketStats.count_ticket || 0}
          color="text-brand-magenta"
        />
        <StatBig
          label="// Pièces"
          value={ticketStats.count_file || 0}
          color="text-brand-blue"
        />
        <StatBig
          label="// Demandeurs"
          value={ticketStats.count_user || 0}
          color="text-brand-orange"
        />
        <Card className="flex flex-col justify-between">
          <p className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            // Délai moyen
          </p>
          <div>
            <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
              {avgDelay}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              max {maxDelay}
            </p>
          </div>
        </Card>
      </div>

      {/* Indicateurs (vue d'ensemble) */}
      {isOverview ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <StatBig
            label="// Taux de traitement"
            value={`${treatmentRate}%`}
            color="text-brand-blue"
            sub={`${kpis.closed}/${kpis.total} fermées`}
          />
          <StatBig
            label="// En attente"
            value={kpis.open}
            color="text-brand-orange"
            sub="demandes ouvertes"
          />
          <StatBig
            label="// Jour le plus chargé"
            value={busiest}
            color="text-brand-magenta"
          />
          <StatBig
            label="// Utilisateurs"
            value={stats.users && stats.users[0] ? stats.users[0].total_users : 0}
            color="text-brand-blue"
            sub={
              stats.users && stats.users[0]
                ? `${stats.users[0].dark_mode_users} en dark mode`
                : ""
            }
          />
        </div>
      ) : null}

      {/* Doughnuts statut / école */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartCard title="// Par statut">
          <DoughnutBox
            darkMode={darkMode}
            data={{
              labels: statusLabels,
              datasets: [
                {
                  label: "Tickets",
                  data: statusCounts,
                  backgroundColor: statusColors,
                  borderColor: statusColors,
                },
              ],
            }}
          />
        </ChartCard>
        <ChartCard title="// Par école">
          <DoughnutBox
            darkMode={darkMode}
            data={{
              labels: ["ESILV", "EMLV", "IIM"],
              datasets: [
                {
                  label: "Demandes",
                  data: [
                    schools.ESILV.count_ticket,
                    schools.EMLV.count_ticket,
                    schools.IIM.count_ticket,
                  ],
                  backgroundColor: ["#E6007E", "#00AEEF", "#F39200"],
                  borderColor: ["#E6007E", "#00AEEF", "#F39200"],
                },
              ],
            }}
          />
        </ChartCard>
      </div>

      {/* Tendance mensuelle (sauf vue mois) */}
      {period.type !== "month" && months.length > 0 ? (
        <div className="mt-4">
          <MonthlyBar months={months} darkMode={darkMode} />
        </div>
      ) : null}

      {/* Répartitions en barres */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="// Par matériau">
          <BarBreakdown items={materials} color="#E6007E" />
        </ChartCard>
        <ChartCard title="// Par type de projet">
          <BarBreakdown items={types} color="#00AEEF" />
        </ChartCard>
        <ChartCard title="// Top groupes">
          <BarBreakdown items={groups} color="#F39200" limit={8} />
        </ChartCard>
      </div>
    </div>
  );
}

export default Stats;
