// Supported locales - single source of truth
export const locales = ["en", "de", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Re-export next-intl hooks
export {
  useTranslations,
  useLocale,
  useMessages,
  useFormatter,
  NextIntlClientProvider,
} from "next-intl";

export {
  getTranslations,
  getLocale,
  getMessages,
  setRequestLocale,
} from "next-intl/server";
