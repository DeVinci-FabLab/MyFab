import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { ChevronRightIcon, DotsVerticalIcon, TrashIcon } from "@heroicons/react/solid";
import "moment/locale/fr";

import LayoutPanel from "../../components/layoutPanel";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { useRouter } from "next/router";
import Moment from "react-moment";
import { getColor, isUserConnected, setZero } from "../../lib/function";
import { getCookie } from "cookies-next";
import axios from "axios";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import Seo from "../../components/seo";
import WebSocket from "../../components/webSocket";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NewPanel({ data, user, role, authorizations, highDemand }) {
  const [maxPage, setMaxPage] = useState(1);
  const [actualPage, setActualPage] = useState(0);
  let newActualPage = 0;
  const [userTicketResult, setIserTicketResult] = useState([]);
  const faq = [
    {
      question: "Quels sont les fichiers acceptés ?",
      answer: "Les fichiers doivent être des fichiers 3D au format STL pour être accepté.",
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
    const jwt = getCookie("jwt");
    await axios({
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: jwt,
      },
      url: process.env.API + "/api/ticket/me",
      params: { page: newActualPage },
    })
      .then((response) => {
        setMaxPage(response.data.maxPage);
        setIserTicketResult(response.data.values);
      })
      .catch(() => {
        toast.error("Une erreur est survenue lors du chargement des tickets.", {
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

  const deleteTicket = async (id) => {
    await axios({
      method: "DELETE",
      url: process.env.API + "/api/ticket/" + id,
      data,
      headers: {
        dvflCookie: `${getCookie("jwt")}`,
      },
    })
      .then(() => {
        toast.success("Le ticket #" + setZero(id) + " a été supprimé.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        update();
      })
      .catch(() => {
        toast.error("Une erreur est survenue lors de la suppression du ticket #" + setZero(id) + ".", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    router.replace(router.asPath);
  };

  if (user.error == undefined) {
    return (
      <LayoutPanel user={user} role={role} authorizations={authorizations} titleMenu="Panel de demande d'impression 3D">
        <Seo title={"Panel"} />
        <WebSocket realodPage={realodPage} event={[]} userId={user.id} />

        {/* Dernières activités */}
        <div className="py-6 px-3">
          <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="col-span-3">
              <nav aria-label="Sidebar" className="sticky top-6 divide-y divide-gray-300">
                {/* FAQ */}
                <div className="w-full">
                  <div className="relative pb-6 bg-white rounded">
                    <div className="">
                      <h3 className="text-xl font-bold">FAQ</h3>
                      <p className="text-sm text-gray-500 text-justify">
                        Un trou de mémoire ? Vous n'êtes pas sûr de ce que vous allez faire ? Consultez d'abord cette mini FAQ avant de demander à un membre de l'association.
                      </p>
                    </div>
                    <dl className="divide-y divide-gray-200">
                      {faq.map((faq) => (
                        <Disclosure as="div" key={faq.question} className="pt-6">
                          {({ open }) => (
                            <>
                              <dt className="text-sm">
                                <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                                  <span className="font-medium text-gray-900">{faq.question}</span>
                                  <span className="ml-6 h-7 flex items-center">
                                    <ChevronDownIcon className={classNames(open ? "-rotate-180" : "rotate-0", "h-6 w-6 transform")} aria-hidden="true" />
                                  </span>
                                </Disclosure.Button>
                              </dt>
                              <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                <p className="text-sm text-gray-500 text-justify">{faq.answer}</p>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                    </dl>
                  </div>
                </div>
              </nav>
            </div>
            <hr className="mb-5 mt-5 block lg:hidden" />
            <main className="col-span-9">
              {highDemand ? (
                <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                  <p class="font-bold">Attention</p>
                  <p>Il y a actuellement beaucoup de demandes d'impression 3D. Merci pour votre patience.</p>
                </div>
              ) : (
                <div></div>
              )}
              <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate mt-5">Vos demandes d'impressions 3D</h1>
              <div className="block mt-5">
                {/* big projects */}
                <div className="align-middle inline-block min-w-full border-b border-gray-200 hidden sm:block">
                  {userTicketResult.length > 0 ? (
                    <div>
                      <div className="border border-gray-200 rounded overflow-x-auto min-w-full bg-white">
                        <table className="min-w-full text-sm align-middle whitespace-nowrap">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center">Id</th>
                              <th className="p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center">Dernière mise à jour</th>
                              <th className="p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center">Type</th>
                              <th className="p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center">Etat</th>
                              <th className="p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {userTicketResult.map((r) => {
                              return (
                                <tr className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                                  <td className="p-3 text-center" onClick={() => router.push(`/panel/${r.id}`)}>
                                    <span className="font-medium">#{setZero(r.id)}</span>
                                  </td>
                                  <td className="p-3 text-center" onClick={() => router.push(`/panel/${r.id}`)}>
                                    <div className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-ful`}>
                                      <Moment format="Do MMM YYYY à HH:mm" locale="fr">
                                        {r.modificationDate}
                                      </Moment>
                                    </div>
                                  </td>
                                  <td className="p-3 text-center" onClick={() => router.push(`/panel/${r.id}`)}>
                                    <div className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-ful`}>{r.projectType}</div>
                                  </td>
                                  <td className="p-3 text-center" onClick={() => router.push(`/panel/${r.id}`)}>
                                    <div className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-ful`}>{r.statusName}</div>
                                  </td>
                                  <td className="p-3 text-center">
                                    <Menu as="div" className="relative flex justify-end items-center">
                                      <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                                        <span className="sr-only">Open options</span>
                                        <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
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
                                                  onClick={() => deleteTicket(r.id)}
                                                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "group flex items-center px-4 py-2 text-sm")}
                                                >
                                                  <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 group-hover:cursor-pointer" aria-hidden="true" />
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
                      <div class="grid place-items-center mb-10">
                        <div class="inline-flex mt-3">
                          <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l rounded-r mr-2" onClick={() => nextPrevPage(-1)}>
                            &lt;
                          </button>
                          <p class="inline-flex py-2 px-4">
                            Pages&nbsp;<p class="font-bold">{actualPage + 1}</p>&nbsp;sur&nbsp;<p class="font-bold">{maxPage != 0 ? maxPage : 1}</p>
                          </p>
                          <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l rounded-r ml-2 mr-6" onClick={() => nextPrevPage(1)}>
                            &gt;
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 md:p-5 rounded flex justify-between text-gray-700 bg-gray-100">
                      <p>Les demandes d'impressions apparaîteront ici. Pour en créer une, cliquez sur le bouton suivant.</p>
                      <Link href="/panel/new/">
                        <a className="inline-flex items-center space-x-1 font-semibold ml-2 text-indigo-600 hover:text-indigo-400">
                          <span>Créer une demande</span>
                          <svg className="hi-solid hi-arrow-right inline-block w-4 h-4" fillName="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                              fill-rule="evenodd"
                              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
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
  } else {
    return "";
  }
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  const user = await fetchAPIAuth("/user/me", cookies.jwt);
  const resUserConnected = isUserConnected(user);
  if (resUserConnected) return resUserConnected;
  const role = await fetchAPIAuth("/user/role", cookies.jwt);
  const authorizations = await fetchAPIAuth("/user/authorization/", cookies.jwt);
  const highDemand = await fetchAPIAuth("/ticket/highDemand/", cookies.jwt);

  return {
    props: { user, role, authorizations, highDemand: highDemand.result ? highDemand.result : false }, // will be passed to the page component as props
  };
}
