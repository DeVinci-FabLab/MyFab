import { fetchAPIAuth, parseCookies } from "../../lib/api";
import LayoutPanel from "../../components/layoutPanel";
import Seo from "../../components/seo";
import WebSocket from "../../components/webSocket";
import Error from "../404";
import { CubeIcon, UserCircleIcon, CogIcon, ExclamationIcon } from "@heroicons/react/outline";
import { useEffect, Fragment, useState } from "react";
import Moment from "react-moment";
import STLViewer from "stl-viewer";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { setZero, isUserConnected } from "../../lib/function";

const colors = {
  "2274e0": "text-gray-700 bg-gray-200",
  e9d41d: "text-amber-700 bg-amber-200",
  f30b0b: "text-white bg-gradient-to-r from-amber-400 to-red-500",
};
const fabColor = ["D51D65", "F5841D", "2CA0BB", "CDCDCD"];

const GestionTicket = ({ params, user, role, ticket, file, message, authorizations, id, status, projectType, printers }) => {
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

    await axios({
      method: "PUT",
      url: process.env.API + "/api/ticket/" + params.id + "/" + (paramType === "status" ? "setStatus" : "setProjecttype") + "/",
      params: data,
      headers: {
        dvflCookie: cookie,
      },
    })
      .then(() => {
        toast.success(paramType === "status" ? "Le status du ticket a été mis à jour" : "Le type de projet à été modifié", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        realodPage();
      })
      .catch((e) => {
        toast.error("Une erreur est survenue, veuillez réessayer.", {
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

  async function cancelTicket() {
    const cookie = getCookie("jwt");

    await axios({
      method: "PUT",
      url: process.env.API + "/api/ticket/" + params.id + "/setCancelStatus/",
      headers: {
        dvflCookie: cookie,
      },
    })
      .then(() => {
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
      })
      .catch((e) => {
        toast.error("Une erreur est survenue, veuillez réessayer.", {
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

  async function download(id, name) {
    const cookie = getCookie("jwt");
    await axios({
      method: "GET",
      responseType: "blob",
      url: process.env.API + "/api/file/" + id,
      headers: {
        dvflCookie: cookie,
      },
    }).then((response) => {
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
    await axios({
      method: "POST",
      url: process.env.API + "/api/ticket/" + params.id + "/message",
      data: {
        content: comment,
      },
      headers: {
        dvflCookie: cookie,
      },
    })
      .then((response) => {
        toast.success("Votre commentaire a été envoyé !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((e) => {
        toast.error("Une erreur est survenue, veuillez réessayer.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    realodPage();
  }

  async function getUrlSTL(id) {
    const cookie = getCookie("jwt");
    await axios({
      method: "GET",
      responseType: "blob",
      url: process.env.API + "/api/file/" + id,
      headers: {
        dvflCookie: cookie,
      },
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setUrlStl(url);
    });
  }

  async function changeSTLColor() {
    setSTLColor("#" + fabColor[Math.floor(Math.random() * fabColor.length)]);
  }

  async function saveFileData() {
    setOpen(false);
    const cookie = getCookie("jwt");
    await axios({
      method: "PUT",
      url: process.env.API + "/api/file/" + ticketFile.id,
      data: {
        comment: ticketFile.comment,
        idprinter: ticketFile.idprinter,
      },
      headers: {
        dvflCookie: cookie,
      },
    })
      .then((response) => {})
      .catch((e) => {
        console.log(e);
        toast.error("Une erreur est survenue, veuillez réessayer.", {
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
    <LayoutPanel user={user} role={role} authorizations={authorizations} titleMenu="Panel de demande d'impression 3D">
      <Seo title={"Ticket #" + setZero(ticket.id)} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} ticketId={ticket.id} />

      {/* Dernières activités */}
      <div className="py-6 px-3">
        <div className="mx-auto sm:px-6 lg:px-8 lg:gap-8">
          <main className="col-span-9">
            <div className="container px-4 mx-auto">
              <div className="flex flex-wrap -mx-4">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg w-full lg:w-2/3 px-4">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Fichiers et commentaires</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Ticket n° {ticket.id}</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Fichier(s) stl</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            {file.map((r) => {
                              return (
                                <div>
                                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                    <div className="w-0 flex-1 flex items-center">
                                      <CubeIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                                      <span className="ml-2 flex-1 w-0 truncate">{r.filename}</span>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                      <button onClick={() => download(r.id, r.filename)} className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Télécharger
                                      </button>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                      <button
                                        onClick={() => {
                                          console.log(r);
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
                                      <p className="text-ellipsis overflow-hidden">
                                        <span className="font-medium">Commentaire sur le fichier</span>: {r.comment}
                                      </p>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {authorizations.myFabAgent ? (
                                    <div className="pl-3 pr-4 flex mb-3 items-center justify-between text-sm">
                                      <p className="text-ellipsis overflow-hidden">
                                        <span className="font-medium">Impression lancé sur</span>: {r.printerName ? r.printerName : "Non lancé"}
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
                        <dt className="text-sm font-medium text-gray-500">Commentaires</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul role="list" className="divide-y divide-gray-200">
                            {message.map((r) => (
                              <li key={r.id} className="relative bg-white py-5 px-4 hover:bg-gray-50">
                                <div className="flex justify-between space-x-3">
                                  <div className="min-w-0 flex-1">
                                    <a href="#" className="block focus:outline-none">
                                      <span className="absolute inset-0 cursor-default" aria-hidden="true" />
                                      <p className="text-sm font-medium text-gray-900 truncate">{r.userName}</p>
                                      <p className="text-sm text-gray-500 truncate">{r.subject}</p>
                                    </a>
                                  </div>
                                  <Moment format="Do MMM YYYY à HH:mm" locale="fr">
                                    {r.creationDate}
                                  </Moment>
                                </div>
                                <div className="mt-1">
                                  <p className="line-clamp-2 text-sm text-gray-600">{r.content}</p>
                                </div>
                              </li>
                            ))}
                            <div>
                              <textarea
                                id="comment"
                                name="comment"
                                rows={3}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-5 max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                defaultValue={""}
                              />
                              <button
                                onClick={(e) => {
                                  document.getElementById("comment").value = "";
                                  sendComment(e);
                                }}
                                className="mt-3 inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-6 rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700"
                              >
                                Envoyer mon commentaire
                              </button>
                              <p className="mt-2 text-sm text-gray-500">Vous pouvez communiquer avec les membres du FabLab via ce formulaire.</p>
                            </div>
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="w-full lg:w-1/3 px-4 space-y-4">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Détails de la demande d'impression</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">Ticket n° {ticket.id}</p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Utilisateur</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between">
                            <div>
                              {ticket.userFirstName + " " + ticket.userLastName.toString().toUpperCase()}
                              <p className="mt-1 max-w-2xl text-sm text-gray-500">{user.title || "Ancien compte"}</p>
                            </div>
                            {authorizations.myFabAgent ? (
                              <button
                                class="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-600 font-bold py-2 px-4 rounded"
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
                            <dd className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-3 flex justify-between">
                              <div>
                                Cet utilisateur a {ticket.ticketCountUser} ticket{ticket.ticketCountUser > 1 ? "s" : ""} réalisé{ticket.ticketCountUser > 1 ? "s" : ""} cette année
                              </div>
                            </dd>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Numéro de groupe</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between">{ticket.groupNumber}</dd>

                          {authorizations.myFabAgent ? (
                            <dd className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-3 flex justify-between">
                              <div>
                                Ce groupe a {ticket.ticketCountGroup} ticket{ticket.ticketCountGroup > 1 ? "s" : ""} réalisé{ticket.ticketCountGroup > 1 ? "s" : ""} cette année
                              </div>
                            </dd>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Type</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between">
                            <div>{ticket.projectType}</div>
                            {authorizations.myFabAgent ? (
                              <button
                                class="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-600 font-bold py-2 px-4 rounded"
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
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between">
                            <div>{ticket.statusName}</div>
                            {authorizations.myFabAgent && !ticket.isCancel ? (
                              <button
                                class="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-600 font-bold py-2 px-4 rounded"
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
                              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 sm:col-span-3 rounded"
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
                            <dt className="text-sm font-medium text-gray-500">Priorité</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-full ${colors[ticket.priorityColor]}`}>{ticket.priorityName}</div>
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
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={saveFileData}>
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

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[50%] sm:w-full sm:max-h-max sm:h-full sm:p-6">
                <div>
                  <p className="text-center font-medium">Aperçu du fichier STL:</p>
                  <p className="text-sm text-center text-gray-500">{ticketFile.filename}</p>
                  <center>
                    <STLViewer
                      width={typeof window !== "undefined" ? (window.innerWidth / 100) * 45 : 300}
                      height={typeof window !== "undefined" ? window.innerHeight / 2.2 : 200}
                      modelColor={STLColor}
                      backgroundColor="#FFFFFF"
                      rotate={true}
                      orbitControls={true}
                      model={urlStl}
                      lightColor="#ffffff"
                      lights={[1, 1, 1]}
                    />

                    {authorizations.myFabAgent ? (
                      <div>
                        <p className="text-center font-medium">Commentaire et imprimante:</p>
                        <div className="flex flex-wrap -mx-4">
                          <div className="overflow-hidden sm:rounded-lg w-full lg:w-7/12 pl-4">
                            <textarea
                              id="comment"
                              name="comment"
                              maxlength="256"
                              rows={ticketFile.comment && ticketFile.comment.length < 150 ? 3 : 5}
                              onChange={(e) => {
                                if (ticketFile.comment !== e.target.value) {
                                  ticketFile.comment = e.target.value;
                                  setTicketFile(ticketFile);
                                }
                              }}
                              className="mt-5 w-full shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                              defaultValue={ticketFile.comment}
                            />
                          </div>
                          <div className="w-full lg:w-5/12 space-y-400 px-4">
                            <select
                              onChange={(e) => {
                                //setNewParam(e.target.value)
                                if (ticketFile.idprinter !== e.target.value) {
                                  ticketFile.idprinter = e.target.value;
                                  ticketFile.printerName = printerObject[ticketFile.idprinter];
                                  setTicketFile(ticketFile);
                                }
                              }}
                              id="type"
                              name="type"
                              className="mt-5 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md cursor-pointer"
                            >
                              <option value={0} selected={ticketFile.idprinter === 0 ? "'selected'" : ""}>
                                (Sélectionnez une imprimante)
                              </option>
                              {printers.map((item) => {
                                const elementSelected = ticketFile.idprinter === item.id;
                                return (
                                  <option selected={elementSelected ? "'selected'" : ""} value={item.id}>
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
                        <p className="text-center font-medium">Commentaire:</p>
                        <textarea
                          id="comment"
                          name="comment"
                          rows={3}
                          onChange={(e) => {
                            ticketFile.comment = e.target.value;
                            setTicketFile(ticketFile);
                          }}
                          className="mt-5 max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                          defaultValue={ticketFile.comment}
                        />
                      </div>
                    )}
                  </center>
                </div>
                <div className="mt-5 sm:mt-6 justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
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

      {/* modal */}
      <Transition.Root show={openUser} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpenUser}>
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

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[50%] sm:w-full sm:p-6">
                <div>
                  <p className="text-center font-medium">Aperçu de l'utilisateur :</p>
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">Nom et prénom</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.firstName + " " + user.lastName.toString().toUpperCase()}</dd>
                      <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">Ecole et année</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.title || "Ancien compte"}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">Adresse e-mail</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.email}</dd>
                      <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">Type de preojet</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.projectType}</dd>
                    </div>
                  </dl>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => setOpenUser(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* modal */}
      <Transition.Root show={openStatus} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpenStatus}>
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

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[500px] sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      {paramType === "cancel" ? <p>Annulation de la demande</p> : <p>Changer le {paramType === "status" ? "status" : "type"} du ticket</p>}
                    </Dialog.Title>
                    {paramType === "cancel" ? (
                      <div>
                        <p className="pt-4">
                          Attention, vous allez annuler la demande <strong>#{ticket.id}</strong>
                        </p>
                        <p>Cette action est irréversible</p>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <select
                          onChange={(e) => setNewParam(e.target.value)}
                          id="type"
                          name="type"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md cursor-pointer"
                        >
                          {(paramType === "status" ? status : projectType).map((item) => {
                            const elementSelected = paramType === "status" ? ticket.statusName : ticket.projectType;
                            return (
                              <option selected={item.name === elementSelected ? "'selected'" : ""} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {paramType === "cancel" ? (
                  <div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                      <button
                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 sm:col-span-2 rounded"
                        onClick={() => {
                          setOpenStatus(false);
                          cancelTicket();
                        }}
                      >
                        Annuler la demande
                      </button>
                      <button
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm sm:col-span-2"
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
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setOpenStatus(false);
                        change();
                      }}
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setOpenStatus(false)}
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
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
  const file = await fetchAPIAuth("/ticket/" + id + "/file", cookies.jwt);
  const message = await fetchAPIAuth("/ticket/" + id + "/message", cookies.jwt);
  const authorizations = await fetchAPIAuth("/user/authorization/", cookies.jwt);
  const status = await fetchAPIAuth("/status/");
  const projectType = await fetchAPIAuth("/projectType/");
  const printers = await fetchAPIAuth("/printer/");

  return {
    props: { user, params, role, ticket, file, message, authorizations, id, status, projectType, printers }, // will be passed to the page component as props
  };
}

export default GestionTicket;
