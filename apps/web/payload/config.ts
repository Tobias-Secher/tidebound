import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { collectionsArr, collections } from './collections';
import { globalsArr } from './globals';
import { initHeader } from './init/header';
import { initMedia } from './init/media';
import { initPages } from './init/pages';
import { initTranslations } from './init/translations';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: collections.Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [...collectionsArr],
  globals: [...globalsArr],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/api-types/src/payload-types.ts'),
    declare: false,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [],
  onInit: async (payload) => {
    await initTranslations(payload);
    await initMedia(payload);
    await initPages(payload);
    await initHeader(payload);
  },
});
