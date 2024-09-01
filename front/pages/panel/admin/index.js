import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LayoutPanel from "../../../components/layoutPanel";
import NavbarAdmin from "../../../components/panel/navbarAdmin";
import OverviewAdmin from "../../../components/overviewAdmin";
import WebSocket from "../../../components/webSocket";
import Seo from "../../../components/seo";
import Error from "../../404";
import { fetchAPIAuth, parseCookies } from "../../../lib/api";
import { getCookie } from "cookies-next";
import { isUserConnected } from "../../../lib/function";
import { toast } from "react-toastify";

import { UserUse } from "../../../context/provider";

export default function Admin({ authorizations }) {
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

  const [maxPage, setMaxPage] = useState(1);
  const [actualPage, setActualPage] = useState(0);
  const [collumnState, setCollumnState] = useState({});
  let newActualPage = 0;
  const [ticketResult, setTicketResult] = useState([]);

  useEffect(function () {
    if (user.error != undefined) {
      router.push("/404");
    } else if (!user.acceptedRule) {
      router.push("/rules");
    }
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

  async function update(newReserch, newCollumnState) {
    const actualCollumnState = newCollumnState ? newCollumnState : collumnState;
    const keys = Object.keys(actualCollumnState);
    if (newReserch) setActualPage(0);
    const jwt = getCookie("jwt");
    const params = { page: newActualPage, selectOpenOnly: true };
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
      <LayoutPanel
        authorizations={authorizations}
        titleMenu={"Gestion des demandes"}
      >
        <Seo title={"Administration"} />
        <NavbarAdmin />
        <div className="md:py-8 md:px-6">
          <div className="container px-8 md:px-16 py-8 mx-auto bg-gradient-to-r from-blue-400 to-indigo-500">
            <h2 className="text-2xl font-bold text-white">
              Bonjour, {user.firstName} 👋{" "}
            </h2>
            <h3 className="text-md font-medium text-white">
              {ticketResult.length === 0
                ? `Il n'y a aucune demande d'impression en cours. Le FabLapinou te remercie. 🐰`
                : `Il y a ${ticketResult.length} impression${
                    ticketResult.length > 1 ? "s" : ""
                  } à traiter. N'hésite pas à
                t'en occuper !`}
            </h3>
          </div>
        </div>
        <OverviewAdmin
          tickets={ticketResult}
          maxPage={maxPage}
          actualPage={actualPage}
          nextPrevPage={nextPrevPage}
          collumnState={collumnState}
          changeCollumnState={changeCollumnState}
          darkMode={darkMode}
        />
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
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }

  return {
    props: {
      authorizations: authorizations.data,
    }, // will be passed to the page component as props
  };
}
