import { useState, useRef } from "react";
import LayoutPanel from "../../components/layoutPanel";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import Seo from "../../components/seo";
import router from "next/router";
import WebSocket from "../../components/webSocket";
import sha256 from "sha256";

import { UserUse } from "../../context/provider";

export default function Settings({ authorizations }) {
  const jwt = getCookie("jwt");
  const { user, darkMode } = UserUse(jwt);

  const [newPassword, setNewPassword] = useState(null);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(null);
  const [actualPassword, setActualPassword] = useState(null);

  const actualPasswordRef = useRef(null);
  const password1Ref = useRef(null);
  const password2Ref = useRef(null);

  function realodPage() {
    router.replace(router.asPath);
  }

  async function changePassword() {
    if (
      newPassword == null ||
      newPasswordConfirm == null ||
      newPassword != newPasswordConfirm ||
      newPassword.length < 1
    ) {
      toast.warning("Vos mots de passes ne sont pas identiques.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      actualPasswordRef.current.value = "";
      password1Ref.current.value = "";
      password2Ref.current.value = "";
    } else {
      const cookie = getCookie("jwt");
      const responseUpdatePassword = await fetchAPIAuth({
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          dvflCookie: cookie,
        },
        url: process.env.API + "/api/user/password/",
        data: {
          actualPassword: sha256(actualPassword),
          newPassword: sha256(newPassword),
        },
      });

      if (responseUpdatePassword.error) {
        actualPasswordRef.current.value = "";
        password1Ref.current.value = "";
        password2Ref.current.value = "";
        toast.error(
          "Une erreur est survenue, veuillez réessayer. Vérifiez que votre mot de passe actuel est correct.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else if (responseUpdatePassword.status === 204) {
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
      }
    }
  }

  return (
    <LayoutPanel authorizations={authorizations} titleMenu="Paramètres">
      <Seo title={"Paramètres"} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />
      <div className="px-10 py-10" id="status">
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3
                  className={`text-lg font-medium leading-6 ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  Mes informations
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Vous pouvez éditer sur cette page votre mot de passe. Si vous
                  souhaitez modifier un autre paramètre, merci de nous contacter
                  directement par mail à fablab@devinci.fr.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div
                    className={`px-4 py-5 space-y-6 sm:p-6 ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div>
                      <label
                        htmlFor="lastName"
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Nom
                      </label>
                      <div className="mt-1">
                        <input
                          disabled
                          type="text"
                          name="lastName"
                          id="lastName"
                          className={`shadow-sm block w-full sm:text-sm rounded-md ${
                            darkMode
                              ? "placeholder-gray-300 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                              : "placeholder-gray-400 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                          }`}
                          value={user.lastName}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="firstName"
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Prénom
                      </label>
                      <div className="mt-1">
                        <input
                          disabled
                          type="text"
                          name="firstName"
                          id="firstName"
                          className={`shadow-sm block w-full sm:text-sm rounded-md ${
                            darkMode
                              ? "placeholder-gray-300 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                              : "placeholder-gray-400 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                          }`}
                          value={user.firstName}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        E-mail
                      </label>
                      <div className="mt-1">
                        <input
                          disabled
                          type="email"
                          name="email"
                          id="email"
                          className={`shadow-sm block w-full sm:text-sm rounded-md ${
                            darkMode
                              ? "placeholder-gray-300 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                              : "placeholder-gray-400 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                          }`}
                          value={user.email}
                        />
                      </div>
                    </div>
                    <div>
                      <h1
                        className={`text-lg font-medium leading-6 ${
                          darkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        Changer mon mot de passe
                      </h1>
                      <div>
                        <label
                          htmlFor="actualPassword"
                          className={`block text-sm mt-2 font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Mot de passe actuel
                        </label>
                        <div className="mt-1">
                          <input
                            onChange={(e) => setActualPassword(e.target.value)}
                            type="password"
                            name="actualPassword"
                            id="actualPassword"
                            ref={actualPasswordRef}
                            className={`actual-password-input shadow-sm block w-full sm:text-sm rounded-md ${
                              darkMode
                                ? "placeholder-gray-300 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                                : "placeholder-gray-400 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                            }`}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className={`block text-sm mt-6 font-medium ${
                            darkMode ? "text-white" : "text-gray-700"
                          }`}
                        >
                          Mot de passe
                        </label>
                        <div className="mt-1">
                          <input
                            onChange={(e) => setNewPassword(e.target.value)}
                            type="password"
                            name="password"
                            id="password"
                            ref={password1Ref}
                            className={`new-password-input shadow-sm block w-full sm:text-sm rounded-md ${
                              darkMode
                                ? "placeholder-gray-300 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                                : "placeholder-gray-400 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                            }`}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className={`block text-sm mt-6 font-medium ${
                            darkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          Confirmer votre mot de passe
                        </label>
                        <div className="mt-1">
                          <input
                            onChange={(e) =>
                              setNewPasswordConfirm(e.target.value)
                            }
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            ref={password2Ref}
                            className={`confirm-new-password-input shadow-sm block w-full sm:text-sm rounded-md ${
                              darkMode
                                ? "placeholder-gray-300 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-700 focus:ring-indigo-700"
                                : "placeholder-gray-400 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {user.isMicrosoft == 0 ? (
                  <div
                    className={`px-4 py-3 text-right sm:px-6 ${
                      darkMode ? "border-gray-600" : "bg-gray-50"
                    }`}
                  >
                    <button
                      onClick={() => changePassword()}
                      type="submit"
                      className="validate-button inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            <div
              className={`border-t ${
                darkMode ? "border-gray-600" : "border-gray-200"
              }`}
            />
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

  return {
    props: {
      authorizations: authorizations.data,
    }, // will be passed to the page component as props
  };
}
