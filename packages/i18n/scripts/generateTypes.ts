import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { flatToNested, type TranslationDocument } from '../src/utils/transformTranslations.js'
import { CMS_URL } from '../src/config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Fetches all translations from Payload CMS and generates JSON files
 */
async function generateTypes() {
  console.log('🔄 Fetching translations from Payload CMS...')
  console.log(`   API URL: ${CMS_URL}`)

  try {
    // Fetch all translations from CMS
    const response = await fetch(
      `${CMS_URL}/api/translations?limit=10000&depth=0`,
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

    // Generate en.json only (for TypeScript type generation)
    const messagesDir = path.join(__dirname, '../messages')
    const nested = flatToNested(docs as TranslationDocument[], 'en')
    const enFilePath = path.join(messagesDir, 'en.json')

    await fs.writeFile(enFilePath, JSON.stringify(nested, null, 2) + '\n')

    const namespaceCount = Object.keys(nested).length
    console.log(`✓ Generated en.json (${namespaceCount} namespaces)`)

    console.log('\n✅ Translation type generation complete!')
    console.log('   Type safety maintained for next-intl')
  } catch (error) {
    console.error('\n❌ Failed to generate translation types:', error)
    process.exit(1)
  }
}

// Run the script
generateTypes()
