import type { Locale } from '../index'
import { flatToNested, type TranslationDocument } from '../utils/transformTranslations'

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

// In-memory cache for server-side
const translationsCache = new Map<
  string,
  { data: Record<string, any>; timestamp: number }
>()

// Cache TTL: 10 seconds in development, 5 minutes in production
const CACHE_TTL = process.env.NODE_ENV === 'production' ? 300000 : 10000 // 5 min prod, 10 sec dev

/**
 * Fetches translations from Payload CMS with caching
 *
 * @param locale - The locale to fetch translations for
 * @returns Nested translation object or null if fetch fails
 */
export async function fetchCMSTranslations(
  locale: Locale
): Promise<Record<string, any> | null> {
  const cacheKey = `translations-${locale}`

  // Check in-memory cache
  if (translationsCache.has(cacheKey)) {
    const cached = translationsCache.get(cacheKey)!
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }
    // Remove stale cache entry
    translationsCache.delete(cacheKey)
  }

  try {
    const response = await fetch(
      `${CMS_API_URL}/api/translations?locale=${locale}&limit=10000&depth=0&where[_status][equals]=published`,
      {
        next: {
          revalidate: process.env.NODE_ENV === 'production' ? 3600 : 10, // 1 hour prod, 10 sec dev
          tags: [`translations-${locale}`, 'translations'],
        },
      } as RequestInit
    )

    if (!response.ok) {
      console.error(
        `[i18n] Failed to fetch translations for ${locale}:`,
        response.statusText
      )
      return null
    }

    const { docs } = await response.json()

    if (!docs || !Array.isArray(docs)) {
      console.error(`[i18n] Invalid response format from CMS for ${locale}`)
      return null
    }

    // Transform flat documents to nested structure
    const nested = flatToNested(docs as TranslationDocument[], locale)

    // Update cache
    translationsCache.set(cacheKey, {
      data: nested,
      timestamp: Date.now(),
    })

    return nested
  } catch (error) {
    console.error(`[i18n] Error fetching CMS translations for ${locale}:`, error)
    return null
  }
}

/**
 * Utility to manually clear the translations cache
 * Useful for development or after CMS updates
 */
export function clearTranslationsCache(locale?: Locale) {
  if (locale) {
    translationsCache.delete(`translations-${locale}`)
    console.log(`[i18n] Cleared cache for locale: ${locale}`)
  } else {
    translationsCache.clear()
    console.log(`[i18n] Cleared all translation caches`)
  }
}
