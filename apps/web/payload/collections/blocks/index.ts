import { withBaseFields } from './withBaseFields';
import { HeroBlock } from './HeroBlock';
import { ContentBlock } from './ContentBlock';
import { ImageBlock } from './ImageBlock';
import { TwoColumnBlock } from './TwoColumnBlock';

export const blocks = [HeroBlock, ContentBlock, ImageBlock, TwoColumnBlock].map(withBaseFields);
