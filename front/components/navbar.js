import Link from "next/link";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon, CubeIcon, LoginIcon } from "@heroicons/react/outline";
import { withRouter } from "next/router";
import { removeCookies } from "cookies-next";
import { logout } from "../lib/function";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navbar({ router, user, role }) {
  const pn = router.pathname;
  const navigations = [
    { name: "Accueil", href: "/", current: pn == "/" },
    //{ name: "Blog", href: "/blog", current: pn.split('/')[1] == "blog" },
  ];

  const isLogged = user != null && user.error == null;

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
                  </Disclosure.Button>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://www.fablabs.io/media/W1siZiIsIjIwMTcvMTAvMjUvMTMvNDgvMjQvZTQzZDgxMGUtM2ZiMy00MjZjLTlhNzYtOGFlYzg1ZWY1OGNjL0xPR08gREVWSU5DSSBGQUJMQUIucG5nIl0sWyJwIiwidGh1bWIiLCIzMDB4MzAwIl1d/LOGO%20DEVINCI%20FABLAB.png?sha=9ae18eebf0e6ea56"
                    alt="Fablab"
                  />
                  <img className="hidden lg:block h-8 w-auto" src={process.env.BASE_PATH + "/logo.png"} alt="Fablab" />
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}

                  {navigations.map((navigation) => {
                    return (
                      <Link href={navigation.href}>
                        <a
                          className={`${
                            navigation.current ? `border-indigo-500 text-gray-900` : `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700`
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                        >
                          {navigation.name}
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/*
                   * Ici on vérifie si l'utilisateur est connecté.
                   */}

                  {isLogged && role != null ? (
                    <Link href={role.length > 0 ? "/panel/admin" : "/panel"}>
                      <button
                        type="button"
                        className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <CubeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        <span>Panel d'impression</span>
                      </button>
                    </Link>
                  ) : (
                    <Link href="/auth">
                      <button
                        type="button"
                        className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <LoginIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        <span>Se connecter</span>
                      </button>
                    </Link>
                  )}
                </div>
                {isLogged ? (
                  <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <span className="sr-only">Open user menu</span>
                          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-500 text-lg">
                            {user == null ? "ET" : user.firstName.toString().toUpperCase()[0] + "" + user.lastName.toString().toUpperCase()[0]}
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a href="#" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                                <button
                                  onClick={() => {
                                    logout(user);
                                  }}
                                >
                                  Se déconnecter
                                </button>
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigations.map((r) => {
                return (
                  <a
                    href={r.href}
                    className={`${
                      r.current ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6`}
                  >
                    {r.name}
                  </a>
                );
              })}
            </div>
            {isLogged ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user == null ? "https://eu.ui-avatars.com/api/?name=John+Doe" : "https://eu.ui-avatars.com/api/?name=" + user.firstName[0] + "+" + user.lastName[0]}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user != null ? user.firstName + " " + user.lastName : ""}</div>
                    <div className="text-sm font-medium text-gray-500">{user != null ? user.email : ""}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <a
                    onClick={() => logout(user)}
                    className="hover:cursor-pointer block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 sm:px-6"
                  >
                    Se déconnecter
                  </a>
                </div>
              </div>
            ) : null}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default withRouter(Navbar);
