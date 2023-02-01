import React from "react";
import { useState } from "react";
import { CubeIcon } from "@heroicons/react/solid";
import LayoutPanel from "../../components/layoutPanel";
import axios from "axios";
import { getCookie } from "cookies-next";
import { setZero, isUserConnected } from "../../lib/function";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { toast } from "react-toastify";
import router from "next/router";
import Seo from "../../components/seo";
import WebSocket from "../../components/webSocket";

const percents = (value, total) => Math.round(value / total) * 100;

export default function NewPanel({ user, role, authorizations, projectType }) {
  const [percentage, setPercentage] = useState(0);
  const [status, setStatus] = useState(false);
  const [userClick, setUserClick] = useState(false);
  const [file, setFile] = useState([]);
  const [description, setDescription] = useState("Aucune déscription fournie.");
  const [type, setType] = useState("PIX 1");
  const [group, setGroup] = useState(null);
  const [percent, setPercent] = useState(0);

  function realodPage() {
    router.replace(router.asPath);
  }

  const onDragEnter = (event) => {
    setStatus(true);
    event.preventDefault();
  };

  const onDragOver = (event) => {
    setStatus(true);
    event.preventDefault();
  };

  const onDragLeave = (event) => {
    setStatus(false);
    event.preventDefault();
  };

  const onDrop = (event) => {
    event.preventDefault();
    setFile((oldArray) => [...oldArray, event.dataTransfer.files]);
    setStatus(false);
  };

  const handleSubmit = async (e) => {
    if (description == "Aucune déscription fournie." || group == null || file.length < 1) {
      toast.error("Tous les champs ne sont pas complétés.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setUserClick(false);
      return;
    }
    e.preventDefault();

    const projectType = {
      "PIX 1": {
        id: 1,
      },
      "PIX 2": {
        id: 2,
      },
      PING: {
        id: 3,
      },
      "PI²": { id: 4 },
      Associatif: { id: 5 },
      Autre: { id: 6 },
    };

    const data = new FormData();
    const jwt = getCookie("jwt");

    for (let i = 0; i < file.length; i++) {
      data.append(`filedata`, file[i][0]);
    }
    data.append("comment", description);
    data.append("groupNumber", group);
    data.append("projectType", projectType[type].id);
    const upload_res = await axios({
      method: "POST",
      url: process.env.API + "/api/ticket",
      data,
      headers: {
        dvflCookie: jwt,
      },
      onUploadProgress: (progress) => setPercent(percents(progress.loaded, progress.total)),
    }).catch((e) => {
      toast.error("Une erreur est survenue, veuillez vérifier le formulaire ou actualiser la page.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
    document.getElementById("status").scrollIntoView();
    setFile([]);
    setDescription("Aucune déscription fournie.");
    setType("PIX 1");
    setGroup(null);
    toast.success("Le ticket #" + setZero(upload_res.data.id) + " a été créé !", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    router.push("/panel/newSuccess/?id=" + upload_res.data.id);
  };

  const handleChange = (e) => {
    setFile((oldArray) => [...oldArray, e.target.files]);
  };

  return (
    <LayoutPanel user={user} role={role} authorizations={authorizations} titleMenu="Panel de demande d'impression 3D">
      <Seo title={"Créer un ticket"} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />

      <div className="px-10 py-10" id="status">
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Informations</h3>
                <p className="mt-1 text-sm text-gray-600">Ces informations permettront de traiter aux mieux votre impression. Merci de les remplir correctement.</p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div onSubmit={handleSubmit}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                        Commentaires
                      </label>
                      <div className="mt-1">
                        <textarea
                          onChange={(e) => setDescription(e.target.value)}
                          id="about"
                          name="about"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Bonjour, pourriez-vous l'imprimer avec du PLA lila ? Merci."
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Description détaillée de la demande d'impression du fichier.</p>
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Type de projet
                      </label>
                      <select
                        onChange={(e) => setType(e.target.value)}
                        id="type"
                        name="type"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {projectType.map((item) => {
                          const elementSelected = projectType[0].name;
                          return (
                            <option selected={item.name === elementSelected ? "'selected'" : ""} value={item.name}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="group" className="block text-sm font-medium text-gray-700">
                        N° de groupe
                      </label>
                      <div className="mt-1">
                        <input
                          onChange={(e) => setGroup(e.target.value)}
                          type="number"
                          name="group"
                          id="group"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="64"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fichier STL</label>
                      <div onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={(e) => onDrop(e)}>
                        <div
                          className={`${status ? "border-gray-800" : "border-gray-300"} ${
                            percentage != 0 ? "hidden" : "block"
                          } dropzone mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md`}
                        >
                          <div className="space-y-1 text-center">
                            <CubeIcon className={`mx-auto h-12 w-12 ${status ? "text-indigo-700" : "text-gray-400"}`} />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Choisir un fichier</span>
                                <input onChange={handleChange} id="file-upload" name="file-upload" type="file" accept=".stl" className="sr-only" />
                              </label>
                              <p className="pl-1 hidden md:block">ou déposez-le</p>
                            </div>
                            <p className="text-xs text-gray-500">STL jusqu'à 64MB</p>
                          </div>
                        </div>
                      </div>

                      {/* progress bar */}
                      {file.length > 0 ? (
                        <div className="flex items-center w-full h-5 bg-indigo-100 rounded-lg overflow-hidden mt-5">
                          <div
                            role="progressbar"
                            aria-valuenow={percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="flex items-center justify-center self-stretch transition-all duration-500 ease-out bg-indigo-500 text-white text-sm font-semibold"
                            style={{ width: `${percent}%` }}
                          >
                            {percent}%
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {file.length >= 1
                        ? file.map((r) => {
                            if (r[0] == null) return null;
                            return (
                              <div className="block mt-3">
                                <p className="text-md font-semibold text-gray-700">{r[0].name}</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFile(
                                      file.filter(function (item) {
                                        return item !== r;
                                      })
                                    );
                                  }}
                                  className="mt-3 inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-indigo-200 bg-indigo-200 text-indigo-700 hover:text-indigo-700 hover:bg-indigo-300 hover:border-indigo-300 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-200 active:border-indigo-200"
                                >
                                  Supprimer le fichier
                                </button>
                              </div>
                            );
                          })
                        : ""}

                      <div className="text-center mt-5"></div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    onClick={(e) => {
                      setUserClick(true);
                      handleSubmit(e);
                    }}
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    disabled={userClick}
                  >
                    Valider et envoyer mon fichier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

        {/*<div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Notifications
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Recevez des notifications dès que votre fichier STL a été
                  approuvé, quand son impression est terminée ou encore quand il
                  a été déposé dans un casier.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form action="#" method="POST">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <fieldset>
                      <div>
                        <legend className="text-base font-medium text-gray-900">
                          Type de notification
                        </legend>
                        <p className="text-sm text-gray-500">
                          Recevez des notifications par SMS ou e-mail, comme
                          pour votre colis chronopost.
                        </p>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="push-everything"
                            name="push-notifications"
                            type="radio"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label
                            htmlFor="push-everything"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Par e-mail
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push-email"
                            name="push-notifications"
                            type="radio"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label
                            htmlFor="push-email"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Par SMS
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="both"
                            name="push-notifications"
                            type="radio"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label
                            htmlFor="both"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            SMS et e-mail
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push-nothing"
                            name="push-notifications"
                            type="radio"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label
                            htmlFor="push-nothing"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Aucune notification
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Valider et envoyer mon fichier
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>*/}
      </div>
    </LayoutPanel>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  const user = await fetchAPIAuth("/user/me", cookies.jwt);
  const resUserConnected = isUserConnected(user);
  if (resUserConnected) return resUserConnected;

  const role = await fetchAPIAuth("/user/role", cookies.jwt);
  const authorizations = await fetchAPIAuth("/user/authorization/", cookies.jwt);

  const projectType = await fetchAPIAuth("/projectType/");

  return {
    props: { user, role, authorizations, projectType }, // will be passed to the page component as props
  };
}
