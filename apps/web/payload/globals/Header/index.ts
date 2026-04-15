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
      name: 'toast',
      type: 'group',
      label: 'Toast Banner',
      admin: {
        description: 'Promotional banner displayed at the top of the header',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show the toast banner',
          },
        },
        {
          name: 'message',
          type: 'text',
          admin: {
            description: 'The message to display in the toast banner',
            condition: (_: unknown, siblingData: { enabled?: boolean }) =>
              siblingData?.enabled === true,
          },
        },
        {
          name: 'linkUrl',
          type: 'text',
          admin: {
            description: 'Optional link URL',
            condition: (_: unknown, siblingData: { enabled?: boolean }) =>
              siblingData?.enabled === true,
          },
        },
        {
          name: 'linkText',
          type: 'text',
          admin: {
            description: 'Link text (displayed after the message)',
            condition: (
              _: unknown,
              siblingData: { enabled?: boolean; linkUrl?: string },
            ) => siblingData?.enabled === true && !!siblingData?.linkUrl,
          },
        },
      ],
    },
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
