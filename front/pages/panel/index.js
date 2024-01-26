import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon, TrashIcon } from "@heroicons/react/solid";
import "moment/locale/fr";

import LayoutPanel from "../../components/layoutPanel";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { useRouter } from "next/router";
import Moment from "react-moment";
import { isUserConnected, setZero } from "../../lib/function";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Seo from "../../components/seo";
import WebSocket from "../../components/webSocket";
import Faq from "../../components/faq";

import { UserUse } from "../../context/provider";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NewPanel({ authorizations, highDemand }) {
  const jwt = getCookie("jwt");
  const { user, setUser, darkMode, roles } = UserUse(jwt);

  const [maxPage, setMaxPage] = useState(1);
  const [actualPage, setActualPage] = useState(0);
  let newActualPage = 0;
  const [userTicketResult, setUserTicketResult] = useState([]);
  const faq = [
    {
      question: "Quels sont les fichiers acceptés ?",
      answer:
        "Les fichiers doivent être des fichiers 3D au format STL pour être accepté.",
    },
    {
      question: "Quand est que ma pièce sera réalisée ?",
      answer:
        "Cela dépend du nombre de pièces dans le ticket et du nombre total de demandes que nous avons actuellement. Cela est donc très variable. Nous pouvons mettre jusqu'à deux semaines pour traiter une demande. Merci de prévoir du temps pour que nous puissions traiter votre demande. Nous ne pouvons pas imprimer une pièce du jour au lendemain.",
    },
    {
      question: "Quels sont les types de projets que je peux réaliser ?",
      answer:
        "Les projets doivent avoir un but pédagogique. Cela peut être un projet demandé par l'école ou un projet personnel. Tous les fichiers 3D sont accepté, tant que vous avez réalisé la modélisation, qui ne s'agit pas d'une arme/objet choquant et que l'impression 3D est la meilleure solution pour cette pièce.",
    },
    // More questions...
  ];

  const router = useRouter();
  function realodPage() {
    router.replace(router.asPath);
  }

  useEffect(function () {
    if (user.error != undefined) {
      router.push("/404");
    }
    update();
  }, []);

  function nextPrevPage(addPage) {
    if (actualPage + addPage < 0 || actualPage + addPage >= maxPage) return;
    setActualPage(actualPage + addPage);
    newActualPage = actualPage + addPage;
    update();
  }

  async function update(newReserch) {
    if (newReserch) setActualPage(0);
    const cookie = getCookie("jwt");
    const responseGetTicket = await fetchAPIAuth({
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: cookie,
      },

      url: process.env.API + "/api/ticket/me",
      params: { page: newActualPage },
    });

    if (!responseGetTicket.error) {
      setMaxPage(responseGetTicket.data.maxPage);
      setUserTicketResult(responseGetTicket.data.values);
    } else {
      toast.error("Une erreur est survenue lors du chargement des tickets.", {
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

  const deleteTicket = async (id) => {
    const cookie = getCookie("jwt");
    const responseDeleteTicket = await fetchAPIAuth({
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: cookie,
      },

      url: process.env.API + "/api/ticket/" + id,
      data: { page: newActualPage },
    });

    if (!responseDeleteTicket.error) {
      toast.success("Le ticket #" + setZero(id) + " a été supprimé.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error(
        "Une erreur est survenue lors de la suppression du ticket #" +
          setZero(id) +
          ".",
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
    }
    router.replace(router.asPath);
  };

  return (
    <LayoutPanel
      user={user}
      setUser={setUser}
      role={roles}
      authorizations={authorizations}
      titleMenu={"Panel de demande d'impression 3D"}
    >
      <Seo title={"Panel"} />
      <WebSocket realodPage={realodPage} event={[]} userId={user.id} />

      {/* Dernières activités */}
      <div className="py-6 px-3">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="col-span-3">
            <nav
              aria-label="Sidebar"
              className="sticky top-6 divide-y divide-gray-300"
            >
              <Faq className="w-full" darkMode={darkMode} questions={faq} />
            </nav>
          </div>
          <hr
            className={`mb-5 mt-5 block lg:hidden ${
              darkMode ? "border-gray-600" : ""
            }`}
          />
          <main className="col-span-9">
            {highDemand ? (
              <div
                className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
                role="alert"
              >
                <p className="font-bold">Attention</p>
                <p>
                  Il y a actuellement beaucoup de demandes d'impression 3D.
                  Merci pour votre patience.
                </p>
              </div>
            ) : (
              <div></div>
            )}
            <h1
              className={`text-lg font-medium leading-6 sm:truncate mt-5 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Vos demandes d'impressions 3D
            </h1>
            <div className="block mt-5">
              {/* big projects */}
              <div
                className={`align-middle inline-block min-w-full border-b hidden sm:block ${
                  darkMode ? "border-gray-800" : "border-gray-200"
                }`}
              >
                {userTicketResult.length > 0 ? (
                  <div>
                    <div
                      className={`border rounded overflow-x-auto min-w-full ${
                        darkMode ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <table className="min-w-full text-sm align-middle whitespace-nowrap">
                        <thead>
                          <tr
                            className={`border-b ${
                              darkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                          >
                            <th
                              className={`p-3 font-medium text-sm tracking-wider uppercase text-center ${
                                darkMode
                                  ? "text-white bg-gray-600"
                                  : "text-gray-700 bg-gray-100"
                              }`}
                            >
                              Id
                            </th>
                            <th
                              className={`p-3 font-medium text-sm tracking-wider uppercase text-center ${
                                darkMode
                                  ? "text-white bg-gray-600"
                                  : "text-gray-700 bg-gray-100"
                              }`}
                            >
                              Dernière mise à jour
                            </th>
                            <th
                              className={`p-3 font-medium text-sm tracking-wider uppercase text-center ${
                                darkMode
                                  ? "text-white bg-gray-600"
                                  : "text-gray-700 bg-gray-100"
                              }`}
                            >
                              Type
                            </th>
                            <th
                              className={`p-3 font-medium text-sm tracking-wider uppercase text-center ${
                                darkMode
                                  ? "text-white bg-gray-600"
                                  : "text-gray-700 bg-gray-100"
                              }`}
                            >
                              Etat
                            </th>
                            <th
                              className={`p-3 font-medium text-sm tracking-wider uppercase text-center ${
                                darkMode
                                  ? "text-white bg-gray-600"
                                  : "text-gray-700 bg-gray-100"
                              }`}
                            ></th>
                          </tr>
                        </thead>
                        <tbody>
                          {userTicketResult.map((r, index) => {
                            return (
                              <tr
                                key={`ticket-${index}`}
                                className={`ticket-element border-b cursor-pointer ${
                                  darkMode
                                    ? "border-gray-700 hover:bg-gray-700 bg-gray-800 text-white"
                                    : "border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                <td
                                  className={`p-3 text-center`}
                                  onClick={() => router.push(`/panel/${r.id}`)}
                                >
                                  <span className="font-medium">
                                    #{setZero(r.id)}
                                  </span>
                                </td>
                                <td
                                  className={`p-3 text-center`}
                                  onClick={() => router.push(`/panel/${r.id}`)}
                                >
                                  <div
                                    className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-ful`}
                                  >
                                    <Moment
                                      format="Do MMM YYYY à HH:mm"
                                      locale="fr"
                                    >
                                      {r.modificationDate}
                                    </Moment>
                                  </div>
                                </td>
                                <td
                                  className={`p-3 text-center`}
                                  onClick={() => router.push(`/panel/${r.id}`)}
                                >
                                  <div
                                    className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-ful`}
                                  >
                                    {r.projectType}
                                  </div>
                                </td>
                                <td
                                  className={`p-3 text-center`}
                                  onClick={() => router.push(`/panel/${r.id}`)}
                                >
                                  <div
                                    className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-ful`}
                                  >
                                    {r.statusName}
                                  </div>
                                </td>
                                <td className={`p-3 text-center`}>
                                  <Menu
                                    as="div"
                                    className="relative flex justify-end items-center"
                                  >
                                    <Menu.Button
                                      className={`open-delete-button w-8 h-8 inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
                                        darkMode
                                          ? "bg-gray-600 hover:bg-gray-500 text-gray-200 hover:text-gray-100"
                                          : "bg-white text-gray-400 hover:text-gray-500"
                                      }`}
                                    >
                                      <span className="sr-only">
                                        Open options
                                      </span>
                                      <DotsVerticalIcon
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                      />
                                    </Menu.Button>
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95"
                                    >
                                      <Menu.Items className="mx-3 origin-top-right absolute right-7 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                                        <div className="py-1">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <a
                                                onClick={() =>
                                                  deleteTicket(r.id)
                                                }
                                                className={classNames(
                                                  active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700",
                                                  "delete-button group flex items-center px-4 py-2 text-sm"
                                                )}
                                              >
                                                <TrashIcon
                                                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 group-hover:cursor-pointer"
                                                  aria-hidden="true"
                                                />
                                                Supprimer
                                              </a>
                                            )}
                                          </Menu.Item>
                                        </div>
                                      </Menu.Items>
                                    </Transition>
                                  </Menu>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="grid place-items-center mb-10">
                      <div className="inline-flex mt-3">
                        <button
                          className={`prev-page-button font-bold py-2 px-4 rounded-l rounded-r mr-2 text-gray-800 ${
                            darkMode
                              ? "bg-gray-200 hover:bg-gray-100"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          onClick={() => nextPrevPage(-1)}
                        >
                          &lt;
                        </button>
                        <div
                          className={`inline-flex py-2 px-4 ${
                            darkMode ? "text-gray-200" : ""
                          }`}
                        >
                          Pages&nbsp;
                          <p className="font-bold">{actualPage + 1}</p>
                          &nbsp;sur&nbsp;
                          <p className="font-bold">
                            {maxPage != 0 ? maxPage : 1}
                          </p>
                        </div>
                        <button
                          className={`next-page-button font-bold py-2 px-4 rounded-l rounded-r ml-2 mr-6 text-gray-800 ${
                            darkMode
                              ? "bg-gray-200 hover:bg-gray-100"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          onClick={() => nextPrevPage(1)}
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-4 md:p-5 rounded flex justify-between ${
                      darkMode
                        ? "text-white bg-gray-700"
                        : "text-gray-700 bg-gray-100"
                    }`}
                  >
                    <p>
                      Les demandes d'impressions apparaîteront ici. Pour en
                      créer une, cliquez sur le bouton suivant.
                    </p>
                    <Link href="/panel/new/">
                      <div
                        className={`inline-flex items-center space-x-1 font-semibold ml-2 ${
                          darkMode
                            ? "text-indigo-500 hover:text-indigo-300"
                            : "text-indigo-600 hover:text-indigo-400"
                        }`}
                      >
                        <span>Créer une demande</span>
                        <svg
                          className={`hi-solid hi-arrow-right inline-block w-4 h-4 ${
                            darkMode ? "fill-white" : ""
                          }`}
                          fillname="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </main>
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
  const highDemand = cookies.jwt
    ? await fetchAPIAuth("/ticket/highDemand/", cookies.jwt)
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
  //const user = await fetchAPIAuth("/user/me", cookies.jwt);
  //const resUserConnected = isUserConnected(user);
  //if (resUserConnected) return resUserConnected;
  //const role = await fetchAPIAuth("/user/role", cookies.jwt);

  return {
    props: {
      //user: user.data,
      //role: role.data,
      authorizations: authorizations.data,
      highDemand: highDemand.data?.result ? highDemand.data.result : false,
    }, // will be passed to the page component as props
  };
}
