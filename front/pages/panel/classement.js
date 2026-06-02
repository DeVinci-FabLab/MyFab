import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import LayoutPanel from "../../components/layoutPanel";
import WebSocket from "../../components/webSocket";
import Seo from "../../components/seo";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { getApi } from "../../lib/runtimeEnv";
import { getCookie } from "cookies-next";

import { UserUse } from "../../context/provider";

// Accent du podium : or / argent / bronze (sobre).
const PODIUM = ["#F39200", "#9ca3af", "#B0764A"];
const PERIODS = [
  { key: "month", label: "Ce mois-ci", field: "pointsMonth" },
  { key: "year", label: "Cette année", field: "pointsYear" },
  { key: "total", label: "Tout le temps", field: "pointsTotal" },
];

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-md border border-gray-200 dark:border-night-800 bg-white dark:bg-night-900 p-4 ${className}`}
    >
      {children}
    </div>
  );
}

function Avatar({ name, color, size = "h-9 w-9", text = "text-sm" }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={`inline-flex ${size} ${text} flex-shrink-0 items-center justify-center rounded-full font-semibold text-white`}
      style={{ backgroundColor: "#" + color }}
    >
      {initials}
    </span>
  );
}

function PodiumColumn({ agent, rank, value }) {
  const accent = PODIUM[rank - 1] || "#9ca3af";
  const pedestalH = rank === 1 ? "h-24" : rank === 2 ? "h-16" : "h-12";
  return (
    <div className="flex flex-col items-center w-1/3 max-w-[160px]">
      <div className="flex flex-col items-center gap-1 pb-2">
        <Avatar
          name={agent.name}
          color={agent.roleColor}
          size={rank === 1 ? "h-14 w-14" : "h-11 w-11"}
        />
        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white text-center truncate max-w-[140px]">
          {agent.name}
          {agent.isMe ? (
            <span className="block text-[10px] font-mono uppercase tracking-wider text-brand-magenta">
              Vous
            </span>
          ) : null}
        </p>
        <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-1">
          pts
        </p>
      </div>
      <div
        className={`${pedestalH} w-full rounded-t-md flex items-start justify-center pt-2`}
        style={{
          backgroundColor: accent + "22",
          borderTop: `3px solid ${accent}`,
        }}
      >
        <span
          className="font-mono text-2xl font-bold"
          style={{ color: accent }}
        >
          {rank}
        </span>
      </div>
    </div>
  );
}

function ProfileLine({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm border-b border-gray-100 dark:border-night-800 last:border-0">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-mono font-semibold text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function ProfileCard({ me, meIndex, ranked, period, metric, totalAll }) {
  if (!me) {
    return (
      <Card>
        <p className="font-mono text-[10px] uppercase tracking-wider text-brand-blue mb-2">
          // Mon profil
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Vous n'avez pas encore d'actions comptabilisées sur cette période.
        </p>
      </Card>
    );
  }
  const rank = meIndex + 1;
  const accent = PODIUM[meIndex] || "#9ca3af";
  const share = Math.round((metric(me) / totalAll) * 100);
  const above = meIndex > 0 ? ranked[meIndex - 1] : null;
  const gap = above ? metric(above) - metric(me) : 0;
  const periodLabel = PERIODS.find((p) => p.key === period).label.toLowerCase();

  return (
    <Card className="lg:sticky lg:top-6">
      <p className="font-mono text-[10px] uppercase tracking-wider text-brand-blue mb-3">
        // Mon profil
      </p>

      <div className="flex items-center gap-3">
        <Avatar
          name={me.name}
          color={me.roleColor}
          size="h-14 w-14"
          text="text-lg"
        />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {me.name}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {me.role}
          </p>
        </div>
      </div>

      {/* Rang + points */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-gray-50 dark:bg-night-800 p-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Rang
          </p>
          <p className="font-mono text-2xl font-bold" style={{ color: accent }}>
            #{rank}
          </p>
          <p className="text-[10px] text-gray-400">sur {ranked.length}</p>
        </div>
        <div className="rounded-md bg-gray-50 dark:bg-night-800 p-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Points
          </p>
          <p className="font-mono text-2xl font-bold text-brand-magenta">
            {metric(me)}
          </p>
          <p className="text-[10px] text-gray-400">{periodLabel}</p>
        </div>
      </div>

      {/* Détails */}
      <div className="mt-3">
        <ProfileLine label="Part de l'équipe" value={`${share}%`} />
        <ProfileLine label="Fermetures" value={me.closures} />
        <ProfileLine label="Actions totales" value={me.actions} />
        <ProfileLine label="Délai moyen" value={`${me.avgDelayHours} h`} />
      </div>

      {/* Progression */}
      <div className="mt-4 rounded-md border border-brand-magenta/30 bg-brand-magenta/5 px-3 py-2">
        {above ? (
          <p className="text-xs text-gray-700 dark:text-gray-200">
            Plus que{" "}
            <span className="font-mono font-semibold text-brand-magenta">
              {gap} pts
            </span>{" "}
            pour passer <span className="font-semibold">{above.name}</span> (#
            {rank - 1})
          </p>
        ) : (
          <p className="text-xs font-medium text-brand-magenta">
            🏆 En tête du classement, bravo !
          </p>
        )}
      </div>
    </Card>
  );
}

export default function Classement({ authorizations }) {
  const jwt = getCookie("jwt");
  const { user } = UserUse(jwt);
  const router = useRouter();

  const [agents, setAgents] = useState([]);
  const [weights, setWeights] = useState(null);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  function realodPage() {
    router.replace(router.asPath);
  }

  async function update() {
    const jwt = getCookie("jwt");
    const response = await fetchAPIAuth({
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: getApi() + "/api/ranking",
    });
    if (!response.error && response.data) {
      setAgents(response.data.agents || []);
      setWeights(response.data.weights || null);
    }
    setLoading(false);
  }

  useEffect(function () {
    update();
  }, []);

  const field = (PERIODS.find((p) => p.key === period) || PERIODS[0]).field;
  const metric = (a) => a[field];
  const ranked = [...agents].sort((a, b) => metric(b) - metric(a));
  const max = ranked.length ? metric(ranked[0]) || 1 : 1;
  const totalAll = ranked.reduce((s, a) => s + metric(a), 0) || 1;
  const meIndex = ranked.findIndex((a) => a.isMe);
  const me = meIndex >= 0 ? ranked[meIndex] : null;
  const top3 = ranked.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div>
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />
      <LayoutPanel
        authorizations={authorizations}
        titleMenu={"Classement des agents"}
      >
        <Seo title={"Classement"} />

        <div className="pt-6">
          <div className="container px-4 mx-auto flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-brand-magenta">
                // Classement des agents
              </p>
              {weights ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Score = actions pondérées :{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    fermeture +{weights.close}
                  </span>{" "}
                  · statut +{weights.status} · message/note +{weights.message}
                </p>
              ) : null}
            </div>
            <div className="inline-flex rounded-md border border-gray-200 dark:border-night-700 overflow-hidden text-sm">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-3 py-1.5 transition-colors ${
                    period === p.key
                      ? "bg-brand-magenta text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container px-4 mx-auto py-6">
          {loading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chargement…
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne principale : podium + classement */}
              <div className="lg:col-span-2 space-y-6">
                {podiumOrder.length > 0 ? (
                  <Card>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-brand-blue mb-4">
                      // Podium
                    </p>
                    <div className="flex justify-center items-end gap-3 sm:gap-6">
                      {podiumOrder.map((a) => (
                        <PodiumColumn
                          key={`podium-${a.id}`}
                          agent={a}
                          rank={ranked.findIndex((x) => x.id === a.id) + 1}
                          value={metric(a)}
                        />
                      ))}
                    </div>
                  </Card>
                ) : null}

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-brand-blue mb-2">
                    // Classement complet
                  </p>
                  <Card className="divide-y divide-gray-100 dark:divide-night-800 p-0">
                    {ranked.map((a, i) => (
                      <div
                        key={`row-${a.id}`}
                        className={`flex items-center gap-3 px-4 py-3 ${
                          a.isMe ? "bg-brand-magenta/5" : ""
                        }`}
                      >
                        <span
                          className="font-mono font-semibold w-6 text-center flex-shrink-0"
                          style={{ color: i < 3 ? PODIUM[i] : undefined }}
                        >
                          {i + 1}
                        </span>
                        <Avatar name={a.name} color={a.roleColor} />
                        <div className="min-w-0 w-28 sm:w-40 flex-shrink-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {a.name}
                            {a.isMe ? (
                              <span className="ml-1.5 text-[10px] font-mono uppercase tracking-wider text-brand-magenta">
                                Vous
                              </span>
                            ) : null}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 truncate">
                            {a.role}
                          </p>
                        </div>
                        <div className="flex-1 h-2.5 rounded bg-gray-100 dark:bg-night-800 overflow-hidden min-w-[40px]">
                          <div
                            className="h-full rounded"
                            style={{
                              width: `${(metric(a) / max) * 100}%`,
                              backgroundColor: a.isMe ? "#E6007E" : "#00AEEF",
                            }}
                          />
                        </div>
                        <span className="font-mono font-semibold text-gray-900 dark:text-white w-12 text-right flex-shrink-0">
                          {metric(a)}
                        </span>
                      </div>
                    ))}
                  </Card>
                </div>
              </div>

              {/* Colonne latérale : mon profil */}
              <div className="lg:col-span-1">
                <ProfileCard
                  me={me}
                  meIndex={meIndex}
                  ranked={ranked}
                  period={period}
                  metric={metric}
                  totalAll={totalAll}
                />
              </div>
            </div>
          )}
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
