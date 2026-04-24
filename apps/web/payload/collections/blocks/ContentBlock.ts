import type { Block } from 'payload';

export const ContentBlock: Block = {
  slug: 'content',
  fields: [
    { name: 'richText', type: 'richText', required: true },
  ],
};
