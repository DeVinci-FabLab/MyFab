import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { setZero } from "../lib/function";

function getChevron(collumnState, type) {
  if (!collumnState) return null;
  if (collumnState[type] === true)
    return <ChevronUpIcon className="w-5 h-5 m-auto" />;
  if (collumnState[type] === false)
    return <ChevronDownIcon className="w-5 h-5 m-auto" />;
  return null;
}

export default function UserTablesAdmin({
  user,
  id,
  maxPage,
  actualPage,
  nextPrevPage,
  collumnState,
  changeCollumnState,
  darkMode,
}) {
  if (user.error) user = [];
  const changeCollumnDefined = changeCollumnState ? true : false;
  if (!changeCollumnState) changeCollumnState = function () {};
  return (
    <div
      className={`border rounded overflow-x-auto min-w-full ${
        darkMode ? "border-gray-600" : "border-gray-200 bg-white"
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
                changeCollumnDefined ? "cursor-pointer select-none" : ""
              } ${
                darkMode
                  ? "text-white bg-gray-600"
                  : "text-gray-700 bg-gray-100"
              }`}
            >
              <div
                className="inline-flex"
                onClick={() => changeCollumnState("firstname")}
              >
                Prénom
                {getChevron(collumnState, "firstname")}
              </div>
            </th>
            <th
              className={`p-3 font-medium text-sm tracking-wider uppercase text-center ${
                changeCollumnDefined ? "cursor-pointer select-none" : ""
              } ${
                darkMode
                  ? "text-white bg-gray-600"
                  : "text-gray-700 bg-gray-100"
              }`}
            >
              <div
                className="inline-flex"
                onClick={() => changeCollumnState("lastname")}
              >
                Nom
                {getChevron(collumnState, "lastname")}
              </div>
            </th>
            <th
              className={`p-3 font-medium text-sm tracking-wider uppercase text-center ${
                changeCollumnDefined ? "cursor-pointer select-none" : ""
              } ${
                darkMode
                  ? "text-white bg-gray-600"
                  : "text-gray-700 bg-gray-100"
              }`}
            >
              <div
                className="inline-flex"
                onClick={() => changeCollumnState("email")}
              >
                E-mail
                {getChevron(collumnState, "email")}
              </div>
            </th>
            <th
              className={`p-3 font-medium text-sm tracking-wider uppercase text-center ${
                changeCollumnDefined ? "cursor-pointer select-none" : ""
              } ${
                darkMode
                  ? "text-white bg-gray-600"
                  : "text-gray-700 bg-gray-100"
              }`}
            >
              <div
                className="inline-flex"
                onClick={() => changeCollumnState("title")}
              >
                Ecole et année
                {getChevron(collumnState, "title")}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {user.map((r, index) => {
            return (
              <tr
                key={`user-${index}`}
                className={`user-${index} border-b cursor-pointer ${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-700 bg-gray-800 text-white"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => {
                  id(r.id);
                }}
              >
                <td className="p-3 text-center">
                  <p className="font-medium">{r.firstName}</p>
                </td>
                <td className="p-3 text-center">
                  <div
                    className={`font-medium inline-flex leading-4 rounded-full uppercase`}
                  >
                    {r.lastName}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div
                    className={`font-medium inline-flex py-1 leading-4 rounded-full`}
                  >
                    {r.email}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div
                    className={`font-medium inline-flex py-1 leading-4 rounded-full`}
                  >
                    {r.title ? r.title : "Ancien compte"}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="grid place-items-center mb-10">
        <div className="inline-flex mt-3">
          <button
            className={`prev-page-button font-bold py-2 px-4 rounded-l rounded-r mr-2 text-gray-800 ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
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
            Pages&nbsp;<p className="font-bold">{actualPage + 1}</p>
            &nbsp;sur&nbsp;
            <p className="font-bold">{maxPage != 0 ? maxPage : 1}</p>
          </div>
          <button
            className={`next-page-button font-bold py-2 px-4 rounded-l rounded-r ml-2 mr-6 text-gray-800 ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => nextPrevPage(1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
