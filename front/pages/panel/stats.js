import { useEffect, useState } from "react";
import "moment/locale/fr";

import LayoutPanel from "../../components/layoutPanel";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
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

  useEffect(function () {
    if (user.error != undefined) {
      router.push("/404");
    } else if (!user.acceptedRule) {
      router.push("/rules");
    }
  }, []);

  return (
    <LayoutPanel
      authorizations={authorizations}
      titleMenu={"Statistiques de MyFab"}
    >
      <Seo title={"Panel"} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />

      {/* Dernières activités */}

      <nav className="">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
              <li>
                <a
                  onClick={() => {
                    setNavMonth([]);
                    setNav("general");
                  }}
                  className={`block py-2 px-3 md:p-0 rounded cursor-pointer ${
                    nav === "general"
                      ? darkMode
                        ? "text-blue-700"
                        : "text-blue-500"
                      : darkMode
                        ? "text-gray-300 hover:text-gray-100"
                        : "text-gray-900 hover:text-gray-500"
                  } `}
                  aria-current="page"
                >
                  Général
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    setNavMonth([]);
                    setNav("alltime");
                  }}
                  className={`block py-2 px-3 md:p-0 rounded cursor-pointer ${
                    nav === "alltime"
                      ? darkMode
                        ? "text-blue-700"
                        : "text-blue-500"
                      : darkMode
                        ? "text-gray-300 hover:text-gray-100"
                        : "text-gray-900 hover:text-gray-500"
                  } `}
                >
                  All time
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
                          ? darkMode
                            ? "text-blue-700"
                            : "text-blue-500"
                          : darkMode
                            ? "text-gray-300 hover:text-gray-100"
                            : "text-gray-900 hover:text-gray-500"
                      } `}
                    >
                      {statByYear.year}
                    </a>
                  </li>
                );
              })}
            </ul>

            {navMonth.length !== 0 ? (
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
                {navMonth.map((month, index) => {
                  return (
                    <li key={"month_" + month.month}>
                      <a
                        onClick={() => setNav(month.month)}
                        className={`block py-2 px-3 md:p-0 rounded cursor-pointer ${
                          nav === month.month
                            ? darkMode
                              ? "text-blue-700"
                              : "text-blue-500"
                            : darkMode
                              ? "text-gray-300 hover:text-gray-100"
                              : "text-gray-900 hover:text-gray-500"
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

  if (!cookies.jwt || !authorizations.data || !authorizations.data.viewUsers) {
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
