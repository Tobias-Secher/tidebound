import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `${process.env.API_URL}/:path*`,
    },
  ],
};

export default withNextIntl(nextConfig);
