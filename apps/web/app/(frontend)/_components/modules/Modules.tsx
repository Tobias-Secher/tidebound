import type { Page } from '@repo/api-types';
import { ContentBlock } from './ContentBlock';
import { HeroBlock } from './HeroBlock';
import { ImageBlock } from './ImageBlock';
import { TwoColumnBlock } from './TwoColumnBlock';
import styles from './Modules.module.css';

type Props = {
  modules: Page['modules'];
};

export function Modules({ modules }: Props) {
  if (!modules?.length) return null;

  return (
    <div className={styles.container}>
      {modules.map((module, index) => {
        const key = module.id ?? index;
        switch (module.blockType) {
          case 'hero':
            return <HeroBlock key={key} {...module} />;
          case 'content':
            return <ContentBlock key={key} {...module} />;
          case 'imageBlock':
            return <ImageBlock key={key} {...module} />;
          case 'twoColumn':
            return <TwoColumnBlock key={key} {...module} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
