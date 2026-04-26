import { Media } from '@repo/api-types';

export function getImageSrc(media: string | Media | null | undefined) {
  if (!media) return undefined;

  return typeof media === 'string' ? (media as string) : (media as Media).url;
}
