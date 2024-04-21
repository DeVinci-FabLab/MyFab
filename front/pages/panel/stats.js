import { useEffect, useState } from "react";
import "moment/locale/fr";

import LayoutPanel from "../../components/layoutPanel";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Seo from "../../components/seo";
import WebSocket from "../../components/webSocket";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);
import { Doughnut } from "react-chartjs-2";

import { UserUse } from "../../context/provider";

export default function NewPanel({ authorizations, stats }) {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);

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

  console.log(stats);
  return (
    <LayoutPanel
      authorizations={authorizations}
      titleMenu={"Statistiques de MyFab"}
    >
      <Seo title={"Panel"} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />

      {/* Dernières activités */}

      <nav class="">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
          <div class="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
              <li>
                <a
                  href="#"
                  class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Général
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  All time
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Services
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

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
                  label: "Dark mode",
                  data: [
                    stats.users[0].total_users - stats.users[0].dark_mode_users,
                    stats.users[0].dark_mode_users,
                  ],
                  backgroundColor: ["rgb(195, 195, 195)", "rgb(48, 48, 48)"],
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

  return {
    props: {
      authorizations: authorizations.data,
      stats: stats.data,
    }, // will be passed to the page component as props
  };
}
