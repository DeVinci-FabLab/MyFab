import "moment/locale/fr";

import { fetchAPIAuth, parseCookies } from "../lib/api";
import router from "next/router";
import { getCookie } from "cookies-next";
import axios from "axios";
import { toast } from "react-toastify";
import RulesText from "../components/rules";

async function validateRules() {
  const jwt = getCookie("jwt");
  const responseValidRules = await fetchAPIAuth({
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: process.env.API + "/api/user/validateRules/",
    headers: {
      dvflCookie: jwt,
    },
  });
  if (responseValidRules.status >= 300) {
    toast.error("Une erreur est survenue lors de la validation.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  } else if (responseValidRules.status === 200) {
    toast.success("Vous avez validé le règlement.", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } else if (responseValidRules.status === 204) {
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
    const responseAuth = await fetchAPIAuth({
      method: "GET",
      headers: {
        dvflCookie: jwt,
      },
      url: process.env.API + "/api/user/authorization",
    });

    if (responseAuth.data.myFabAgent == 1) {
      router.push("/panel/admin");
    } else {
      router.push("/panel");
    }
  }, 1500);
}

const date = new Date();

export default function Rules({ userNeedToAccept, darkMode }) {
  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      <div className="max-w-3xl m-auto text-center space-y-3 ">
        <h1
          className={`font-semibold leading-6 text-xl ${
            darkMode ? "text-gray-200" : ""
          }`}
        >
          Avant d'accéder à MyFab, vous devez accepter notre règlement.
        </h1>
        <p
          className={`font-light text-md ${
            darkMode ? "text-gray-200" : "text-gray-500"
          }`}
        >
          Les présentes conditions générales d'utilisation (dites « CGU ») ont
          pour objet l'encadrement juridique des modalités de mise à disposition
          du site et des services par le DeVinci FabLab et de définir les
          conditions d’accès et d’utilisation des services par « l'Utilisateur
          ». Vous pouvez à tout moment nous contacter à fablab@devinci.fr si
          vous souhaitez faire valoir vos droits.
        </p>

        <div
          className={`prose max-w-4xl overflow-y-auto max-h-96 mx-5 p-5 shadow-sm block w-full ring-indigo-500 border-indigo-500 sm:text-sm border rounded-md text-left text-justify ${
            darkMode ? "text-gray-200 bg-gray-700" : ""
          }`}
        >
          <RulesText darkMode={darkMode} />
        </div>
        {userNeedToAccept ? (
          <div>
            <p className={`pb-4 ${darkMode ? "text-gray-200" : ""}`}>
              L'acceptation des règles a une validité jusqu'au 31 août{" "}
              {date.getMonth() >= 8
                ? date.getFullYear() + 1
                : date.getFullYear()}
              .
            </p>
            <button
              type="button"
              className="accept-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                validateRules();
              }}
            >
              J'ai lu et j'accepte le règlement
            </button>
          </div>
        ) : (
          <a
            href="/"
            className="back-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

  const darkMode = user.error ? false : user.data.darkMode;
  return {
    props: { userNeedToAccept, darkMode }, // will be passed to the page component as props
  };
}
