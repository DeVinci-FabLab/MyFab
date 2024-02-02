import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import TablesAdmin from "./tablesAdmin";
import Faq from "./faq";
import Link from "next/link";

const faqs = [
  {
    question: "Comment choisir une demande à traiter ?",
    answer:
      "Les demandes sont triées du plus ancien, au plus récent. Pour choisir une demande, il faut commencer par les plus anciennes.",
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

export default function OverviewAdmin({
  tickets,
  maxPage,
  actualPage,
  nextPrevPage,
  collumnState,
  changeCollumnState,
  darkMode,
}) {
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
                darkMode={darkMode}
              />
            ) : (
              <div className="p-4 md:p-5 rounded flex justify-between text-gray-700 bg-gray-100">
                <p>
                  Il n'y a aucun ticket à traiter. Vous pouvez accéder à
                  l'historique des tickets déjà traités en cliquant sur le
                  bouton suivant.
                </p>
                <Link href="/panel/admin/history">
                  <p className="inline-flex items-center space-x-1 font-semibold ml-2 text-indigo-600 hover:text-indigo-400">
                    <span>Accéder à l'historique</span>
                    <svg
                      className="hi-solid hi-arrow-right inline-block w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </p>
                </Link>
              </div>
            )}
          </div>

          {/* FAQ */}
          <Faq
            className="w-full lg:w-1/3 px-4"
            darkMode={darkMode}
            questions={faqs}
          />
        </div>
      </div>
    </section>
  );
}
