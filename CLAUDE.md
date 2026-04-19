# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

When creating new labels, always add them in the payload init folder for the correct collection

## Project Overview

Tidebound is a webshop for scuba, diving, and water sport equipment. It's a pnpm + Turborepo monorepo with a Next.js 16 frontend and Payload CMS backend sharing a single app.

## Commands

```bash
# Development
pnpm dev                          # Start all apps (web on :3000)
pnpm storybook                    # Storybook on :6006

# Build / Lint / Types
pnpm build
pnpm lint
pnpm check-types

# Testing (Jest + React Testing Library)
pnpm test                         # All workspaces
pnpm --filter @repo/ui test       # Single package
pnpm --filter web test            # Web app only
pnpm test:watch                   # Watch mode
pnpm test:coverage                # With coverage

# Code generation
pnpm generate:component           # Interactive component scaffolding (from packages/ui)
pnpm generate:types               # Payload CMS → TypeScript types
pnpm generate:translations        # CMS → packages/i18n/messages/en.json (type source)
pnpm generate:importmap           # Payload import map
pnpm format                       # Prettier
```

## Architecture

### Monorepo Layout

- **apps/web** — Next.js 16 (App Router, React 19) + Payload CMS. Route groups split frontend `(frontend)` from Payload admin `(payload)`. Frontend routes are under `[locale]/(pages)/`.
- **apps/docs** — Storybook 10 (Webpack 5). Stories live in `stories/ui/` and `stories/templates/`.

### Key Packages

| Package                   | Purpose                                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@repo/ui`                | Shared presentational components. Exported via `@repo/ui/component-name`.                                                                          |
| `@repo/services`          | TanStack Query hooks + Ky HTTP client for API calls.                                                                                               |
| `@repo/mocks`             | MSW handlers. Exports `server` and `browser` entry points.                                                                                         |
| `@repo/i18n`              | next-intl integration. CMS is the source of truth for translations.                                                                                |
| `@repo/api-types`         | Payload-generated TypeScript types (`payload-types.ts`). Build with `pnpm --filter @repo/api-types build` before other packages that depend on it. |
| `@repo/utils`             | Pure utility functions.                                                                                                                            |
| `@repo/styles`            | CSS variables, fonts, and global styles.                                                                                                           |
| `@repo/jest-config`       | Shared Jest base config and workspace mappings.                                                                                                    |
| `@repo/eslint-config`     | Shared ESLint configs.                                                                                                                             |
| `@repo/typescript-config` | Shared tsconfig bases.                                                                                                                             |

### Payload CMS

- Config: `apps/web/payload/config.ts`
- Collections: `apps/web/payload/collections/` (Media, Pages, Translations, Users)
- Globals: `apps/web/payload/globals/` (Header)
- Seed data: `apps/web/payload/init/` — **when adding a new collection, add corresponding init logic here** so data is restored if MongoDB is dropped.
- Payload generates types to `packages/api-types/src/payload-types.ts`.
- Uses local MongoDB (`DATABASE_URI` env var).

### Internationalization

- Powered by `next-intl` with CMS-first translations (no static JSON at runtime).
- Locales defined in `packages/i18n/src/index.ts`.
- Middleware at `apps/web/middleware.ts` handles locale routing (always prefixed).
- Translation fallback: requested locale → English → key name.
- After adding CMS translations, run `pnpm generate:translations` to update types.
- When using a link/anchor tag always use the nextIntl's Link component

### MSW Mocking

- Server-side: initialized via `apps/web/instrumentation.js`.
- Client-side: wrapped in a provider in the root layout.
- Toggle with `NEXT_PUBLIC_USE_MSW` env var.
- Mock handlers live in `packages/mocks/src/`.

### Environment Variables

Key vars (see `turbo.json` globalEnv): `NODE_ENV`, `NEXT_PUBLIC_USE_MSW`, `API_URL`, `PAYLOAD_SECRET`, `DATABASE_URI`.

`API_URL` should be the base URL only (e.g., `http://localhost:3001`) — no `/api` suffix.

### Testing Conventions

- React packages (ui): jsdom environment, co-located test files (`component.test.tsx`).
- Services/utils: node environment, tests in `__tests__/` directories.
- Web app: uses `next/jest` config (`jest.config.cjs`), jsdom environment.
- `ky` is mocked in `packages/services/__mocks__/ky.ts` (ESM-only module).
- Cross-workspace imports resolved via `@repo/jest-config/shared.js` mappings.

### Styling

- CSS Modules for component styles. Always use nested css when possible for best specificity possible
- Global CSS variables and fonts in `@repo/styles`.
- Imported as `@repo/styles/variables.css`, `@repo/styles/globals.css`, etc.
