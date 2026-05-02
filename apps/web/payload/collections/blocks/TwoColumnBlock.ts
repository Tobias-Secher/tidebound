import type { Block } from 'payload';

export const TwoColumnBlock: Block = {
  slug: 'twoColumn',
  fields: [
    { name: 'leftColumn', type: 'richText', required: true },
    { name: 'rightColumn', type: 'richText', required: true },
  ],
};
