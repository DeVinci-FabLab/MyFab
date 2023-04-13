/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {};

module.exports = nextConfig;

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({});

module.exports = {
  reactStrictMode: true,
  basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
  env: {
    API: process.env.API
      ? process.env.API.split("")[process.env.API.length - 1] === "/"
        ? process.env.API.substring(0, process.env.API.length - 1)
        : process.env.API
      : "http://localhost:5000",
    BASE_PATH: process.env.BASE_PATH ? process.env.BASE_PATH : "",
    IS_TEST_MODE: process.env.IS_TEST_MODE ? process.env.IS_TEST_MODE : false,
  },
};
