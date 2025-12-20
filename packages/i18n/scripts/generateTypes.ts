import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { locales } from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CMS_API_URL = process.env.CMS_URL || process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

type TranslationDocument = {
  key: string
  namespace: string
  translations: {
    en?: string
    de?: string
    fr?: string
    da?: string
  }
}

/**
 * Converts flat translation keys to nested object structure
 */
function flatToNested(translations: TranslationDocument[], locale: string): Record<string, any> {
  const result: Record<string, any> = {}

  for (const doc of translations) {
    const value = doc.translations[locale as keyof typeof doc.translations]
    if (!value) continue // Skip if translation doesn't exist for this locale

    const keys = doc.key.split('.')
    let current = result

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!current[key]) {
        current[key] = {}
      }
      current = current[key]
    }

    current[keys[keys.length - 1]] = value
  }

  return result
}

/**
 * Fetches all translations from Payload CMS and generates JSON files
 */
async function generateTypes() {
  console.log('🔄 Fetching translations from Payload CMS...')
  console.log(`   API URL: ${CMS_API_URL}`)

  try {
    // Fetch all translations from CMS
    const response = await fetch(
      `${CMS_API_URL}/api/translations?limit=10000&depth=0`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch translations: ${response.status} ${response.statusText}`)
    }

    const { docs, totalDocs } = await response.json()

    if (!docs || !Array.isArray(docs)) {
      throw new Error('Invalid response format from CMS')
    }

    console.log(`✓ Fetched ${totalDocs} translation documents`)

    // Generate JSON file for each locale
    const messagesDir = path.join(__dirname, '../messages')

    for (const locale of locales) {
      const nested = flatToNested(docs as TranslationDocument[], locale)
      const localeFilePath = path.join(messagesDir, `${locale}.json`)

      await fs.writeFile(localeFilePath, JSON.stringify(nested, null, 2) + '\n')

      const keyCount = Object.keys(nested).length
      console.log(`✓ Generated ${locale}.json (${keyCount} namespaces)`)
    }

    console.log('\n✅ Translation type generation complete!')
    console.log('   Type safety maintained for next-intl')
  } catch (error) {
    console.error('\n❌ Failed to generate translation types:', error)
    process.exit(1)
  }
}

// Run the script
generateTypes()
