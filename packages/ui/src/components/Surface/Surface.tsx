import clsx from 'clsx';
import { ComponentPropsWithoutRef, ElementType } from 'react';
import styles from './Surface.module.css';

type SurfaceOwnProps<T extends ElementType> = {
  as?: T;
};

type SurfaceProps<T extends ElementType> = SurfaceOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof SurfaceOwnProps<T>>;

export function Surface<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...rest
}: SurfaceProps<T>) {
  const Wrapper = as ?? 'div';
  return (
    <Wrapper {...rest} className={clsx(styles.surface, className)}>
      {children}
    </Wrapper>
  );
}
