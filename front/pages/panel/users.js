import {
  InformationCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import router from "next/router";
import { useEffect, useState } from "react";
import LayoutPanel from "../../components/layoutPanel";
import UserTablesAdmin from "../../components/tablesUserAdmin";
import WebSocket from "../../components/webSocket";
import Error from "../404";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { Fragment } from "react";
import { Dialog, DialogPanel, Transition, Disclosure } from "@headlessui/react";
import { getCookie } from "cookies-next";
import { setZero, isUserConnected } from "../../lib/function";
import { toast } from "react-toastify";
import Seo from "../../components/seo";
import { PlusIcon } from "@heroicons/react/24/solid";

import { UserUse } from "../../context/provider";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Settings({ authorizations, rolesList }) {
  const jwt = getCookie("jwt");
  const { user: me, darkMode } = UserUse(jwt);

  const [open, setOpen] = useState(false);
  const [data, setData] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [maxPage, setMaxPage] = useState(1);
  const [actualPage, setActualPage] = useState(0);
  const [collumnState, setCollumnState] = useState({});
  let newActualPage = 0;
  const [usersListResult, setUsersListResult] = useState([]);
  const [allRole, setAllRole] = useState([]);
  const [userRole, setUserRole] = useState({ data: [] });

  function realodPage() {
    router.replace(router.asPath);
    getAuth();

    async function getAuth() {
      const jwt = getCookie("jwt");
      const authorizations = await fetchAPIAuth("/user/authorization/", jwt);
      if (authorizations.data.viewUsers) {
        update();
      } else {
        setUsersListResult([]);
      }
    }
  }

  useEffect(function () {
    if (authorizations.viewUsers) {
      update();
    }
  }, []);

  async function update(newReserch, newCollumnState) {
    const actualCollumnState = newCollumnState ? newCollumnState : collumnState;
    const keys = Object.keys(actualCollumnState);
    if (newReserch) setActualPage(0);
    const params = { page: newActualPage, inputValue };
    if (keys.length === 1) {
      params["collumnName"] = keys[0];
      params["order"] = actualCollumnState[keys[0]];
    }

    const cookie = getCookie("jwt");
    const responseGetUsers = await fetchAPIAuth({
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: cookie,
      },

      url: process.env.API + "/api/user",
      params,
    });

    if (!responseGetUsers.error) {
      setMaxPage(responseGetUsers.data.maxPage);
      setUsersListResult(responseGetUsers.data.values);
    } else {
      toast.error(
        "Une erreur est survenue lors du chargement des utilisateurs.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        },
      );
    }
  }

  function nextPrevPage(addPage) {
    if (actualPage + addPage < 0 || actualPage + addPage >= maxPage) return;
    setActualPage(actualPage + addPage);
    newActualPage = actualPage + addPage;
    update();
  }

  function changeCollumnState(collumnClicked) {
    const newCollumnState = {};
    if (!collumnState[collumnClicked]) newCollumnState[collumnClicked] = true;
    else if (collumnState[collumnClicked])
      newCollumnState[collumnClicked] = false;
    setCollumnState(newCollumnState);
    update(true, newCollumnState);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // send state to server with e.g. `window.fetch`
    update(true);
  }

  async function settingModal(id) {
    const cookie = getCookie("jwt");

    var allRoles = [...rolesList];
    const user = await fetchAPIAuth("/user/" + id, cookie);
    const userRole = await fetchAPIAuth("/user/" + id + "/role", cookie);

    for (let i = 0; i < userRole.data.length; i++) {
      for (let j = 0; j < allRoles.length; j++) {
        if (userRole.data[i].id == allRoles[j].id) {
          allRoles = allRoles.filter((e) => e.id != userRole.data[i].id);
        }
      }
    }

    setUserRole(userRole);
    setAllRole(allRoles);
    setData(user.data);
    setOpen(true);
  }

  return (
    <div>
      <WebSocket
        realodPage={realodPage}
        event={[{ name: "event-reload-users", action: update }]}
        userId={me.id}
      />
      {authorizations.viewUsers ? (
        <LayoutPanel
          authorizations={authorizations}
          titleMenu="Gestion des utilisateurs"
        >
          <Seo title={"Paramètres administrateurs"} />
          <section className="">
            <div className="container px-4 mx-auto">
              <div className="flex flex-wrap -mx-4">
                {/* Tickets à traiter */}
                <div className="w-full md:px-6 mt-5 mb-8 lg:mb-0">
                  <div
                    className={`flex flex-col rounded shadow-sm overflow-hidden ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="mb-3 grow">
                      <div className="space-x-2">
                        <div className="relative grow">
                          <form onSubmit={handleSubmit}>
                            <Disclosure as="div">
                              {({ open }) => (
                                <>
                                  <div className="relative grow">
                                    <div className="absolute inset-y-5 left-0 w-10 my-px ml-px flex items-center justify-center pointer-events-none rounded-l text-gray-500">
                                      <svg
                                        className="hi-solid hi-search inline-block w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  </div>

                                  <div className="w-full inline-flex">
                                    <input
                                      onChange={(e) => {
                                        setInputValue(e.target.value);
                                      }}
                                      className={`search-input filterInput block border pr-3 py-2 leading-6 w-full rounded focus:ring focus:ring-opacity-50 pl-10 mr-2 ${
                                        darkMode
                                          ? "placeholder-gray-300 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                                          : "placeholder-gray-400 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                      }`}
                                      type="text"
                                      placeholder="Rechercher un étudiant"
                                    />
                                    <button
                                      type="submit"
                                      className="search-validation-button w-2/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                      onClick={() => update(true)}
                                    >
                                      Rechercher
                                    </button>
                                    <div className="w-2/12 flex items-center">
                                      <>
                                        <Disclosure.Button className="roles-list-button text-left w-full flex justify-between items-start px-4">
                                          <h3
                                            className={`text-xl font-bold ${
                                              darkMode ? "text-gray-200" : ""
                                            }`}
                                          >
                                            Roles
                                          </h3>
                                          <span className="ml-6 h-7 flex items-center">
                                            <ChevronDownIcon
                                              className={classNames(
                                                open
                                                  ? "-rotate-180"
                                                  : "rotate-0",
                                                "h-6 w-6 transform duration-300 text-gray-400",
                                              )}
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </Disclosure.Button>
                                      </>
                                    </div>
                                  </div>
                                  <Transition
                                    enter="transition duration-150 ease-out"
                                    enterFrom="transform scale-75 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-150 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-75 opacity-0"
                                  >
                                    <Disclosure.Panel as="div" className="mt-2">
                                      <div className="grid grid-cols-3 gap-4">
                                        {rolesList.map((role, index) => {
                                          return (
                                            <div
                                              key={`role-${index}`}
                                              className="border rounded"
                                              style={{
                                                borderColor: "#" + role.color,
                                              }}
                                            >
                                              <p
                                                className="text-center bg-gray-200"
                                                style={{
                                                  backgroundColor:
                                                    "#" + role.color,
                                                }}
                                              >
                                                {role.name}
                                              </p>
                                              <p
                                                className={`role-description-p p-2 text-justify ${
                                                  darkMode
                                                    ? "text-gray-200"
                                                    : ""
                                                }`}
                                              >
                                                {role.description}
                                              </p>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </Disclosure.Panel>
                                  </Transition>
                                </>
                              )}
                            </Disclosure>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <UserTablesAdmin
                    users={usersListResult}
                    id={settingModal}
                    maxPage={maxPage}
                    actualPage={actualPage}
                    nextPrevPage={nextPrevPage}
                    collumnState={collumnState}
                    changeCollumnState={changeCollumnState}
                    darkMode={darkMode}
                  />
                </div>
              </div>
            </div>
          </section>
          <Dialog
            open={open}
            as="div"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClose={setOpen}
          >
            <DialogPanel
              transition
              className={`duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 w-8/12`}
            >
              <div
                className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
                onClick={(e) => {
                  if (e.target == e.currentTarget) setOpen(false);
                }}
              >
                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div
                  className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6 ${
                    darkMode ? "bg-gray-600" : "bg-white"
                  }`}
                >
                  <div>
                    <div
                      className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                        darkMode ? "bg-blue-300" : "bg-blue-100"
                      }`}
                    >
                      <InformationCircleIcon
                        className={`h-6 w-6 ${
                          darkMode ? "text-blue-800" : "text-blue-600"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className={`text-lg leading-6 font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        <p>
                          Utilisateur <strong>#{setZero(data.id)}</strong>:{" "}
                          {data.firstName} {data.lastName}
                        </p>
                        <div>
                          {data.title
                            ? `${data.b_isold ? "Aciennement " : ""}${data.title}`
                            : "Ancien compte"}
                        </div>
                        <div>
                          <div className="space-x-1 text-center">
                            {userRole.data.map((r, index) => {
                              const buttonAvailable =
                                data.id === me.id
                                  ? false
                                  : r.isProtected === 1
                                    ? authorizations.changeUserProtectedRole
                                    : authorizations.changeUserRole;
                              return (
                                <span
                                  key={`user-role-${index}`}
                                  className="user-role inline-flex items-center py-0.5 pl-2 pr-0.5 rounded-full text-xs font-medium text-white"
                                  style={{
                                    backgroundColor: "#" + r.color,
                                    paddingRight: buttonAvailable ? "" : "8px",
                                  }}
                                >
                                  {r.name}
                                  {buttonAvailable ? (
                                    <button
                                      onClick={async () => {
                                        setUserRole({
                                          data: userRole.data.filter(
                                            (e) => e != r,
                                          ),
                                        });
                                        var array = allRole;
                                        array.push(r);
                                        setAllRole(array);

                                        const responseDeleteUserRole =
                                          await fetchAPIAuth({
                                            method: "DELETE",
                                            headers: {
                                              Accept: "application/json",
                                              "Content-Type":
                                                "application/json",
                                              dvflCookie: getCookie("jwt"),
                                            },

                                            url:
                                              process.env.API +
                                              "/api/user/" +
                                              data.id +
                                              "/role/" +
                                              r.id,
                                          });

                                        if (
                                          responseDeleteUserRole.status == 200
                                        ) {
                                          toast.success(
                                            "Le rôle " +
                                              r.name +
                                              " a été supprimé à l'utilisateur #" +
                                              setZero(data.id),
                                            {
                                              position: "top-right",
                                              autoClose: 3000,
                                              hideProgressBar: true,
                                              closeOnClick: true,
                                              pauseOnHover: true,
                                              draggable: true,
                                              progress: undefined,
                                            },
                                          );
                                        } else {
                                          toast.error(
                                            "Une erreur est survenue. Impossible de supprimer le rôle",
                                            {
                                              position: "top-right",
                                              autoClose: 3000,
                                              hideProgressBar: true,
                                              closeOnClick: true,
                                              pauseOnHover: true,
                                              draggable: true,
                                              progress: undefined,
                                            },
                                          );
                                        }
                                      }}
                                      type="button"
                                      className="remove-role-button flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-white hover:bg-gray-200 hover:text-gray-500 focus:outline-none focus:bg-gray-500 focus:text-white"
                                    >
                                      <span className="sr-only">
                                        Remove small option
                                      </span>
                                      <svg
                                        className="h-2 w-2"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 8 8"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeWidth="1.5"
                                          d="M1 1l6 6m0-6L1 7"
                                        />
                                      </svg>
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </Dialog.Title>
                      <div className="mt-2">
                        <form className="space-y-8 divide-y divide-gray-200">
                          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                            <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
                              <div className="space-y-6 sm:space-y-5">
                                <div className="sm:grid sm:grid-cols-3  sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                  <label
                                    className={`block text-sm font-medium sm:pt-1 ${
                                      darkMode
                                        ? "text-gray-200"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    <p>Prénom</p>
                                    {me.specialFont ? (
                                      <p
                                        className={`${me.specialFont} small text-gray-400`}
                                      >
                                        Prénom
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </label>
                                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <p
                                      className={`text-left self-end justify-end ${
                                        darkMode ? "text-gray-200" : ""
                                      }`}
                                    >
                                      {data.firstName}
                                    </p>
                                  </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3  sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                  <label
                                    className={`block text-sm font-medium sm:pt-1 ${
                                      darkMode
                                        ? "text-gray-200"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    <p>Nom</p>
                                    {me.specialFont ? (
                                      <p
                                        className={`${me.specialFont} small text-gray-400`}
                                      >
                                        Nom
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </label>
                                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <p
                                      className={`text-left self-end justify-end ${
                                        darkMode ? "text-gray-200" : ""
                                      }`}
                                    >
                                      {data.lastName}
                                    </p>
                                  </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3  sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                  <label
                                    className={`block text-sm font-medium sm:pt-1 ${
                                      darkMode
                                        ? "text-gray-200"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    <p>E-mail</p>
                                    {me.specialFont ? (
                                      <p
                                        className={`${me.specialFont} small text-gray-400`}
                                      >
                                        E-mail
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </label>
                                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <p
                                      className={`text-left self-end justify-end ${
                                        darkMode ? "text-gray-200" : ""
                                      }`}
                                    >
                                      {data.email}
                                    </p>
                                  </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                  <label
                                    className={`block text-sm font-medium sm:pt-1 ${
                                      darkMode
                                        ? "text-gray-200"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    <p>Rôle disponible</p>
                                    {me.specialFont ? (
                                      <p
                                        className={`${me.specialFont} small text-gray-400`}
                                      >
                                        Rôle disponible
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </label>
                                  <div className="mt-1 sm:mt-0 sm:col-span-2 space-x-1">
                                    {allRole.map((r, index) => {
                                      const buttonAvailable =
                                        data.id === me.id
                                          ? false
                                          : r.isProtected === 1
                                            ? authorizations.changeUserProtectedRole
                                            : authorizations.changeUserRole;
                                      return (
                                        <span
                                          key={`role-${index}`}
                                          className="available-role inline-flex items-center py-0.5 pl-2 pr-0.5 rounded-full text-xs font-medium text-white"
                                          style={{
                                            backgroundColor: "#" + r.color,
                                            paddingRight: buttonAvailable
                                              ? ""
                                              : "8px",
                                          }}
                                        >
                                          {r.name}
                                          {buttonAvailable ? (
                                            <button
                                              onClick={async () => {
                                                setAllRole(
                                                  allRole.filter((e) => e != r),
                                                );
                                                var array = userRole.data;
                                                array.push(r);
                                                setUserRole({ data: array });

                                                const responseAddUserRole =
                                                  await fetchAPIAuth({
                                                    method: "POST",
                                                    headers: {
                                                      Accept:
                                                        "application/json",
                                                      "Content-Type":
                                                        "application/json",
                                                      dvflCookie:
                                                        getCookie("jwt"),
                                                    },

                                                    url:
                                                      process.env.API +
                                                      "/api/user/" +
                                                      data.id +
                                                      "/role/" +
                                                      r.id,
                                                  });

                                                if (
                                                  responseAddUserRole.status ==
                                                  200
                                                ) {
                                                  if (
                                                    responseAddUserRole.status ==
                                                    200
                                                  ) {
                                                    toast.success(
                                                      "Le rôle " +
                                                        r.name +
                                                        " a été ajouté à l'utilisateur #" +
                                                        setZero(data.id),
                                                      {
                                                        position: "top-right",
                                                        autoClose: 3000,
                                                        hideProgressBar: true,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                      },
                                                    );
                                                  }
                                                } else {
                                                  toast.error(
                                                    "Une erreur est survenue. Impossible d'ajouter le rôle",
                                                    {
                                                      position: "top-right",
                                                      autoClose: 3000,
                                                      hideProgressBar: true,
                                                      closeOnClick: true,
                                                      pauseOnHover: true,
                                                      draggable: true,
                                                      progress: undefined,
                                                    },
                                                  );
                                                }
                                              }}
                                              type="button"
                                              className="add-role-button flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-white hover:bg-gray-200 hover:text-gray-500 focus:outline-none focus:bg-gray-500 focus:text-white"
                                            >
                                              <span className="sr-only">
                                                Remove small option
                                              </span>
                                              <PlusIcon className="h-2 w-2" />
                                            </button>
                                          ) : (
                                            ""
                                          )}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="validate-button inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Valider les changements
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </LayoutPanel>
      ) : (
        <div>
          <Error />
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  const authorizations = cookies.jwt
    ? await fetchAPIAuth("/user/authorization/", cookies.jwt)
    : null;
  const rolesList = await fetchAPIAuth("/role", cookies.jwt);
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

  // Pass the data to our page via props
  return {
    props: {
      authorizations: authorizations.data,
      rolesList: rolesList.data,
    }, // will be passed to the page component as props
  };
}
