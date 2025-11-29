const nextJest = require('next/jest');
const { WORKSPACE_MAPPINGS } = require('@repo/jest-config/shared');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: [
    '<rootDir>/../../packages/jest-config/jest.setup.ts',
  ],
  testEnvironment: 'jest-environment-jsdom',
  displayName: 'web',

  testMatch: [
    '<rootDir>/app/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/app/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  moduleNameMapper: {
    // Next.js handles CSS modules, but keep for consistency
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Use shared workspace mappings
    ...WORKSPACE_MAPPINGS,
  },

  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!**/*.spec.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
