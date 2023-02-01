import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import TablesAdmin from "./tablesAdmin";
import Link from "next/link";

const faqs = [
  {
    question: "Comment choisir une demande à traiter ?",
    answer: "Les demandes sont triées du plus ancien, au plus récent. Pour choisir une demande, il faut commencer par les plus anciennes.",
  },
  {
    question: "Comment fonctionnent le système de priorité ?",
    answer:
      "Le système de priorité fonctionne automatiquement et il n'est pas possible de modifier une priorité manuellement. Ce sont des indicateurs de temps, 'normal' signifie que la demande a été créé il y a moins d'une semaine, 'A traiter' plus d'une semaine et 'Urgent' plus de deux semaines.",
  },
  {
    question: "Quelles sont étapes pour réaliser une demande ?",
    answer:
      "Pour réaliser une demande, il faut en premier temps, regarder les fichiers envoyés pour savoir si les pièces sont imprimables/l'impression 3D est le plus intéressant pour faire cette pièce. Ensuite, il faut lancer l'impression 3D sur une de nos imprimantes et indiquer dans le ticket sur quelle imprimante la pièce a été lancé. Après l'impression de toutes les pièces, le ticket doit être mis en statut 'Fermé'",
  },
  {
    question: "Quels sont différents statuts ?",
    answer:
      "'Ouvert' signifie que la demande est en attente de réalisation, 'En attente de réponse' qu'une question a été posé au demandeur, 'Fermé' que l'impression a été réalisé, 'Refusé' que les fichiers ne sont pas imprimable ou que le projet a été refusé, 'Impression commencé' que l'impression est en cours, 'Annulée' que la demande a été annulée par le demandeur",
  },
  // More questions...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function OverviewAdmin({ tickets, maxPage, actualPage, nextPrevPage, collumnState, changeCollumnState }) {
  return (
    <section className="">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -mx-4">
          {/* Tickets à traiter */}
          <div className="w-full lg:w-2/3 md:px-6 mt-5 mb-8 lg:mb-0">
            {tickets.length > 0 ? (
              <TablesAdmin
                tickets={tickets}
                maxPage={maxPage}
                actualPage={actualPage}
                nextPrevPage={nextPrevPage}
                isDone={true}
                collumnState={collumnState}
                changeCollumnState={changeCollumnState}
              />
            ) : (
              <div className="p-4 md:p-5 rounded flex justify-between text-gray-700 bg-gray-100">
                <p>Il n'y a aucun ticket à traiter. Vous pouvez accéder à l'historique des tickets déjà traités en cliquant sur le bouton suivant.</p>
                <Link href="/panel/admin/history">
                  <a className="inline-flex items-center space-x-1 font-semibold ml-2 text-indigo-600 hover:text-indigo-400">
                    <span>Accéder à l'historique</span>
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

          {/* FAQ */}
          <div className="w-full lg:w-1/3 px-4">
            <div className="relative px-6 pb-6 py-4 bg-white rounded">
              <div className="">
                <h3 className="text-xl font-bold">FAQ</h3>
                <p className="text-sm text-gray-500 text-justify">
                  Un trou de mémoire ? Vous n'êtes pas sûr de ce que vous allez faire ? Consultez d'abord cette mini FAQ avant de demander à un membre de l'association.
                </p>
              </div>
              <dl className="divide-y divide-gray-200">
                {faqs.map((faq) => (
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
        </div>
      </div>
    </section>
  );
}
