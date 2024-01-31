import { getCookie } from "cookies-next";

import { UserUse } from "../context/provider";

export default function VersionBlock({ version }) {
  const jwt = getCookie("jwt");
  const { darkMode } = UserUse(jwt);

  return (
    <li className={`border-b mt-4 ${darkMode ? "border-gray-500" : ""}`}>
      <div className="pb-2">
        <div className="flex justify-between">
          <h2
            className={`font-bold text-justify ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {version.version}
          </h2>
          <p className={darkMode ? "text-gray-300" : "text-gray-400"}>
            {version.date}
          </p>
        </div>
        {version.message && (
          <p
            className={`text-justify ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {version.message}
          </p>
        )}
        {version.changes.length !== 0 && (
          <div
            className={`rounded-lg p-4 ${
              darkMode
                ? "text-gray-300 bg-gray-600"
                : "text-gray-500 bg-gray-200"
            }`}
          >
            {version.changes.map((change, index) => (
              <p key={index} className="text-justify">
                • {change}
              </p>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
