import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Faq({ className = "", questions = [] }) {
  return (
    <div className={className}>
      <div className="relative px-6 pb-6 py-4 rounded-md border border-gray-200 dark:border-night-800 bg-white dark:bg-night-900">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-brand-blue">
            // FAQ
          </p>
          <p className="mt-2 text-sm text-justify text-gray-500 dark:text-gray-400">
            Un trou de mémoire ? Vous n'êtes pas sûr de ce que vous allez faire
            ? Consultez d'abord cette mini FAQ avant de demander à un membre de
            l'association.
          </p>
        </div>
        <dl className="divide-y divide-gray-200 dark:divide-night-800">
          {questions.map((faq, index) => (
            <Disclosure as="div" key={`faq-${index}`} className="pt-6">
              {({ open }) => (
                <>
                  <dt className="text-sm">
                    <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                      <span className="ml-6 h-7 flex items-center">
                        <ChevronDownIcon
                          className={classNames(
                            open
                              ? "-rotate-180 text-brand-blue"
                              : "rotate-0 text-gray-400 dark:text-gray-500",
                            "faq-button h-6 w-6 transform",
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-2 pr-12">
                    <p className="text-sm text-justify text-gray-500 dark:text-gray-400">
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
