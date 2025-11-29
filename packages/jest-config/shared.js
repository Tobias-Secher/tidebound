/**
 * Shared Jest configuration constants
 * Used across base and Next.js Jest configs
 */

/**
 * Module name mappings for workspace packages
 * Allows tests to import from other workspaces using @repo/* aliases
 * Example: import { Button } from '@repo/ui/button'
 */
const WORKSPACE_MAPPINGS = {
  '^@repo/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1',
  '^@repo/utils/(.*)$': '<rootDir>/../../packages/utils/src/$1',
  '^@repo/templates/(.*)$': '<rootDir>/../../packages/templates/src/$1',
  '^@repo/mocks/(.*)$': '<rootDir>/../../packages/mocks/src/$1',
};

/**
 * Common asset mock patterns
 * These handle CSS and static file imports in tests
 */
const ASSET_MOCKS = {
  // CSS Modules - uses identity-obj-proxy to return className as-is
  '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

  // Regular CSS/SCSS files
  '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

  // Static assets (images, fonts, etc.)
  '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': '<rootDir>/__mocks__/fileMock.js',
};

module.exports = {
  WORKSPACE_MAPPINGS,
  ASSET_MOCKS,
};
