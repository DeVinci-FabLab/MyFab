import { MoonIcon } from "@heroicons/react/outline";
import { setZero } from "../lib/function";

export default function TableTablesAdmin({ token }) {
  if (token.error) token = [];
  return (
    <div className="border border-gray-200 rounded overflow-x-auto min-w-full bg-white">
      <table className="min-w-full text-sm align-middle whitespace-nowrap">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center">Email</th>
            <th className="p-3 text-gray-700 bg-gray-100 font-medium text-sm tracking-wider uppercase text-center">Token</th>
          </tr>
        </thead>
        <tbody>
          {token.map((r) => {
            return (
              <tr className="border-b border-gray-200 hover:bg-gray-50">
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
