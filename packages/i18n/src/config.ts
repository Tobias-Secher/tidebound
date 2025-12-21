/**
 * Centralized i18n configuration
 */

export const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

export const CACHE_REVALIDATE = {
  production: 3600,  // 1 hour
  development: 10,   // 10 seconds
} as const

export const getCacheRevalidate = () =>
  process.env.NODE_ENV === 'production'
    ? CACHE_REVALIDATE.production
    : CACHE_REVALIDATE.development
