import router from "next/router";
import WebSocket from "../../components/webSocket";
import { useEffect, useState } from "react";
import LayoutPanel from "../../components/layoutPanel";
import TableTablesAdmin from "../../components/tablesToken";
import { fetchAPIAuth, parseCookies } from "../../lib/api";
import { isUserConnected } from "../../lib/function";
import Seo from "../../components/seo";

export default function Settings({ role, me, authorizations, token }) {
  function realodPage() {
    router.replace(router.asPath);
  }

  useEffect(function () {
    if (authorizations.manageUser === 0) {
      router.push("/404");
    }
  }, []);

  return (
    <>
      <LayoutPanel user={me} role={role} authorizations={authorizations} titleMenu="Gestion des tokens de création de compte">
        <Seo title={"Paramètres administrateurs"} />
        <WebSocket realodPage={realodPage} event={[]} userId={me.id} />
        <section className="">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap -mx-4">
              {/* Tickets à traiter */}
              <div className="w-full md:px-6 mt-5 mb-8 lg:mb-0">
                <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
                  <div className="mb-3 grow">
                    <div className="space-x-2">
                      <div className="relative grow">
                        <div className="absolute inset-y-0 left-0 w-10 my-px ml-px flex items-center justify-center pointer-events-none rounded-l text-gray-500">
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <TableTablesAdmin token={token} />
              </div>
            </div>
          </div>
        </section>
      </LayoutPanel>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  const me = await fetchAPIAuth("/user/me", cookies.jwt);
  const resUserConnected = isUserConnected(me);
  if (resUserConnected) return resUserConnected;
  const role = await fetchAPIAuth("/user/role", cookies.jwt);
  const authorizations = await fetchAPIAuth("/user/authorization/", cookies.jwt);
  const token = await fetchAPIAuth("/user/mailtoken/", cookies.jwt);

  // Pass the data to our page via props
  return {
    props: { role, me, authorizations, token }, // will be passed to the page component as props
  };
}
