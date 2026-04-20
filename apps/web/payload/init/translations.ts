import { BasePayload } from 'payload';

type Translation = {
  key: string;
  namespace:
    | 'common'
    | 'HomePage'
    | 'auth'
    | 'navigation'
    | 'footer'
    | 'forms'
    | 'errors'
    | 'success'
    | 'validation'
    | 'a11y';
  description: string;
  translations: {
    en: string;
  };
  tags?: { tag: string }[];
};

const allyTranslations: Translation[] = [
  {
    key: 'a11y.navigation.desktop',
    description: 'Aria label for the desktop menu',
    namespace: 'a11y',
    translations: { en: 'Main menu' },
    tags: [{ tag: 'navigation' }, { tag: 'a11y' }],
  },
  {
    key: 'a11y.header.tidebound',
    description: 'Aria label for the tidebound link',
    namespace: 'a11y',
    translations: { en: 'Tidebound home' },
    tags: [{ tag: 'navigation' }, { tag: 'a11y' }],
  },
  {
    key: 'a11y.toast.dismiss',
    description: 'Aria label for the toast dismiss btn',
    namespace: 'a11y',
    translations: { en: 'Dismiss notification' },
    tags: [{ tag: 'navigation' }, { tag: 'a11y' }],
  },
];

const homePageTranslations: Translation[] = [
  {
    key: 'HomePage.title',
    description: 'Main title on home page',
    namespace: 'HomePage',
    translations: { en: 'Welcome to Tidebound' },
  },
  {
    key: 'HomePage.subtitle',
    description: 'Subtitle on home page',
    namespace: 'HomePage',
    translations: { en: 'Your content management solution' },
  },
];

const seedTranslations: Translation[] = [...homePageTranslations, ...allyTranslations];

export const initTranslations = async (payload: BasePayload) => {
  const existingTranslations = await payload.find({
    collection: 'translations',
    limit: 1,
  });

  if (existingTranslations.docs.length > 0) {
    return;
  }

  for (const translation of seedTranslations) {
    await payload.create({
      collection: 'translations',
      data: { ...translation, _status: 'published' },
    });
  }
};
