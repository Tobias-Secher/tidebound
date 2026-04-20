import { BasePayload } from 'payload'

type Translation = {
  key: string
  namespace: 'common' | 'HomePage' | 'auth' | 'navigation' | 'footer' | 'forms' | 'errors' | 'success' | 'validation'
  description: string
  translations: {
    en: string
  }
}

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
]

const seedTranslations: Translation[] = [...homePageTranslations]

export const initTranslations = async (payload: BasePayload) => {
  const existingTranslations = await payload.find({
    collection: 'translations',
    limit: 1,
  })

  if (existingTranslations.docs.length > 0) {
    return
  }

  for (const translation of seedTranslations) {
    await payload.create({
      collection: 'translations',
      data: { ...translation, _status: 'published' },
    })
  }
}
