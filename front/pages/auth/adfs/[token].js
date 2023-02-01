import axios from "axios";
import { setCookies } from "cookies-next";
import router from "next/router";
import { useEffect } from "react";

export default function Forget({}) {
  useEffect(function () {
    const { token } = router.query;
    if (!token) router.replace("/auth");

    axios({
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      url: process.env.API + "/api/user/login/adfs/",
      data: {
        token,
      },
    })
      .then(async (response) => {
        try {
          if (response.status == 200) {
            const expires = new Date(Date.now() + 7200000);
            setCookies("jwt", response.data.dvflCookie, { expires });
            router.push("/auth/");
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          router.push("/auth/?error=true");
        } else if (error.response.status === 403) {
          router.push("/auth/?close=true");
        } else if (error.response.status === 404) {
          router.push("/auth/");
        }
      });
  }, []);

  return <div>Please wait</div>;
}

export async function getServerSideProps({}) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
