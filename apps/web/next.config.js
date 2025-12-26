import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@payload-config": path.resolve(__dirname, "./payload.config.ts"),
    };

    // Exclude MSW from webpack bundling (it's only for development/testing)
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'msw/node': 'commonjs msw/node',
        '@mswjs/interceptors': 'commonjs @mswjs/interceptors',
        '@mswjs/interceptors/ClientRequest': 'commonjs @mswjs/interceptors/ClientRequest',
      });
    }

    return config;
  },
};

export default withPayload(withNextIntl(nextConfig));
