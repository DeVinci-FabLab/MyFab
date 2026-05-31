export default function TableTokensAdmin({ token, darkMode }) {
  if (!token) token = [];
  return (
    <div
      className={`border rounded overflow-x-auto min-w-full ${
        darkMode ? "bg-night-800 border-night-700" : "bg-white border-gray-200"
      }`}
    >
      <table className="min-w-full text-sm align-middle whitespace-nowrap">
        <thead>
          <tr
            className={`border-b ${
              darkMode
                ? "border-night-600 text-white bg-night-600"
                : "border-gray-200 text-gray-700 bg-gray-100"
            }`}
          >
            <th className="p-3 font-medium text-sm tracking-wider uppercase text-center">
              Email
            </th>
            <th className="p-3 font-medium text-sm tracking-wider uppercase text-center">
              Token
            </th>
          </tr>
        </thead>
        <tbody>
          {token.map((r, index) => {
            return (
              <tr
                className={`border-b ${
                  darkMode
                    ? "border-night-600 hover:bg-night-700 text-gray-200"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                key={`token-${index}`}
              >
                <td className="p-3 text-center">
                  <p className="font-medium">{r.email}</p>
                </td>
                <td className="p-3 text-center">
                  <p className={`font-medium`}>{r.token}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
