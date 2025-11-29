const baseConfig = require('@repo/jest-config/base');

module.exports = {
  ...baseConfig,
  displayName: '@repo/utils',
  rootDir: __dirname,
  testEnvironment: 'node', // Utils don't need DOM
};
