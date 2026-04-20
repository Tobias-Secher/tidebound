import messages from './messages/en.json';
import type { Locale } from './locales';

export { defaultLocale, locales, type Locale } from './locales';

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
