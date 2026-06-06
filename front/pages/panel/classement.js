import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import LayoutPanel from "../../components/layoutPanel";
import WebSocket from "../../components/webSocket";
import Seo from "../../components/seo";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { getApi } from "../../lib/runtimeEnv";
import { getCookie } from "cookies-next";
import { isBirthday, birthdayEmoji } from "../../lib/birthday";

import { UserUse } from "../../context/provider";

// Accent du podium : or / argent / bronze (sobre).
const PODIUM = ["#F39200", "#9ca3af", "#B0764A"];
const PERIODS = [
  { key: "month", label: "Ce mois-ci", field: "pointsMonth" },
  { key: "year", label: "Cette année", field: "pointsYear" },
  { key: "total", label: "Tout le temps", field: "pointsTotal" },
];

// Paliers de progression (maison, CSS pur — aucune image sous licence).
// On monte de niveau en CUMULANT des points sur toute sa carrière
// (pointsTotal). C'est ABSOLU : pas de "1er = tel rang", chacun peut atteindre
// le palier max en étant actif. Seuils ajustables ici.
const LEVELS = [
  { name: "Apprenti", min: 0, color: "#94a3b8" },
  { name: "Opérateur", min: 50, color: "#38bdf8" },
  { name: "Technicien", min: 150, color: "#3b82f6" },
  { name: "Spécialiste", min: 350, color: "#8b5cf6" },
  { name: "Expert", min: 700, color: "#E6007E" },
  { name: "Référent", min: 1200, color: "#F39200" },
  { name: "Maître", min: 2000, color: "#e7b53a" },
];

// Niveau atteint pour un total de points + progression vers le palier suivant.
function levelForPoints(points) {
  const p = Number(points) || 0;
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (p >= LEVELS[i].min) idx = i;
  const level = LEVELS[idx];
  const next = LEVELS[idx + 1] || null;
  const span = next ? next.min - level.min : 1;
  const progress = next ? Math.min(1, (p - level.min) / span) : 1;
  const toNext = next ? Math.max(0, next.min - p) : 0;
  return {
    idx,
    level,
    next,
    progress,
    toNext,
    num: idx + 1,
    count: LEVELS.length,
  };
}

// Médaillon de niveau (numéro du palier) + libellé optionnel. CSS, pas d'image.
function LevelBadge({ points, size = 22, showLabel = false, stacked = false }) {
  const { level, num, count } = levelForPoints(points);
  const medal = (
    <span
      className="inline-flex flex-shrink-0 items-center justify-center rounded-full font-mono font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        background: `radial-gradient(circle at 35% 30%, ${level.color}, ${level.color}bb)`,
        border: `1px solid ${level.color}`,
        boxShadow: `0 0 0 2px ${level.color}22`,
      }}
      title={`${level.name} — niveau ${num}/${count}`}
    >
      {num}
    </span>
  );
  if (!showLabel && !stacked) return medal;
  return (
    <span
      className={
        stacked
          ? "inline-flex flex-col items-center gap-1.5"
          : "inline-flex items-center gap-1.5"
      }
    >
      {medal}
      <span
        className={`font-mono uppercase tracking-wider whitespace-nowrap ${
          stacked ? "text-sm font-semibold" : "text-[10px]"
        }`}
        style={{ color: level.color }}
      >
        {level.name}
      </span>
    </span>
  );
}

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
  const fete = isBirthday();
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={`inline-flex ${size} ${text} flex-shrink-0 items-center justify-center rounded-full font-semibold text-white`}
      style={{ backgroundColor: fete ? "transparent" : "#" + color }}
    >
      {fete ? birthdayEmoji(name) : initials}
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
  // Niveau (palier absolu) basé sur le total carrière, pas sur la période.
  const lvl = levelForPoints(me.pointsTotal);

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

      {/* Niveau + progression vers le palier suivant */}
      <div className="mt-4 rounded-md border border-gray-200 dark:border-night-800 bg-gray-50 dark:bg-night-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <LevelBadge points={me.pointsTotal} size={56} />
          <div className="min-w-0">
            <p
              className="font-semibold leading-tight"
              style={{ color: lvl.level.color }}
            >
              {lvl.level.name}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Niveau {lvl.num}/{lvl.count} · {me.pointsTotal} pts
            </p>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-2 rounded bg-gray-200 dark:bg-night-700 overflow-hidden">
            <div
              className="h-full rounded"
              style={{
                width: `${Math.round(lvl.progress * 100)}%`,
                backgroundColor: lvl.level.color,
              }}
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
            {lvl.next ? (
              <>
                Plus que{" "}
                <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">
                  {lvl.toNext} pts
                </span>{" "}
                pour <span className="font-semibold">{lvl.next.name}</span>
              </>
            ) : (
              <>Palier maximum atteint 🎉</>
            )}
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
        <ProfileLine label="Tickets traités" value={me.ticketsHandled} />
        <ProfileLine label="Fermetures" value={me.closures} />
        <ProfileLine label="Tickets partagés" value={me.sharedTickets} />
        <ProfileLine
          label="Série"
          value={me.streak > 0 ? `🔥 ${me.streak} j` : "—"}
        />
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
  // On ne montre que les agents avec un score > 0 SUR LA PÉRIODE choisie
  // (un agent inactif ce mois-ci ne doit pas apparaître à 0).
  const ranked = [...agents]
    .filter((a) => metric(a) > 0)
    .sort((a, b) => metric(b) - metric(a));
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
                  Score par ticket traité :{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    fermeture +{weights.close}
                  </span>{" "}
                  · participation +{weights.participation} (hors ses propres
                  demandes)
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
                          <div className="mt-0.5">
                            <LevelBadge
                              points={a.pointsTotal}
                              size={16}
                              showLabel
                            />
                          </div>
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
