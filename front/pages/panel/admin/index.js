import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LayoutPanel from "../../../components/layoutPanel";
import NavbarAdmin from "../../../components/panel/navbarAdmin";
import OverviewAdmin from "../../../components/overviewAdmin";
import WebSocket from "../../../components/webSocket";
import Seo from "../../../components/seo";
import { fetchAPIAuth, parseCookies } from "../../../lib/api";
import { getApi } from "../../../lib/runtimeEnv";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import { UserUse } from "../../../context/provider";

const EMPTY_FILTERS = {
  idMaterial: "",
  idProjectType: "",
  idPriority: "",
  idStatus: "",
};

function Kpi({ label, value, color }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className="h-2 w-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="font-mono font-semibold text-gray-900 dark:text-white">
        {value}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}

export default function Admin({
  authorizations,
  materials,
  projectTypes,
  statuses,
  priorities,
}) {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);

  const router = useRouter();

  const [maxPage, setMaxPage] = useState(1);
  const [actualPage, setActualPage] = useState(0);
  const [collumnState, setCollumnState] = useState({});
  let newActualPage = 0;
  const [ticketResult, setTicketResult] = useState([]);
  const [counts, setCounts] = useState({
    open: 0,
    aTraiter: 0,
    urgent: 0,
    waitingPickup: 0,
  });
  const [openOnly, setOpenOnly] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  function realodPage() {
    router.replace(router.asPath);
    getAuth();

    async function getAuth() {
      const jwt = getCookie("jwt");
      const authorizations = await fetchAPIAuth("/user/authorization/", jwt);
      if (authorizations.myFabAgent) {
        update();
        fetchCounts();
      } else {
        setTicketResult([]);
      }
    }
  }

  useEffect(function () {
    if (user.error != undefined) {
      router.push("/404");
    }
    if (authorizations.myFabAgent) {
      // Initialise les filtres depuis l'URL (partage / rechargement)
      const q = router.query;
      const initFilters = {
        idMaterial: q.idMaterial || "",
        idProjectType: q.idProjectType || "",
        idPriority: q.idPriority || "",
        idStatus: q.idStatus || "",
      };
      const initOpen = q.all !== "1";
      setFilters(initFilters);
      setOpenOnly(initOpen);
      update(true, null, { filters: initFilters, openOnly: initOpen });
      fetchCounts();
    }
  }, []);

  function syncUrl(f, oo) {
    const query = {};
    if (!oo) query.all = "1";
    ["idMaterial", "idProjectType", "idPriority", "idStatus"].forEach((k) => {
      if (f[k]) query[k] = f[k];
    });
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  }

  function setFilter(key, value) {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setActualPage(0);
    newActualPage = 0;
    update(true, null, { filters: newFilters });
    syncUrl(newFilters, openOnly);
  }

  function toggleOpenOnly() {
    const oo = !openOnly;
    setOpenOnly(oo);
    setActualPage(0);
    newActualPage = 0;
    update(true, null, { openOnly: oo });
    syncUrl(filters, oo);
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setOpenOnly(true);
    setActualPage(0);
    newActualPage = 0;
    update(true, null, { filters: EMPTY_FILTERS, openOnly: true });
    syncUrl(EMPTY_FILTERS, true);
  }

  function nextPrevPage(addPage) {
    if (actualPage + addPage < 0 || actualPage + addPage >= maxPage) return;
    setActualPage(actualPage + addPage);
    newActualPage = actualPage + addPage;
    update();
  }

  function changeCollumnState(collumnClicked) {
    const newCollumnState = {};
    if (!collumnState[collumnClicked]) newCollumnState[collumnClicked] = true;
    else if (collumnState[collumnClicked])
      newCollumnState[collumnClicked] = false;
    setCollumnState(newCollumnState);
    update(true, newCollumnState);
  }

  async function exportCsv() {
    const jwt = getCookie("jwt");
    const params = {};
    if (openOnly && !filters.idStatus) params.selectOpenOnly = true;
    if (filters.idMaterial) params.idMaterial = filters.idMaterial;
    if (filters.idProjectType) params.idProjectType = filters.idProjectType;
    if (filters.idPriority) params.idPriority = filters.idPriority;
    if (filters.idStatus) params.idStatus = filters.idStatus;
    try {
      const response = await axios({
        method: "GET",
        url: getApi() + "/api/ticket/export/csv",
        params,
        responseType: "blob",
        headers: { dvflCookie: jwt },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "myfab_demandes.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      toast.error("Une erreur est survenue lors de l'export.", {
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

  async function fetchCounts() {
    const jwt = getCookie("jwt");
    const response = await fetchAPIAuth({
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: getApi() + "/api/ticket/counts",
    });
    if (!response.error && response.data) setCounts(response.data);
  }

  async function update(newReserch, newCollumnState, opts = {}) {
    const actualCollumnState = newCollumnState ? newCollumnState : collumnState;
    const keys = Object.keys(actualCollumnState);
    if (newReserch) setActualPage(0);
    const f = opts.filters ? opts.filters : filters;
    const oo = opts.openOnly !== undefined ? opts.openOnly : openOnly;
    const jwt = getCookie("jwt");
    const params = { page: newActualPage };
    // Le filtre "ouverts uniquement" est ignoré si un statut précis est choisi
    if (oo && !f.idStatus) params.selectOpenOnly = true;
    if (f.idMaterial) params.idMaterial = f.idMaterial;
    if (f.idProjectType) params.idProjectType = f.idProjectType;
    if (f.idPriority) params.idPriority = f.idPriority;
    if (f.idStatus) params.idStatus = f.idStatus;
    if (keys.length === 1) {
      params["collumnName"] = keys[0];
      params["order"] = actualCollumnState[keys[0]];
    }

    const responseTickets = await fetchAPIAuth({
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: getApi() + "/api/ticket",
      params,
    });
    if (!responseTickets.error) {
      setMaxPage(responseTickets.data.maxPage);
      setTicketResult(responseTickets.data.values);
    } else {
      toast.error("Une erreur est survenue lors du chargement des tickets.", {
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

  const selectClass =
    "rounded-md border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 text-sm py-1.5 pl-2 pr-8 focus:border-brand-magenta focus:ring-brand-magenta";

  const hasFilter =
    !openOnly ||
    filters.idMaterial ||
    filters.idProjectType ||
    filters.idPriority ||
    filters.idStatus;

  return (
    <div>
      <WebSocket
        realodPage={realodPage}
        event={[
          {
            name: "event-reload-tickets",
            action: () => {
              update();
              fetchCounts();
            },
          },
        ]}
        userId={user.id}
      />
      <LayoutPanel
        authorizations={authorizations}
        titleMenu={"Gestion des demandes"}
      >
        <Seo title={"Administration"} />
        <NavbarAdmin />
        <div className="md:py-8 md:px-6">
          <div className="container px-4 mx-auto space-y-4">
            <div className="rounded-md border border-gray-200 dark:border-night-800 bg-white dark:bg-night-900 px-6 py-5">
              <p className="font-mono text-xs uppercase tracking-wider text-brand-magenta">
                // Gestion des demandes
              </p>
              <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                Bonjour, {user.firstName}
              </h2>
              {user.specialFont ? (
                <p className={`${user.specialFont} text-sm text-gray-500`}>
                  Bonjour, {user.firstName}
                </p>
              ) : (
                ""
              )}
              {/* KPI */}
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                <Kpi label="ouverts" value={counts.open} color="#2ca1bb" />
                <Kpi
                  label="à traiter"
                  value={counts.aTraiter}
                  color="#e9d41d"
                />
                <Kpi label="urgents" value={counts.urgent} color="#f30b0b" />
                <Kpi
                  label="à récupérer"
                  value={counts.waitingPickup}
                  color="#d4d41c"
                />
              </div>
            </div>

            {/* Barre de filtres */}
            <div className="rounded-md border border-gray-200 dark:border-night-800 bg-white dark:bg-night-900 px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-wider text-brand-blue mb-2">
                // Filtres
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mr-2">
                  <input
                    type="checkbox"
                    checked={openOnly}
                    onChange={toggleOpenOnly}
                    disabled={!!filters.idStatus}
                    className="h-4 w-4 rounded text-brand-magenta focus:ring-brand-magenta border-gray-300 disabled:opacity-40"
                  />
                  Ouverts uniquement
                </label>
                <select
                  value={filters.idStatus}
                  onChange={(e) => setFilter("idStatus", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Statut : tous</option>
                  {statuses.map((s) => (
                    <option key={`st-${s.id}`} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.idMaterial}
                  onChange={(e) => setFilter("idMaterial", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Matériau : tous</option>
                  {materials.map((m) => (
                    <option key={`mat-${m.id}`} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.idProjectType}
                  onChange={(e) => setFilter("idProjectType", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Type : tous</option>
                  {projectTypes.map((p) => (
                    <option key={`pt-${p.id}`} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.idPriority}
                  onChange={(e) => setFilter("idPriority", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Priorité : toutes</option>
                  {priorities.map((p) => (
                    <option key={`pr-${p.id}`} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {hasFilter ? (
                  <button
                    onClick={resetFilters}
                    className="reset-filters-button text-sm font-medium text-brand-magenta hover:text-brand-magenta-dark ml-1"
                  >
                    Réinitialiser
                  </button>
                ) : null}
                <button
                  onClick={exportCsv}
                  className="export-csv-button ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue border border-gray-200 dark:border-night-700 rounded-md px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-night-800 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Exporter CSV
                </button>
              </div>
            </div>
          </div>
        </div>
        <OverviewAdmin
          tickets={ticketResult}
          maxPage={maxPage}
          actualPage={actualPage}
          nextPrevPage={nextPrevPage}
          collumnState={collumnState}
          changeCollumnState={changeCollumnState}
          statuses={statuses}
          darkMode={darkMode}
        />
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
      redirect: {
        permanent: false,
        destination: "/404",
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

  const materialsRes = await fetchAPIAuth("/material/", cookies.jwt);
  const projectTypesRes = await fetchAPIAuth("/projectType/", cookies.jwt);
  const statusesRes = await fetchAPIAuth("/status/", cookies.jwt);
  const prioritiesRes = await fetchAPIAuth("/priority/", cookies.jwt);

  return {
    props: {
      authorizations: authorizations.data,
      materials: Array.isArray(materialsRes.data) ? materialsRes.data : [],
      projectTypes: Array.isArray(projectTypesRes.data)
        ? projectTypesRes.data
        : [],
      statuses: Array.isArray(statusesRes.data) ? statusesRes.data : [],
      priorities: Array.isArray(prioritiesRes.data) ? prioritiesRes.data : [],
    }, // will be passed to the page component as props
  };
}
