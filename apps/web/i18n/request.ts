import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { fetchCMSTranslations } from './fetchers/cmsTranslations';
import { defaultLocale, Locale } from './locales';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = hasLocale(routing.locales, requested) ? requested : defaultLocale;

  // Only use CMS translations
  const cmsMessages = await fetchCMSTranslations(locale);

  if (cmsMessages && Object.keys(cmsMessages).length > 0) {
    return { locale, messages: cmsMessages };
  }

  // If CMS fails, log error and return empty messages
  console.error(`[i18n] CMS translations unavailable for ${locale}`);
  return { locale, messages: {} };
});
