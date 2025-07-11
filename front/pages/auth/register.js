import { useState, useRef } from "react";
import router from "next/router";
import { toast } from "react-toastify";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import sha256 from "sha256";

export default function Register() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(false);
  const [name, setName] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [checked, setChecked] = useState(false);

  const password1Ref = useRef(null);
  const password2Ref = useRef(null);

  async function register(e) {
    e.preventDefault(); // Don't reload page on form submit
    if (firstName == null) {
      toast.warn("Merci de renseigner votre prénom", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (name == null) {
      toast.warn("Merci de renseigner votre nom", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (email == null) {
      toast.warn("Merci de renseigner votre email", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (
      confirmPassword == null ||
      password == null ||
      password != confirmPassword
    ) {
      toast.warn("Vos mots de passes ne correspondent pas", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      password1Ref.current.value = "";
      password2Ref.current.value = "";
    } else {
      const responseRegister = await fetchAPIAuth({
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        url: process.env.API + "/api/user/register",
        data: {
          firstName,
          lastName: name,
          email,
          password: sha256(password),
        },
      });

      if (responseRegister.status == 200) {
        toast.success(
          "Votre compte a été créé avec succès. Veuillez consulter votre adresse mail pour valider votre compte",
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
        router.push("/auth");
      } else if (responseRegister.error) {
        console.log(error);
        setError(true);
        setTimeout(() => setError(false), 5000);
        toast.error(
          "Impossible de vous inscrire. Vérifiez que vous ayez remplis tous les champs.",
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
              alt="Workflow"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Enregistrez-vous sur MyFab
            </h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form className="mt-8" onSubmit={register}>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium ${
                        error ? "text-red-500" : "text-gray-700"
                      }`}
                    >
                      Nom
                    </label>
                    <div className="mt-1">
                      <input
                        onChange={(e) => setName(e.target.value)}
                        id="name"
                        name="name"
                        type="text"
                        required
                        className={`lastname appearance-none block w-full px-3 py-2 border ${
                          error ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="firstname"
                      className={`block text-sm font-medium ${
                        error ? "text-red-500" : "text-gray-700"
                      }`}
                    >
                      Prénom
                    </label>
                    <div className="mt-1">
                      <input
                        onChange={(e) => setFirstName(e.target.value)}
                        id="firstname"
                        name="firstname"
                        type="text"
                        required
                        className={`firstname appearance-none block w-full px-3 py-2 border ${
                          error ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                    </div>
                  </div>
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
                        type={`${checked ? "text" : "password"}`}
                        autoComplete="current-password"
                        required
                        ref={password1Ref}
                        className={`password1 appearance-none block w-full px-3 py-2 border ${
                          error ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="confirmPassword"
                      className={`block text-sm font-medium ${
                        error ? "text-red-500" : "text-gray-700"
                      }`}
                    >
                      Confirmer mon mot de passe
                    </label>
                    <div className="mt-1">
                      <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        id="confirmPassword"
                        name="confirmPassword"
                        type={`${checked ? "text" : "password"}`}
                        autoComplete="current-password"
                        required
                        ref={password2Ref}
                        className={`password2 appearance-none block w-full px-3 py-2 border ${
                          error ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="show-password"
                        name="show-password"
                        type="checkbox"
                        onChange={() => setChecked(!checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="show-password"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Afficher mon mot de passe
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="submit-button w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      S'enregistrer
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
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
