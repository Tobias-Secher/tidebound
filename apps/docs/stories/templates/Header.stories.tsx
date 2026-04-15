import type { Meta, StoryObj } from '@storybook/react';
import { ToastBar, Links, MobileNav } from '@repo/templates';
import type { ResolvedNavItem } from '@repo/templates';

const sampleNavItems: ResolvedNavItem[] = [
  { id: '1', label: 'Women', href: '/women' },
  { id: '2', label: 'Men', href: '/men' },
  {
    id: '3',
    label: 'About',
    href: '#',
    children: [
      { id: '3a', label: 'Our Story', href: '/about/our-story' },
      { id: '3b', label: 'Sustainability', href: '/about/sustainability' },
      { id: '3c', label: 'Careers', href: '/about/careers' },
    ],
  },
  {
    id: '4',
    label: 'Collections',
    href: '#',
    children: [
      { id: '4a', label: 'New Arrivals', href: '/collections/new' },
      { id: '4b', label: 'Best Sellers', href: '/collections/best-sellers' },
      { id: '4c', label: 'Sale', href: '/collections/sale' },
    ],
  },
  { id: '5', label: 'Contact', href: '/contact' },
];

// ToastBar Stories
const toastMeta: Meta<typeof ToastBar> = {
  title: 'Templates/Header/ToastBar',
  component: ToastBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default toastMeta;
type ToastStory = StoryObj<typeof toastMeta>;

export const Default: ToastStory = {
  args: {
    message: 'Free shipping on orders over $100',
    linkUrl: '/shipping',
    linkText: 'Learn more',
  },
};

export const WithoutLink: ToastStory = {
  args: {
    message: 'Spring sale — 20% off all wetsuits this weekend!',
  },
};

// Links Stories
const linksMeta: Meta<typeof Links> = {
  title: 'Templates/Header/Links',
  component: Links,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export const Navigation: StoryObj<typeof linksMeta> = {
  render: () => <Links items={sampleNavItems} />,
};

// MobileNav Stories
const mobileMeta: Meta<typeof MobileNav> = {
  title: 'Templates/Header/MobileNav',
  component: MobileNav,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const Mobile: StoryObj<typeof mobileMeta> = {
  render: () => (
    <div style={{ padding: '16px' }}>
      <MobileNav items={sampleNavItems} />
      <p style={{ marginTop: '16px', color: '#666' }}>
        Click the hamburger icon to open the mobile menu
      </p>
    </div>
  ),
};
