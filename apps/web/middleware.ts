import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - /api routes
  // - /admin routes (Payload CMS)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /public files (favicon.ico, etc.)
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};
