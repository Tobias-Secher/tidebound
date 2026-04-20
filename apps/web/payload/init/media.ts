import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BasePayload } from 'payload';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const SEED_ALT = 'Banner image';

export const initMedia = async (payload: BasePayload) => {
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
  });

  if (existing.docs.length > 0) {
    return;
  }

  const sourcePath = path.resolve(
    dirname,
    '../../media/da09edb81c790549db8980a5aa976dec.jpg',
  );
  const data = fs.readFileSync(sourcePath);

  await payload.create({
    collection: 'media',
    data: { alt: SEED_ALT },
    file: {
      data,
      mimetype: 'image/jpeg',
      name: 'banner.jpg',
      size: data.length,
    },
  });
};

export const findSeededBannerId = async (payload: BasePayload) => {
  const res = await payload.find({
    collection: 'media',
    where: { alt: { equals: SEED_ALT } },
    limit: 1,
  });
  return res.docs[0]?.id;
};
