import Link from "next/link";
import { withRouter } from "next/router";
import { getCookie } from "cookies-next";

import { UserUse } from "../../context/provider";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavbarAdmin({ router }) {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);
  const pn = router.pathname;
  const tabs = [
    {
      name: "Demandes à traiter",
      classNames: "goTo-tickets-button",
      href: "/panel/admin/",
      current: pn.split("/")[3] === undefined,
      show: true,
    },
    {
      name: "Historique des demandes",
      classNames: "goTo-history-button",
      href: "/panel/admin/history",
      current: pn.split("/")[3] == "history",
      show: true,
    },
    {
      name: "Logs",
      classNames: "goTo-logs-button",
      href: "/panel/admin/logs",
      current: pn.split("/")[3] == "logs",
      show: true,
    },
  ];

  return (
    <div className="">
      <div className="sm:hidden pb-2 ">
        <label htmlFor="tabs" className="sr-only">
          Navigation
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-brand-magenta focus:border-brand-magenta sm:text-sm rounded-md border border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-white"
          defaultValue={
            tabs.find((tab) => tab.current) !== undefined
              ? tabs.find((tab) => tab.current).name
              : "Impressions à traiter"
          }
          onChange={(e) => {
            router.push(e.target.value);
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.href}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200 dark:border-night-800">
          <nav className="-mb-px flex space-x-8 px-8" aria-label="Tabs">
            {tabs.map((tab, index) => {
              if (tab.show == true) {
                return (
                  <Link key={`nav-${index}`} href={tab.href}>
                    <div
                      key={tab.name}
                      className={classNames(
                        tab.current
                          ? "border-brand-magenta text-brand-magenta"
                          : "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-night-600",
                        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm " +
                          tab.classNames,
                      )}
                      aria-current={tab.current ? "page" : undefined}
                    >
                      <p>{tab.name}</p>
                      {user.specialFont ? (
                        <p className={`${user.specialFont} small`}>
                          {tab.name}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </Link>
                );
              }
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default withRouter(NavbarAdmin);
