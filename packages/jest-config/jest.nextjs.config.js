const nextJest = require('next/jest');

// Create Next.js Jest config with app directory support
const createJestConfig = nextJest({
  dir: './', // Path to Next.js app
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/../../packages/jest-config/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',

  testMatch: [
    '<rootDir>/app/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/app/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  moduleNameMapper: {
    // CSS Modules (Next.js handles most of this, but keep for consistency)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Workspace packages
    '^@repo/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1',
    '^@repo/utils/(.*)$': '<rootDir>/../../packages/utils/src/$1',
    '^@repo/templates/(.*)$': '<rootDir>/../../packages/templates/src/$1',
    '^@repo/mocks/(.*)$': '<rootDir>/../../packages/mocks/src/$1',
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

// next/jest handles transform and other Next.js-specific config
module.exports = createJestConfig(customJestConfig);
