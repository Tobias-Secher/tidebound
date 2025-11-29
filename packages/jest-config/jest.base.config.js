const { WORKSPACE_MAPPINGS, ASSET_MOCKS } = require('./shared');

module.exports = {
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/../../packages/jest-config/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',

  // Test file patterns - co-located tests
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Module resolution for cross-workspace imports and assets
  moduleNameMapper: {
    ...ASSET_MOCKS,
    ...WORKSPACE_MAPPINGS,
  },

  // SWC transformation (faster than ts-jest)
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        transform: {
          react: {
            runtime: 'automatic', // Matches React 19 new JSX transform
          },
        },
      },
    }],
  },

  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
  ],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/', '/coverage/'],
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};
