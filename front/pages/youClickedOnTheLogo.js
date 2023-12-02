import { fetchAPIAuth } from "../lib/api";
import { getCookie } from "cookies-next";

export default function Rules() {
  return <div></div>;
}

export async function getServerSideProps({ req }) {
  const cookie = getCookie("jwt");
  await fetchAPIAuth({
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      dvflCookie: cookie,
    },
    url: process.env.API + "/api/clickonlogopaint",
  });

  return {
    redirect: {
      permanent: false,
      destination: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    props: {},
  };

  return {
    props: {}, // will be passed to the page component as props
  };
}
