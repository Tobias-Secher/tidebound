import { Image } from '@repo/ui';
import type { Media } from '@repo/api-types';
import type { Meta, StoryObj } from '@storybook/react';

const desktopMedia: Media = {
  id: 'desktop',
  alt: 'Stories desktop image',
  url: 'https://placehold.co/600x400',
  width: 600,
  height: 400,
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const mobileMedia: Media = {
  id: 'mobile',
  alt: 'Stories mobile image',
  url: 'https://placehold.co/400x600',
  width: 400,
  height: 600,
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const meta = {
  title: 'UI/Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    desktop: desktopMedia,
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMobileSrc: Story = {
  args: {
    mobile: mobileMedia,
  },
};

export const WithCustomBreakpoint: Story = {
  args: {
    mobile: mobileMedia,
    breakpoint: '(min-width: 768px)',
  },
};

export const WithAltOverride: Story = {
  args: {
    alt: 'Overridden alt text',
  },
};

export const WithDimensionOverride: Story = {
  args: {
    desktop: { media: desktopMedia, width: 300, height: 200 },
  },
};

export const WithError: Story = {
  args: {
    desktop: {
      ...desktopMedia,
      id: 'broken',
      url: 'https://example.invalid/missing.jpg',
    },
    onImageLoaderError: () => {
      // eslint-disable-next-line no-console
      console.warn('Image failed to load');
    },
  },
};
