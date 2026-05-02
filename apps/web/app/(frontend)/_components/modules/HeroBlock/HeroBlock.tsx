import type { Media, Page } from '@repo/api-types';
import styles from './HeroBlock.module.css';
import { Image } from '@repo/ui';

type HeroModule = Omit<
  Extract<Page['modules'][number], { blockType: 'hero' }>,
  'blockName' | 'blockType' | 'id'
>;

export function HeroBlock({ heading, subheading, moduleSpacing, backgroundImage }: HeroModule) {
  const media =
    typeof backgroundImage === 'object' ? (backgroundImage as Media).url : backgroundImage;
  console.log(media, backgroundImage);
  return (
    <div className={styles.hero}>
      {/* <Image desktop={media} alt={heading} /> */}
      {/* <h2 className={styles.heading}>{heading}</h2>
      {subheading && <p className={styles.subheading}>{subheading}</p>} */}
    </div>
  );
}
