import type { Page } from '@repo/api-types';
import styles from './HeroBlock.module.css';

type HeroModule = Extract<Page['modules'][number], { blockType: 'hero' }>;

export function HeroBlock({ heading, subheading }: HeroModule) {
  return (
    <div className={styles.hero}>
      <h2 className={styles.heading}>{heading}</h2>
      {subheading && <p className={styles.subheading}>{subheading}</p>}
    </div>
  );
}
