import type { Locale } from '../locales';
import type { Translation } from '@repo/api-types';

export type NestedMessages = Record<string, any>;

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
export function flatToNested(translations: Translation[], locale: Locale): NestedMessages {
  const result: NestedMessages = {};

  for (const doc of translations) {
    // Fallback to English if translation doesn't exist for requested locale
    // If both are missing, use the key itself to make the error visible
    const translations = doc.translations as Record<string, string | null | undefined>;
    const value = translations[locale] || doc.translations.en || doc.key;

    // If key doesn't include namespace, prepend it
    const fullKey = doc.key.includes('.') ? doc.key : `${doc.namespace}.${doc.key}`;

    const keys = fullKey.split('.');
    let current: any = result;

    // Navigate/create nested structure
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!key) continue; // Skip empty keys

      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }

    // Set the final value
    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      current[lastKey] = value;
    }
  }

  return result;
}
