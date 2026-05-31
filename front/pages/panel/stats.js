import { useEffect, useState } from "react";
import "moment/locale/fr";
import axios from "axios";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import LayoutPanel from "../../components/layoutPanel";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { getApi } from "../../lib/runtimeEnv";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Seo from "../../components/seo";
import WebSocket from "../../components/webSocket";
import Stats from "../../components/stats";

import { UserUse } from "../../context/provider";

function getMonthName(monthIndex) {
  switch (monthIndex) {
    case "01":
      return "Janvier";
    case "02":
      return "Février";
    case "03":
      return "Mars";
    case "04":
      return "Avril";
    case "05":
      return "Mai";
    case "06":
      return "Juin";
    case "07":
      return "Juillet";
    case "08":
      return "Août";
    case "09":
      return "Septembre";
    case "10":
      return "Octobre";
    case "11":
      return "Novembre";
    case "12":
      return "Décembre";

    default:
      return "INCORRECT_MONTH";
  }
}

export default function NewPanel({ authorizations, stats }) {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);
  const [nav, setNav] = useState("general");
  const [navMonth, setNavMonth] = useState([]);

  const router = useRouter();
  function realodPage() {
    router.replace(router.asPath);
  }

  async function downloadCsv(url, filename) {
    try {
      const response = await axios({
        method: "GET",
        url,
        responseType: "blob",
        headers: { dvflCookie: getCookie("jwt") },
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      // silencieux : l'utilisateur peut réessayer
    }
  }

  function exportReport() {
    const period = nav === "general" || nav === "alltime" ? "all" : nav;
    downloadCsv(
      getApi() + "/api/stats/report/csv?period=" + encodeURIComponent(period),
      `myfab_stats_${period}.csv`,
    );
  }

  function exportRaw() {
    downloadCsv(getApi() + "/api/stats/prints/csv", "myfab_demandes_brut.csv");
  }

  useEffect(function () {
    if (user.error != undefined) {
      router.push("/404");
    }
  }, []);

  return (
    <LayoutPanel
      authorizations={authorizations}
      titleMenu={"Statistiques de MyFab"}
    >
      <Seo title={"Panel"} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />

      <div className="pt-6">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs uppercase tracking-wider text-brand-magenta">
            // Statistiques
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportReport}
              className="export-report-button inline-flex items-center gap-1.5 text-sm font-medium text-brand-magenta border border-gray-200 dark:border-night-700 rounded-md px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-night-800 transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export rapport
            </button>
            <button
              onClick={exportRaw}
              className="export-raw-button inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue border border-gray-200 dark:border-night-700 rounded-md px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-night-800 transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Données brutes
            </button>
          </div>
        </div>
      </div>

      <nav className="">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
          <div className="w-full md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-row flex-wrap items-center gap-x-6 gap-y-2 p-0 mt-0 rounded-lg rtl:space-x-reverse dark:border-night-700">
              <li>
                <a
                  onClick={() => {
                    setNavMonth([]);
                    setNav("general");
                  }}
                  className={`block py-2 px-3 md:p-0 rounded cursor-pointer ${
                    nav === "general"
                      ? "text-brand-magenta font-semibold"
                      : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  } `}
                  aria-current="page"
                >
                  Vue d'ensemble
                </a>
              </li>

              {stats.ticketStatsByYears.map((statByYear, index) => {
                return (
                  <li key={"year_" + index}>
                    <a
                      onClick={() => {
                        setNavMonth(
                          stats.ticketStatsByMonths.filter(
                            (currentValue) =>
                              currentValue.year === statByYear.year,
                          ),
                        );
                        setNav(statByYear.year);
                      }}
                      className={`block py-2 px-3 md:p-0 rounded cursor-pointer ${
                        nav === statByYear.year ||
                        (navMonth.length !== 0 &&
                          navMonth[0].year === statByYear.year)
                          ? "text-brand-magenta font-semibold"
                          : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      } `}
                    >
                      {statByYear.year}
                    </a>
                  </li>
                );
              })}
            </ul>

            {navMonth.length !== 0 ? (
              <ul className="font-medium flex flex-row flex-wrap items-center gap-x-5 gap-y-1 mt-2 rounded-lg rtl:space-x-reverse text-sm dark:border-night-700">
                {navMonth.map((month, index) => {
                  return (
                    <li key={"month_" + month.month}>
                      <a
                        onClick={() => setNav(month.month)}
                        className={`block py-2 px-3 md:p-0 rounded cursor-pointer ${
                          nav === month.month
                            ? "text-brand-magenta font-semibold"
                            : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                        } `}
                      >
                        {getMonthName(month.month.split("-")[1])}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </nav>

      <Stats nav={nav} stats={stats}></Stats>
    </LayoutPanel>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  const authorizations = cookies.jwt
    ? await fetchAPIAuth("/user/authorization/", cookies.jwt)
    : null;
  const stats = cookies.jwt ? await fetchAPIAuth("/stats/", cookies.jwt) : null;

  if (!cookies.jwt || !authorizations.data || !authorizations.data.manageUser) {
    const url = req.url;
    const encodedUrl = encodeURIComponent(url);
    return {
      redirect: {
        permanent: false,
        destination: "/auth/?from=" + encodedUrl,
      },
      props: {},
    };
  }

  if (!authorizations.data.acceptedRule) {
    const url = req.url;
    const encodedUrl = encodeURIComponent(url);
    return {
      redirect: {
        permanent: false,
        destination: "/rules/?from=" + encodedUrl,
      },
      props: {},
    };
  }

  return {
    props: {
      authorizations: authorizations.data,
      stats: stats.data,
    }, // will be passed to the page component as props
  };
}
