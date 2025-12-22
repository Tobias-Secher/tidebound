// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Translations } from './collections/Translations'
import { initTranslations } from './init/translations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const apiTypesWorkspacePath = path.resolve(dirname, '../../../packages/api-types/src')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: `${apiTypesWorkspacePath}`,
    },
  },
  collections: [Users, Media, Pages, Translations],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: `${apiTypesWorkspacePath}/payload-types.ts`,
    declare: false,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
  onInit: async (payload) => {
    await initTranslations(payload)
  },
})
