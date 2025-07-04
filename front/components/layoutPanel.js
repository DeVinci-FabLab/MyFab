import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { toast } from "react-toastify";
import { Dialog, Menu, Transition, DialogPanel } from "@headlessui/react";
import {
  HomeIcon,
  Bars3CenterLeftIcon,
  BeakerIcon,
  CubeIcon,
  UsersIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import ButtonLayoutPanel from "./buttonLayoutPanel";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import LogoDvfl from "./logoDvfl";
import { logout } from "../lib/function";
import { getTextForClick } from "../lib/layoutClickText";
import { fetchAPIAuth } from "../lib/api";

import { UserUse } from "../context/provider";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function LayoutPanel({ children, authorizations, titleMenu }) {
  const router = useRouter();
  const pn = router.pathname;
  if (!authorizations) authorizations = {};
  const [openStatus, setOpenStatus] = useState(false);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [version] = useState(process.env.VERSION);

  const jwt = getCookie("jwt");

  let { user, setUser, darkMode, setDarkMode, roles } = UserUse(
    jwt,
    ({ user }) => {
      if (user.id !== 0 && !user.schoolValid) {
        fetchAPIAuth("/school/").then((school) => {
          setSchools(school.data);
          setOpenStatus(true);
        });
      }
    },
  );

  const date = new Date();

  //name = le nom qui est affiché
  //href = le lien du bouton
  //icon = l'icon du bouton
  //current = boolean pour mettre le bouton en avant pour dire qu'il est sélectionné
  //show = boolean pour montrer ou non le bouton selon les rôles de l'utilisateur
  const navigation = [
    {
      name: "Mes demandes",
      className: ["my-demand-button"],
      href: "/panel",
      icon: HomeIcon,
      current: pn === "/panel",
      show: true,
    },
    {
      name: "Gestions des demandes",
      className: ["users-demand-button"],
      href: "/panel/admin",
      icon: BeakerIcon,
      current: pn.split("/")[2] === "admin",
      show: authorizations.myFabAgent == 1,
    },
    {
      name: "Gestions des utilisateurs",
      className: ["users-button"],
      href: "/panel/users",
      icon: UsersIcon,
      current: pn === "/panel/users",
      show: authorizations.myFabAgent == 1,
    },
    {
      name: "Pannel d'administration",
      className: [],
      href: "/youClickedOnTheLogo",
      icon: UsersIcon,
      current: false,
      show: date.getMonth() === 3 && date.getDate() === 1,
    },
    //{ name: "Retourner au site", className: ["ag-button"], href: "/", icon: CubeIcon, current: false, show: true },
  ];

  const years = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
  ];

  let currentClicked = 0;
  async function clickCurrent() {
    currentClicked++;
    const results = getTextForClick(currentClicked);
    for (const result of results) {
      switch (result.type) {
        case "success":
          toast.success(result.text, result.options);
          break;
        case "warn":
          toast.warn(result.text, result.options);
          break;
        case "error":
          toast.error(result.text, result.options);
          break;
        case "wait":
          await new Promise((resolve, reject) => {
            setTimeout(resolve, result.time ? result.time : 2500);
          });
          break;

        default:
          break;
      }
    }
  }

  async function toggleDarkMode() {
    user.darkMode = !user.darkMode;
    setUser(user);
    setDarkMode(user.darkMode);

    const responseToggleDarkMode = await fetchAPIAuth({
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: process.env.API + "/api/user/darkmode/",
      params: {
        darkmode: user.darkMode,
      },
    });
  }

  async function validSchool() {
    let errorMessage = null;
    if (selectedSchool === 0)
      errorMessage = "Vous devez sélectionner une école";
    if (selectedYear === 0) errorMessage = "Vous devez sélectionner une année";
    if (errorMessage) {
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const responseValidSchool = await fetchAPIAuth({
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: process.env.API + "/api/user/school/",
      data: {
        idSchool: selectedSchool,
        year: selectedYear,
      },
    });
    if (responseValidSchool.status) {
      toast.success("Votre école et année ont été enregistrées", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      //router.push(window.location.href);
      //setOpenStatus(false);
    } else {
      toast.error("Erreur avec le serveur", {
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

  const name = user.firstName;
  const surname = user.lastName;

  const title = titleMenu ? titleMenu : "Panel de demande d'impression 3D";

  function LayoutMenu({ size, className }) {
    return (
      <div className={className}>
        <div
          className={`flex flex-col w-64 border-r pt-5 pb-4 ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          <div className="flex items-center flex-shrink-0 px-6 justify-between">
            <LogoDvfl user={user} />

            <label className="relative inline-flex items-center cursor-pointer pr-0">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                onChange={() => {
                  toggleDarkMode();
                }}
                checked={user.darkMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <div className="pl-2" />
              <MoonIcon
                className={`flex-shrink-0 h-5 w-5 ${
                  user.darkMode ? "text-indigo-500" : "text-gray-500"
                }`}
              />
            </label>
          </div>

          <div className="h-0 flex-1 flex flex-col overflow-y-auto">
            <Menu
              as="div"
              className="px-3 mt-6 relative inline-block text-left"
            >
              <div>
                <Menu.Button
                  className={`group w-full rounded-md px-3.5 py-2 text-sm text-left font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-800"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span className="flex w-full justify-between items-center">
                    <span className="flex min-w-0 items-center justify-between space-x-3">
                      <div
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                          darkMode
                            ? "bg-gray-500 text-gray-100"
                            : "bg-gray-200 text-gray-500"
                        } ${user.specialFont ? user.specialFont : ""}`}
                      >
                        {name[0].toString().toUpperCase() +
                          " " +
                          surname[0].toString().toUpperCase()}
                      </div>
                      <span className="flex-1 flex flex-col min-w-0">
                        <span
                          className={`text-sm font-medium truncate ${
                            darkMode ? "text-gray-100" : "text-gray-900"
                          } ${user.specialFont ? user.specialFont + " small" : ""}`}
                        >
                          {name + " " + surname.toUpperCase()}
                        </span>
                        <span
                          className={`text-sm truncate ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          } ${user.specialFont ? user.specialFont + " small" : ""}`}
                        >
                          {user.title || "Ancien compte"}
                        </span>
                      </span>
                    </span>
                    <ChevronUpDownIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="mt-3 space-x-1 space-y-1 text-center">
                    {roles.map((r, index) => {
                      return (
                        <span
                          key={`role-${size}-${index}`}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${user.specialFont ? user.specialFont + " small" : ""}`}
                          style={{ backgroundColor: "#" + r.color }}
                        >
                          {r.name}
                        </span>
                      );
                    })}
                  </div>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  className={`z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none ${
                    user.darkMode ? "bg-gray-600" : "bg-white"
                  }`}
                >
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={() => router.push("/panel/settings")}
                          className={classNames(
                            active
                              ? user.darkMode
                                ? "bg-gray-500 text-gray-100"
                                : "bg-gray-100 text-gray-900"
                              : user.darkMode
                                ? "text-gray-200"
                                : "text-gray-700",
                            "block px-4 py-2 text-sm cursor-pointer",
                          )}
                        >
                          <button>Mes paramètres</button>
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={() => {
                            logout(user);
                          }}
                          className={classNames(
                            active
                              ? user.darkMode
                                ? "bg-gray-500 text-gray-100"
                                : "bg-gray-100 text-gray-900"
                              : user.darkMode
                                ? "text-gray-200"
                                : "text-gray-700",
                            "block px-4 py-2 text-sm cursor-pointer",
                          )}
                        >
                          <button>Se déconnecter</button>
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <nav className="px-3 mt-6">
              <div className="space-y-1">
                {navigation.map((item, index) => {
                  if (item.show == true) {
                    if (item.current) {
                      return (
                        <a
                          key={`nav-${size}-${index}`}
                          className={`cursor-pointer`}
                          onClick={() => clickCurrent()}
                        >
                          <ButtonLayoutPanel
                            item={item}
                            suffix={size}
                            darkMode={darkMode}
                            specialFont={user.specialFont}
                          />
                        </a>
                      );
                    } else {
                      return (
                        <Link key={`nav-${size}-${index}`} href={item.href}>
                          <ButtonLayoutPanel
                            item={item}
                            suffix={size}
                            darkMode={darkMode}
                            specialFont={user.specialFont}
                          />
                        </Link>
                      );
                    }
                  }
                })}
              </div>
            </nav>
          </div>
          <span
            className="text-xs text-gray-400 text-center"
            onClick={() => router.push("https://github.com/MathieuSchl/")}
          >
            MyFab by{" "}
            <p className="underline underline-offset-2 inline cursor-pointer">
              Cody
            </p>
          </span>
          <span
            className="text-xs text-gray-400 text-center"
            onClick={() => router.push("https://github.com/eliasto/")}
          >
            Front-End by{" "}
            <p className="underline underline-offset-2 inline cursor-pointer">
              Eliasto
            </p>
          </span>
          <span className="text-xs text-gray-400 text-center">
            <p
              className="underline underline-offset-2 inline cursor-pointer"
              onClick={() => router.push("/versions/")}
            >
              version {version}
            </p>{" "}
            - fablab@devinci.fr
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-screen flex overflow-hidden ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <LayoutMenu
        size={"large"}
        className={`${sidebarOpen ? "flex flex-shrink-0 transition-opacity duration-500 ease-in-out" : "hidden lg:flex lg:flex-shrink-0"}`}
      />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div
          className={`relative flex-shrink-0 flex h-16 border-b border-gray-200 lg:hidden ${
            darkMode ? "bg-gray-700 border-gray-500" : "bg-white"
          }`}
        >
          <button
            type="button"
            className={`open-layout-button px-4 border-r  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500 lg:hidden ${
              darkMode
                ? "text-gray-100 border-gray-600"
                : "text-gray-500 border-gray-200"
            }`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div
            className={`border-b px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 ${
              darkMode ? "border-gray-600" : "border-gray-200"
            }`}
          >
            <div className="flex-1 min-w-0">
              <h1
                className={`text-lg font-medium leading-6 sm:truncate ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </h1>
              {user.specialFont ? (
                <p
                  className={`${user.specialFont} text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  {title}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="mt-4 flex sm:mt-0 sm:ml-4">
              <Link href="/panel/new">
                <button
                  type="button"
                  className={`${
                    pn.split("/")[2] == "new" ? "hidden" : "block"
                  } order-0 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:order-1 sm:ml-3`}
                >
                  <div className="inline-flex">
                    <CubeIcon width="16" height="16" className="mr-1" />
                    Créer une demande
                  </div>
                  {user.specialFont ? (
                    <p
                      className={`${user.specialFont} small text-sm text-violet-200`}
                    >
                      Créer une demande
                    </p>
                  ) : (
                    ""
                  )}
                </button>
              </Link>
            </div>
          </div>
          {children}
        </main>
      </div>

      <Dialog
        open={openStatus}
        as="div"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClose={() => {}}
      >
        <DialogPanel
          transition
          className={`w-full max-w-md rounded-xl p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[500px] sm:w-full sm:p-6 ${
            darkMode ? "bg-gray-700" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-center">
            <h1
              className={`text-3xl font-bold pb-6 ${
                darkMode ? "text-gray-200" : ""
              }`}
            >
              Informations à saisir
            </h1>
          </div>
          <div className="flex items-center justify-center sm:flex sm:items-start pb-3">
            <div className={`text-lg leading-6 font-medium`}>
              <p className={`${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                Sélectionner votre école
              </p>
              <select
                onChange={(e) => {
                  setSelectedSchool(e.target.value);
                }}
                id="type"
                name="type"
                className={`school-select mt-5 block w-full pl-3 pr-10 py-2 focus:outline-none sm:text-sm rounded-md cursor-pointer ${
                  darkMode
                    ? "text-gray-200 border-gray-500 bg-gray-600 focus:border-indigo-700 focus:ring-indigo-700"
                    : "text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              >
                <option value={0} defaultValue="">
                  (Sélectionnez votre école)
                </option>
                {schools.map((item, index) => {
                  return (
                    <option key={`school-${index}`} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-center sm:flex sm:items-start pb-3">
            <div className="text-lg leading-6 font-medium text-gray-900">
              <p className={`${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                Sélectionner votre année
              </p>
              <select
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                }}
                id="type"
                name="type"
                className={`year-select mt-5 block w-full pl-3 pr-10 py-2 focus:outline-none sm:text-sm rounded-md cursor-pointer ${
                  darkMode
                    ? "text-gray-200 border-gray-500 bg-gray-600 focus:border-indigo-700 focus:ring-indigo-700"
                    : "text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              >
                <option value={0} defaultValue="">
                  (Sélectionnez votre année)
                </option>
                {years.map((item, index) => {
                  return (
                    <option key={`year-${index}`} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className={`approve-button back-button mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm sm:col-span-2 ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-200 hover:text-gray-300"
                  : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700 hover:text-gray-500"
              }`}
              onClick={() => validSchool()}
            >
              Valider
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
