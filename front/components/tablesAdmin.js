import router from "next/router";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { setZero } from "../lib/function";
import { dateDiff } from "../lib/date";

const colors = {
  "2274e0": "text-gray-700 bg-gray-200",
  e9d41d: "text-amber-700 bg-amber-200",
  f30b0b: "text-white bg-gradient-to-r from-amber-400 to-red-500",
};

function getChevron(collumnState, type) {
  if (!collumnState) return null;
  if (collumnState[type] === true)
    return <ChevronUpIcon className="w-5 h-5 m-auto" />;
  if (collumnState[type] === false)
    return <ChevronDownIcon className="w-5 h-5 m-auto" />;
  return null;
}

export default function TablesAdmin({
  tickets,
  maxPage,
  actualPage,
  nextPrevPage,
  collumnState,
  changeCollumnState,
  darkMode,
}) {
  const dateNow = new Date();
  const changeCollumnDefined = changeCollumnState ? true : false;
  if (!changeCollumnState) changeCollumnState = function () {};
  return (
    <div>
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
                  onClick={() => changeCollumnState("id")}
                >
                  Id
                  {getChevron(collumnState, "id")}
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
                  onClick={() => changeCollumnState("name")}
                >
                  Nom
                  {getChevron(collumnState, "name")}
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
                  onClick={() => changeCollumnState("createAt")}
                >
                  Modifié il y a{getChevron(collumnState, "createAt")}
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
                  onClick={() => changeCollumnState("priority")}
                >
                  Priorité
                  {getChevron(collumnState, "priority")}
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
                  onClick={() => changeCollumnState("type")}
                >
                  Type
                  {getChevron(collumnState, "type")}
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
                  onClick={() => changeCollumnState("material")}
                >
                  Matériaux
                  {getChevron(collumnState, "material")}
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
                  onClick={() => changeCollumnState("status")}
                >
                  État
                  {getChevron(collumnState, "status")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((r, index) => {
              return (
                <tr
                  key={`ticket-${index}`}
                  className={`ticket-element border-b cursor-pointer ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700 bg-gray-800 text-white"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => router.push(`/panel/${r.id}`)}
                >
                  <td className="p-3 text-center">
                    <span className="font-medium">#{setZero(r.id)}</span>
                  </td>
                  <td className="p-3 text-center">
                    <p className="font-medium">{r.userName}</p>
                    <p className="text-gray-500">
                      {r.title || "Ancien compte"}
                    </p>
                  </td>
                  <td className="p-3 text-center">
                    <div
                      className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-ful`}
                    >
                      {dateDiff(new Date(r.modificationDate), dateNow)}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div
                      className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-full ${
                        colors[r.priorityColor]
                      }`}
                    >
                      {r.priorityName}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div
                      className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-ful`}
                    >
                      {r.projectType}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div
                      className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-ful`}
                    >
                      {r.material}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div
                      className={`font-medium inline-flex px-2 py-1 leading-4 text-md rounded-ful`}
                    >
                      {r.statusName}
                    </div>
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
