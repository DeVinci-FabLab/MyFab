import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BellIcon } from "@heroicons/react/24/outline";
import { getCookie } from "cookies-next";
import { fetchAPIAuth } from "../lib/api";
import { getApi } from "../lib/runtimeEnv";

function shortDate(dt) {
  try {
    return new Date(dt).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "";
  }
}

export default function NotificationBell({ userId }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const router = useRouter();

  async function fetchNotifs() {
    const jwt = getCookie("jwt");
    const res = await fetchAPIAuth({
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: getApi() + "/api/notification/",
    });
    if (!res.error && res.data) {
      setItems(res.data.values || []);
      setUnread(res.data.unread || 0);
    }
  }

  // Rafraîchit au montage et à chaque changement de page.
  useEffect(() => {
    fetchNotifs();
  }, [router.asPath]);

  // Polling léger (la cloche n'ouvre pas sa propre connexion socket).
  useEffect(() => {
    if (process.env.IS_TEST_MODE === "true") return;
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  async function markAllRead() {
    const jwt = getCookie("jwt");
    const res = await fetchAPIAuth({
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: getApi() + "/api/notification/read",
    });
    // Ne pas désynchroniser l'UI si le backend a échoué.
    if (res.error) return;
    setUnread(0);
    setItems((prev) => prev.map((i) => ({ ...i, isRead: 1 })));
  }

  function openItem(n) {
    setOpen(false);
    if (unread > 0) markAllRead();
    if (n.link) router.push(n.link);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="notification-bell-button relative p-1 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-800 transition-colors"
      >
        <BellIcon className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 inline-flex items-center justify-center rounded-full bg-brand-magenta text-white text-[10px] font-semibold leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          {/* backdrop pour fermer au clic extérieur */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] max-h-96 overflow-y-auto z-50 rounded-md border border-gray-200 dark:border-night-800 bg-white dark:bg-night-900 shadow-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-night-800">
              <p className="font-mono text-xs uppercase tracking-wider text-brand-magenta">
                // Notifications
              </p>
              {unread > 0 ? (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs font-medium text-brand-blue hover:underline"
                >
                  Tout marquer lu
                </button>
              ) : null}
            </div>

            {items.length === 0 ? (
              <p className="px-3 py-6 text-sm text-center text-gray-500 dark:text-gray-400">
                Aucune notification.
              </p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-night-800">
                {items.map((n) => (
                  <button
                    key={`notif-${n.id}`}
                    type="button"
                    onClick={() => openItem(n)}
                    className={`notification-item block w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-night-800/50 transition-colors ${
                      n.isRead ? "" : "bg-brand-magenta/5"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {n.isRead ? (
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0" />
                      ) : (
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-magenta flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 dark:text-gray-200 break-words">
                          {n.message}
                        </p>
                        <p className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
                          {shortDate(n.creationDate)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
