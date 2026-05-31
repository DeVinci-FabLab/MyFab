import React from "react";
import { useState } from "react";
import { CubeIcon } from "@heroicons/react/24/solid";
import LayoutPanel from "../../components/layoutPanel";
import { getCookie } from "cookies-next";
import { setZero, isUserConnected } from "../../lib/function";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { getApi } from "../../lib/runtimeEnv";
import { toast } from "react-toastify";
import router from "next/router";
import Seo from "../../components/seo";
import WebSocket from "../../components/webSocket";
import axios from "axios";

import { UserUse } from "../../context/provider";

const percents = (value, total) => Math.round(value / total) * 100;

export default function NewPanel({ authorizations, projectType, materials }) {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);

  const [showMissingField, setShowMissingField] = useState(false);
  const [status, setStatus] = useState(false);
  const [userClick, setUserClick] = useState(false);
  const [file, setFile] = useState([]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState(0);
  const [material, setMaterial] = useState(0);
  const [group, setGroup] = useState("");
  const [noGroup, setNoGroup] = useState(false);
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
    const validGroup = noGroup
      ? projectType[type].groupCanBeNull === 1
      : /^\d{1,4}[A-Za-z]?$/.test(group.trim());
    if (description == "" || !validGroup || file.length < 1) {
      setShowMissingField(true);
      setTimeout(() => setShowMissingField(false), 5000);
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

    const data = new FormData();
    const jwt = getCookie("jwt");

    for (let i = 0; i < file.length; i++) {
      data.append(`filedata`, file[i][0]);
    }

    data.append("comment", description);
    data.append("groupNumber", group);
    data.append("projectType", projectType[type].id);
    data.append("projectMaterial", materials[material].id);
    const responsePostTicket = await fetchAPIAuth({
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        dvflCookie: jwt,
      },

      url: getApi() + "/api/ticket",
      data,
      onUploadProgress: (progress) =>
        setPercent(percents(progress.loaded, progress.total)),
    });

    if (responsePostTicket.error) {
      toast.error(
        "Une erreur est survenue, veuillez vérifier le formulaire ou actualiser la page.",
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
      setUserClick(false);
    } else {
      toast.success(
        "Le ticket #" + setZero(responsePostTicket.data.id) + " a été créé !",
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
      router.push("/panel/newSuccess/?id=" + responsePostTicket.data.id);
    }
  };

  const handleChange = (e) => {
    const files = { ...e.target.files };
    setFile((oldArray) => [...oldArray, files]);
    e.target.value = "";
  };

  return (
    <LayoutPanel
      authorizations={authorizations}
      titleMenu="Panel de demande d'impression 3D"
    >
      <Seo title={"Créer un ticket"} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />

      <div className="px-10 py-10" id="status">
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <p className="font-mono text-xs uppercase tracking-wider text-brand-magenta mb-2">
                  // Nouvelle demande
                </p>
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
                  Informations
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Ces informations permettront de traiter aux mieux votre
                  impression. Merci de les remplir correctement.
                </p>
                <div className="mt-6 text-sm rounded-md border-l-4 border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10 p-4 text-gray-600 dark:text-gray-300">
                  <h3 className="font-semibold text-brand-blue">
                    Avant de soumettre une demande d’impression 3D :
                  </h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      Le volume maximal d’impression est limité à{" "}
                      <strong>18 cm³</strong>.
                    </li>
                    <li>
                      Il est possible de{" "}
                      <strong>joindre plusieurs fichiers</strong> à une seule
                      demande.
                    </li>
                    <li>
                      Les demandes seront traitées en priorité pour les{" "}
                      <strong>
                        groupes ayant peu de demandes déjà effectuées
                      </strong>
                      .
                    </li>
                    <li>
                      Veuillez{" "}
                      <strong>
                        évaluer si l’impression 3D est réellement nécessaire
                      </strong>
                      , ou si d’autres solutions comme la{" "}
                      <strong>découpe ou gravure laser</strong> pourraient
                      convenir.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div onSubmit={handleSubmit}>
                <div className="rounded-md overflow-hidden border border-gray-200 dark:border-night-800">
                  <div className="px-4 py-5 space-y-6 sm:p-6 bg-white dark:bg-night-900">
                    <div>
                      <label
                        htmlFor="about"
                        className={`block text-sm font-medium ${
                          showMissingField && description == ""
                            ? "text-red-500"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        Commentaires
                      </label>
                      {user.specialFont ? (
                        <label
                          className={`${user.specialFont} small text-gray-500`}
                        >
                          Commentaires
                        </label>
                      ) : (
                        ""
                      )}
                      <div className="mt-1">
                        <textarea
                          onChange={(e) => setDescription(e.target.value)}
                          id="about"
                          name="about"
                          rows={3}
                          maxLength="1000"
                          className={`description-textarea shadow-sm mt-1 block w-full sm:text-sm border rounded-md ${
                            showMissingField && description == ""
                              ? "border-red-500 placeholder-red-400 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200"
                              : "placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 focus:border-brand-magenta focus:ring-brand-magenta"
                          }`}
                          placeholder="Bonjour, pourriez-vous l'imprimer avec du PLA lila ? Merci."
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                        Description détaillée de la demande d'impression du
                        fichier.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Type de projet
                      </label>
                      {user.specialFont ? (
                        <label
                          className={`${user.specialFont} small text-gray-500`}
                        >
                          Type de projet
                        </label>
                      ) : (
                        ""
                      )}
                      <select
                        onChange={(e) => setType(e.target.value)}
                        id="type"
                        name="type"
                        className="projectType-select mt-1 block w-full pl-3 pr-10 py-2 focus:outline-none sm:text-sm rounded-md border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 focus:border-brand-magenta focus:ring-brand-magenta"
                      >
                        {projectType.map((item, index) => {
                          return (
                            <option key={`projectType-${index}`} value={index}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="group"
                        className={`block text-sm font-medium ${
                          showMissingField &&
                          !(noGroup
                            ? projectType[type].groupCanBeNull === 1
                            : /^\d{1,4}[A-Za-z]?$/.test(group.trim()))
                            ? "text-red-500"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        N° de groupe
                      </label>
                      {user.specialFont ? (
                        <label
                          className={`${user.specialFont} small text-gray-500`}
                        >
                          N° de groupe
                        </label>
                      ) : (
                        ""
                      )}
                      <div className="mt-1">
                        <input
                          onChange={(e) => {
                            setGroup(e.target.value);
                            setNoGroup(false);
                          }}
                          type="text"
                          name="group"
                          value={group}
                          id="group"
                          maxLength="5"
                          className={`group-number-input shadow-sm block w-full sm:text-sm rounded-md ${
                            showMissingField &&
                            !(noGroup
                              ? projectType[type].groupCanBeNull === 1
                              : /^\d{1,4}[A-Za-z]?$/.test(group.trim()))
                              ? "border-red-500 placeholder-red-400 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200"
                              : "placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 focus:border-brand-magenta focus:ring-brand-magenta"
                          } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                          placeholder="Ex : 212 ou 401E"
                        />
                      </div>
                      {type && projectType[type].groupCanBeNull ? (
                        <div className="flex items-center justify-center pt-2">
                          <input
                            id="no-group"
                            name="no-group"
                            type="checkbox"
                            checked={noGroup}
                            onChange={(e) => {
                              setNoGroup(e.target.checked);
                              setGroup("");
                            }}
                            className="rememberMe-button h-4 w-4 text-brand-magenta focus:ring-brand-magenta border-gray-500 rounded"
                          />
                          <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                          >
                            Je n'ai pas de numéro de groupe pour ce projet
                          </label>
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Type de matériaux
                      </label>
                      {user.specialFont ? (
                        <label
                          className={`${user.specialFont} small text-gray-500`}
                        >
                          Type de matériaux
                        </label>
                      ) : (
                        ""
                      )}
                      <select
                        onChange={(e) => setMaterial(e.target.value)}
                        id="type"
                        name="type"
                        className="material-select mt-1 block w-full pl-3 pr-10 py-2 focus:outline-none sm:text-sm rounded-md border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 focus:border-brand-magenta focus:ring-brand-magenta"
                      >
                        {materials.map((item, index) => {
                          return (
                            <option key={`materials-${index}`} value={index}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                        Si vous souhaitez une impression standard en plastique,
                        selectionnez FDM. Vidéo exemple du{" "}
                        <a
                          href="https://www.youtube.com/watch?v=m_QhY1aABsE"
                          target="_blank"
                          className="text-brand-blue hover:underline"
                        >
                          FDM
                        </a>
                        .
                      </p>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          showMissingField && file.length < 1
                            ? "text-red-500"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        Fichier STL / DXF
                      </label>
                      {user.specialFont ? (
                        <label
                          className={`${user.specialFont} small text-gray-500`}
                        >
                          Fichier STL / DXF
                        </label>
                      ) : (
                        ""
                      )}
                      <div
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e)}
                      >
                        <div
                          className={`${
                            status
                              ? "border-gray-500 dark:border-gray-400"
                              : showMissingField && file.length < 1
                                ? "border-red-500"
                                : "border-gray-300 dark:border-night-600"
                          } ${
                            percent != 0 ? "hidden" : "block"
                          } dropzone mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md`}
                        >
                          <div className="space-y-1 text-center">
                            <CubeIcon
                              className={`mx-auto h-12 w-12 ${
                                status
                                  ? "text-brand-magenta"
                                  : showMissingField && file.length < 1
                                    ? "text-red-500"
                                    : "text-gray-400 dark:text-gray-300"
                              }`}
                            />
                            <div className="flex text-sm text-gray-600 dark:text-gray-300">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-magenta text-brand-magenta hover:text-brand-magenta-dark"
                              >
                                <span>Choisir un fichier</span>
                                <input
                                  onChange={handleChange}
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  accept=".stl, .obj, .step, .dxf"
                                  className="sr-only"
                                />
                              </label>
                              <p className="pl-1 hidden md:block">
                                ou déposez-le
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              STL, obj, STEP, DXF jusqu'à 20MB
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* progress bar */}
                      {file.length && userClick > 0 ? (
                        <div className="flex items-center w-full h-5 bg-brand-magenta/10 rounded-lg overflow-hidden mt-5">
                          <div
                            role="progressbar"
                            aria-valuenow={percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="flex items-center justify-center self-stretch transition-all duration-500 ease-out bg-brand-magenta text-white text-sm font-semibold"
                            style={{ width: `${percent}%` }}
                          >
                            {percent}%
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {file.length >= 1
                        ? file.map((r, index) => {
                            if (r[0] == null) return null;
                            return (
                              <div key={`file-${index}`} className="block mt-3">
                                <p className="text-md font-semibold text-gray-700 dark:text-white">
                                  {r[0].name}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFile(
                                      file.filter(function (item) {
                                        return item !== r;
                                      }),
                                    );
                                  }}
                                  className="mt-3 inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded focus:ring text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-night-800 border-gray-200 dark:border-night-700 hover:bg-gray-200 dark:hover:bg-night-700 focus:ring-brand-magenta focus:ring-opacity-50"
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
                <div className="px-4 py-3 text-right sm:px-6">
                  <button
                    onClick={(e) => {
                      setUserClick(true);
                      handleSubmit(e);
                    }}
                    type="submit"
                    className="submit-button justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-magenta hover:bg-brand-magenta-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-magenta disabled:bg-brand-magenta/50 disabled:cursor-not-allowed"
                    disabled={userClick}
                  >
                    <p>Valider et envoyer mon fichier</p>
                    {user.specialFont ? (
                      <p className={`${user.specialFont} small text-white/80`}>
                        Type de matériaux
                      </p>
                    ) : (
                      ""
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200 dark:border-night-800" />
          </div>
        </div>
      </div>
    </LayoutPanel>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  const authorizations = cookies.jwt
    ? await fetchAPIAuth("/user/authorization/", cookies.jwt)
    : null;
  const projectTypeList = await fetchAPIAuth("/projectType/");
  const materialList = await fetchAPIAuth("/material/");

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

  return {
    props: {
      authorizations: authorizations.data,
      projectType: projectTypeList.data,
      materials: materialList.data,
    }, // will be passed to the page component as props
  };
}
