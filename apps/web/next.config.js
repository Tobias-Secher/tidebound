import { withPayload } from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    remotePatterns: [new URL('https://placehold.co/**')],
  },
  webpack: (config, { isServer, nextRuntime }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@payload-config': path.resolve(__dirname, './payload/config.ts'),
    };

    // Exclude MSW from webpack bundling (it's only for development/testing)
    // Apply to both server and edge runtime
    if (isServer || nextRuntime === 'edge') {
      config.externals = config.externals || [];

      // For edge runtime, we need to completely ignore these modules
      if (nextRuntime === 'edge') {
        config.resolve.alias = {
          ...config.resolve.alias,
          'msw/node': false,
          '@mswjs/interceptors': false,
          '@repo/mocks/server': false,
        };
      } else {
        config.externals.push({
          'msw/node': 'commonjs msw/node',
          '@mswjs/interceptors': 'commonjs @mswjs/interceptors',
          '@mswjs/interceptors/ClientRequest': 'commonjs @mswjs/interceptors/ClientRequest',
        });
      }
    }

    return config;
  },
};

export default withPayload(withNextIntl(nextConfig));
