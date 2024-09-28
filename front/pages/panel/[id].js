import { fetchAPIAuth, parseCookies } from "../../lib/api";
import LayoutPanel from "../../components/layoutPanel";
import Seo from "../../components/seo";
import WebSocket from "../../components/webSocket";
import {
  CubeIcon,
  UserCircleIcon,
  CogIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, Fragment, useState } from "react";
import { StlViewer } from "react-stl-viewer";
import { Dialog, Transition, DialogPanel } from "@headlessui/react";
import { getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { setZero, isUserConnected } from "../../lib/function";
import { format } from "../../lib/date";

import { UserUse } from "../../context/provider";

const colors = {
  "2274e0": "text-gray-700 bg-gray-200",
  e9d41d: "text-amber-700 bg-amber-200",
  f30b0b: "text-white bg-gradient-to-r from-amber-400 to-red-500",
};
const fabColor = ["D51D65", "F5841D", "2CA0BB"];

const GestionTicket = ({
  params,
  ticket,
  file,
  message,
  authorizations,
  id,
  status,
  projectType,
  printers,
  is_test_mode,
}) => {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);

  const [open, setOpen] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [newParam, setNewParam] = useState("");
  const [paramType, setparamType] = useState("status");
  const [urlStl, setUrlStl] = useState("");
  const [ticketFile, setTicketFile] = useState({});
  const [comment, setComment] = useState("");
  const [STLColor, setSTLColor] = useState("#FF0000");

  const router = useRouter();
  function realodPage() {
    router.replace(router.asPath);
  }

  for (let index = 0; index < file.length; index++) {
    file[index].changed = false;
  }
  const printerObject = {};
  for (const printer of printers) {
    printerObject[printer.id] = printer.name;
  }

  // Si l'id du ticket est invalid (un string par exemple) la page 404 va être affiché
  useEffect(function () {
    if (ticket.error) {
      if (isNaN(id)) {
        router.push("/404");
      } else {
        router.push("/403");
      }
      return;
    }
  }, []);
  if (file.error) file = [];
  if (message.error) message = [];

  async function change() {
    const cookie = getCookie("jwt");
    const data = {};
    data[paramType === "status" ? "idStatus" : "projecttype"] = newParam;

    const responseUpdateTicket = await fetchAPIAuth({
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: cookie,
      },
      url:
        process.env.API +
        "/api/ticket/" +
        params.id +
        "/" +
        (paramType === "status" ? "setStatus" : "setProjecttype") +
        "/",
      params: data,
    });

    if (!responseUpdateTicket.error) {
      toast.success(
        paramType === "status"
          ? "Le status du ticket a été mis à jour"
          : "Le type de projet à été modifié",
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
      realodPage();
    } else {
      toast.error("Une erreur est survenue, veuillez réessayer.", {
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

  async function cancelTicket() {
    const cookie = getCookie("jwt");

    const responseCancelTicket = await fetchAPIAuth({
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: cookie,
      },
      url: process.env.API + "/api/ticket/" + params.id + "/setCancelStatus/",
      params,
    });

    if (!responseCancelTicket.error) {
      toast.success("La demande a été annulée", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      realodPage();
    } else {
      toast.error("Une erreur est survenue, veuillez réessayer.", {
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

  async function download(id, name) {
    const cookie = getCookie("jwt");
    const options =
      process.env.IS_TEST_MODE !== "true"
        ? {
            method: "GET",
            responseType: "blob",
            url: process.env.API + "/api/file/" + id,
            headers: {
              dvflCookie: cookie,
            },
          }
        : {
            method: "GET",
            responseType: "blob",
            url: process.env.BASE_PATH + "/stl/cube.stl",
          };

    await axios(options).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  }

  async function sendComment(e) {
    e.preventDefault();
    const cookie = getCookie("jwt");
    const responseMessageTicket = await fetchAPIAuth({
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: cookie,
      },
      url: process.env.API + "/api/ticket/" + params.id + "/message",
      data: {
        content: comment,
      },
    });
    if (!responseMessageTicket.error) {
      toast.success("Votre commentaire a été envoyé !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Une erreur est survenue, veuillez réessayer.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    realodPage();
  }

  async function getUrlSTL(id) {
    if (process.env.IS_TEST_MODE === "true") return setUrlStl("/stl/cube.stl");

    const cookie = getCookie("jwt");
    const responseGetUrlSTL = await fetchAPIAuth({
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: cookie,
      },
      url: process.env.API + "/api/file/" + id + "/getToken",
    });

    setUrlStl(process.env.API + "/api/file/" + responseGetUrlSTL.data);
  }

  async function changeSTLColor() {
    setSTLColor("#" + fabColor[Math.floor(Math.random() * fabColor.length)]);
  }

  async function saveFileData() {
    setOpen(false);
    const cookie = getCookie("jwt");

    const responseUpdateTicket = await fetchAPIAuth({
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

    if (responseUpdateTicket.error) {
      toast.error("Une erreur est survenue, veuillez réessayer.", {
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
    <LayoutPanel
      authorizations={authorizations}
      titleMenu="Panel de demande d'impression 3D"
    >
      <Seo title={"Ticket #" + setZero(ticket.id)} />
      <WebSocket
        realodPage={realodPage}
        event={[]}
        userId={user.id}
        ticketId={ticket.id}
      />

      {/* Dernières activités */}
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
                      Fichiers et commentaires
                    </h3>
                    <p
                      className={`mt-1 max-w-2xl text-sm text-gray-500 ${
                        darkMode ? "text-gray-200" : "text-gray-900"
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
                          Fichier(s) stl
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul
                            role="list"
                            className={`border rounded-md divide-y ${
                              darkMode
                                ? "border-gray-700 divide-gray-700"
                                : "border-gray-200 divide-gray-200"
                            }`}
                          >
                            {file.map((r, index) => {
                              return (
                                <div key={`file-${index}`}>
                                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                    <div className="w-0 flex-1 flex items-center">
                                      <CubeIcon
                                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <span
                                        className={`ml-2 flex-1 w-0 truncate ${
                                          darkMode ? "text-gray-200" : ""
                                        }`}
                                      >
                                        {r.filename}
                                      </span>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                      <button
                                        onClick={() =>
                                          download(r.id, r.filename)
                                        }
                                        className="download-button font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        Télécharger
                                      </button>
                                    </div>
                                    <div
                                      className={`see-file-button ml-4 flex-shrink-0 ${
                                        darkMode ? "text-gray-200" : ""
                                      }`}
                                    >
                                      <button
                                        onClick={() => {
                                          changeSTLColor();
                                          setTicketFile(r);
                                          getUrlSTL(r.id);
                                          setOpen(true);
                                        }}
                                      >
                                        Voir le fichier STL
                                      </button>
                                    </div>
                                  </li>
                                  {r.comment != "" ? (
                                    <div className="pl-3 pr-4 flex mb-3 items-center justify-between text-sm">
                                      <p
                                        className={`text-ellipsis overflow-hidden ${
                                          darkMode ? "text-gray-200" : ""
                                        }`}
                                      >
                                        <span
                                          className={`font-medium ${
                                            darkMode ? "text-gray-200" : ""
                                          }`}
                                        >
                                          Commentaire sur le fichier
                                        </span>
                                        : {r.comment}
                                      </p>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {authorizations.myFabAgent ? (
                                    <div className="pl-3 pr-4 flex mb-3 items-center justify-between text-sm">
                                      <p
                                        className={`text-ellipsis overflow-hidden ${
                                          darkMode ? "text-gray-200" : ""
                                        }`}
                                      >
                                        <span
                                          className={`font-medium ${
                                            darkMode ? "text-gray-200" : ""
                                          }`}
                                        >
                                          Impression lancé sur
                                        </span>
                                        :{" "}
                                        {r.printerName
                                          ? r.printerName
                                          : "Non lancé"}
                                      </p>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              );
                            })}
                          </ul>
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-200" : "text-gray-500"
                          }`}
                        >
                          Commentaires
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul
                            role="list"
                            className={`divide-y ${
                              darkMode ? "divide-gray-700" : "divide-gray-200"
                            }`}
                          >
                            {message.map((r, index) => (
                              <li
                                key={`message-${index}`}
                                className={`relative py-5 px-4 ${
                                  darkMode
                                    ? "bg-gray-800 hover:bg-gray-700"
                                    : "bg-white hover:bg-gray-50"
                                }`}
                              >
                                <div className="flex justify-between space-x-3">
                                  <div className="min-w-0 flex-1">
                                    <a className="block focus:outline-none">
                                      <span
                                        className="inset-0 cursor-default"
                                        aria-hidden="true"
                                      />
                                      <p
                                        className={`text-sm font-medium truncate ${
                                          darkMode
                                            ? "text-gray-200"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {r.userName}
                                      </p>
                                      <p
                                        className={`text-sm truncate ${
                                          darkMode
                                            ? "text-gray-200"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {r.subject}
                                      </p>
                                    </a>
                                  </div>
                                  <div
                                    className={`${
                                      darkMode
                                        ? "text-gray-200"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {is_test_mode
                                      ? r.creationDate
                                      : format(r.creationDate, "frAt")}
                                  </div>
                                </div>
                                <div className="mt-1">
                                  <p
                                    className={`text-sm ${
                                      darkMode
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {r.content}
                                  </p>
                                </div>
                              </li>
                            ))}
                            <div>
                              <textarea
                                id="comment"
                                name="comment"
                                rows={3}
                                onChange={(e) => setComment(e.target.value)}
                                className={`chat-textarea mt-5 max-w-lg shadow-sm block w-full sm:text-sm border rounded-md ${
                                  darkMode
                                    ? "border-gray-500 bg-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                }`}
                                defaultValue={""}
                              />
                              <button
                                onClick={(e) => {
                                  document.getElementById("comment").value = "";
                                  sendComment(e);
                                }}
                                className="send-message-button mt-3 inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-6 rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700"
                              >
                                Envoyer le message
                              </button>
                              <p
                                className={`mt-2 text-sm ${
                                  darkMode ? "text-gray-200" : "text-gray-500"
                                }`}
                              >
                                Vous pouvez communiquer avec{" "}
                                {authorizations.myFabAgent
                                  ? "le demandeur"
                                  : "les membres du FabLab"}{" "}
                                via ce formulaire.
                              </p>
                            </div>
                          </ul>
                        </dd>
                      </div>
                    </dl>
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
                          darkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        Détails de la demande d'impression
                      </h3>
                      <p
                        className={`mt-1 max-w-2xl text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Ticket n° {ticket.id}
                      </p>
                      <p
                        className={`mt-1 max-w-2xl text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Créé le{" "}
                        {is_test_mode
                          ? ticket.creationDate
                          : format(ticket.creationDate, "frAt")}
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
                              darkMode ? "text-gray-50" : "text-gray-900"
                            }`}
                          >
                            <div>
                              {ticket.userFirstName +
                                " " +
                                (ticket.userLastName
                                  ? ticket.userLastName
                                  : "undefined"
                                )
                                  .toString()
                                  .toUpperCase()}
                              <p
                                className={`mt-1 max-w-2xl text-sm ${
                                  darkMode ? "text-gray-200" : "text-gray-500"
                                }`}
                              >
                                {ticket.title || "Ancien compte"}
                              </p>
                            </div>
                            {authorizations.myFabAgent ? (
                              <button
                                className={`user-button font-bold py-2 px-4 rounded ${
                                  darkMode
                                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-200"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-600"
                                }`}
                                onClick={() => {
                                  setOpenUser(true);
                                }}
                              >
                                <UserCircleIcon className="h-6 w-6"></UserCircleIcon>
                              </button>
                            ) : (
                              ""
                            )}
                          </dd>

                          {authorizations.myFabAgent ? (
                            <dd
                              className={`mt-1 text-sm sm:mt-0 sm:col-span-3 flex justify-between ${
                                darkMode ? "text-gray-300" : "text-gray-400"
                              }`}
                            >
                              <div>
                                Cet utilisateur a {ticket.ticketCountUser}{" "}
                                ticket{ticket.ticketCountUser > 1 ? "s" : ""}{" "}
                                réalisé{ticket.ticketCountUser > 1 ? "s" : ""}{" "}
                                cette année (demandes terminées)
                              </div>
                            </dd>
                          ) : (
                            ""
                          )}
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
                              darkMode ? "text-gray-200" : "text-gray-900"
                            }`}
                          >
                            {ticket.groupNumber
                              ? ticket.groupNumber
                              : "Ce projet n'est pas en groupe"}
                          </dd>

                          {authorizations.myFabAgent && ticket.groupNumber ? (
                            <dd
                              className={`mt-1 text-sm sm:mt-0 sm:col-span-3 flex justify-between ${
                                darkMode ? "text-gray-300" : "text-gray-400"
                              }`}
                            >
                              <div>
                                Ce groupe a {ticket.ticketCountGroup} ticket
                                {ticket.ticketCountGroup > 1 ? "s" : ""} réalisé
                                {ticket.ticketCountGroup > 1 ? "s" : ""} cette
                                année (demandes terminées)
                              </div>
                            </dd>
                          ) : (
                            ""
                          )}
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
                              darkMode ? "text-gray-300" : "text-gray-400"
                            }`}
                          >
                            <div>{ticket.projectType}</div>
                            {authorizations.myFabAgent ? (
                              <button
                                className={`change-type-button font-bold py-2 px-4 rounded ${
                                  darkMode
                                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-200"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-600"
                                }`}
                                onClick={() => {
                                  setparamType("projectType");
                                  setOpenStatus(true);
                                }}
                              >
                                <CogIcon className="h-6 w-6"></CogIcon>
                              </button>
                            ) : (
                              ""
                            )}
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
                              darkMode ? "text-gray-300" : "text-gray-400"
                            }`}
                          >
                            <div>{ticket.statusName}</div>
                            {authorizations.myFabAgent && !ticket.isCancel ? (
                              <button
                                className={`change-status-button font-bold py-2 px-4 rounded ${
                                  darkMode
                                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-200"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-600"
                                }`}
                                onClick={() => {
                                  setparamType("status");
                                  setOpenStatus(true);
                                }}
                              >
                                <CogIcon className="h-6 w-6"></CogIcon>
                              </button>
                            ) : (
                              ""
                            )}
                          </dd>
                          {ticket.userCanCancel && !ticket.isCancel ? (
                            <button
                              className="cancel-ticket bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 sm:col-span-3 rounded"
                              onClick={() => {
                                setparamType("cancel");
                                setOpenStatus(true);
                              }}
                            >
                              Annuler la demande
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                        {authorizations.myFabAgent ? (
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt
                              className={`text-sm font-medium ${
                                darkMode ? "text-gray-200" : "text-gray-500"
                              }`}
                            >
                              Priorité
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div
                                className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-full ${
                                  colors[ticket.priorityColor]
                                }`}
                              >
                                {ticket.priorityName}
                              </div>
                            </dd>
                          </div>
                        ) : (
                          ""
                        )}
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
      <Dialog
        open={open}
        as="div"
        className="fixed inset-0 items-center justify-center"
        onClose={saveFileData}
      >
        {" "}
        <DialogPanel
          transition
          className={`duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 bg-black bg-opacity-50`}
        >
          <div
            className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            onClick={(e) => {
              if (e.target == e.currentTarget) saveFileData();
            }}
          >
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[50%] sm:min-w-[45%] sm:w-full sm:p-6 ${
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

                  {authorizations.myFabAgent ? (
                    <div>
                      <p
                        className={`text-center font-medium ${
                          darkMode ? "text-gray-100" : ""
                        }`}
                      >
                        Commentaire et imprimante:
                      </p>
                      <div className="flex flex-wrap -mx-4">
                        <div className="overflow-hidden sm:rounded-lg w-full lg:w-7/12 pl-4">
                          <textarea
                            id="comment"
                            name="comment"
                            maxLength="256"
                            rows={
                              ticketFile.comment &&
                              ticketFile.comment.length < 150
                                ? 3
                                : 5
                            }
                            onChange={(e) => {
                              if (ticketFile.comment !== e.target.value) {
                                ticketFile.comment = e.target.value;
                                setTicketFile(ticketFile);
                              }
                            }}
                            className={`comment-file-textarea mt-5 max-w-lg shadow-sm block w-full sm:text-sm border rounded-md ${
                              darkMode
                                ? "border-gray-500 bg-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            }`}
                            defaultValue={ticketFile.comment}
                          />
                        </div>
                        <div className="w-full lg:w-5/12 space-y-400 px-4">
                          <select
                            onChange={(e) => {
                              //setNewParam(e.target.value)
                              if (ticketFile.idprinter !== e.target.value) {
                                ticketFile.idprinter = e.target.value;
                                ticketFile.printerName =
                                  printerObject[ticketFile.idprinter];
                                setTicketFile(ticketFile);
                              }
                            }}
                            id="type"
                            name="type"
                            className={`printer-select mt-5 block w-full pl-3 pr-10 py-2 focus:outline-none sm:text-sm rounded-md cursor-pointer ${
                              darkMode
                                ? "text-gray-200 border-gray-500 bg-gray-600 focus:border-indigo-700 focus:ring-indigo-700"
                                : "text-base border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                            }`}
                          >
                            <option
                              value={0}
                              defaultValue={
                                ticketFile.idprinter === 0 ? "'selected'" : ""
                              }
                            >
                              (Sélectionnez une imprimante)
                            </option>
                            {printers.map((item, index) => {
                              const elementSelected =
                                ticketFile.idprinter === item.id;
                              return (
                                <option
                                  key={`printer-${index}`}
                                  defaultValue={
                                    elementSelected ? "'selected'" : ""
                                  }
                                  value={item.id}
                                >
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                        className={`comment-file-textarea mt-5 max-w-lg shadow-sm block w-full sm:text-sm border rounded-md ${
                          darkMode
                            ? "border-gray-500 bg-gray-600 text-white focus:border-indigo-700 focus:ring-indigo-700"
                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        }`}
                        defaultValue={ticketFile.comment}
                      />
                    </div>
                  )}
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
          </div>
        </DialogPanel>
      </Dialog>

      {/* modal */}
      <Dialog
        open={openUser}
        as="div"
        className="fixed inset-0 items-center justify-center"
        onClose={setOpenUser}
      >
        <DialogPanel
          transition
          className={`duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 bg-black bg-opacity-50`}
        >
          <div
            className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            onClick={(e) => {
              if (e.target == e.currentTarget) setOpenUser(false);
            }}
          >
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[50%] sm:min-w-[45%] sm:w-full sm:p-6 ${
                darkMode ? "bg-gray-600" : "bg-white"
              }`}
            >
              <div>
                <p
                  className={`text-center font-medium ${
                    darkMode ? "text-gray-200" : ""
                  }`}
                >
                  Aperçu de l'utilisateur :
                </p>
                <dl
                  className={`sm:divide-y ${
                    darkMode ? "sm:divide-gray-500" : "sm:divide-gray-200"
                  }`}
                >
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                    <dt
                      className={`text-sm font-medium whitespace-nowrap ${
                        darkMode ? "text-gray-200" : "text-gray-500"
                      }`}
                    >
                      Nom et prénom
                    </dt>
                    <dd
                      className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {ticket.userFirstName +
                        " " +
                        ticket.userLastName.toString().toUpperCase()}
                    </dd>
                    <dt
                      className={`text-sm font-medium whitespace-nowrap ${
                        darkMode ? "text-gray-200" : "text-gray-500"
                      }`}
                    >
                      Ecole et année
                    </dt>
                    <dd
                      className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {ticket.title || "Ancien compte"}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                    <div
                      className={`text-sm font-medium whitespace-nowrap ${
                        darkMode ? "text-gray-200" : "text-gray-500"
                      }`}
                    >
                      Adresse e-mail
                    </div>
                    <div
                      className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {ticket.email}
                    </div>
                    <div
                      className={`text-sm font-medium whitespace-nowrap ${
                        darkMode ? "text-gray-200" : "text-gray-500"
                      }`}
                    >
                      Type de projet
                    </div>
                    <div
                      className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {ticket.projectType}
                    </div>
                  </div>
                </dl>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="close-button inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setOpenUser(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      {/* modal */}
      <Dialog
        open={openStatus}
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpenStatus}
      >
        <DialogPanel
          transition
          className={`duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 bg-black bg-opacity-50`}
        >
          <div
            className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            onClick={(e) => {
              if (e.target == e.currentTarget) setOpenStatus(false);
            }}
          >
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[500px] sm:w-full sm:p-6 ${
                darkMode ? "bg-gray-600" : "bg-white"
              }`}
            >
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className={`text-lg leading-6 font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {paramType === "cancel" ? (
                      <p>Annulation de la demande</p>
                    ) : (
                      <p>
                        Changer le {paramType === "status" ? "status" : "type"}{" "}
                        du ticket{" "}
                        {paramType === "status"
                          ? ticket.statusName
                          : ticket.projectType}
                      </p>
                    )}
                  </Dialog.Title>
                  {paramType === "cancel" ? (
                    <div>
                      <p className={`pt-4 ${darkMode ? "text-gray-200" : ""}`}>
                        Attention, vous allez annuler la demande{" "}
                        <strong>#{ticket.id}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <select
                        onChange={(e) => setNewParam(e.target.value)}
                        id="type"
                        name="type"
                        className={`statusType-select mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none sm:text-sm rounded-md cursor-pointer ${
                          darkMode
                            ? "text-gray-200 border-gray-500 bg-gray-600 focus:border-indigo-700 focus:ring-indigo-700"
                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                        defaultValue={
                          paramType === "status"
                            ? ticket.idStatus
                            : ticket.idProjectType
                        }
                      >
                        {(paramType === "status" ? status : projectType).map(
                          (item, index) => {
                            return (
                              <option key={`param-${index}`} value={item.id}>
                                {item.name}
                              </option>
                            );
                          },
                        )}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {paramType === "cancel" ? (
                <div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                    <button
                      className="confirmation-cancel-ticket-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 sm:col-span-2 rounded"
                      onClick={() => {
                        setOpenStatus(false);
                        cancelTicket();
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      className={`back-button mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm sm:col-span-2 ${
                        darkMode
                          ? "bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-200 hover:text-gray-300"
                          : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700 hover:text-gray-500"
                      }`}
                      onClick={() => setOpenStatus(false)}
                    >
                      Retour
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="approve-button w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setOpenStatus(false);
                      change();
                    }}
                  >
                    Confirmer
                  </button>
                  <button
                    type="button"
                    className={`cancel-button mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-200 hover:text-gray-300"
                        : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700 hover:text-gray-500"
                    }`}
                    onClick={() => setOpenStatus(false)}
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </LayoutPanel>
  );
};

export async function getServerSideProps({ req, params }) {
  const cookies = parseCookies(req);
  const user = await fetchAPIAuth("/user/me", cookies.jwt);
  const resUserConnected = isUserConnected(user);
  if (resUserConnected) return resUserConnected;
  const role = await fetchAPIAuth("/user/role", cookies.jwt);
  const id = params.id;
  const ticket = await fetchAPIAuth("/ticket/" + id, cookies.jwt);
  if (ticket.status === 204 || ticket.error) {
    return {
      redirect: {
        permanent: false,
        destination: "/panel/",
      },
      props: {},
    };
  }
  const file = await fetchAPIAuth("/ticket/" + id + "/file", cookies.jwt);
  const message = await fetchAPIAuth("/ticket/" + id + "/message", cookies.jwt);
  const authorizations = await fetchAPIAuth(
    "/user/authorization/",
    cookies.jwt,
  );

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

  const status = await fetchAPIAuth("/status/");
  const projectType = await fetchAPIAuth("/projectType/");
  const printers = await fetchAPIAuth("/printer/");

  return {
    props: {
      user: user.data,
      params,
      role: role.data,
      ticket: ticket.data,
      file: file.data,
      message: message.data,
      authorizations: authorizations.data,
      id,
      status: status.data,
      projectType: projectType.data,
      printers: printers.data,
      is_test_mode: process.env.IS_TEST_MODE == "true",
    }, // will be passed to the page component as props
  };
}

export default GestionTicket;
