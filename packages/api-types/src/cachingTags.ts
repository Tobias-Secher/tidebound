export const CACHE_TAGS = {
  pages: {
    all: 'pages',
    page: (slug: string) => `page-${slug}`,
  },
  translation: {
    all: 'translations',
    locale: (locale: string) => `translations-${locale}`,
  },
  header: {
    all: 'header',
  },
} as const;
