import Link from 'next/link';
import { withRouter } from 'next/router';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function NavbarAdmin({ router, role }) {
  const pn = router.pathname;
  const tabs = [
    { name: 'Demandes à traiter', href: '/panel/admin/', current: pn.split('/')[3] === undefined, show: true },
    { name: 'Historique des demandes', href: '/panel/admin/history', current: pn.split('/')[3] == 'history', show: true },
  ]

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
          defaultValue={tabs.find((tab) => tab.current) !== undefined ? tabs.find((tab) => tab.current).name : "Impressions à traiter"}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-8" aria-label="Tabs">
            {tabs.map((tab) => {
              if (tab.show == true) {
                return (
                  <Link href={tab.href}>
                    <a
                      key={tab.name}
                      className={classNames(
                        tab.current
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                      )}
                      aria-current={tab.current ? 'page' : undefined}
                    >
                      {tab.name}
                    </a></Link>
                );
              }
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default withRouter(NavbarAdmin);