import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@repo/ui/card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
    },
    href: {
      control: 'text',
      description: 'Link URL',
    },
    className: {
      control: 'text',
      description: 'Optional CSS class name',
    },
    children: {
      control: 'text',
      description: 'Card content',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Example Card',
    href: 'https://example.com',
    children: 'This is a card component with some example content.',
  },
};

export const Documentation: Story = {
  args: {
    title: 'Documentation',
    href: 'https://turbo.build/repo/docs',
    children: 'Find in-depth information about Turborepo features and API.',
  },
};

export const Learn: Story = {
  args: {
    title: 'Learn',
    href: 'https://turbo.build/repo/docs/handbook',
    children: 'Learn about Turborepo in an interactive course with quizzes!',
  },
};
