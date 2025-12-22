/**
 * Centralized i18n configuration
 */

export const CMS_URL = process.env.API_URL;

/**
 * Cache tags for translation revalidation
 * Use these tags to manually revalidate translations when CMS content changes
 */
export const TRANSLATION_CACHE_TAGS = {
  all: "translations",
  locale: (locale: string) => `translations-${locale}`,
} as const;
