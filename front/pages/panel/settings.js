import { useState, useRef } from "react";
import LayoutPanel from "../../components/layoutPanel";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { getApi } from "../../lib/runtimeEnv";
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
        url: getApi() + "/api/user/password/",
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
          },
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
                <p className="font-mono text-xs uppercase tracking-wider text-brand-blue mb-2">
                  // Paramètres
                </p>
                <h3
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                >
                  Mes informations
                </h3>
                <p
                  className="mt-1 text-sm text-gray-600 dark:text-gray-300"
                >
                  Vous pouvez éditer sur cette page votre mot de passe. Si vous
                  souhaitez modifier un autre paramètre, merci de nous contacter
                  directement par mail à fablab@devinci.fr.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div>
                <div className="rounded-md overflow-hidden border border-gray-200 dark:border-night-800">
                  <div className="px-4 py-5 space-y-6 sm:p-6 bg-white dark:bg-night-900">
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Nom
                      </label>
                      {user.specialFont ? (
                        <label
                          className={`${user.specialFont} small text-gray-500`}
                        >
                          Nom
                        </label>
                      ) : (
                        ""
                      )}
                      <div className="mt-1">
                        <input
                          disabled
                          type="text"
                          name="lastName"
                          id="lastName"
                          className="shadow-sm block w-full sm:text-sm rounded-md placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 focus:border-brand-magenta focus:ring-brand-magenta"
                          value={user.lastName}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Prénom
                      </label>
                      {user.specialFont ? (
                        <label
                          className={`${user.specialFont} small text-gray-500`}
                        >
                          Prénom
                        </label>
                      ) : (
                        ""
                      )}
                      <div className="mt-1">
                        <input
                          disabled
                          type="text"
                          name="firstName"
                          id="firstName"
                          className="shadow-sm block w-full sm:text-sm rounded-md placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 focus:border-brand-magenta focus:ring-brand-magenta"
                          value={user.firstName}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        E-mail
                      </label>
                      {user.specialFont ? (
                        <label
                          className={`${user.specialFont} small text-gray-500`}
                        >
                          E-mail
                        </label>
                      ) : (
                        ""
                      )}
                      <div className="mt-1">
                        <input
                          disabled
                          type="email"
                          name="email"
                          id="email"
                          className="shadow-sm block w-full sm:text-sm rounded-md placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 focus:border-brand-magenta focus:ring-brand-magenta"
                          value={user.email}
                        />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Changer mon mot de passe
                      </h1>
                      {user.specialFont ? (
                        <p
                          className={`${user.specialFont} small text-gray-500`}
                        >
                          Changer mon mot de passe
                        </p>
                      ) : (
                        ""
                      )}
                      <div>
                        <label
                          htmlFor="actualPassword"
                          className="block text-sm mt-2 font-medium text-gray-700 dark:text-gray-300"
                        >
                          Mot de passe actuel
                        </label>
                        {user.specialFont ? (
                          <label
                            className={`${user.specialFont} small text-gray-500`}
                          >
                            Mot de passe actuel
                          </label>
                        ) : (
                          ""
                        )}
                        <div className="mt-1">
                          <input
                            onChange={(e) => setActualPassword(e.target.value)}
                            type="password"
                            name="actualPassword"
                            id="actualPassword"
                            ref={actualPasswordRef}
                            className="actual-password-input shadow-sm block w-full sm:text-sm rounded-md placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 focus:border-brand-magenta focus:ring-brand-magenta"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm mt-6 font-medium text-gray-700 dark:text-gray-200"
                        >
                          Mot de passe
                        </label>
                        {user.specialFont ? (
                          <label
                            className={`${user.specialFont} small text-gray-500`}
                          >
                            Mot de passe
                          </label>
                        ) : (
                          ""
                        )}
                        <div className="mt-1">
                          <input
                            onChange={(e) => setNewPassword(e.target.value)}
                            type="password"
                            name="password"
                            id="password"
                            ref={password1Ref}
                            className="new-password-input shadow-sm block w-full sm:text-sm rounded-md placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 focus:border-brand-magenta focus:ring-brand-magenta"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm mt-6 font-medium text-gray-700 dark:text-gray-200"
                        >
                          Confirmer votre mot de passe
                        </label>
                        {user.specialFont ? (
                          <label
                            className={`${user.specialFont} small text-gray-500`}
                          >
                            Confirmer votre mot de passe
                          </label>
                        ) : (
                          ""
                        )}
                        <div className="mt-1">
                          <input
                            onChange={(e) =>
                              setNewPasswordConfirm(e.target.value)
                            }
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            ref={password2Ref}
                            className="confirm-new-password-input shadow-sm block w-full sm:text-sm rounded-md placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-night-700 bg-white dark:bg-night-800 text-gray-900 dark:text-gray-200 focus:border-brand-magenta focus:ring-brand-magenta"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {user.isMicrosoft == 0 ? (
                  <div
                    className={`px-4 py-3 text-right sm:px-6 border-gray-600`}
                  >
                    <button
                      onClick={() => changePassword()}
                      type="submit"
                      className="validate-button justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-magenta hover:bg-brand-magenta-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-magenta"
                    >
                      <p>Valider et changer mon mot de passe</p>
                      {user.specialFont ? (
                        <p
                          className={`${user.specialFont} small text-white/80`}
                        >
                          Valider et changer mon mot de passe
                        </p>
                      ) : (
                        ""
                      )}
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
    }, // will be passed to the page component as props
  };
}
