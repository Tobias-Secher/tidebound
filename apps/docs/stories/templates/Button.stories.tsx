import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@repo/templates/button';

const meta = {
  title: 'Templates/Button',
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
    className: {
      control: 'text',
      description: 'Optional CSS class name (note: button uses CSS modules internally)',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appName: 'Storybook',
    children: 'Template Button',
  },
};

export const Styled: Story = {
  args: {
    appName: 'templates',
    children: 'Styled with CSS Modules',
  },
};

export const LongText: Story = {
  args: {
    appName: 'templates',
    children: 'This is a button with longer text content',
  },
};
