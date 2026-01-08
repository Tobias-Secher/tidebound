import type { StorybookConfig } from '@storybook/react-webpack5';

import { dirname } from 'path';

import { fileURLToPath } from 'url';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-webpack5-compiler-swc')],
  framework: getAbsolutePath('@storybook/react-webpack5'),
  webpackFinal: async (config) => {
    // Remove existing CSS rules
    config.module!.rules = config.module!.rules!.filter((rule) => {
      if (rule && typeof rule === 'object' && rule.test instanceof RegExp) {
        return !rule.test.test('.css');
      }
      return true;
    });

    // Add CSS rules with CSS Modules support
    config.module!.rules!.push(
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
                namedExport: false,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    );

    return config;
  },
};
export default config;
