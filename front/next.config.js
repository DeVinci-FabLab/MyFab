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
    API: process.env.API,
    BASE_PATH: process.env.BASE_PATH ? process.env.BASE_PATH : "",
    IS_TEST_MODE: process.env.IS_TEST_MODE === "true" ? true : false,
    VERSION: require("./package.json").version,
  },
};
