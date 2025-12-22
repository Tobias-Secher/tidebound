import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "./index";
import { fetchCMSTranslations } from "./fetchers/cmsTranslations";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  // Only use CMS translations
  const cmsMessages = await fetchCMSTranslations(locale);

  if (cmsMessages && Object.keys(cmsMessages).length > 0) {
    return { locale, messages: cmsMessages };
  }

  // If CMS fails, log error and return empty messages
  console.error(`[i18n] CMS translations unavailable for ${locale}`);
  return { locale, messages: {} };
});
