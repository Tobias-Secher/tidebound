# Tidebound Component Documentation (Storybook)

This app hosts Storybook for the Tidebound monorepo, providing interactive documentation for components in `@repo/ui`.

## Getting Started

Run the Storybook development server:

```bash
pnpm dev
# or
pnpm storybook
```

Open [http://localhost:6006](http://localhost:6006) in your browser to view the component documentation.

## Project Structure

```
apps/docs/
├── .storybook/          # Storybook configuration
│   ├── main.ts         # Main config (framework, addons, etc.)
│   ├── preview.ts      # Global decorators and parameters
│   └── tsconfig.json   # TypeScript config for Storybook
└── stories/            # Component stories
    ├── Introduction.mdx
    ├── ui/             # Stories for @repo/ui components
    │   ├── Button.stories.tsx
    │   ├── Card.stories.tsx
    │   └── Code.stories.tsx
```

## Adding Stories

Create a new `.stories.tsx` file in the appropriate directory:

**For @repo/ui components:**

```typescript
// stories/ui/YourComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from '@repo/ui/your-component';

const meta = {
  title: 'UI/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // your props here
  },
};
```

## Building for Production

Build a static Storybook site:

```bash
pnpm build
# or
pnpm build-storybook
```

The static site will be output to `storybook-static/`.

## Learn More

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook for React](https://storybook.js.org/docs/react/get-started/introduction)
- [Writing Stories](https://storybook.js.org/docs/react/writing-stories/introduction)
