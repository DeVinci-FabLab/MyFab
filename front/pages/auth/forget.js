import axios from "axios";
import { useState } from "react"
import router from "next/router";
import { toast } from "react-toastify";
import { fetchAPIAuth, parseCookies } from "../../lib/api";

export default function Forget() {
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(false);

  const forget = async (e) => {
    e.preventDefault();

    await axios({
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      url: process.env.API + '/api/user/forgottenPassword',
      data: {
        email
      },
    }).then((response) => {
      if (response.status == 200) {
        toast.success("Si un compte existe à l'adresse e-mail " + email + ", vous receverez votre lien de récupération d'ici quelques minutes. Pensez à vérifier vos spams.", {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        router.push('/auth');
      }
    })
      .catch((error) => {
        console.log(error);
        setError(true);
        setTimeout(() => setError(false), 5000);
        toast.error("Une erreur s'est produite. Veuillez réessayer dans quelques instants.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })

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
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Rénitialisez votre mot de passe</h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <div className="space-y-6">

                <div className="">
                  <label htmlFor="email" className={`block text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'}`}>
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
                      className={`appearance-none block w-full px-3 py-2 border ${error ? 'border-red-300 ' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                </div>




                <div>
                  <button
                    onClick={(e) => forget(e)}
                    onSubmit={(e) => forget(e)}
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Rénitialiser mon mot de passe
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