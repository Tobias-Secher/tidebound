import type { Meta, StoryObj } from '@storybook/react';
import { Code } from '@repo/ui/code';

const meta = {
  title: 'UI/Code',
  component: Code,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Optional CSS class name',
    },
    children: {
      control: 'text',
      description: 'Code content',
    },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'npm install',
  },
};

export const LongCommand: Story = {
  args: {
    children: 'pnpm add -D @storybook/react @storybook/react-vite',
  },
};

export const FilePath: Story = {
  args: {
    children: '/Users/tobias/Documents/workspace/tidebound',
  },
};
