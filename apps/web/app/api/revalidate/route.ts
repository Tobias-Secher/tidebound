import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import type { Locale } from '@repo/i18n'
import { TRANSLATION_CACHE_TAGS } from '@repo/i18n/config'

const REVALIDATE_TAG_PROFILE = "max";
/**
 * API route to revalidate translation cache
 *
 * Usage:
 * - POST /api/revalidate (revalidates all translations)
 * - POST /api/revalidate?locale=en (revalidates specific locale)
 *
 * Security: Add authentication/secret token validation in production
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Verify secret token for security
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.REVALIDATE_SECRET

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get locale from query params (optional)
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') as Locale | null

    // Revalidate translations
    if (locale) {
      revalidateTag(TRANSLATION_CACHE_TAGS.locale(locale), REVALIDATE_TAG_PROFILE)
      console.log(`[i18n] Revalidated cache for locale: ${locale}`)
    } else {
      revalidateTag(TRANSLATION_CACHE_TAGS.all, REVALIDATE_TAG_PROFILE)
      console.log(`[i18n] Revalidated cache for all translations`)
    }

    return NextResponse.json({
      success: true,
      revalidated: locale ? `locale: ${locale}` : 'all translations',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[API] Revalidation error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}
