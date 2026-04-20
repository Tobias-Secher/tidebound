import messages from "./i18n/messages/en.json";
import { locales } from "./i18n/locales";

type Messages = typeof messages;
type Locale = (typeof locales)[number];

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
