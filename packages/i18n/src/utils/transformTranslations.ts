import type { Locale } from '../index'

export type TranslationDocument = {
  key: string
  namespace: string
  translations: {
    en?: string
    de?: string
    fr?: string
    da?: string
  }
}

export type NestedMessages = Record<string, any>

/**
 * Converts flat translation keys to nested object structure
 *
 * @example
 * Input: [{ key: "HomePage.title", translations: { en: "Welcome" } }]
 * Output: { HomePage: { title: "Welcome" } }
 *
 * @param translations - Array of translation documents from CMS
 * @param locale - The locale to extract translations for
 * @returns Nested object structure compatible with next-intl
 */
export function flatToNested(
  translations: TranslationDocument[],
  locale: Locale
): NestedMessages {
  const result: NestedMessages = {}

  for (const doc of translations) {
    const value = doc.translations[locale]
    if (!value) continue // Skip if translation doesn't exist for this locale

    // If key doesn't include namespace, prepend it
    const fullKey = doc.key.includes('.')
      ? doc.key
      : `${doc.namespace}.${doc.key}`

    const keys = fullKey.split('.')
    let current: any = result

    // Navigate/create nested structure
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!key) continue // Skip empty keys

      if (!current[key]) {
        current[key] = {}
      }
      current = current[key]
    }

    // Set the final value
    const lastKey = keys[keys.length - 1]
    if (lastKey) {
      current[lastKey] = value
    }
  }

  return result
}

/**
 * Merges CMS translations with fallback JSON translations
 * CMS translations take precedence over fallback
 *
 * @param cmsTranslations - Translations fetched from CMS
 * @param fallbackTranslations - Fallback translations from JSON files
 * @returns Merged translations with CMS taking precedence
 */
export function mergeTranslations(
  cmsTranslations: NestedMessages,
  fallbackTranslations: NestedMessages
): NestedMessages {
  return deepMerge(fallbackTranslations, cmsTranslations)
}

/**
 * Deep merge two objects, with the second object taking precedence
 *
 * @param target - Base object
 * @param source - Object to merge in (takes precedence)
 * @returns Merged object
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target }

  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (isObject(sourceValue)) {
        if (!(key in target)) {
          output[key] = sourceValue
        } else {
          output[key] = deepMerge(targetValue, sourceValue)
        }
      } else {
        output[key] = sourceValue
      }
    }
  }

  return output
}

/**
 * Check if value is a plain object
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}
