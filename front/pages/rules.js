import "moment/locale/fr";

import { fetchAPIAuth, parseCookies } from "../lib/api";
import router from "next/router";
import { getCookie } from "cookies-next";
import axios from "axios";
import { toast } from "react-toastify";
import RulesText from "../components/rules";

async function validateRules() {
  const jwt = getCookie("jwt");
  await axios({
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: process.env.API + "/api/user/validateRules/",
    headers: {
      dvflCookie: jwt,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        toast.success("Vous avez validé le règlement.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.warn("Vous avez déjà validé le règlement.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setTimeout(async () => {
        await axios({
          method: "GET",
          headers: {
            dvflCookie: jwt,
          },
          url: process.env.API + "/api/user/authorization",
        }).then((response) => {
          if (response.data.myFabAgent == 1) {
            router.push("/panel/admin");
          } else {
            router.push("/panel");
          }
        });
      }, 1500);
    })
    .catch((error) => {
      console.log(error);
      toast.error("Une erreur est survenue lors de la validation.", {
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

export default function Rules({ userNeedToAccept }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="max-w-3xl m-auto text-center space-y-3 ">
        <h1 className="font-semibold leading-6 text-xl">Avant d'accéder à MyFab, vous devez accepter notre règlement.</h1>
        <p className="font-light text-md text-gray-500">
          L'utilisation de MyFab étant réglementé, l'acceptation de ces règles est obligatoire. Vous pouvez à tout moment nous contacter à fablab@devinci.fr si vous souhaitez faire
          valoir vos droits.
        </p>

        <div className="prose max-w-4xl overflow-y-auto max-h-96 mx-5 p-5 shadow-sm block w-full ring-indigo-500 border-indigo-500 sm:text-sm border rounded-md text-left text-justify">
          <RulesText />
        </div>
        {userNeedToAccept ? (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              validateRules();
            }}
          >
            J'ai lu et j'accepte le règlement
          </button>
        ) : (
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retour
          </a>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  const user = await fetchAPIAuth("/user/me", cookies.jwt);
  let userNeedToAccept;
  if (user.error) {
    userNeedToAccept = false;
  } else if (user.acceptedRule == 1) {
    userNeedToAccept = false;
  } else {
    userNeedToAccept = true;
  }

  return {
    props: { userNeedToAccept }, // will be passed to the page component as props
  };
}
