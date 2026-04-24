import type { Block, Field } from 'payload';

const baseFields: Field[] = [
  {
    name: 'moduleSpacing',
    type: 'select',
    required: true,
    defaultValue: 'medium',
    options: [
      { label: 'Small', value: 'small' },
      { label: 'Medium', value: 'medium' },
      { label: 'Large', value: 'large' },
    ],
  },
];

export const withBaseFields = (block: Block): Block => ({
  ...block,
  fields: [...block.fields, ...baseFields],
});
