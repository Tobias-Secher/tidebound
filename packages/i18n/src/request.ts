import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "./index";
import { fetchCMSTranslations } from "./fetchers/cmsTranslations";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  // Try CMS first
  const cmsMessages = await fetchCMSTranslations(locale);

  if (cmsMessages && Object.keys(cmsMessages).length > 0) {
    return { locale, messages: cmsMessages };
  }

  // Fallback to en.json only (for type safety + default locale)
  if (locale === defaultLocale) {
    try {
      const messages = (await import(`../messages/${defaultLocale}.json`)).default;
      return { locale, messages };
    } catch (error) {
      console.error(`[i18n] Fatal: Cannot load ${defaultLocale}.json`);
      throw error;
    }
  }

  // Non-English locales with no CMS data: return empty
  console.warn(`[i18n] No translations for ${locale}, CMS may be down`);
  return { locale, messages: {} };
});
