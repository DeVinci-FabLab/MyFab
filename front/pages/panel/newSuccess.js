import Link from "next/link";
import React from "react";
import { Fragment, useState } from "react";
import LayoutPanel from "../../components/layoutPanel";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { setZero, isUserConnected } from "../../lib/function";
import Seo from "../../components/seo";
import { Dialog, Transition } from "@headlessui/react";
import { StlViewer } from "react-stl-viewer";
import { CubeIcon } from "@heroicons/react/outline";
import { getCookie } from "cookies-next";
import axios from "axios";
import { toast } from "react-toastify";
import router from "next/router";
import WebSocket from "../../components/webSocket";

import { UserUse } from "../../context/provider";

const fabColor = ["D51D65", "F5841D", "2CA0BB"];

export default function NewPanel({ ticket, file, authorizations }) {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);

  const [open, setOpen] = useState(false);
  const [ticketFile, setTicketFile] = useState({});
  const [urlStl, setUrlStl] = useState("");
  const [STLColor, setSTLColor] = useState("#FF0000");
  const ticketLink = "/panel/" + ticket.id;

  function realodPage() {
    router.replace(router.asPath);
  }

  async function saveFileData() {
    setOpen(false);

    const cookie = getCookie("jwt");
    const responsePutTicket = await fetchAPIAuth({
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: cookie,
      },
      url: process.env.API + "/api/file/" + ticketFile.id,
      data: {
        comment: ticketFile.comment,
        idprinter: ticketFile.idprinter,
      },
    });
    if (responsePutTicket.error) {
      toast.error("Une erreur est survenue, veuillez réessayer.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (process.env.IS_TEST_MODE === "true") {
      //Used for e2e test
      toast.success("Le commentaire du fichier a été enregistré.", {
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

  async function changeSTLColor() {
    setSTLColor("#" + fabColor[Math.floor(Math.random() * fabColor.length)]);
  }

  async function getUrlSTL(id) {
    if (process.env.IS_TEST_MODE === "true")
      return setUrlStl(
        "https://storage.googleapis.com/ucloud-v3/ccab50f18fb14c91ccca300a.stl"
      );

    const cookie = getCookie("jwt");
    await axios({
      method: "GET",
      url: process.env.API + "/api/file/" + id + "/getToken",
      headers: {
        dvflCookie: cookie,
      },
    }).then((response) => {
      setUrlStl(process.env.API + "/api/file/" + response.data);
    });
  }

  return (
    <LayoutPanel
      authorizations={authorizations}
      titleMenu="Récapitulatif de la demande"
    >
      <Seo title={"Nouvelle demande créé"} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />

      <div className="py-6 px-3">
        <div className="mx-auto sm:px-6 lg:px-8 lg:gap-8">
          <main className="col-span-9">
            <div className="container px-4 mx-auto">
              <div className="flex flex-wrap -mx-4">
                <div
                  className={`shadow overflow-hidden sm:rounded-lg w-full lg:w-2/3 px-4 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="px-4 py-5 sm:px-6">
                    <h3
                      className={`text-lg leading-6 font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      La demande {"#" + setZero(ticket.id)} à été créé
                    </h3>
                  </div>
                  <div
                    className={`border-t px-4 py-5 sm:p-0 ${
                      darkMode ? "border-gray-600" : "border-gray-200"
                    }`}
                  >
                    <p className={`p-5 ${darkMode ? "text-gray-200" : ""}`}>
                      Les membres du DeVinci FabLab traiteons la demande le dès
                      que possible. Vous pouvez suivre l'avancée de la demande
                      sur cette plateforme.
                    </p>
                    <p className={`p-5 ${darkMode ? "text-gray-200" : ""}`}>
                      Vous pouvez rajouter des notes sur les fichiers stl pour
                      par exemple demander plusieurs impression pour un même
                      fichier, une couleur d'impression spécifique, ...
                    </p>
                    <div className="flex justify-center mb-4">
                      <Link href={ticketLink}>
                        <button
                          type="button"
                          className={`continue-button order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:order-1 sm:ml-3`}
                        >
                          Continuer
                        </button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-6 gap-5 p-5 ">
                      {file.map((r, index) => {
                        return (
                          <div
                            key={`file-${index}`}
                            className={`col-span-6 mt-5 bg-opacity-50 border rounded shadow-lg cursor-pointer backdrop-blur-20 to-gray-50 md:col-span-3 lg:col-span-2 pl-3 pr-4 py-3 ${
                              darkMode
                                ? "border-gray-600 bg-gray-600"
                                : "border-gray-100"
                            }`}
                          >
                            <div className="w-0 flex-1 flex items-center">
                              <CubeIcon
                                className={`flex-shrink-0 h-5 w-5 ${
                                  darkMode ? "text-gray-200" : "text-gray-400"
                                }`}
                                aria-hidden="true"
                              />
                              <span
                                className={`ml-2 flex-1 ${
                                  darkMode ? "text-gray-100" : ""
                                }`}
                              >
                                {r.filename}
                              </span>
                            </div>
                            <div className="flex justify-center mt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  changeSTLColor();
                                  setTicketFile(r);
                                  getUrlSTL(r.id);
                                  setOpen(true);
                                }}
                                className={`file-button order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:order-1 sm:ml-3`}
                              >
                                Mettre un commentaire
                              </button>
                            </div>
                            {r.comment != "" ? (
                              <div className="pl-3 pr-4 flex mb-3 items-center justify-between text-sm mt-2">
                                <p
                                  className={`text-ellipsis overflow-hidden ${
                                    darkMode ? "text-gray-100" : ""
                                  }`}
                                >
                                  <span className="font-medium">
                                    Commentaire{" "}
                                  </span>
                                  : {r.comment}
                                </p>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/3 px-4 space-y-4">
                  <div
                    className={`shadow overflow-hidden sm:rounded-lg ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="px-4 py-5 sm:px-6">
                      <h3
                        className={`text-lg leading-6 font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Détails de la demande d'impression
                      </h3>
                      <p
                        className={`mt-1 max-w-2xl text-sm ${
                          darkMode ? "text-gray-200" : "text-gray-500"
                        }`}
                      >
                        Ticket n° {ticket.id}
                      </p>
                    </div>
                    <div
                      className={`border-t px-4 py-5 sm:p-0 ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <dl
                        className={`sm:divide-y ${
                          darkMode ? "sm:divide-gray-700" : "sm:divide-gray-200"
                        }`}
                      >
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt
                            className={`text-sm font-medium ${
                              darkMode ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            Utilisateur
                          </dt>
                          <dd
                            className={`mt-1 text-sm sm:mt-0 sm:col-span-2 flex justify-between ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            <div>
                              {ticket.userName}
                              <p
                                className={`mt-1 max-w-2xl text-sm ${
                                  darkMode ? "text-gray-200" : "text-gray-500"
                                }`}
                              >
                                {ticket.title || "Ancien compte"}
                              </p>
                            </div>
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt
                            className={`text-sm font-medium ${
                              darkMode ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            Numéro de groupe
                          </dt>
                          <dd
                            className={`mt-1 text-sm sm:mt-0 sm:col-span-2 flex justify-between ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {ticket.groupNumber
                              ? ticket.groupNumber
                              : "Ce projet n'est pas en groupe"}
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt
                            className={`text-sm font-medium ${
                              darkMode ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            Type
                          </dt>
                          <dd
                            className={`mt-1 text-sm sm:mt-0 sm:col-span-2 flex justify-between ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            <div>{ticket.projectType}</div>
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt
                            className={`text-sm font-medium ${
                              darkMode ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            Status
                          </dt>
                          <dd
                            className={`mt-1 text-sm sm:mt-0 sm:col-span-2 flex justify-between ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            <div>{ticket.statusName}</div>
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt
                            className={`text-sm font-medium ${
                              darkMode ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            Fichiers
                          </dt>
                          <dd
                            className={`mt-1 text-sm sm:mt-0 sm:col-span-2 flex justify-between ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            <div>
                              Ce ticket comporte {file.length} fichier
                              {file.length > 1 ? "s" : ""} :
                              {file.map((r, index) => {
                                return (
                                  <p
                                    key={`fileName-${index}`}
                                    className={`mt-1 max-w-2xl text-sm ${
                                      darkMode
                                        ? "text-gray-200"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    - {r.filename}
                                  </p>
                                );
                              })}
                            </div>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={saveFileData}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[50%] sm:w-full sm:max-h-max sm:h-full sm:p-6 ${
                  darkMode ? "bg-gray-600" : "bg-white"
                }`}
              >
                <div>
                  <p
                    className={`text-center font-medium ${
                      darkMode ? "text-gray-100" : ""
                    }`}
                  >
                    Aperçu du fichier STL:
                  </p>
                  <p
                    className={`text-sm text-center ${
                      darkMode ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    {ticketFile.filename}
                  </p>
                  <center>
                    <StlViewer
                      style={{
                        top: 0,
                        left: 0,
                        width:
                          typeof window !== "undefined"
                            ? (window.innerWidth / 100) * 45
                            : 300,
                        height:
                          typeof window !== "undefined"
                            ? window.innerHeight / 2.2
                            : 200,
                      }}
                      modelProps={{ color: STLColor }}
                      orbitControls={true}
                      url={urlStl}
                    />

                    <div>
                      <p
                        className={`text-center font-medium ${
                          darkMode ? "text-gray-100" : ""
                        }`}
                      >
                        Commentaire:
                      </p>
                      <textarea
                        id="comment"
                        name="comment"
                        rows={3}
                        onChange={(e) => {
                          ticketFile.comment = e.target.value;
                          setTicketFile(ticketFile);
                        }}
                        className={`comment-textarea mt-5 max-w-lg shadow-sm block w-full sm:text-sm border rounded-md ${
                          darkMode
                            ? "border-gray-500 bg-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        }`}
                        defaultValue={ticketFile.comment}
                      />
                    </div>
                  </center>
                </div>
                <div className="mt-5 sm:mt-6 justify-center">
                  <button
                    type="button"
                    className="close-button inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => {
                      saveFileData();
                    }}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </LayoutPanel>
  );
}

const defaultTicket = {
  id: 1,
  userName: "Ticket inconnu",
  title: "Ticket inconnu",
  groupNumber: 0,
  projectType: "Inconnu",
  statusName: "Inconnu",
};

export async function getServerSideProps({ req, query }) {
  const cookies = parseCookies(req);
  const authorizations = cookies.jwt
    ? await fetchAPIAuth("/user/authorization/", cookies.jwt)
    : null;
  const highDemand = cookies.jwt
    ? await fetchAPIAuth("/ticket/highDemand/", cookies.jwt)
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

  const idTicket = query.id;
  const ticket = await fetchAPIAuth("/ticket/" + idTicket, cookies.jwt);
  const file = await fetchAPIAuth("/ticket/" + idTicket + "/file", cookies.jwt);

  return {
    props: {
      ticket: ticket.data ? ticket.data : defaultTicket,
      file: file.data ? file.data : [],
      authorizations: authorizations.data,
    }, // will be passed to the page component as props
  };
}
