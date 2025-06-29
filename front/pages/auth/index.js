import { getCookie, setCookie } from "cookies-next";
import { useEffect, useState, useRef } from "react";
import router from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import sha256 from "sha256";

import { UserUse } from "../../context/provider";

export default function Auth() {
  const { setCookies } = UserUse();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(false);
  const [toastedLoad, setToastedLoad] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const passwordRef = useRef(null);

  useEffect(() => {
    if (!toastedLoad && router.query.close != null) {
      setToastedLoad(true);
      setCookie("adfs", false);
      toast.error(
        "MyFab est actuellement fermé merci de réessayer plus tard.",
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
    }
    if (!toastedLoad && router.query.error != null) {
      setToastedLoad(true);
      toast.error(
        "Il y a une erreur avec le système de connexion. Merci de réessayer plus tard.",
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
    }
    if (!toastedLoad && router.query.mail != null) {
      setToastedLoad(true);
      if (router.query.mail == "ok") {
        toast.success(
          "Votre e-mail a été vérifié. Vous pouvez désormais vous connecter.",
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
      } else {
        toast.error(
          "Une erreur est survenue lors de la vérification de votre e-mail.",
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
      }
    } else {
      // Connection avec le DVIC
      const adfs = getCookie("adfs");
      if (adfs) router.push(process.env.API + "/api/user/login/adfs/");
    }

    const handleKeyPress = (e) => {
      try {
        const isCapsLockActive = e.getModifierState("CapsLock");

        setCapsLockActive(isCapsLockActive);
      } catch (error) {}
    };

    // Ajoutez un écouteur d'événements pour la touche pressée
    window.addEventListener("keydown", handleKeyPress);

    // Retirez l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  async function login(e) {
    e.preventDefault(); // Don't reload page on form submit
    const expires = new Date(Date.now() + (!checked ? 7200000 : 31536000000));
    const responseLogin = await fetchAPIAuth({
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      url: process.env.API + "/api/user/login",
      data: {
        email,
        password: sha256(password),
        rememberMe: checked,
        expires: expires,
      },
    });

    if (responseLogin.status == 200) {
      setCookie("jwt", responseLogin.data.dvflCookie, { expires });
      setCookies(responseLogin.data.dvflCookie);

      const responseAuth = await fetchAPIAuth({
        method: "GET",
        headers: {
          dvflCookie: responseLogin.data.dvflCookie,
        },
        url: process.env.API + "/api/user/authorization",
      });

      if (responseAuth.data.myFabAgent == 1) {
        router.push("/panel/admin");
      } else {
        router.push("/panel");
      }
    } else if (responseLogin.status == 204) {
      toast.warning(
        "Votre adresse e-mail n'est pas validée. Veuillez vérifier vos mails.",
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
    } else if (responseLogin.error) {
      setError(true);
      setTimeout(() => setError(false), 5000);
      toast.error(
        "Impossible de vous connecter. Vérifiez votre mot de passe ou votre e-mail.",
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

      passwordRef.current.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              className="h-12 w-auto"
              src={process.env.BASE_PATH + "/logo.png"}
              alt="Devinci FabLab"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Connectez-vous à MyFab
            </h2>
          </div>

          <form className="mt-8" onSubmit={login}>
            <div className="mt-6">
              <div className="space-y-6">
                <div className="">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${
                      error ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    Adresse e-mail
                  </label>
                  <div className="mt-1">
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`email appearance-none block w-full px-3 py-2 border ${
                        error ? "border-red-300 " : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium ${
                      error ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    Mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      ref={passwordRef}
                      className={`password appearance-none block w-full px-3 py-2 border ${
                        error ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                </div>
                {capsLockActive && (
                  <p className="text-red-500">
                    <strong>La touche Ver Maj est active !</strong>
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link href="/auth/register">
                      <p className="font-medium text-blue-700 hover:text-blue-600">
                        Créer un compte
                      </p>
                    </Link>
                  </div>
                  <div className="text-sm">
                    <Link href="/auth/forget">
                      <p className="font-medium text-blue-700 hover:text-blue-600">
                        Mot de passe oublié ?
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    onChange={() => setChecked(!checked)}
                    className="rememberMe-button h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Se souvenir de moi
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    className="login-button w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-blue-600"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://media.lesechos.com/api/v1/images/view/5d9c7a8c3e45463dde1e2ad6/1280x720/0602009053500-web-tete.jpg"
          alt=""
        />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  const user = await fetchAPIAuth("/user/me", cookies.jwt);

  if (user.error == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/panel/",
      },
      props: {},
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}
