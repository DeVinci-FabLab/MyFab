import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Faq({ className = "", questions = [], darkMode }) {
  return (
    <div className={className}>
      <div
        className={`relative px-6 pb-6 py-4 rounded ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="">
          <h3 className={`text-xl font-bold ${darkMode ? "text-white" : ""}`}>
            FAQ
          </h3>
          <p
            className={`text-sm text-justify ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Un trou de mémoire ? Vous n'êtes pas sûr de ce que vous allez faire
            ? Consultez d'abord cette mini FAQ avant de demander à un membre de
            l'association.
          </p>
        </div>
        <dl
          className={`divide-y ${
            darkMode ? "divide-gray-600" : "divide-gray-200"
          }`}
        >
          {questions.map((faq, index) => (
            <Disclosure as="div" key={`faq-${index}`} className="pt-6">
              {({ open }) => (
                <>
                  <dt className="text-sm">
                    <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span className="ml-6 h-7 flex items-center">
                        <ChevronDownIcon
                          className={
                            classNames(
                              open ? "-rotate-180" : "rotate-0",
                              "faq-button h-6 w-6 transform"
                            ) + ` ${darkMode ? "text-white" : ""}`
                          }
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-2 pr-12">
                    <p
                      className={`text-sm text-justify ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {faq.answer}
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </div>
  );
}
