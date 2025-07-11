import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LayoutPanel from "../../../components/layoutPanel";
import NavbarAdmin from "../../../components/panel/navbarAdmin";
import WebSocket from "../../../components/webSocket";
import Error from "../../404";
import Seo from "../../../components/seo";
import TablesAdmin from "../../../components/tablesAdmin";
import { fetchAPIAuth, parseCookies } from "../../../lib/api";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

import { UserUse } from "../../../context/provider";

export default function OverviewAdmin({ authorizations }) {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);

  const router = useRouter();

  function realodPage() {
    router.replace(router.asPath);
    getAuth();

    async function getAuth() {
      const jwt = getCookie("jwt");
      const authorizations = await fetchAPIAuth("/user/authorization/", jwt);
      if (authorizations.myFabAgent) {
        update();
      } else {
        setTicketResult([]);
      }
    }
  }

  const [inputValue, setInputValue] = useState("");
  const [maxPage, setMaxPage] = useState(1);
  const [actualPage, setActualPage] = useState(0);
  const [collumnState, setCollumnState] = useState({});
  let newActualPage = 0;
  const [ticketResult, setTicketResult] = useState([]);

  useEffect(function () {
    if (authorizations.myFabAgent) {
      update();
    }
  }, []);

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

  async function update(newReserch, newCollumnState) {
    const actualCollumnState = newCollumnState ? newCollumnState : collumnState;
    const keys = Object.keys(actualCollumnState);
    if (newReserch) setActualPage(0);
    const jwt = getCookie("jwt");
    const params = { page: newActualPage, inputValue };
    if (keys.length === 1) {
      params["collumnName"] = keys[0];
      params["order"] = actualCollumnState[keys[0]];
    }

    const responseTickets = await fetchAPIAuth({
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: process.env.API + "/api/ticket",
      params,
    });

    if (!responseTickets.error) {
      setMaxPage(responseTickets.data.maxPage);
      setTicketResult(responseTickets.data.values);
    } else {
      toast.error("Une erreur est survenue lors du chargement des tickets.", {
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

  return (
    <div>
      <WebSocket
        realodPage={realodPage}
        event={[{ name: "event-reload-tickets", action: update }]}
        userId={user.id}
      />
      {authorizations.myFabAgent ? (
        <div>
          <LayoutPanel
            authorizations={authorizations}
            titleMenu={"Gestion des demandes"}
          >
            <Seo title={"Historique"} />

            <NavbarAdmin darkMode={darkMode} />

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
                          <form
                            onSubmit={handleSubmit}
                            className="relative grow"
                          >
                            <div
                              className={`absolute inset-y-0 left-0 w-10 my-px ml-px flex items-center justify-center pointer-events-none rounded-l ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
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
                            <div className="w-full inline-flex">
                              <input
                                onChange={(e) => {
                                  setInputValue(e.target.value);
                                }}
                                className={`filterInput block border pr-3 py-2 leading-6 w-full rounded focus:ring focus:ring-opacity-50 pl-10 mr-2 ${
                                  darkMode
                                    ? "placeholder-gray-300 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                                    : "placeholder-gray-400 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                }`}
                                type="text"
                                placeholder="Rechercher un ticket"
                              />
                              <button
                                type="submit"
                                className="w-2/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => update(true)}
                              >
                                Rechercher
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <TablesAdmin
                      tickets={ticketResult}
                      isDone={false}
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
          </LayoutPanel>
        </div>
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
    }, // will be passed to the page component as props
  };
}
