import React from "react";
import { useState } from "react";
import LayoutPanel from "../../components/layoutPanel";
import axios from "axios";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { isUserConnected } from "../../lib/function";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import Seo from "../../components/seo";
import router from "next/router";
import WebSocket from "../../components/webSocket";

export default function Settings({ user, role, authorizations }) {
  const [newPassword, setNewPassword] = useState(null);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(null);
  const [actualPassword, setActualPassword] = useState(null);

  function realodPage() {
    router.replace(router.asPath);
  }

  async function changePassword() {
    if (newPassword == null || newPasswordConfirm == null || newPassword != newPasswordConfirm || newPassword.length < 1) {
      toast.warning("Vos mots de passes ne sont pas identiques.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      await axios({
        method: "PUT",
        url: process.env.API + "/api/user/password/",
        data: {
          actualPassword,
          newPassword,
        },
        headers: {
          dvflCookie: getCookie("jwt"),
        },
      })
        .then((response) => {
          if (response.status === 204) {
            toast.error("Votre mot de passe actuel est incorrect.", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            toast.success("Votre mot de passe a été modifié !", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            document.getElementById("actualPassword").value = "";
            document.getElementById("password").value = "";
            document.getElementById("confirmPassword").value = "";
          }
        })
        .catch((e) => {
          toast.error("Une erreur est survenue, veuillez réessayer. Vérifiez que votre mot de passe actuel est correct.", {
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
  }

  return (
    <LayoutPanel user={user} role={role} authorizations={authorizations} titleMenu="Paramètres">
      <Seo title={"Paramètres"} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />
      <div className="px-10 py-10" id="status">
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Mes informations</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Vous pouvez éditer sur cette page votre mot de passe. Si vous souhaitez modifier un autre paramètre, merci de nous contacter directement par mail à
                  fablab@devinci.fr.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Nom
                      </label>
                      <div className="mt-1">
                        <input
                          disabled
                          type="text"
                          name="lastName"
                          id="lastName"
                          className="text-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={user.lastName}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Prénom
                      </label>
                      <div className="mt-1">
                        <input
                          disabled
                          type="text"
                          name="firstName"
                          id="firstName"
                          className="text-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={user.firstName}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        E-mail
                      </label>
                      <div className="mt-1">
                        <input
                          disabled
                          type="email"
                          name="email"
                          id="email"
                          className="text-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={user.email}
                        />
                      </div>
                    </div>
                    {user.isMicrosoft == 0 ? (
                      <div>
                        <h1 className="text-lg font-medium leading-6 text-gray-900">Changer mon mot de passe</h1>
                        <div>
                          <label htmlFor="actualPassword" className="block text-sm font-medium text-gray-700">
                            Mot de passe actuel
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) => setActualPassword(e.target.value)}
                              type="password"
                              name="actualPassword"
                              id="actualPassword"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mot de passe
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) => setNewPassword(e.target.value)}
                              type="password"
                              name="password"
                              id="password"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirmer votre mot de passe
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) => setNewPasswordConfirm(e.target.value)}
                              type="password"
                              name="confirmPassword"
                              id="confirmPassword"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
                {user.isMicrosoft == 0 ? (
                  <div className={`px-4 py-3 bg-gray-50 text-right sm:px-6`}>
                    <button
                      onClick={() => changePassword()}
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Valider et changer mon mot de passe
                    </button>
                  </div>
                ) : (
                  <div></div>
                )}
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

  return {
    props: { user, role, authorizations }, // will be passed to the page component as props
  };
}
