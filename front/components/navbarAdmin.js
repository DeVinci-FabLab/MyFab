import Link from "next/link";
import { withRouter } from "next/router";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavbarAdmin({ router, role }) {
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
  ];

  return (
    <div className="">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Navigation
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          defaultValue={
            tabs.find((tab) => tab.current) !== undefined
              ? tabs.find((tab) => tab.current).name
              : "Impressions à traiter"
          }
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-8" aria-label="Tabs">
            {tabs.map((tab, index) => {
              if (tab.show == true) {
                return (
                  <Link key={`nav-${index}`} href={tab.href}>
                    <p
                      key={tab.name}
                      className={classNames(
                        tab.current
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm " +
                          tab.classNames,
                      )}
                      aria-current={tab.current ? "page" : undefined}
                    >
                      {tab.name}
                    </p>
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
