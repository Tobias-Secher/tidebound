import Image from 'next/image';
import type { Page } from '@repo/api-types';
import styles from './ImageBlock.module.css';

type ImageModule = Extract<Page['modules'][number], { blockType: 'imageBlock' }>;

export function ImageBlock({ image, caption }: ImageModule) {
  if (typeof image === 'string' || !image?.url) return null;

  return (
    <div className={styles.block}>
      <Image
        src={image.url}
        alt={caption || image.alt || ''}
        width={image.width ?? 1200}
        height={image.height ?? 800}
        className={styles.image}
      />
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
