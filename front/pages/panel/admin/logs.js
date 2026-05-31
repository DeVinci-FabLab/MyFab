import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import LayoutPanel from "../../../components/layoutPanel";
import NavbarAdmin from "../../../components/panel/navbarAdmin";
import WebSocket from "../../../components/webSocket";
import Seo from "../../../components/seo";
import { fetchAPIAuth, parseCookies } from "../../../lib/api";
import { getApi } from "../../../lib/runtimeEnv";
import { setZero } from "../../../lib/function";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

import { UserUse } from "../../../context/provider";

const CATEGORIES = [
  { key: "", label: "Tout" },
  { key: "ticket", label: "Tickets" },
  { key: "role", label: "Rôles" },
  { key: "user", label: "Utilisateurs" },
  { key: "connection", label: "Connexions" },
];

const CATEGORY_COLOR = {
  ticket: "#00AEEF",
  role: "#F39200",
  user: "#E6007E",
  connection: "#9ca3af",
};

const ACTION_LABEL = {
  upd_status: "a changé le statut",
  upd_priority: "a changé la priorité",
  upd_projType: "a changé le type de projet",
  upd_note: "a modifié une note",
  add_role: "a ajouté le rôle",
  del_role: "a retiré le rôle",
  login: "s'est connecté(e)",
};

function formatDate(dt) {
  try {
    return new Date(dt).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "";
  }
}

export default function Logs({ authorizations }) {
  const jwt = getCookie("jwt");
  const { user } = UserUse(jwt);
  const router = useRouter();

  const [logs, setLogs] = useState([]);
  const [maxPage, setMaxPage] = useState(1);
  const [actualPage, setActualPage] = useState(0);
  const [category, setCategory] = useState("");
  let newActualPage = 0;

  function realodPage() {
    router.replace(router.asPath);
  }

  useEffect(function () {
    if (authorizations.myFabAgent) update();
  }, []);

  async function update(opts = {}) {
    const cat = opts.category !== undefined ? opts.category : category;
    const jwt = getCookie("jwt");
    const params = { page: newActualPage };
    if (cat) params.category = cat;
    const response = await fetchAPIAuth({
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: getApi() + "/api/logs",
      params,
    });
    if (!response.error) {
      setMaxPage(response.data.maxPage);
      setLogs(response.data.values);
    } else {
      toast.error("Une erreur est survenue lors du chargement des logs.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  function selectCategory(cat) {
    setCategory(cat);
    setActualPage(0);
    newActualPage = 0;
    update({ category: cat });
  }

  function nextPrevPage(addPage) {
    if (actualPage + addPage < 0 || actualPage + addPage >= maxPage) return;
    setActualPage(actualPage + addPage);
    newActualPage = actualPage + addPage;
    update();
  }

  function Target({ log }) {
    if (log.targetType === "ticket" && log.targetId) {
      return (
        <Link href={`/panel/${log.targetId}`}>
          <span className="font-mono text-brand-blue hover:underline cursor-pointer">
            ticket #{setZero(log.targetId)}
          </span>
        </Link>
      );
    }
    if (log.targetType === "user" && log.targetId) {
      return (
        <span className="font-mono text-gray-700 dark:text-gray-300">
          utilisateur #{setZero(log.targetId)}
        </span>
      );
    }
    return null;
  }

  function Detail({ log }) {
    // Contenu lisible : note (texte), rôle (nom). Les ids de statut/priorité sont masqués.
    if (log.action === "upd_note" && log.detail) {
      return (
        <span className="text-gray-500 dark:text-gray-400">
          {" : "}
          <span className="italic">« {log.detail} »</span>
        </span>
      );
    }
    if (
      (log.action === "add_role" || log.action === "del_role") &&
      log.detail
    ) {
      return (
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {" "}
          {log.detail}
        </span>
      );
    }
    return null;
  }

  if (!authorizations.myFabAgent) {
    return null;
  }

  return (
    <div>
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />
      <LayoutPanel
        authorizations={authorizations}
        titleMenu={"Gestion des demandes"}
      >
        <Seo title={"Logs"} />
        <NavbarAdmin />
        <div className="md:py-8 md:px-6">
          <div className="container px-4 mx-auto space-y-4">
            <div className="rounded-md border border-gray-200 dark:border-night-800 bg-white dark:bg-night-900 px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-wider text-brand-blue mb-2">
                // Journal d'activité
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={`cat-${c.key || "all"}`}
                    onClick={() => selectCategory(c.key)}
                    className={`logs-cat-button text-sm px-3 py-1 rounded-md border transition-colors ${
                      category === c.key
                        ? "border-brand-magenta text-brand-magenta bg-brand-magenta/5"
                        : "border-gray-200 dark:border-night-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-800"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-gray-200 dark:border-night-800 bg-white dark:bg-night-900 divide-y divide-gray-100 dark:divide-night-800">
              {logs.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                  Aucune activité à afficher.
                </p>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={`log-${index}`}
                    className="log-row flex items-start gap-3 px-4 py-3"
                  >
                    <span
                      className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          CATEGORY_COLOR[log.category] || "#9ca3af",
                      }}
                    />
                    <div className="flex-1 min-w-0 text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {log.actorName || "Inconnu"}
                      </span>{" "}
                      {ACTION_LABEL[log.action] || log.action}{" "}
                      <Target log={log} />
                      <Detail log={log} />
                    </div>
                    <span className="font-mono text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {formatDate(log.dt)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="grid place-items-center">
              <div className="inline-flex items-center gap-2">
                <button
                  className="prev-page-button h-9 w-9 inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-night-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-800 transition-colors"
                  onClick={() => nextPrevPage(-1)}
                >
                  &lt;
                </button>
                <div className="inline-flex items-center px-3 text-sm text-gray-600 dark:text-gray-300">
                  Page&nbsp;
                  <span className="font-mono font-semibold text-brand-blue">
                    {actualPage + 1}
                  </span>
                  &nbsp;/&nbsp;
                  <span className="font-mono font-semibold text-gray-900 dark:text-white">
                    {maxPage != 0 ? maxPage : 1}
                  </span>
                </div>
                <button
                  className="next-page-button h-9 w-9 inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-night-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-800 transition-colors"
                  onClick={() => nextPrevPage(1)}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </LayoutPanel>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  const authorizations = cookies.jwt
    ? await fetchAPIAuth("/user/authorization/", cookies.jwt)
    : null;
  if (!cookies.jwt || !authorizations.data) {
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

  if (authorizations.status === 200 && !authorizations.data.myFabAgent) {
    return {
      redirect: { permanent: false, destination: "/404" },
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
    },
  };
}
