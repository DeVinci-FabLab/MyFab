import React, { useEffect } from "react";
import router from "next/router";

const Home = ({}) => {
  useEffect(async function () {
    router.push(`/auth/`);
  }, []);

  return <head></head>;
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
