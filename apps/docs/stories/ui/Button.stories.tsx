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
    className: {
      control: 'text',
      description: 'Optional CSS class name',
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
    children: 'Click me',
  },
};

export const Web: Story = {
  args: {
    appName: 'web',
    children: 'Web App Button',
  },
};

export const Docs: Story = {
  args: {
    appName: 'docs',
    children: 'Docs App Button',
  },
};

export const WithCustomClass: Story = {
  args: {
    appName: 'Storybook',
    children: 'Styled Button',
    className: 'custom-button-class',
  },
};
