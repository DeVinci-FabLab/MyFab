import Link from "next/link";
import React from "react";
import { Fragment, useState } from "react";
import LayoutPanel from "../../components/layoutPanel";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { setZero, isUserConnected } from "../../lib/function";
import Seo from "../../components/seo";
import { Dialog, Transition } from "@headlessui/react";
import STLViewer from "stl-viewer";
import { CubeIcon } from "@heroicons/react/outline";
import { getCookie } from "cookies-next";
import axios from "axios";
import { toast } from "react-toastify";
import router from "next/router";
import WebSocket from "../../components/webSocket";

const fabColor = ["D51D65", "F5841D", "2CA0BB", "CDCDCD"];

export default function NewPanel({ user, role, ticket, file, authorizations }) {
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

  async function changeSTLColor() {
    setSTLColor("#" + fabColor[Math.floor(Math.random() * fabColor.length)]);
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

  return (
    <LayoutPanel user={user} role={role} authorizations={authorizations} titleMenu="Récapitulatif de la demande">
      <Seo title={"Nouvelle demande créé"} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />

      <div className="py-6 px-3">
        <div className="mx-auto sm:px-6 lg:px-8 lg:gap-8">
          <main className="col-span-9">
            <div className="container px-4 mx-auto">
              <div className="flex flex-wrap -mx-4">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg w-full lg:w-2/3 px-4">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">La demande {"#" + setZero(ticket.id)} à été créé</h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <p className="p-5">Les membres du DeVinci FabLab traiteons la demande le dès que possible. Vous pouvez suivre l'avancée de la demande sur cette plateforme.</p>
                    <p className="p-5">
                      Vous pouvez rajouter des notes sur les fichiers stl pour par exemple demander plusieurs impression pour un même fichier, une couleur d'impression spécifique,
                      ...
                    </p>
                    {/*
                    <div className="flex justify-center">
                      { inviteAvaible ? (<Link href={inviteLink.result ? inviteLink.result : ""} passHref rel="noopener noreferrer">
                        <a target="_blank">
                          <button
                            type="button"
                            className={`order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:order-1 sm:ml-3`}>
                            Rejoindre le serveur discord
                          </button>
                        </a>
                      </Link>):(<button
                          type="button"
                          onClick={()=>{
                            toast.error("L'invitation à discord n'est pas disponible pour le moment. Veillez réessayer plus tard.", {
                              position: "top-right",
                              autoClose: 3000,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                            });
                          }}
                          className={`order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:order-1 sm:ml-3`}>
                          Rejoindre le serveur discord
                        </button>)}
                    </div>
                    <p className="p-5">Après avoir rejoint le discord, n'oubliez pas de lier votre compte MyFab à Discord, pour avoir accès au demande sur le serveur. 😉</p>
                    */}

                    <div className="flex justify-center mb-4">
                      <Link href={ticketLink}>
                        <button
                          type="button"
                          className={`order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:order-1 sm:ml-3`}
                        >
                          Continuer
                        </button>
                      </Link>
                    </div>

                    <div class="grid grid-cols-6 gap-5 p-5 ">
                      {file.map((r) => {
                        return (
                          <div class="col-span-6 mt-5 bg-opacity-50 border border-gray-100 rounded shadow-lg cursor-pointer backdrop-blur-20 to-gray-50 md:col-span-3 lg:col-span-2 pl-3 pr-4 py-3">
                            <div className="w-0 flex-1 flex items-center">
                              <CubeIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                              <span className="ml-2 flex-1">{r.filename}</span>
                            </div>
                            <div className="flex justify-center mt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  console.log(r);
                                  changeSTLColor();
                                  setTicketFile(r);
                                  getUrlSTL(r.id);
                                  setOpen(true);
                                }}
                                className={`order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:order-1 sm:ml-3`}
                              >
                                Mettre un commentaire
                              </button>
                            </div>
                            {r.comment != "" ? (
                              <div className="pl-3 pr-4 flex mb-3 items-center justify-between text-sm mt-2">
                                <p className="text-ellipsis overflow-hidden">
                                  <span className="font-medium">Commentaire </span>: {r.comment}
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
                              {user.firstName + " " + user.lastName.toString().toUpperCase()}
                              <p className="mt-1 max-w-2xl text-sm text-gray-500">{user.title || "Ancien compte"}</p>
                            </div>
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Numéro de groupe</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between">{ticket.groupNumber}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Type</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between">
                            <div>{ticket.projectType}</div>
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between">
                            <div>{ticket.statusName}</div>
                          </dd>
                        </div>
                        {authorizations.myFabAgent ? (
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Priorité</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-full`}>{ticket.priorityName}</div>
                            </dd>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Fichiers</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between">
                            <div>
                              Ce ticket comporte {file.length} fichier{file.length > 1 ? "s" : ""} :
                              {file.map((r) => {
                                return <p className="mt-1 max-w-2xl text-sm text-gray-500">- {r.filename}</p>;
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
    </LayoutPanel>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = parseCookies(req);
  const user = await fetchAPIAuth("/user/me", cookies.jwt);
  const resUserConnected = isUserConnected(user);
  if (resUserConnected) return resUserConnected;
  const idTicket = query.id;
  const ticket = await fetchAPIAuth("/ticket/" + idTicket, cookies.jwt);
  const file = await fetchAPIAuth("/ticket/" + idTicket + "/file", cookies.jwt);

  const role = await fetchAPIAuth("/user/role", cookies.jwt);
  const authorizations = await fetchAPIAuth("/user/authorization/", cookies.jwt);

  return {
    props: { user, role, ticket, file, authorizations }, // will be passed to the page component as props
  };
}
