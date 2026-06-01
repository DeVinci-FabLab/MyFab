import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { getCookie } from "cookies-next";

import { UserUse } from "../context/provider";

function getChevron(collumnState, type) {
  if (!collumnState) return null;
  if (collumnState[type] === true) return <ChevronUpIcon className="w-4 h-4" />;
  if (collumnState[type] === false)
    return <ChevronDownIcon className="w-4 h-4" />;
  return null;
}

export default function UserTablesAdmin({
  users,
  id,
  maxPage,
  actualPage,
  nextPrevPage,
  collumnState,
  changeCollumnState,
}) {
  const jwt = getCookie("jwt");
  const { user } = UserUse(jwt);

  if (users.error) users = [];
  const changeCollumnDefined = changeCollumnState ? true : false;
  if (!changeCollumnState) changeCollumnState = function () {};

  function Th({ label, sortKey }) {
    return (
      <th className="px-4 py-3 text-left">
        <div
          className={`inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
            changeCollumnDefined ? "cursor-pointer select-none" : ""
          }`}
          onClick={() => sortKey && changeCollumnState(sortKey)}
        >
          <span>{label}</span>
          {user.specialFont ? (
            <span className={`${user.specialFont} normal-case`}>{label}</span>
          ) : null}
          {sortKey ? getChevron(collumnState, sortKey) : null}
        </div>
      </th>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-night-800 rounded-md overflow-x-auto min-w-full bg-white dark:bg-night-900">
      <table className="min-w-full text-sm align-middle whitespace-nowrap">
        <thead>
          <tr className="border-b border-gray-200 dark:border-night-800 bg-gray-50 dark:bg-night-900/60">
            <Th label="Prénom" sortKey="firstname" />
            <Th label="Nom" sortKey="lastname" />
            <Th label="E-mail" sortKey="email" />
            <Th label="École et année" sortKey="title" />
          </tr>
        </thead>
        <tbody>
          {users.map((r, index) => {
            return (
              <tr
                key={`user-${index}`}
                className={`user-${index} border-b border-gray-100 dark:border-night-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-night-800/50 transition-colors`}
                onClick={() => {
                  id(r.id);
                }}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {r.firstName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium uppercase text-gray-900 dark:text-white">
                    {r.lastName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {r.email}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-700 dark:text-gray-300">
                    {r.title ? r.title : "Ancien compte"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="grid place-items-center mb-10">
        <div className="inline-flex items-center mt-4 gap-2">
          <button
            className="prev-page-button h-9 w-9 inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-night-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-800 transition-colors"
            onClick={() => nextPrevPage(-1)}
          >
            &lt;
          </button>
          <div className="inline-flex items-center px-3 text-sm text-gray-600 dark:text-gray-300">
            Page&nbsp;
            <span className="font-mono font-semibold text-brand-blue">
              {actualPage + 1}
            </span>
            &nbsp;/&nbsp;
            <span className="font-mono font-semibold text-gray-900 dark:text-white">
              {maxPage != 0 ? maxPage : 1}
            </span>
          </div>
          <button
            className="next-page-button h-9 w-9 inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-night-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-800 transition-colors"
            onClick={() => nextPrevPage(1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
