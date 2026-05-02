import type { Meta, StoryObj } from '@storybook/react';
import { Surface } from '@repo/ui';

const meta = {
  title: 'UI/Surface',
  component: Surface,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: <div>I am some content</div>,
  },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RenderAsMain: Story = {
  args: {
    as: 'main',
  },
};
