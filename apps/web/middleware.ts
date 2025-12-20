import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@repo/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always redirect to a locale-prefixed path
  localePrefix: 'always',

  // Disable locale detection from Accept-Language header
  // Set to true if you want automatic locale detection based on user's browser
  localeDetection: false,
});

export const config = {
  // Match all pathnames except for
  // - /api routes
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /public files (favicon.ico, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
