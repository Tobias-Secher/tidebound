import { RichText } from '@payloadcms/richtext-lexical/react';
import type { Page } from '@repo/api-types';

type ContentModule = Extract<Page['modules'][number], { blockType: 'content' }>;

export function ContentBlock({ richText }: ContentModule) {
  return <RichText data={richText as never} />;
}
