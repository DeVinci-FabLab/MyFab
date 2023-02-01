import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { setZero } from "../lib/function";

function getChevron(collumnState, type) {
  if (!collumnState) return null;
  if (collumnState[type] === true) return <ChevronUpIcon className="w-5 h-5 m-auto" />;
  if (collumnState[type] === false) return <ChevronDownIcon className="w-5 h-5 m-auto" />;
  return null;
}

export default function UserTablesAdmin({ user, id, maxPage, actualPage, nextPrevPage, collumnState, changeCollumnState }) {
  if (user.error) user = [];
  const changeCollumnDefined = changeCollumnState ? true : false;
  if (!changeCollumnState) changeCollumnState = function () {};
  return (
    <div className="border border-gray-200 rounded overflow-x-auto min-w-full bg-white">
      <table className="min-w-full text-sm align-middle whitespace-nowrap">
        <thead>
          <tr className="border-b border-gray-200">
            <th className={`p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center ${changeCollumnDefined ? "cursor-pointer select-none" : ""}`}>
              <div className="inline-flex" onClick={() => changeCollumnState("id")}>
                Id
                {getChevron(collumnState, "id")}
              </div>
            </th>
            <th className={`p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center ${changeCollumnDefined ? "cursor-pointer select-none" : ""}`}>
              <div className="inline-flex" onClick={() => changeCollumnState("firstname")}>
                Prénom
                {getChevron(collumnState, "firstname")}
              </div>
            </th>
            <th className={`p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center ${changeCollumnDefined ? "cursor-pointer select-none" : ""}`}>
              <div className="inline-flex" onClick={() => changeCollumnState("lastname")}>
                Nom
                {getChevron(collumnState, "lastname")}
              </div>
            </th>
            <th className={`p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center ${changeCollumnDefined ? "cursor-pointer select-none" : ""}`}>
              <div className="inline-flex" onClick={() => changeCollumnState("email")}>
                E-mail
                {getChevron(collumnState, "email")}
              </div>
            </th>
            <th className={`p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center ${changeCollumnDefined ? "cursor-pointer select-none" : ""}`}>
              <div className="inline-flex" onClick={() => changeCollumnState("title")}>
                Ecole et année
                {getChevron(collumnState, "title")}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {user.map((r) => {
            return (
              <tr
                className="border-b border-gray-200 hover:bg-gray-50"
                onClick={() => {
                  id(r.id);
                }}
              >
                <td className="p-3 text-center">
                  <span className="font-medium">#{setZero(r.id)}</span>
                </td>
                <td className="p-3 text-center">
                  <p className="font-medium">{r.firstName}</p>
                </td>
                <td className="p-3 text-center">
                  <div className={`font-medium inline-flex leading-4 rounded-full uppercase`}>{r.lastName}</div>
                </td>
                <td className="p-3 text-center">
                  <div className={`font-medium inline-flex py-1 leading-4 rounded-full`}>{r.email}</div>
                </td>
                <td className="p-3 text-center">
                  <div className={`font-medium inline-flex py-1 leading-4 rounded-full`}>{r.title ? r.title : "Ancien compte"}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
  );
}
