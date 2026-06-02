import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { fetchAPIAuth } from "../../lib/api";
import LayoutPanel from "../../components/layoutPanel";
import Seo from "../../components/seo";
import WebSocket from "../../components/webSocket";
import { UserUse } from "../../context/provider";
import { useRouter } from "next/router";

const STATE_LABELS = {
  IDLE: { label: "En attente", color: "bg-gray-400" },
  PREPARE: { label: "Préparation", color: "bg-yellow-400" },
  RUNNING: { label: "En impression", color: "bg-green-500" },
  PAUSE: { label: "En pause", color: "bg-yellow-500" },
  FAILED: { label: "Erreur", color: "bg-red-500" },
  FINISH: { label: "Terminé", color: "bg-blue-500" },
  offline: { label: "Hors ligne", color: "bg-gray-300" },
};

function stateInfo(state) {
  return (
    STATE_LABELS[state] || { label: state || "Inconnu", color: "bg-gray-300" }
  );
}

function formatMinutes(min) {
  if (min == null) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function PrinterCard({ printer }) {
  const { name, model, status, currentTicket } = printer;
  const state = stateInfo(status?.gcode_state);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-lg">
            {name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{model}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-medium ${state.color}`}
        >
          <span className="w-2 h-2 rounded-full bg-white opacity-80 inline-block" />
          {state.label}
        </span>
      </div>

      {status ? (
        <>
          {/* Progression */}
          {status.gcode_state === "RUNNING" && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>{status.subtask_name || "Impression en cours"}</span>
                <span>{status.print_percent ?? 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${status.print_percent ?? 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Temps restant : {formatMinutes(status.remaining_time)}
              </p>
            </div>
          )}

          {/* Températures */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Buse</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {status.nozzle_temper ?? "—"}°C
                {status.nozzle_target_temper > 0 && (
                  <span className="text-xs text-gray-400 ml-1">
                    / {status.nozzle_target_temper}°C
                  </span>
                )}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Plateau</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {status.bed_temper ?? "—"}°C
                {status.bed_target_temper > 0 && (
                  <span className="text-xs text-gray-400 ml-1">
                    / {status.bed_target_temper}°C
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Couche + signal */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            {status.total_layer_num > 0 && (
              <span>
                Couche {status.layer_num} / {status.total_layer_num}
              </span>
            )}
            {status.wifi_signal && <span>WiFi {status.wifi_signal} dBm</span>}
          </div>

          <p className="text-xs text-gray-400">
            Mis à jour :{" "}
            {status.updatedAt
              ? new Date(status.updatedAt).toLocaleTimeString("fr-FR")
              : "—"}
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-400 italic">
          Aucune donnée reçue de l&apos;agent
        </p>
      )}

      {currentTicket && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Ticket en cours
          </p>
          <a
            href={`/panel/${currentTicket.id}`}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>#{currentTicket.id}</span>
            <span className="text-gray-500 dark:text-gray-400 font-normal">
              — {currentTicket.user}
            </span>
          </a>
          {currentTicket.file && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {currentTicket.file}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PrintersDashboard({ initialPrinters }) {
  const jwt = getCookie("jwt");
  const { user } = UserUse(jwt);
  const router = useRouter();

  const [printers, setPrinters] = useState(initialPrinters || []);

  useEffect(() => {
    if (user?.error != null) router.push("/404");
  }, [user]);

  async function refresh() {
    const res = await fetchAPIAuth("/printers/", jwt);
    if (res?.data) setPrinters(res.data);
  }

  return (
    <LayoutPanel>
      <Seo title="Imprimantes" />
      <WebSocket event={[{ name: "printer-status-update", action: refresh }]} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Imprimantes 3D
          </h1>
          <button
            onClick={refresh}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Actualiser
          </button>
        </div>

        {printers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Aucune imprimante configurée.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {printers.map((p) => (
              <PrinterCard key={p.serial} printer={p} />
            ))}
          </div>
        )}
      </div>
    </LayoutPanel>
  );
}

export async function getServerSideProps({ req }) {
  const { getApi } = await import("../../lib/runtimeEnv");
  const cookies = req.headers.cookie || "";
  const jwt = cookies.match(/jwt=([^;]+)/)?.[1];

  try {
    const axios = (await import("axios")).default;
    const res = await axios.get(`${getApi()}/api/printers/`, {
      headers: { dvflCookie: jwt || "" },
    });
    return { props: { initialPrinters: res.data } };
  } catch {
    return { props: { initialPrinters: [] } };
  }
}
