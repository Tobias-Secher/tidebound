import { RichText } from '@payloadcms/richtext-lexical/react';
import type { Page } from '@repo/api-types';
import styles from './TwoColumnBlock.module.css';

type TwoColumnModule = Extract<Page['modules'][number], { blockType: 'twoColumn' }>;

export function TwoColumnBlock({ leftColumn, rightColumn }: TwoColumnModule) {
  return (
    <div className={styles.grid}>
      <RichText data={leftColumn as never} />
      <RichText data={rightColumn as never} />
    </div>
  );
}
