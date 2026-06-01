import router from "next/router";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon as StarIconOutline,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { setZero } from "../lib/function";
import { dateDiff } from "../lib/date";
import { fetchAPIAuth } from "../lib/api";
import { getApi } from "../lib/runtimeEnv";
import { getCookie } from "cookies-next";

import { UserUse } from "../context/provider";

async function togglePin(e, id) {
  e.stopPropagation();
  const jwt = getCookie("jwt");
  const response = await fetchAPIAuth({
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      dvflCookie: jwt,
    },
    url: getApi() + "/api/ticket/" + id + "/setPinned/",
  });
  if (response.error) {
    toast.error("Impossible de modifier l'épinglage du ticket.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  // La liste se rafraîchit via l'event socket "event-reload-tickets".
}

async function changeStatus(id, idStatus) {
  const jwt = getCookie("jwt");
  const response = await fetchAPIAuth({
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      dvflCookie: jwt,
    },
    url: getApi() + "/api/ticket/" + id + "/setStatus/",
    params: { idStatus },
  });
  if (response.error) {
    toast.error("Impossible de changer le statut du ticket.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  // La liste se rafraîchit via l'event socket "event-reload-tickets".
}

// Ouvre le ticket ; gère le clic-milieu / ctrl-clic (nouvel onglet).
function openTicket(e, id) {
  const url = `/panel/${id}`;
  if (e.ctrlKey || e.metaKey || e.button === 1) {
    window.open(url, "_blank");
    return;
  }
  router.push(url);
}

function getChevron(collumnState, type) {
  if (!collumnState) return null;
  if (collumnState[type] === true) return <ChevronUpIcon className="w-4 h-4" />;
  if (collumnState[type] === false)
    return <ChevronDownIcon className="w-4 h-4" />;
  return null;
}

function StatusDot({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="h-2 w-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color ? `#${color}` : "#9ca3af" }}
      />
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </span>
  );
}

export default function TablesAdmin({
  tickets,
  maxPage,
  actualPage,
  nextPrevPage,
  collumnState,
  changeCollumnState,
  statuses,
}) {
  const jwt = getCookie("jwt");
  const { user } = UserUse(jwt);
  const canQuickStatus = Array.isArray(statuses) && statuses.length > 0;

  const dateNow = new Date();
  const changeCollumnDefined = changeCollumnState ? true : false;
  if (!changeCollumnState) changeCollumnState = function () {};

  function Th({ label, sortKey }) {
    return (
      <th className="px-4 py-3 text-left">
        <div
          className={`inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
            changeCollumnDefined ? "cursor-pointer select-none" : ""
          }`}
          onClick={() => sortKey && changeCollumnState(sortKey)}
        >
          <span>{label}</span>
          {user.specialFont ? (
            <span className={`${user.specialFont} normal-case`}>{label}</span>
          ) : null}
          {sortKey ? getChevron(collumnState, sortKey) : null}
        </div>
      </th>
    );
  }

  return (
    <div>
      <div className="border border-gray-200 dark:border-night-800 rounded-md overflow-x-auto min-w-full bg-white dark:bg-night-900">
        <table className="min-w-full text-sm align-middle whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-200 dark:border-night-800 bg-gray-50 dark:bg-night-900/60">
              <th className="w-10 px-2 py-3" aria-label="Épinglage" />
              <Th label="Id" sortKey="id" />
              <Th label="Demandeur" sortKey="name" />
              <Th label="Priorité" sortKey="priority" />
              <Th label="Matériau" sortKey="material" />
              <Th label="État" sortKey="status" />
              <Th label="Dernière modif" sortKey="createAt" />
            </tr>
          </thead>
          <tbody>
            {tickets.map((r, index) => {
              return (
                <tr
                  key={`ticket-${index}`}
                  className={`ticket-element border-b border-gray-100 dark:border-night-800 last:border-0 cursor-pointer transition-colors ${
                    r.pinned
                      ? "bg-brand-yellow/10 hover:bg-brand-yellow/20"
                      : "hover:bg-gray-50 dark:hover:bg-night-800/50"
                  }`}
                  onClick={(e) => openTicket(e, r.id)}
                  onAuxClick={(e) => openTicket(e, r.id)}
                >
                  <td
                    className={`px-2 py-3 ${
                      r.pinned ? "border-l-2 border-brand-yellow" : ""
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => togglePin(e, r.id)}
                      title={r.pinned ? "Désépingler" : "Épingler en haut"}
                      aria-label={r.pinned ? "Désépingler" : "Épingler"}
                      className="pin-button flex items-center justify-center rounded p-1 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    >
                      {r.pinned ? (
                        <StarIconSolid className="h-5 w-5 text-brand-yellow" />
                      ) : (
                        <StarIconOutline className="h-5 w-5 text-gray-300 hover:text-brand-yellow dark:text-gray-600 dark:hover:text-brand-yellow transition-colors" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-gray-400 dark:text-gray-500">
                      #{setZero(r.id)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {r.userName}
                    </p>
                    <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      {r.projectType}
                      {r.groupNumber ? ` ${r.groupNumber}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusDot color={r.priorityColor} label={r.priorityName} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                      {r.material}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={
                      canQuickStatus ? (e) => e.stopPropagation() : undefined
                    }
                  >
                    {canQuickStatus ? (
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: r.statusColor
                              ? `#${r.statusColor}`
                              : "#9ca3af",
                          }}
                        />
                        <select
                          value={r.statusId || ""}
                          onChange={(e) => changeStatus(r.id, e.target.value)}
                          className="quick-status-select rounded-md border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-700 dark:text-gray-300 text-sm py-1 pl-1.5 pr-7 focus:border-brand-magenta focus:ring-brand-magenta"
                        >
                          {statuses.map((s) => (
                            <option key={`row-st-${s.id}`} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </span>
                    ) : (
                      <StatusDot color={r.statusColor} label={r.statusName} />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      il y a {dateDiff(new Date(r.modificationDate), dateNow)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid place-items-center mb-10">
        <div className="inline-flex items-center mt-4 gap-2">
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
  );
}
