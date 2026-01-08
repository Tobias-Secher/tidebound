import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '@repo/templates';

const meta: Meta<typeof Header> = {
  title: 'Templates/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Optional CSS class name',
    },
    children: {
      control: 'text',
      description: 'Component content',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default content',
  },
};

export const WithCustomClass: Story = {
  args: {
    children: 'Styled content',
    className: 'custom-class',
  },
};
