import type { Endpoint } from 'payload'
import { locales } from '@repo/i18n'

/**
 * Custom endpoint for optimized translation fetching
 * Returns pre-transformed nested structure for a specific locale
 *
 * Usage: GET /api/translations/by-locale/:locale
 * Example: GET /api/translations/by-locale/en
 */
export const translationsEndpoint: Endpoint = {
  path: '/translations/by-locale/:locale',
  method: 'get',
  handler: async (req) => {
    const locale = req.routeParams?.locale as string | undefined
    const { payload } = req

    // Validate locale
    if (!locale || !locales.includes(locale as any)) {
      return Response.json(
        { error: `Invalid locale. Must be one of: ${locales.join(', ')}` },
        { status: 400 }
      )
    }

    try {
      // Fetch all published translations
      const { docs } = await payload.find({
        collection: 'translations',
        limit: 10000,
        where: {
          _status: { equals: 'published' },
        },
        depth: 0,
      })

      // Transform to nested structure optimized for locale
      const translations = docs.reduce<Record<string, any>>((acc, doc) => {
        const value = doc.translations?.[locale as keyof typeof doc.translations]
        if (value) {
          const keys = doc.key.split('.')
          let current = acc

          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            if (!current[key]) {
              current[key] = {}
            }
            current = current[key]
          }

          current[keys[keys.length - 1]] = value
        }
        return acc
      }, {})

      return Response.json({
        locale,
        translations,
        count: docs.length,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error fetching translations:', error)
      return Response.json(
        { error: 'Failed to fetch translations' },
        { status: 500 }
      )
    }
  },
}
