/**
 * Centralized i18n configuration
 */

export const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

/**
 * Cache tags for translation revalidation
 * Use these tags to manually revalidate translations when CMS content changes
 */
export const TRANSLATION_CACHE_TAGS = {
  all: 'translations',
  locale: (locale: string) => `translations-${locale}`,
} as const
