# Tidebound

A modern, full-stack monorepo starter template demonstrating best practices for building scalable React applications with comprehensive testing, API mocking, and component documentation.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
- [API Mocking](#api-mocking)
- [Testing with Jest](#testing-with-jest)
- [Storybook](#storybook)
- [Project Features](#project-features)
- [Scripts Reference](#scripts-reference)

## Overview

Tidebound is a production-ready monorepo architecture built with Turborepo, showcasing:

- **Next.js 16** web application with App Router and React 19
- **API mocking** with Mock Service Worker (MSW) for both client and server
- **Comprehensive testing** with Jest and React Testing Library
- **Component development** with Storybook and visual regression testing
- **Data fetching** with TanStack Query (React Query) and Ky HTTP client
- **State management** with Zustand
- **Type-safe workspace organization** with TypeScript monorepo patterns

## Tech Stack

### Core Technologies

- **Next.js 16** (App Router) - React framework for web applications
- **React 19** - UI library
- **TypeScript** - Type safety across the monorepo
- **Turborepo** - High-performance build system
- **pnpm** - Fast, disk-space efficient package manager

### Data Management

- **TanStack Query (React Query)** - Powerful data synchronization for React
- **Ky** - Modern HTTP client for REST APIs
- **Zustand** - Lightweight state management

### Development & Testing

- **Jest** - Unit and integration testing
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking for development and testing
- **Storybook** - Component development and documentation
- **Chromatic** - Visual regression testing

### Code Quality

- **ESLint** - Code linting with shared configurations
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Monorepo Structure

This project uses a monorepo architecture with pnpm workspaces and Turborepo for efficient task orchestration.

### Applications (`apps/`)

- **`web`** - Next.js 16 application with App Router
  - Demonstrates server and client components
  - Integrates MSW for API mocking
  - Uses TanStack Query for data fetching
  - Includes comprehensive Jest test setup

- **`docs`** - Storybook application for component documentation
  - Showcases components from `@repo/ui` and `@repo/templates`
  - Configured with Chromatic for visual regression testing
  - Built with Vite for fast development

### Packages (`packages/`)

- **`@repo/ui`** - Shared React components library
  - Reusable UI components (Button, Card, Code)
  - Fully tested with Jest and React Testing Library
  - Documented in Storybook

- **`@repo/templates`** - Template components with state management
  - Components using Zustand for state
  - Examples of complex component patterns

- **`@repo/services`** - Data fetching and API services
  - TanStack Query hooks for data synchronization
  - Ky-based HTTP client utilities
  - Type-safe API service layer
  - Tested with Jest in Node environment

- **`@repo/mocks`** - MSW mock definitions
  - Shared mock handlers for development and testing
  - Browser and server exports
  - Organized mock data structure

- **`@repo/utils`** - Shared utility functions
  - Common helpers and utilities
  - Pure functions tested with Jest

- **`@repo/typescript-config`** - Shared TypeScript configurations
  - Base, React, and Next.js-specific configs
  - Ensures consistent TypeScript settings across workspaces

- **`@repo/eslint-config`** - Shared ESLint configurations
  - Linting rules for library and Next.js projects
  - Consistent code style enforcement

- **`@repo/jest-config`** - Shared Jest configurations
  - Base configuration for React packages
  - Shared test setup and module mappings
  - Enables cross-workspace testing

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9.5.0

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run the web app
pnpm dev

# Run storybook
pnpm storybook
```

### Building

```bash
# Build all workspaces
pnpm build
```

### Linting & Type Checking

```bash
# Lint all workspaces
pnpm lint

# Type check all workspaces
pnpm check-types

# Format code
pnpm format
```

## API Mocking

This project uses [MSW](https://mswjs.io/) to mock API calls for both client and server components.

### Setup

The mocking infrastructure is organized in the `packages/mocks` workspace, which exports `browser` and `server` modules for setting up MSW in different contexts.

### Server-Side Mocking

For server components, MSW is initialized in the `instrumentation` file. Learn more about the instrumentation file in the [Next.js documentation](https://nextjs.org/docs/app/guides/instrumentation).

### Client-Side Mocking

For client-side data fetching, the root layout file is wrapped in a provider that enables MSW for the client.

### Adding New Mocks

To add a new API mock:

1. Add the URL pattern to the handler file
2. Create a corresponding mock file in `packages/mocks/src/handlers/mock`

### Configuration

To enable or disable MSW, update the environment variables in your `.env` file.

## Testing with Jest

This project uses [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/react) for unit and integration testing across the monorepo.

### Architecture Overview

The Jest setup follows a **shared configuration pattern** optimized for Turborepo:

```
packages/jest-config/          # Shared Jest configuration package
├── jest.base.config.js        # Base config for React packages
├── jest.setup.ts              # Global test setup (jest-dom)
└── shared.js                  # Shared constants (workspace mappings, mocks)

packages/ui/                   # React components package
├── jest.config.js             # Extends base config (jsdom)
├── __mocks__/                 # Mock files for CSS/assets
└── src/
    ├── button.tsx
    └── button.test.tsx        # Co-located test file

packages/services/             # API services package
├── jest.config.js             # Extends base config (node)
├── __mocks__/
│   └── ky.ts                  # Mock for ESM-only ky module
└── src/
    ├── queries/
    └── __tests__/             # Test directory

apps/web/                      # Next.js app with tests
├── jest.config.cjs            # Next.js-specific config
├── __mocks__/
└── app/
    └── __tests__/             # Test directory
```

### Why This Architecture?

**1. Shared Configuration = DRY Principle**

- Single source of truth for Jest settings
- All workspaces use consistent test configuration
- Update once, applies everywhere

**2. Workspace-Specific Overrides**

- React packages (`ui`, `templates`) use `jest.base.config.js` (jsdom environment)
- Next.js apps use custom config with `next/jest` (App Router support)
- Utility packages (`utils`, `services`) use Node environment (faster for non-React code)

**3. Cross-Workspace Testing**

- Tests can import components from other workspaces
- Shared module mappings resolve `@repo/*` imports (`@repo/ui`, `@repo/templates`, `@repo/utils`, `@repo/mocks`, `@repo/services`)
- Enables integration testing across packages

**4. Performance Optimized**

- Worker parallelization (`--maxWorkers=50%`)
- No build dependency (tests run on source files)
- Turbo caching for unchanged workspaces

### Running Tests

**Run all tests across monorepo:**

```bash
pnpm test
```

**Run tests for specific workspace:**

```bash
pnpm --filter @repo/ui test
pnpm --filter @repo/templates test
pnpm --filter @repo/services test
pnpm --filter web test
```

**Watch mode (auto-rerun on changes):**

```bash
pnpm --filter @repo/ui test:watch
```

**Generate coverage report:**

```bash
pnpm test:coverage
```

### Writing Tests

#### 1. React Component Testing

Tests are **co-located** with source files:

```typescript
// packages/ui/src/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button appName="test">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

#### 2. Custom React Hooks

```typescript
// apps/web/app/__tests__/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount((c) => c + 1);
  return { count, increment };
}

test('increments counter', () => {
  const { result } = renderHook(() => useCounter());

  act(() => result.current.increment());

  expect(result.current.count).toBe(1);
});
```

#### 3. Zustand Store Testing

```typescript
// packages/templates/src/__tests__/store.test.ts
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

describe('Counter Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useStore.setState({ count: 0 });
  });

  it('increments count', () => {
    useStore.getState().increment();
    expect(useStore.getState().count).toBe(1);
  });
});
```

#### 4. Cross-Workspace Integration Tests

```typescript
// apps/web/app/__tests__/integration.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@repo/ui/button'; // Import from another workspace!

test('renders component from @repo/ui', () => {
  render(<Button appName="web">Imported Button</Button>);
  expect(screen.getByText('Imported Button')).toBeInTheDocument();
});
```

### Test File Patterns

Jest automatically finds tests matching these patterns:

```
src/**/__tests__/**/*.[jt]s?(x)    # Files in __tests__ directories
src/**/*.{test,spec}.[jt]s?(x)     # Files ending in .test or .spec
app/**/__tests__/**/*.[jt]s?(x)    # Next.js app directory tests
app/**/*.{test,spec}.[jt]s?(x)     # Co-located Next.js tests
```

**Recommended patterns:**

- ✅ Co-located tests: `button.tsx` → `button.test.tsx`
- ✅ Test directories: `__tests__/integration.test.tsx`
- ✅ Group related tests in `describe` blocks

### Configuration Per Workspace

#### React Packages (ui, templates)

**jest.config.js:**

```javascript
const baseConfig = require('@repo/jest-config/base');

module.exports = {
  ...baseConfig,
  displayName: '@repo/ui',
  rootDir: __dirname,
};
```

**Environment:** `jsdom` (simulates browser)
**Use for:** React components, hooks, DOM interactions

#### Utility Packages (utils)

**jest.config.js:**

```javascript
const baseConfig = require('@repo/jest-config/base');

module.exports = {
  ...baseConfig,
  displayName: '@repo/utils',
  rootDir: __dirname,
  testEnvironment: 'node', // Override to Node
};
```

**Environment:** `node` (no DOM overhead)
**Use for:** Pure functions, utility libraries

#### Next.js Apps (web)

**jest.config.cjs:**

```javascript
const nextJest = require('next/jest');
const { WORKSPACE_MAPPINGS } = require('@repo/jest-config/shared');

const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig({
  setupFilesAfterEnv: ['<rootDir>/../../packages/jest-config/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    ...WORKSPACE_MAPPINGS,
  },
});
```

**Environment:** `jsdom` + Next.js transformations
**Use for:** Next.js pages, components, API routes

#### Services Package (services)

**jest.config.js:**

```javascript
const baseConfig = require('@repo/jest-config/base');

module.exports = {
  ...baseConfig,
  displayName: '@repo/services',
  rootDir: __dirname,
  testEnvironment: 'node', // Services don't need DOM
};
```

**Environment:** `node` (no DOM overhead)
**Use for:** API clients, utility functions, non-React business logic

**Note:** The `ky` HTTP client is mocked in `__mocks__/ky.ts` because it's an ESM-only module that Jest cannot transform by default.

### What Gets Tested vs. Not Tested

#### ✅ Test with Jest (Unit & Integration)

- Component logic and behavior
- Event handlers and user interactions
- State management (React state, Zustand stores)
- Custom hooks
- Utility functions
- API call logic (with MSW mocking)
- Cross-workspace component integration
- Conditional rendering
- Accessibility attributes

#### ❌ Don't Test with Jest

- **Visual appearance** → Use Chromatic/Percy/Playwright
- **Actual CSS styles** → Use E2E tests with real browsers
- **Complex user flows** → Use Playwright/Cypress
- **Performance** → Use Lighthouse/profiling tools
- **SSR/Server Components** → Use E2E tests

CSS files are mocked in tests, so you can test which classes are applied, but not the actual visual output.

### TypeScript Support

TypeScript knows about Jest and testing-library matchers through type references:

```typescript
// types.d.ts (in each workspace)
/// <reference types="@testing-library/jest-dom" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

This gives you full autocomplete for:

- `expect(...).toBeInTheDocument()`
- `expect(...).toHaveClass('button')`
- `expect(...).toHaveAttribute('disabled')`
- And 40+ more matchers!

### Troubleshooting

**"Cannot find module '@repo/ui'"**

- Check `moduleNameMapper` in `packages/jest-config/shared.js`
- Verify workspace path exists: `packages/ui/src/`

**"SyntaxError: Unexpected token 'export'"**

- Check `transform` configuration includes `@swc/jest`
- Ensure file extension matches transform pattern

**"toBeInTheDocument is not a function"**

- Verify `jest.setup.ts` imports `@testing-library/jest-dom`
- Check `types.d.ts` includes reference directive

**CSS/Image import errors**

- Ensure `__mocks__/styleMock.js` and `fileMock.js` exist
- Check `moduleNameMapper` patterns in config

### Performance Tips

1. **Use focused tests during development:**

   ```typescript
   test.only('this test', () => {
     /* ... */
   });
   ```

2. **Skip slow tests in watch mode:**

   ```typescript
   test.skip('slow integration test', () => {
     /* ... */
   });
   ```

3. **Parallelize tests:**
   - Tests run on 50% of CPU cores by default
   - Watch mode uses 25% to leave resources for dev

4. **Leverage Turbo caching:**
   - Unchanged workspaces use cached results
   - Tests only re-run when source or test files change

### Further Reading

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Storybook

This project uses [Storybook](https://storybook.js.org/) for component development and documentation. Storybook provides an isolated environment to build, test, and showcase UI components.

### Architecture Overview

The Storybook setup is located in the `apps/docs` workspace:

```
apps/docs/
├── .storybook/
│   ├── main.ts              # Storybook configuration
│   ├── preview.ts           # Global decorators and parameters
│   ├── tsconfig.json        # TypeScript config for Storybook
│   └── css-modules.d.ts     # CSS modules type definitions
└── stories/
    ├── ui/                  # Stories for @repo/ui components
    │   ├── Button.stories.tsx
    │   ├── Card.stories.tsx
    │   └── Code.stories.tsx
    └── templates/           # Stories for @repo/templates
        └── Button.stories.tsx
```

### Key Features

**1. Component-Driven Development**

- Develop UI components in isolation
- Test different states and variants
- Rapid prototyping without running the full app

**2. Automatic Documentation**

- Auto-generated docs from TypeScript prop types
- Interactive controls for component props
- Live code examples

**3. Cross-Workspace Component Library**

- Import and document components from `@repo/ui`
- Import and document components from `@repo/templates`
- Centralized component showcase

**4. Visual Testing with Chromatic**

- Automated visual regression testing
- Integrated via `pnpm chromatic` script
- Tracks UI changes across commits

### Running Storybook

**Start Storybook dev server:**

```bash
pnpm storybook
```

This runs Storybook on `http://localhost:6006`

**Build static Storybook:**

```bash
pnpm build-storybook
```

**Run Chromatic visual tests:**

```bash
cd apps/docs
pnpm chromatic
```

### Configuration

#### Main Configuration (apps/docs/.storybook/main.ts)

The main config defines:

- **Story locations**: `../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- **Addons**: Essential addons for controls, interactions, docs, and onboarding
- **Framework**: React with Vite builder
- **TypeScript**: React-docgen-typescript for prop extraction

Key settings:

```typescript
{
  framework: "@storybook/react-vite",
  docs: { autodocs: "tag" },
  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
}
```

#### Preview Configuration (apps/docs/.storybook/preview.ts)

Global story parameters:

- **Controls**: Automatic control type matching for colors and dates
- **Backgrounds**: Light and dark theme options
- **Layout**: Configurable layout per story (centered, fullscreen, padded)

### Writing Stories

Stories are written using the Component Story Format (CSF) 3.0:

```typescript
// apps/docs/stories/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@repo/ui/button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    appName: {
      control: 'text',
      description: 'The name of the app using the button',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appName: 'Storybook',
    children: 'Click me',
  },
};
```

### Story Organization

Stories are organized by package:

**UI Components (`@repo/ui`):**

- `stories/ui/Button.stories.tsx`
- `stories/ui/Card.stories.tsx`
- `stories/ui/Code.stories.tsx`

**Template Components (`@repo/templates`):**

- `stories/templates/Button.stories.tsx`

### Adding New Stories

1. **Create a new story file** in `apps/docs/stories/`:

   ```typescript
   // apps/docs/stories/ui/NewComponent.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { NewComponent } from '@repo/ui/new-component';

   const meta = {
     title: 'UI/NewComponent',
     component: NewComponent,
     tags: ['autodocs'],
   } satisfies Meta<typeof NewComponent>;

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {
     args: {
       // component props
     },
   };
   ```

2. **Storybook auto-discovers** the story (no config changes needed)

3. **View in browser** at `http://localhost:6006`

### Story Features

**Tags:**

- `['autodocs']`: Auto-generate documentation page from props

**Parameters:**

- `layout: 'centered'`: Center component in canvas
- `layout: 'fullscreen'`: Full viewport layout
- `layout: 'padded'`: Default padding

**ArgTypes:**
Customize controls for props:

```typescript
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary'],
    description: 'Button style variant',
  },
  disabled: {
    control: 'boolean',
  },
}
```

### Chromatic Integration

Chromatic provides automated visual regression testing:

**Configuration:**

- Project token configured in `apps/docs/package.json`
- Runs via: `pnpm chromatic`

**Workflow:**

1. Push changes to repository
2. Run `pnpm chromatic` (or configure CI)
3. Chromatic captures screenshots of all stories
4. Compare against baseline
5. Review and approve changes

**Benefits:**

- Catch unintended visual changes
- Review UI changes in PRs
- Maintain visual consistency

### Monorepo Integration

Storybook seamlessly imports components from workspace packages:

```typescript
// Import from @repo/ui
import { Button } from '@repo/ui/button';

// Import from @repo/templates
import { TemplateButton } from '@repo/templates/button';
```

The Vite builder resolves workspace dependencies automatically.

### Addons

**Installed addons:**

- `@storybook/addon-essentials`: Core features (docs, controls, actions, viewport, backgrounds)
- `@storybook/addon-interactions`: Component interaction testing
- `@storybook/addon-links`: Navigate between stories
- `@storybook/addon-onboarding`: First-time user guide

### Best Practices

**1. One Story Per State:**

```typescript
export const Default: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Disabled: Story = { args: { disabled: true } };
```

**2. Meaningful Story Names:**

- Use descriptive names that indicate the component state
- `WithCustomClass`, `Loading`, `Error`, etc.

**3. Document Props:**

```typescript
argTypes: {
  onClick: {
    description: 'Callback fired when button is clicked',
  },
}
```

**4. Use Tags for Auto-docs:**

```typescript
tags: ['autodocs']; // Generates docs page automatically
```

**5. Test Interactions:**

```typescript
import { userEvent, within } from '@storybook/test';

export const ClickTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};
```

### Troubleshooting

**"Module not found" errors:**

- Check workspace dependencies are installed: `pnpm install`
- Verify component exports in package `index.ts`

**TypeScript errors in stories:**

- Check `apps/docs/.storybook/tsconfig.json` extends project config
- Ensure `@storybook/test` types are available

**Stories not appearing:**

- Verify story file matches pattern: `*.stories.@(js|jsx|ts|tsx)`
- Check story is in `apps/docs/stories/` directory
- Restart Storybook dev server

**Vite build errors:**

- Clear Storybook cache: `rm -rf apps/docs/.storybook/cache`
- Check for conflicting dependencies

### Further Reading

- [Storybook Documentation](https://storybook.js.org/docs)
- [Component Story Format (CSF)](https://storybook.js.org/docs/api/csf)
- [Storybook with Vite](https://storybook.js.org/docs/builders/vite)
- [Chromatic Documentation](https://www.chromatic.com/docs)

## Project Features

### 1. Modern React Patterns

- **React 19** with latest features and patterns
- **Server Components** for improved performance
- **Client Components** with hooks and interactivity
- **Parallel data fetching** with TanStack Query

### 2. Type-Safe Development

- Full **TypeScript** coverage across all workspaces
- Shared TypeScript configurations for consistency
- Type-safe API clients with Ky
- Autocomplete and IntelliSense throughout

### 3. Developer Experience

- **Fast refresh** in development
- **Hot module replacement** with Vite (Storybook)
- **Parallel builds** with Turborepo
- **Smart caching** for faster rebuilds
- **ESLint** with auto-fix on save
- **Prettier** for consistent formatting

### 4. Testing Strategy

- **Unit tests** for components and utilities
- **Integration tests** across workspaces
- **MSW** for API mocking without backend
- **React Testing Library** for user-centric tests
- **Visual regression** with Chromatic

### 5. Monorepo Benefits

- **Code sharing** between applications
- **Consistent tooling** across workspaces
- **Atomic changes** across multiple packages
- **Dependency management** with pnpm catalogs
- **Independent versioning** per package

### 6. Production Ready

- **Optimized builds** with Next.js
- **Tree shaking** for minimal bundle sizes
- **Static generation** where applicable
- **Environment configuration** support
- **CI/CD ready** structure

## Scripts Reference

### Root Scripts (run from project root)

```bash
# Development
pnpm dev                    # Start all apps in dev mode
pnpm storybook              # Start Storybook on port 6006

# Building
pnpm build                  # Build all workspaces
pnpm build-storybook        # Build static Storybook

# Testing
pnpm test                   # Run all tests (50% max workers)
pnpm test:watch             # Run tests in watch mode (25% max workers)
pnpm test:coverage          # Run tests with coverage report

# Code Quality
pnpm lint                   # Lint all workspaces
pnpm format                 # Format code with Prettier
pnpm check-types            # Type check all workspaces
```

### Workspace-Specific Scripts

```bash
# Run scripts in specific workspaces
pnpm --filter web dev           # Run web app
pnpm --filter docs storybook    # Run Storybook
pnpm --filter @repo/ui test     # Test UI package
pnpm --filter web build         # Build web app
```

### Turborepo Features

- **Caching**: Task outputs are cached and reused
- **Parallelization**: Independent tasks run in parallel
- **Incremental builds**: Only rebuild what changed
- **Remote caching**: Share cache across team (configure in `turbo.json`)

## Environment Variables

> Pull env from vercel

## Architecture Decisions

### Why Turborepo?

- High-performance builds with intelligent caching
- Simple task orchestration across workspaces
- Great developer experience with minimal configuration

### Why pnpm?

- Fast and efficient with disk space optimization
- Native monorepo support with workspaces
- Strict dependency isolation prevents phantom dependencies

### Why MSW?

- Mock API at the network level (works everywhere)
- Same mocks for development, testing, and Storybook
- No backend required for frontend development

### Why TanStack Query?

- Powerful caching and synchronization
- Optimistic updates and background refetching
- Excellent TypeScript support

### Why Zustand?

- Minimal boilerplate compared to Redux
- Easy to test and reason about
- Great TypeScript inference

### Adding a New Workspace

1. Create directory in `apps/` or `packages/`
2. Add `package.json` with workspace dependencies
3. Reference shared configs (`@repo/typescript-config`, `@repo/eslint-config`)
4. Update `pnpm-workspace.yaml` if needed (usually auto-detected)

### Adding a New Component

Use Turbo generators:

```bash
cd packages/ui
pnpm generate:component
```

## License

MIT

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TanStack Query](https://tanstack.com/query/latest)
- [MSW Documentation](https://mswjs.io/docs)
- [Jest Documentation](https://jestjs.io/)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Font](https://fonts.google.com/specimen/Atkinson+Hyperlegible+Mono)
