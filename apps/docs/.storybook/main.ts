import type { StorybookConfig } from '@storybook/nextjs';

import { dirname } from 'path';

import { fileURLToPath } from 'url';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../web/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  staticDirs: ['../../web/public'],
  framework: {
    name: getAbsolutePath('@storybook/nextjs') as '@storybook/nextjs',
    options: {
      nextConfigPath: '../next.config.js',
    },
  },
};
export default config;
