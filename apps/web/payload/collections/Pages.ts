import { revalidateTag } from 'next/cache';
import type { CollectionConfig } from 'payload';
import { blocks } from './blocks';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ req }) => {
        req.payload.logger.info(`Page updated, revalidating cache.`);
        try {
          revalidateTag('*', 'max');
        } catch (error) {
          req.payload.logger.error(`Failed to revalidate page cache: ${error}`);
        }
        return;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'The URL path for this page (e.g., "about", "contact")',
      },
    },
    {
      name: 'modules',
      type: 'blocks',
      required: true,
      blocks,
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
};
