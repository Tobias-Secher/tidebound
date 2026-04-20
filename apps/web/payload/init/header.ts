import { BasePayload } from 'payload';

export const initHeader = async (payload: BasePayload) => {
  const header = await payload.findGlobal({
    slug: 'header',
  });

  if (header?.toast?.enabled !== undefined && header?.navItems?.length) {
    return;
  }

  const findPageId = async (slug: string) => {
    const res = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    });
    return res.docs[0]?.id;
  };

  const womanId = await findPageId('woman');
  const manId = await findPageId('man');

  await payload.updateGlobal({
    slug: 'header',
    data: {
      toast: {
        enabled: true,
        message: 'Free shipping on orders over $100',
        linkUrl: '/shipping',
        linkText: 'Learn more',
      },
      navItems: [
        {
          label: 'Women',
          linkType: 'internal',
          page: womanId,
          openInNewTab: false,
        },
        {
          label: 'Men',
          linkType: 'internal',
          page: manId,
          openInNewTab: false,
        },
        {
          label: 'About',
          linkType: 'external',
          externalUrl: '#',
          openInNewTab: false,
          children: [
            {
              label: 'Our Story',
              linkType: 'external',
              externalUrl: '/about/our-story',
              openInNewTab: false,
            },
            {
              label: 'Sustainability',
              linkType: 'external',
              externalUrl: '/about/sustainability',
              openInNewTab: false,
            },
          ],
        },
        {
          label: 'Contact',
          linkType: 'external',
          externalUrl: '/contact',
          openInNewTab: false,
        },
      ],
    },
  });
};
