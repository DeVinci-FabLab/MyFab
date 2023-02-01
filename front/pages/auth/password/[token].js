import axios from "axios";
import router from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchAPIAuth, parseCookies } from "../../../lib/api";

export default function Forget({ params }) {
  const [password1, setPassword1] = useState(null);
  const [password, setPassword] = useState(null);

  const passwordReset = async (e) => {
    const { token } = router.query
    console.log(token);
    if (password1 == password) {
      await axios({
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        url: process.env.API + '/api/user/resetPassword/' + token,
        data: {
          newPassword: password
        },
      }).then((response) => {
        if (response.status == 200) {
          toast.success("Votre nouveau mot de passe a été enregistré. Vous pouvez désormais vous connecter.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          router.push('/auth');
        } else {
          toast.warning("Votre mot de passe n'a pas pu rénitialisé. Vérifiez que vous ayez bien cliqué sur le bon lien de rénitialisation, ou que votre nouveau mot de passe est valide.", {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
        .catch((error) => {
          console.log(error);
          toast.error("Votre mot de passe n'a pas pu rénitialisé. Vérifiez que vous ayez bien cliqué sur le bon e-mail, ou que votre nouveau mot de passe est valide.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
    } else {
      toast.error("Vos mots de passes ne correspondent pas.", {
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
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              className="h-12 w-auto"
              src="/logo.png"
              alt="Workflow"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Rénitialiser mon mot de passe</h2>
          </div>

          <div className="mt-8">
            <div className="">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Confirmer mon mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      onChange={(e) => setPassword1(e.target.value)}
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    onClick={() => passwordReset()}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Valider le changement de mot de passe
                  </button>
                </div>
              </div>
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
  )
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  const user = await fetchAPIAuth("/user/me", cookies.jwt);

  if(user.error == null){
    return {
      redirect: {
        permanent: false,
        destination: "/panel/",
      },
      props:{},
    };  }

  return {
    props: { }, // will be passed to the page component as props
  }
}