import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { locales } from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CMS_API_URL = process.env.CMS_URL || process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'
const CMS_API_KEY = process.env.CMS_API_KEY

/**
 * Converts nested JSON to flat key-value pairs for CMS
 */
function nestedToFlat(
  obj: any,
  namespace: string,
  prefix = ''
): Array<{ key: string; namespace: string; value: string }> {
  const result: Array<{ key: string; namespace: string; value: string }> = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      result.push({
        key: fullKey,
        namespace,
        value,
      })
    } else if (typeof value === 'object' && value !== null) {
      result.push(...nestedToFlat(value, namespace, fullKey))
    }
  }

  return result
}

/**
 * Gets a nested value from an object using a dot-notation path
 */
function getNestedValue(obj: any, keys: string[]): string | undefined {
  let current = obj
  for (const key of keys) {
    if (current[key] === undefined) return undefined
    current = current[key]
  }
  return typeof current === 'string' ? current : undefined
}

/**
 * Migrates JSON translations to Payload CMS
 */
async function migrateTranslations() {
  console.log('🔄 Starting migration of translations to Payload CMS...')
  console.log(`   API URL: ${CMS_API_URL}`)

  if (!CMS_API_KEY) {
    console.error('\n❌ Error: CMS_API_KEY environment variable is required')
    console.error('   Set it in your .env file or pass it when running this script:')
    console.error('   CMS_API_KEY=your-api-key pnpm generate:migrate')
    process.exit(1)
  }

  const messagesDir = path.join(__dirname, '../messages')

  try {
    // Load all locale files
    console.log('\n📖 Reading JSON translation files...')
    const allMessages: Record<string, any> = {}

    for (const locale of locales) {
      const filePath = path.join(messagesDir, `${locale}.json`)
      try {
        const content = await fs.readFile(filePath, 'utf-8')
        allMessages[locale] = JSON.parse(content)
        console.log(`   ✓ Loaded ${locale}.json`)
      } catch (error) {
        console.warn(`   ⚠ Warning: Could not load ${locale}.json, skipping...`)
        allMessages[locale] = {}
      }
    }

    // Extract namespaces from English (source of truth)
    const namespaces = Object.keys(allMessages.en || {})

    if (namespaces.length === 0) {
      console.error('\n❌ Error: No translations found in en.json')
      process.exit(1)
    }

    console.log(`\n📝 Found ${namespaces.length} namespaces: ${namespaces.join(', ')}`)

    // Convert to flat structure grouped by key
    const translationDocs = new Map<string, any>()

    for (const namespace of namespaces) {
      const flatKeys = nestedToFlat(allMessages.en[namespace], namespace)

      for (const { key, value } of flatKeys) {
        if (!translationDocs.has(key)) {
          translationDocs.set(key, {
            key,
            namespace,
            translations: {},
          })
        }

        // Add English translation
        translationDocs.get(key).translations.en = value

        // Add other locales
        for (const locale of locales) {
          if (locale === 'en') continue

          const localeNamespace = allMessages[locale]?.[namespace]
          if (!localeNamespace) continue

          const localeValue = getNestedValue(
            localeNamespace,
            key.replace(`${namespace}.`, '').split('.')
          )

          if (localeValue) {
            translationDocs.get(key).translations[locale] = localeValue
          }
        }
      }
    }

    // Upload to CMS
    const docs = Array.from(translationDocs.values())
    console.log(`\n⬆️  Uploading ${docs.length} translation documents to CMS...`)

    let successCount = 0
    let errorCount = 0

    for (const doc of docs) {
      try {
        const response = await fetch(`${CMS_API_URL}/api/translations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CMS_API_KEY}`,
          },
          body: JSON.stringify({
            ...doc,
            _status: 'published', // Auto-publish migrated translations
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`   ❌ Failed to upload "${doc.key}": ${errorText}`)
          errorCount++
        } else {
          console.log(`   ✓ Uploaded "${doc.key}"`)
          successCount++
        }
      } catch (error) {
        console.error(`   ❌ Error uploading "${doc.key}":`, error)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log(`✅ Migration complete!`)
    console.log(`   Successfully uploaded: ${successCount}/${docs.length}`)
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount}`)
    }
    console.log('='.repeat(60))

    if (errorCount > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the script
migrateTranslations()
