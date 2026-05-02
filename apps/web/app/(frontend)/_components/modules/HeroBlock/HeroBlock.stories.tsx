import type { Meta, StoryObj } from '@storybook/react';
import { HeroBlock } from './HeroBlock';

const meta = {
  title: 'Blocks/HeroBlock',
  component: HeroBlock,
  args: {
    backgroundImage: 'https://placehold.co/1920x1080',
    heading: 'Heading text',
    subheading: 'Sub heading text',
    moduleSpacing: 'small',
  },
} satisfies Meta<typeof HeroBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
