import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "./index";
import { fetchCMSTranslations } from "./fetchers/cmsTranslations";
import { mergeTranslations } from "./utils/transformTranslations";

const USE_CMS_TRANSLATIONS = process.env.NEXT_PUBLIC_USE_CMS_TRANSLATIONS === 'true'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  let messages: any = null

  if (USE_CMS_TRANSLATIONS) {
    // Try to fetch from CMS first
    try {
      console.log(`[i18n] Fetching translations from CMS for locale: ${locale}`)
      const cmsTranslations = await fetchCMSTranslations(locale)

      if (cmsTranslations && Object.keys(cmsTranslations).length > 0) {
        console.log(`[i18n] Successfully loaded ${Object.keys(cmsTranslations).length} namespaces from CMS for ${locale}`)
        messages = cmsTranslations
      } else {
        console.warn(`[i18n] No CMS translations found for ${locale}`)
      }
    } catch (error) {
      console.error(`[i18n] Error fetching CMS translations for ${locale}:`, error)
    }

    // If CMS fetch failed or returned no translations, try default locale from CMS
    if (!messages && locale !== defaultLocale) {
      try {
        console.log(`[i18n] Falling back to default locale (${defaultLocale}) from CMS`)
        const defaultCmsTranslations = await fetchCMSTranslations(defaultLocale)

        if (defaultCmsTranslations && Object.keys(defaultCmsTranslations).length > 0) {
          console.log(`[i18n] Successfully loaded default locale from CMS`)
          messages = defaultCmsTranslations
        }
      } catch (error) {
        console.error(`[i18n] Error fetching default locale from CMS:`, error)
      }
    }
  }

  // Final fallback: Load from JSON files
  if (!messages) {
    try {
      console.log(`[i18n] Loading translations from JSON file for ${locale}`)
      messages = (await import(`../messages/${locale}.json`)).default
    } catch (error) {
      // If JSON file doesn't exist for this locale, use default locale JSON
      if (locale !== defaultLocale) {
        console.warn(`[i18n] JSON file not found for ${locale}, using ${defaultLocale}`)
        messages = (await import(`../messages/${defaultLocale}.json`)).default
      } else {
        console.error(`[i18n] Fatal: Could not load translations for default locale ${defaultLocale}`)
        throw error
      }
    }
  }

  return {
    locale,
    messages,
  };
});
