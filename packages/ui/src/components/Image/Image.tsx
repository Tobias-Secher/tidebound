'use client';

import NextImage, { getImageProps } from 'next/image';
import clsx from 'clsx';
import type { SyntheticEvent } from 'react';
import type { Media } from '@repo/api-types';
import styles from './Image.module.css';

type ImageSource = {
  media: Media;
  width?: number;
  height?: number;
};

type Props = {
  desktop: ImageSource | Media | null | undefined;
  mobile?: ImageSource | Media | null | undefined;
  alt?: string;
  className?: string;
  /** Default: "(min-width: 1000px)" */
  breakpoint?: string;
  onImageLoaderError?: (e: SyntheticEvent<HTMLImageElement>) => void;
};

const DEFAULT_BREAKPOINT = '(min-width: 1000px)';

type Resolved = {
  src: string;
  width: number;
  height: number;
};

function isImageSource(input: ImageSource | Media): input is ImageSource {
  return 'media' in input;
}

function getMedia(input: ImageSource | Media): Media {
  return isImageSource(input) ? input.media : input;
}

function resolve(input: ImageSource | Media): Resolved {
  const source: ImageSource = isImageSource(input) ? input : { media: input };
  const { media, width, height } = source;

  if (!media.url) {
    throw new Error(`Image: media (id=${media.id}) is missing a url`);
  }

  const resolvedWidth = width ?? media.width;
  if (resolvedWidth == null) {
    throw new Error(
      `Image: media (id=${media.id}) is missing width and no override was provided`,
    );
  }

  const resolvedHeight = height ?? media.height;
  if (resolvedHeight == null) {
    throw new Error(
      `Image: media (id=${media.id}) is missing height and no override was provided`,
    );
  }

  return { src: media.url, width: resolvedWidth, height: resolvedHeight };
}

export function Image({
  desktop,
  mobile,
  alt,
  className,
  breakpoint = DEFAULT_BREAKPOINT,
  onImageLoaderError,
}: Props) {
  if (desktop == null) return null;

  const desktopResolved = resolve(desktop);
  const finalAlt = alt ?? getMedia(desktop).alt;

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    onImageLoaderError?.(e);
  };

  if (mobile == null) {
    return (
      <NextImage
        src={desktopResolved.src}
        alt={finalAlt}
        width={desktopResolved.width}
        height={desktopResolved.height}
        className={clsx(styles.image, className)}
        onError={handleError}
      />
    );
  }

  const mobileResolved = resolve(mobile);

  const {
    props: { srcSet: desktopSrcSet, src: desktopFallbackSrc },
  } = getImageProps({
    src: desktopResolved.src,
    alt: finalAlt,
    width: desktopResolved.width,
    height: desktopResolved.height,
  });
  const {
    props: { srcSet: mobileSrcSet, src: mobileFallbackSrc, ...mobileImgProps },
  } = getImageProps({
    src: mobileResolved.src,
    alt: finalAlt,
    width: mobileResolved.width,
    height: mobileResolved.height,
  });

  return (
    <picture>
      <source
        media={breakpoint}
        srcSet={desktopSrcSet ?? desktopFallbackSrc}
        width={desktopResolved.width}
        height={desktopResolved.height}
      />
      <img
        {...mobileImgProps}
        src={mobileFallbackSrc}
        srcSet={mobileSrcSet}
        className={clsx(styles.image, className)}
        onError={handleError}
      />
    </picture>
  );
}
