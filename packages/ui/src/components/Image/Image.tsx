'use client';

import NextImage, { getImageProps } from 'next/image';
import clsx from 'clsx';
import { useState, type SyntheticEvent } from 'react';
import type { Media } from '@repo/api-types';
import styles from './Image.module.css';
import fallbackSvg from './fallback.svg';


type Props = {
  desktop:  Media | null | undefined;
  mobile?:  Media | null | undefined;
  alt?: string;
  className?: string;
  /** Default: "(min-width: 1000px)" */
  breakpoint?: string;
  onImageLoaderError?: (e: SyntheticEvent<HTMLImageElement>) => void;
};

const DEFAULT_BREAKPOINT = '(min-width: 1000px)';

export function Image({
  desktop,
  mobile,
  alt,
  className,
  breakpoint = DEFAULT_BREAKPOINT,
  onImageLoaderError,
}: Props) {
  const [error, setError] = useState(false);
  if (desktop == null) return null;

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    onImageLoaderError?.(e);
    setError(true);
  };

  if (mobile == null) {
    return (
      <NextImage
        src={error ? fallbackSvg : desktop.url!}
        alt={alt ?? ''}
        width={desktop.width!}
        height={desktop.height!}
        className={clsx(styles.image, error && styles.fallback, className)}
        onError={handleError}
      />
    );
  }


const finalAlt = alt ?? '';
  const {
    props: { srcSet: desktopSrcSet, src: desktopFallbackSrc },
  } = getImageProps({
    src: error ? fallbackSvg.src : desktop.url!,
    alt: finalAlt,
    width: desktop.width!,
    height: desktop.height!,
  });
  const {
    props: { srcSet: mobileSrcSet, src: mobileFallbackSrc, ...mobileImgProps },
  } = getImageProps({
    src: error ? fallbackSvg.src : mobile.url!,
    alt: finalAlt,
    width: mobile.width!,
    height: mobile.height!,
  });

  return (
    <picture>
      <source
        media={breakpoint}
        srcSet={desktopSrcSet ?? desktopFallbackSrc}
        width={desktop.width!}
        height={desktop.height!}
      />
      <img
        {...mobileImgProps}
        src={mobileFallbackSrc}
        srcSet={mobileSrcSet}
        className={clsx(styles.image, error && styles.fallback, className)}
        onError={handleError}
      />
    </picture>
  );
}
