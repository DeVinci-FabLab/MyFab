import React, { useEffect } from "react";
import router from "next/router";

const Home = ({}) => {
  useEffect(() => {
    router.push(`/auth/`);
  }, []);

  return <div></div>;
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
