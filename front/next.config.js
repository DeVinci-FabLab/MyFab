/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {};

module.exports = nextConfig;

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({});

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

module.exports = {
  reactStrictMode: true,
  basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
  env: {
    BASE_PATH: process.env.BASE_PATH ? process.env.BASE_PATH : "",
    IS_TEST_MODE: process.env.IS_TEST_MODE === "true" ? "true" : "false",
    DARK_MODE_IN_TEST_MODE: process.env.DARK_MODE_IN_TEST_MODE
      ? "true"
      : "false",
    VERSION: require("./package.json").version,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
