# Tidebound

A Next.js test application with integrated API mocking capabilities.

## Tech Stack

- Next.js (App Router)
- MSW (Mock Service Worker) for API mocking
- Monorepo workspace structure

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