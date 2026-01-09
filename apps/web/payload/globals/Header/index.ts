import { revalidateTag } from 'next/cache';
import type { Field, GlobalConfig } from 'payload';

const navItemFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
    admin: {
      description: 'Display text for this navigation item',
    },
  },
  {
    name: 'linkType',
    type: 'radio',
    required: true,
    defaultValue: 'internal',
    options: [
      { label: 'Internal Page', value: 'internal' },
      { label: 'External URL', value: 'external' },
    ],
    admin: {
      layout: 'horizontal',
    },
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    required: true,
    admin: {
      condition: (_: unknown, siblingData: { linkType?: string }) =>
        siblingData?.linkType === 'internal',
      description: 'Select an internal page',
    },
  },
  {
    name: 'externalUrl',
    type: 'text',
    required: true,
    admin: {
      condition: (_: unknown, siblingData: { linkType?: string }) =>
        siblingData?.linkType === 'external',
      description: 'Enter the full external URL (e.g., https://example.com)',
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      description: 'Open link in a new browser tab',
    },
  },
];

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ req }) => {
        req.payload.logger.info('Header navigation updated, revalidating cache.');
        try {
          revalidateTag('header', 'max');
        } catch (error) {
          req.payload.logger.error(`Failed to revalidate header cache: ${error}`);
        }
      },
    ],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      admin: {
        description: 'Main navigation menu items',
      },
      fields: [
        ...navItemFields,
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown Items',
          labels: {
            singular: 'Dropdown Link',
            plural: 'Dropdown Links',
          },
          admin: {
            description: 'Optional nested navigation items (dropdown menu)',
          },
          fields: navItemFields,
        },
      ],
    },
  ],
};
