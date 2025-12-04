const baseConfig = require('@repo/jest-config/base');

module.exports = {
  ...baseConfig,
  displayName: '@repo/services',
  rootDir: __dirname,
  testEnvironment: 'node', // Services don't need DOM
};
