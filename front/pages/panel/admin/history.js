import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LayoutPanel from "../../../components/layoutPanel";
import NavbarAdmin from "../../../components/navbarAdmin";
import WebSocket from "../../../components/webSocket";
import Error from "../../404";
import Seo from "../../../components/seo";
import TablesAdmin from "../../../components/tablesAdmin";
import { fetchAPIAuth, parseCookies } from "../../../lib/api";
import { isUserConnected } from "../../../lib/function";
import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

export default function OverviewAdmin({ user, role, authorizations }) {
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
    else if (collumnState[collumnClicked]) newCollumnState[collumnClicked] = false;
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

    await axios({
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: process.env.API + "/api/ticket",
      params,
    })
      .then((response) => {
        setMaxPage(response.data.maxPage);
        setTicketResult(response.data.values);
      })
      .catch(() => {
        toast.error("Une erreur est survenue lors du chargement des tickets.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }

  return (
    <div>
      <WebSocket realodPage={realodPage} event={[{ name: "event-reload-tickets", action: update }]} userId={user.id} />
      {authorizations.myFabAgent ? (
        <div>
          <LayoutPanel user={user} role={role} authorizations={authorizations} titleMenu="Gestion des demandes">
            <Seo title={"Historique"} />

            <NavbarAdmin role={role} />

            <section className="">
              <div className="container px-4 mx-auto">
                <div className="flex flex-wrap -mx-4">
                  {/* Tickets à traiter */}
                  <div className="w-full md:px-6 mt-5 mb-8 lg:mb-0">
                    <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
                      <div className="mb-3 grow">
                        <div className="space-x-2">
                          <form onSubmit={handleSubmit} className="relative grow">
                            <div className="absolute inset-y-0 left-0 w-10 my-px ml-px flex items-center justify-center pointer-events-none rounded-l text-gray-500">
                              <svg className="hi-solid hi-search inline-block w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
                                className="filterInput block border placeholder-gray-400 pr-3 py-2 leading-6 w-full rounded border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 pl-10 mr-2"
                                type="text"
                                placeholder="Rechercher un ticket"
                              />
                              <button type="submit" className="w-2/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => update(true)}>
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
  const user = await fetchAPIAuth("/user/me", cookies.jwt);
  const resUserConnected = isUserConnected(user);
  if (resUserConnected) return resUserConnected;
  const role = await fetchAPIAuth("/user/role", cookies.jwt);
  const authorizations = await fetchAPIAuth("/user/authorization/", cookies.jwt);

  // Pass the data to our page via props
  return {
    props: { user, role, authorizations }, // will be passed to the page component as props
  };
}
