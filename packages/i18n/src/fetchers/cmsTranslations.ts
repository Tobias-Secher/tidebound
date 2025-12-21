import type { Locale } from '../index'
import { flatToNested, type TranslationDocument } from '../utils/transformTranslations'
import { CMS_URL, getCacheRevalidate } from '../config'

/**
 * Fetches translations from Payload CMS with caching
 *
 * @param locale - The locale to fetch translations for
 * @returns Nested translation object or null if fetch fails
 */
export async function fetchCMSTranslations(
  locale: Locale
): Promise<Record<string, any> | null> {
  try {
    const response = await fetch(
      `${CMS_URL}/api/translations?locale=${locale}&limit=10000&depth=0&where[_status][equals]=published`,
      {
        next: {
          revalidate: getCacheRevalidate(),
          tags: [`translations-${locale}`, 'translations'],
        },
      }
    )

    if (!response.ok) {
      console.error(`[i18n] CMS fetch failed for ${locale}: ${response.statusText}`)
      return null
    }

    const { docs } = await response.json()

    if (!Array.isArray(docs)) {
      console.error(`[i18n] Invalid CMS response for ${locale}`)
      return null
    }

    return flatToNested(docs as TranslationDocument[], locale)
  } catch (error) {
    console.error(`[i18n] CMS fetch error for ${locale}:`, error)
    return null
  }
}
