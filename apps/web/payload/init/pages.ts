import { BasePayload } from 'payload';
import { findSeededBannerId } from './media';

type RichTextRoot = {
  root: {
    type: 'root';
    version: 1;
    direction: null;
    format: '';
    indent: 0;
    children: unknown[];
  };
};

const paragraph = (text: string) => ({
  type: 'paragraph',
  version: 1,
  direction: null,
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  children: [
    {
      type: 'text',
      version: 1,
      detail: 0,
      format: 0,
      mode: 'normal',
      style: '',
      text,
    },
  ],
});

const richText = (text: string): RichTextRoot => ({
  root: {
    type: 'root',
    version: 1,
    direction: null,
    format: '',
    indent: 0,
    children: [paragraph(text)],
  },
});

type HeroBlock = {
  blockType: 'hero';
  heading: string;
  subheading?: string;
  backgroundImage?: string | number;
};
type ContentBlock = { blockType: 'content'; richText: RichTextRoot };

type SeedPage = {
  title: string;
  slug: string;
  modules: Array<HeroBlock | ContentBlock>;
};

export const initPages = async (payload: BasePayload) => {
  const existing = await payload.find({
    collection: 'pages',
    limit: 1,
  });

  if (existing.docs.length > 0) {
    return;
  }

  const bannerId = await findSeededBannerId(payload);

  const seedPages: SeedPage[] = [
    {
      title: 'Home page',
      slug: '/',
      modules: [
        {
          blockType: 'content',
          richText: richText('This is very nice indeed '),
        },
      ],
    },
    {
      title: 'Woman',
      slug: 'woman',
      modules: [{ blockType: 'hero', heading: 'My woman hero', backgroundImage: bannerId }],
    },
    {
      title: 'Man',
      slug: 'man',
      modules: [{ blockType: 'hero', heading: 'My man hero', backgroundImage: bannerId }],
    },
  ];

  for (const page of seedPages) {
    await payload.create({
      collection: 'pages',
      data: page,
    });
  }
};
