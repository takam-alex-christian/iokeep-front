/** @type {import('next').NextConfig} */

let beUrl = "";

switch (process.env.NODE_ENV) {
  case "development":
    beUrl = process.env.BE_DEV_LOCAL_URL;
    break;
  case "production":
    beUrl = process.env.BE_PROD_URL;
    break;
  case "test":
    beUrl = process.env.BE_DEV_TEST_URL;
    break;
  default:
    beUrl = "";
    break;
}

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/be/:path*", // the /be represents requests meant for the backend
        destination: `${beUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
