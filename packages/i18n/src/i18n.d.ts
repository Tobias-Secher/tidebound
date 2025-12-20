import messages from "../messages/en.json";
import { locales } from "./index";

type Messages = typeof messages;
type Locale = (typeof locales)[number];

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
