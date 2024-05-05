import React from "react";
import { getCookie } from "cookies-next";

import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);
import { Doughnut } from "react-chartjs-2";

import { UserUse } from "../context/provider";

const regexYear = /^\d{4}\-\d{4}$/;
const regexMonth = /^\d{4}\-\d{2}$/;

function getTicketStats({
  darkMode,
  ticketStats,
  ticketStatus,
  ticketStatsForSchools,
}) {
  const labels = [];
  const counts = [];
  const colors = [];
  for (const status of ticketStatus) {
    labels.push(status.name);
    counts.push(status.count);
    colors.push("#" + status.color);
  }

  return (
    <div className="grid grid-cols-12 gap-5 p-5">
      <div
        className={`col-span-6 mt-5 bg-opacity-50 border rounded shadow-lg backdrop-blur-20 to-gray-50 md:col-span-3 lg:col-span-2 pl-3 pr-4 py-3 ${
          darkMode ? "border-gray-600 bg-gray-600" : "border-gray-100"
        }`}
      >
        <p
          className={`ml-2 flex-1 text-center ${
            darkMode ? "text-gray-100" : ""
          }`}
        >
          Nombre total de demandes créé
        </p>
        <p
          className={`ml-2 flex-1 text-5xl text-center ${
            darkMode ? "text-gray-100" : ""
          }`}
        >
          {ticketStats.count_ticket}
        </p>
      </div>
      <div
        className={`col-span-6 mt-5 bg-opacity-50 border rounded shadow-lg backdrop-blur-20 to-gray-50 md:col-span-3 lg:col-span-2 pl-3 pr-4 py-3 ${
          darkMode ? "border-gray-600 bg-gray-600" : "border-gray-100"
        }`}
      >
        <p
          className={`ml-2 flex-1 text-center ${
            darkMode ? "text-gray-100" : ""
          }`}
        >
          Nombre total de pièces demandé
        </p>
        <p
          className={`ml-2 flex-1 text-5xl text-center ${
            darkMode ? "text-gray-100" : ""
          }`}
        >
          {ticketStats.count_file}
        </p>
      </div>
      <div
        className={`row-span-3 md:col-span-6 lg:col-span-4 mt-5 bg-opacity-50 border rounded shadow-lg backdrop-blur-20 to-gray-50 pl-3 pr-4 py-3 ${
          darkMode ? "border-gray-600 bg-gray-600" : "border-gray-100"
        }`}
      >
        <Doughnut
          data={{
            labels: labels,
            datasets: [
              {
                label: "Nombre de tickets",
                data: counts,
                backgroundColor: colors,
                borderColor: colors,
              },
            ],
          }}
        />
      </div>{" "}
      <div
        className={`row-span-3 md:col-span-6 lg:col-span-4 mt-5 bg-opacity-50 border rounded shadow-lg backdrop-blur-20 to-gray-50 pl-3 pr-4 py-3 ${
          darkMode ? "border-gray-600 bg-gray-600" : "border-gray-100"
        }`}
      >
        <Doughnut
          data={{
            labels: [
              ticketStatsForSchools["ESILV"].v_name,
              ticketStatsForSchools["EMLV"].v_name,
              ticketStatsForSchools["IIM"].v_name,
            ],
            datasets: [
              {
                label: "Demandes créés",
                data: [
                  ticketStatsForSchools["ESILV"].count_ticket,
                  ticketStatsForSchools["EMLV"].count_ticket,
                  ticketStatsForSchools["IIM"].count_ticket,
                ],
                backgroundColor: [
                  "rgb(213, 29, 101)",
                  "rgb(44, 160, 187)",
                  "rgb(245, 132, 29)",
                ],
                borderColor: [
                  "rgb(213, 29, 101)",
                  "rgb(44, 160, 187)",
                  "rgb(245, 132, 29)",
                ],
              },
            ],
          }}
          options={{
            plugins: {
              legend: { labels: { color: darkMode ? "white" : "black" } },
            },
          }}
        />
      </div>
      <div
        className={`col-span-6 md:col-span-3 lg:col-span-4 mt-5 bg-opacity-50 border rounded shadow-lg backdrop-blur-20 to-gray-50 pl-3 pr-4 py-3 ${
          darkMode ? "border-gray-600 bg-gray-600" : "border-gray-100"
        }`}
      >
        <p
          className={`ml-2 flex-1 text-center ${
            darkMode ? "text-gray-100" : ""
          }`}
        >
          Temps moyen de réalisation
        </p>
        <p
          className={`ml-2 flex-1 text-3xl text-center ${
            darkMode ? "text-gray-100" : ""
          }`}
        >
          {`${ticketStats.diffday} jour${ticketStats.diffday > 1 ? "s" : ""} ${
            ticketStats.diffhours
          } heure${ticketStats.diffhours > 1 ? "s" : ""} ${
            ticketStats.diffminutes
          } minute${ticketStats.diffminutes > 1 ? "s" : ""}`}
        </p>
      </div>
    </div>
  );
}

function Stats({ nav, stats }) {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);

  switch (nav) {
    case "alltime":
      const ticketStatsAllTime = stats["ticketStatsAllTime"][0];
      const ticketStatsForSchoolsAllTime =
        stats["ticketStatsForSchoolsAllTime"];
      const ticketStatusAllTime = stats["ticketStatusAllTime"];
      const ticketStatsForEsilvByAllTime = ticketStatsForSchoolsAllTime.reduce(
        (accumulator, currentValue) => {
          return currentValue.v_name === "ESILV" ? currentValue : accumulator;
        },
        {
          count_ticket: 0,
          count_user: 0,
          v_name: "ESILV",
        }
      );
      const ticketStatsForEmvlByAllTime = ticketStatsForSchoolsAllTime.reduce(
        (accumulator, currentValue) => {
          return currentValue.v_name === "EMLV" ? currentValue : accumulator;
        },
        {
          count_ticket: 0,
          count_user: 0,
          v_name: "EMLV",
        }
      );
      const ticketStatsForIimByAllTime = ticketStatsForSchoolsAllTime.reduce(
        (accumulator, currentValue) => {
          return currentValue.v_name === "IIM" ? currentValue : accumulator;
        },
        {
          count_ticket: 0,
          count_user: 0,
          v_name: "IIM",
        }
      );

      return getTicketStats({
        darkMode,
        ticketStats: ticketStatsAllTime,
        ticketStatus: ticketStatusAllTime,
        ticketStatsForSchools: {
          ESILV: ticketStatsForEsilvByAllTime,
          EMLV: ticketStatsForEmvlByAllTime,
          IIM: ticketStatsForIimByAllTime,
        },
      });

    default:
      if (nav.match(regexYear)) {
        const ticketStatusByYear = stats["ticketStatusByYears"];
        const ticketStatsByYear = stats.ticketStatsByYears.reduce(
          (accumulator, currentValue) => {
            return currentValue.year === nav ? currentValue : accumulator;
          },
          {}
        );
        const ticketStatsForSchoolsByYear =
          stats.ticketStatsForSchoolsByYears.filter(
            (currentValue) => currentValue.year === nav
          );
        const ticketStatsForEsilvByYear = ticketStatsForSchoolsByYear.reduce(
          (accumulator, currentValue) => {
            return currentValue.v_name === "ESILV" ? currentValue : accumulator;
          },
          {
            count_ticket: 0,
            count_user: 0,
            v_name: "ESILV",
            year: ticketStatsForSchoolsByYear.year,
          }
        );
        const ticketStatsForEmvlByYear = ticketStatsForSchoolsByYear.reduce(
          (accumulator, currentValue) => {
            return currentValue.v_name === "EMLV" ? currentValue : accumulator;
          },
          {
            count_ticket: 0,
            count_user: 0,
            v_name: "EMLV",
            year: ticketStatsForSchoolsByYear.year,
          }
        );
        const ticketStatsForIimByYear = ticketStatsForSchoolsByYear.reduce(
          (accumulator, currentValue) => {
            return currentValue.v_name === "IIM" ? currentValue : accumulator;
          },
          {
            count_ticket: 0,
            count_user: 0,
            v_name: "IIM",
            year: ticketStatsForSchoolsByYear.year,
          }
        );

        return getTicketStats({
          darkMode,
          ticketStats: ticketStatsByYear,
          ticketStatus: ticketStatusByYear,
          ticketStatsForSchools: {
            ESILV: ticketStatsForEsilvByYear,
            EMLV: ticketStatsForEmvlByYear,
            IIM: ticketStatsForIimByYear,
          },
        });
      } else if (nav.match(regexMonth)) {
        const ticketStatusByMonth = stats.ticketStatusByMonths.filter(
          (currentValue) => currentValue.month === nav
        );
        const ticketStatsByMonth = stats.ticketStatsByMonths.reduce(
          (accumulator, currentValue) => {
            return currentValue.month === nav ? currentValue : accumulator;
          },
          {}
        );
        const ticketStatsForSchoolsByMonth =
          stats.ticketStatsForSchoolsByMonths.filter(
            (currentValue) => currentValue.month === nav
          );
        const ticketStatsForEsilvByMonth = ticketStatsForSchoolsByMonth.reduce(
          (accumulator, currentValue) => {
            return currentValue.v_name === "ESILV" ? currentValue : accumulator;
          },
          {
            count_ticket: 0,
            count_user: 0,
            month: ticketStatsByMonth.month,
            v_name: "ESILV",
            year: ticketStatsByMonth.year,
          }
        );
        const ticketStatsForEmvlByMonth = ticketStatsForSchoolsByMonth.reduce(
          (accumulator, currentValue) => {
            return currentValue.v_name === "EMLV" ? currentValue : accumulator;
          },
          {
            count_ticket: 0,
            count_user: 0,
            month: ticketStatsByMonth.month,
            v_name: "EMLV",
            year: ticketStatsByMonth.year,
          }
        );
        const ticketStatsForIimByMonth = ticketStatsForSchoolsByMonth.reduce(
          (accumulator, currentValue) => {
            return currentValue.v_name === "IIM" ? currentValue : accumulator;
          },
          {
            count_ticket: 0,
            count_user: 0,
            month: ticketStatsByMonth.month,
            v_name: "IIM",
            year: ticketStatsByMonth.year,
          }
        );

        return getTicketStats({
          darkMode,
          ticketStats: ticketStatsByMonth,
          ticketStatus: ticketStatusByMonth,
          ticketStatsForSchools: {
            ESILV: ticketStatsForEsilvByMonth,
            EMLV: ticketStatsForEmvlByMonth,
            IIM: ticketStatsForIimByMonth,
          },
        });
      } else {
        return (
          <div className="grid grid-cols-12 gap-5 p-5 ">
            <div
              className={`col-span-6 mt-5 bg-opacity-50 border rounded shadow-lg backdrop-blur-20 to-gray-50 md:col-span-3 lg:col-span-2 pl-3 pr-4 py-3 ${
                darkMode ? "border-gray-600 bg-gray-600" : "border-gray-100"
              }`}
            >
              <p
                className={`ml-2 flex-1 text-center ${
                  darkMode ? "text-gray-100" : ""
                }`}
              >
                Nombre d'utilisateurs total créé
              </p>
              <p
                className={`ml-2 flex-1 text-5xl text-center ${
                  darkMode ? "text-gray-100" : ""
                }`}
              >
                {stats.users[0].total_users}
              </p>
            </div>
            <div
              className={`row-span-3 md:col-span-6 lg:col-span-4 mt-5 bg-opacity-50 border rounded shadow-lg backdrop-blur-20 to-gray-50 pl-3 pr-4 py-3 ${
                darkMode ? "border-gray-600 bg-gray-600" : "border-gray-100"
              }`}
            >
              <Doughnut
                data={{
                  labels: ["Light mode", "Dark mode"],
                  datasets: [
                    {
                      label: "Interface",
                      data: [
                        stats.users[0].total_users -
                          stats.users[0].dark_mode_users,
                        stats.users[0].dark_mode_users,
                      ],
                      backgroundColor: [
                        "rgb(195, 195, 195)",
                        "rgb(48, 48, 48)",
                      ],
                      borderColor: ["rgb(195, 195, 195)", "rgb(48, 48, 48)"],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { labels: { color: darkMode ? "white" : "black" } },
                  },
                }}
              />
            </div>{" "}
            <div
              className={`row-span-3 md:col-span-6 lg:col-span-4 mt-5 bg-opacity-50 border rounded shadow-lg backdrop-blur-20 to-gray-50 pl-3 pr-4 py-3 ${
                darkMode ? "border-gray-600 bg-gray-600" : "border-gray-100"
              }`}
            >
              <Doughnut
                data={{
                  labels: ["ESILV", "EMLV", "IIM"],
                  datasets: [
                    {
                      label: "Users",
                      data: [
                        stats.usersBySchools[0].count_user,
                        stats.usersBySchools[1].count_user,
                        stats.usersBySchools[2].count_user,
                      ],
                      backgroundColor: [
                        "rgb(213, 29, 101)",
                        "rgb(44, 160, 187)",
                        "rgb(245, 132, 29)",
                      ],
                      borderColor: [
                        "rgb(213, 29, 101)",
                        "rgb(44, 160, 187)",
                        "rgb(245, 132, 29)",
                      ],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { labels: { color: darkMode ? "white" : "black" } },
                  },
                }}
              />
            </div>
          </div>
        );
      }
  }
}

export default Stats;
